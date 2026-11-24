// API mock for the production takes: every request that does not go to the local preview server is answered
// here (nothing leaves the machine). Default answer: { code: 0, message: 'ok', data: {} }.
// MOCKS maps a path suffix to a JSON body; a spec can add its own (spec.mocks).
//
// The immersive withdraw flow (keypad, M-099 / M-107) is an A/B bucket read from the rollout config
// (POST /util/frontend-rollout, key 025ImmersiveWithdrawAmount, src/features/withdrawAmountInputRollout*.ts).
// The mock answers it with the B bucket for everyone (enable, percentage 0:100, and the harness user on the
// B white list), so no source change is needed to force the flow.
export const HARNESS_USER_ID = '10000099';
export const ROLLOUT = {
  '025ImmersiveWithdrawAmount': { enable: true, percentage: '0:100', whiteList: { B: HARNESS_USER_ID } },
};
export const MOCKS = {
  '/util/frontend-rollout': { code: 0, message: 'ok', data: ROLLOUT },
  '/cyclecredit/loan/history': { code: 0, message: 'ok', data: { list: [] } },
};
export async function installMock(c, log = [], extra = {}) {
  await c.send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  c.on('Fetch.requestPaused', async p => {
    const u = new URL(p.request.url);
    if (u.hostname === '127.0.0.1' || u.hostname === 'localhost' || u.protocol === 'data:') return c.send('Fetch.continueRequest', { requestId: p.requestId }).catch(() => {});
    log.push(p.request.method + ' ' + u.pathname);
    const origin = p.request.headers.Origin || p.request.headers.origin || 'http://127.0.0.1:4173';
    const cors = [{ name: 'Access-Control-Allow-Origin', value: origin }, { name: 'Access-Control-Allow-Credentials', value: 'true' },
      { name: 'Access-Control-Allow-Headers', value: p.request.headers['Access-Control-Request-Headers'] || '*' }, { name: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' }];
    if (p.request.method === 'OPTIONS') return c.send('Fetch.fulfillRequest', { requestId: p.requestId, responseCode: 204, responseHeaders: cors }).catch(() => {});
    const all = { ...MOCKS, ...extra };
    const key = Object.keys(all).sort((a, b) => b.length - a.length).find(k => u.pathname.endsWith(k));
    const body = key ? all[key] : { code: 0, message: 'ok', data: {} };
    return c.send('Fetch.fulfillRequest', { requestId: p.requestId, responseCode: 200, responseHeaders: [...cors, { name: 'Content-Type', value: 'application/json' }], body: Buffer.from(JSON.stringify(body)).toString('base64') }).catch(() => {});
  });
}
