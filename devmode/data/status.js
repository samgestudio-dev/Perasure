/* PeraSure Dev Mode — dev statuses, as in Figma Dev Mode: 'ready' (Ready for dev) · 'changed' (changed since it was ready or
   completed: set for every page and component an iteration touches) · 'completed' (development done: set when the owner says so).
   pages / components: { id: { status, since: iteration id, note } }; anything not listed has `default`. */
window.DM_STATUS = {
  default: { status: 'ready', since: 'v1.0' },
  pages: {},
  components: {}
};
