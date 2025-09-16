// @ts-nocheck
const handlers = {};

function register(area, handler) {
  handlers[area] = handler;
}

async function execute(parsed, context = {}) {
  if (!parsed) return { ok: false, error: 'empty command' };
  // Resolve area: explicit first, then context
  const area = parsed.area || (context && context.area) || null;
  const action = parsed.action;
  if (!area) return { ok: false, error: 'no area specified and no current context' };
  const h = handlers[area];
  if (!h) return { ok: false, error: `unknown area: ${area}` };
  if (typeof h[action] !== 'function') return { ok: false, error: `unknown action: ${action} for area ${area}` };
  try {
    const res = await h[action](context, parsed.subject, parsed.flags);
    return { ok: true, result: res };
  } catch (err) {
    return { ok: false, error: err && err.message };
  }
}

module.exports = { register, execute };
