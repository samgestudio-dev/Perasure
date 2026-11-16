/* PeraSure Dev Mode — dev statuses, as in Figma Dev Mode: 'ready' (Ready for dev) · 'changed' (changed since it was ready or
   completed: set for every page and component an iteration touches) · 'completed' (development done: set when the owner says so).
   pages / components: { id: { status, since: iteration id, note } }; anything not listed has `default`. */
window.DM_STATUS = {
  default: { status: 'ready', since: 'v1.0' },
  pages: {
    home: { status: 'changed', since: 'v1-20261116-n1' },
    keep: { status: 'changed', since: 'v1-20261116-n2' }
  },
  components: {
    'APP.WdHero': { status: 'changed', since: 'v1-20261113-n1' },
    Card: { status: 'changed', since: 'v1-20261116-n1' },
    PaymentCard: { status: 'changed', since: 'v1-20261116-n1' },
    HomeCoupons: { status: 'changed', since: 'v1-20261116-n1' },
    CouponArt: { status: 'changed', since: 'v1-20261116-n2' },
    Decision: { status: 'changed', since: 'v1-20261116-n2' }
  }
};
