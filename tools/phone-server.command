#!/bin/bash
# PeraSure — one-click local server for phone testing (double-click in Finder, or run tools/phone-server.command).
#
# - The port is always 8788 (never changes). If an old PeraSure dev server holds it, it is stopped and replaced; if another program
#   holds it, the script stops and says which one — it never moves to another port.
# - Every 2 seconds it checks that the server answers on 8788 (and starts it again on the same port if it stopped), and whether this
#   Mac's network address changed (Wi-Fi changed, hotspot / cable plugged in). When it changes you get a sound, a Mac notification and
#   the new addresses.
# - The .local address (this Mac's name) stays the same even when the Wi-Fi gives the Mac a new number — use it on the iPhone if it opens.
# Stop: Ctrl+C (or close the window).

PORT=8788
[ -n "$PERASURE_TEST_PORT" ] && PORT="$PERASURE_TEST_PORT"   # only for checking the script itself; normal use is always 8788
PREFIX=/perasure/playground/
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG="${TMPDIR:-/tmp}/perasure-dev-server.log"
SERVER_PID=""

say_cn() { printf '%s\n' "$*"; }
now() { date '+%H:%M:%S'; }

stop_server() {
  if [ -n "$SERVER_PID" ] && kill -0 "$SERVER_PID" 2>/dev/null; then kill "$SERVER_PID" 2>/dev/null; wait "$SERVER_PID" 2>/dev/null; fi
}
trap 'printf "\n"; stop_server; say_cn "已停止，端口 $PORT 已释放。"; exit 0' INT TERM
trap 'stop_server' EXIT

# 1. make sure port 8788 is ours (never another port)
free_port() {
  local pid cmd
  pid="$(lsof -ti tcp:$PORT -sTCP:LISTEN 2>/dev/null | head -1)"
  [ -z "$pid" ] && return 0
  cmd="$(ps -o command= -p "$pid" 2>/dev/null)"
  case "$cmd" in
    *dev-server.py*--port\ $PORT*)
      say_cn "端口 $PORT 上已有一个旧的 PeraSure 服务器（PID $pid），先把它关掉…"
      kill "$pid" 2>/dev/null
      for i in 1 2 3 4 5 6 7 8 9 10; do lsof -ti tcp:$PORT -sTCP:LISTEN >/dev/null 2>&1 || return 0; sleep 0.3; done
      kill -9 "$pid" 2>/dev/null; sleep 0.5
      lsof -ti tcp:$PORT -sTCP:LISTEN >/dev/null 2>&1 && { say_cn "关不掉 PID $pid，端口 $PORT 仍被占用。"; exit 1; }
      return 0 ;;
    *)
      say_cn "端口 $PORT 被别的程序占用了（PID $pid）："
      say_cn "  $cmd"
      say_cn "为了保证端口不变，脚本不会换端口。请先关掉这个程序，再重新运行。"
      exit 1 ;;
  esac
}

start_server() {
  free_port
  (cd "$ROOT" && exec python3 tools/dev-server.py --port "$PORT") >"$LOG" 2>&1 &
  SERVER_PID=$!
  for i in $(seq 1 30); do
    [ "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT$PREFIX")" = "200" ] && return 0
    kill -0 "$SERVER_PID" 2>/dev/null || break
    sleep 0.3
  done
  say_cn "服务器没能启动，日志："; cat "$LOG"; exit 1
}

# the Mac's IPv4 addresses the phone can use ("interface address" per line), without loopback and link-local
addresses() {
  ifconfig 2>/dev/null | awk '/^[a-z0-9]+:/ { name=$1; sub(":", "", name) } /inet / { ip=$2; if (ip !~ /^127\./ && ip !~ /^169\.254\./) print name " " ip }'
}
local_name() { local n; n="$(scutil --get LocalHostName 2>/dev/null)"; [ -n "$n" ] && printf '%s.local' "$n"; }

show_addresses() {
  local name ip tag code
  say_cn ""
  say_cn "  在这台电脑上：  http://localhost:$PORT$PREFIX"
  if [ -z "$1" ]; then
    say_cn "  在 iPhone 上：  （现在没有网络地址：请连上 Wi-Fi，或者打开 iPhone 个人热点并插上数据线）"
  else
    printf '%s\n' "$1" | while read -r name ip; do
      case "$ip" in 172.20.10.*) tag="数据线（iPhone 热点）· 用这个";; *) tag="Wi-Fi / 网络（$name）";; esac
      code="$(curl -s -m 2 -o /dev/null -w '%{http_code}' "http://$ip:$PORT$PREFIX")"
      [ "$code" = "200" ] && ok="可访问" || ok="这台电脑上访问不到（$code）"
      say_cn "  在 iPhone 上：  http://$ip:$PORT$PREFIX    $tag · $ok"
    done
  fi
  [ -n "$LOCALNAME" ] && say_cn "  不变的地址：    http://$LOCALNAME:$PORT$PREFIX    （这台 Mac 的名字：数据线、Wi-Fi 都能用，号码变了也不变）"
  say_cn ""
}

# the cable (owner: iPhone by cable only): an iPhone on USB reaches this Mac only through Personal Hotspot — then the "iPhone USB"
# network gets a 172.20.10.x address. State: none (no iPhone on USB) · nohotspot (plugged in, hotspot off) · ok <address>
cable_state() {
  local dev ip
  ioreg -p IOUSB -w0 2>/dev/null | grep -q -- '-o iPhone@' || { echo none; return; }
  dev="$(networksetup -listallhardwareports 2>/dev/null | awk '/Hardware Port: iPhone USB/ { getline; print $2; exit }')"
  ip="$( [ -n "$dev" ] && ifconfig "$dev" 2>/dev/null | awk '/inet 172\.20\.10\./ { print $2; exit }')"
  [ -z "$ip" ] && ip="$(ifconfig 2>/dev/null | awk '/inet 172\.20\.10\./ { print $2; exit }')"
  [ -n "$ip" ] && echo "ok $ip" || echo nohotspot
}
show_cable() {
  case "$1" in
    none) say_cn "  数据线：iPhone 没有插在这台 Mac 上。" ;;
    nohotspot)
      say_cn "  📱 数据线：iPhone 已插上，但个人热点没有通过数据线分配地址（没有 172.20.10.x）。"
      say_cn "      在 iPhone 上打开：  http://$LOCALNAME:$PORT$PREFIX    （走数据线，不需要热点）"
      say_cn "      打不开的话：iPhone 解锁，个人热点关掉再打开，拔掉数据线再插上；连通后这里会自动显示 172.20.10.x 地址。" ;;
    ok\ *)
      say_cn "  ✅ 数据线已连通 —— 在 iPhone 上打开：  http://${1#ok }:$PORT$PREFIX" ;;
  esac
}

notify() { osascript -e "display notification \"$1\" with title \"PeraSure 本地服务器\" sound name \"Glass\"" >/dev/null 2>&1; }

# 2. start and watch
say_cn ""
say_cn "PeraSure 本地服务器 · 端口固定 $PORT · 文件一改页面就自动刷新 · Ctrl+C 停止"
start_server
LOCALNAME="$(local_name)"
LAST="$(addresses)"
say_cn "[$(now)] 已启动（PID $SERVER_PID）。"
show_addresses "$LAST"
CABLE="$(cable_state)"
show_cable "$CABLE"; say_cn ""

while true; do
  sleep 2
  # the server: still ours on 8788 and answering? If not, start it again on the same port
  code="$(curl -s -m 2 -o /dev/null -w '%{http_code}' "http://localhost:$PORT$PREFIX")"
  if ! kill -0 "$SERVER_PID" 2>/dev/null || [ "$code" != "200" ]; then
    printf '\n'; say_cn "[$(now)] 服务器没有响应（$code），在同一个端口 $PORT 上重新启动…"
    stop_server; start_server
    say_cn "[$(now)] 已重新启动（PID $SERVER_PID），端口仍是 $PORT。"; notify "服务器已在端口 $PORT 重新启动"
  fi
  # the address: did it change?
  CUR="$(addresses)"
  if [ "$CUR" != "$LAST" ]; then
    printf '\a\n'
    say_cn "[$(now)] ⚠️  地址变了！端口没变，仍是 $PORT。"
    [ -n "$LAST" ] && say_cn "  原来：$(printf '%s' "$LAST" | awk '{print $2}' | tr '\n' ' ')"
    say_cn "  现在：$(printf '%s' "$CUR" | awk '{print $2}' | tr '\n' ' ')"
    show_addresses "$CUR"
    notify "地址变了：$(printf '%s' "$CUR" | awk '{print $2}' | tr '\n' ' ')· 端口仍是 $PORT"
    LAST="$CUR"
    CABLE=""
  fi
  # the cable: plugged in? hotspot on?
  C="$(cable_state)"
  if [ "$C" != "$CABLE" ]; then
    printf '\a\n'; say_cn "[$(now)] 数据线状态变了："; show_cable "$C"; say_cn ""
    case "$C" in
      nohotspot) notify "iPhone 已插上：在手机上打开 http://$LOCALNAME:$PORT$PREFIX" ;;
      ok\ *) notify "数据线已连通：http://${C#ok }:$PORT$PREFIX" ;;
    esac
    CABLE="$C"
  else
    case "$C" in none) cs="未插 iPhone";; nohotspot) cs="数据线：用 $LOCALNAME";; *) cs="数据线 ${C#ok }";; esac
    printf '\r[%s] ✓ 端口 %s 正常 · %s · 地址：%s   ' "$(now)" "$PORT" "$cs" "$(printf '%s' "$CUR" | awk '{print $2}' | tr '\n' ' ')"
  fi
done
