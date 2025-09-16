// @ts-nocheck
// Simple CLI parser: turns raw input into { area, action, subject, flags, raw }
// @ts-nocheck
// Simple CLI parser: turns raw input into { area, action, subject, flags, raw }
function parseFlags(tokens) {
  const flags = {};
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t.startsWith('-')) {
      const key = t.replace(/^-+/, '');
      const next = tokens[i+1];
      if (next && !next.startsWith('-')) {
        flags[key] = next;
        i += 2;
        continue;
      }
      flags[key] = true;
      i++;
      continue;
    }
    i++;
  }
  return flags;
}

function tokenize(input) {
  // very simple tokenizer: split on spaces but respect quoted strings
  const tokens = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === '"') {
      inQuote = !inQuote;
      continue;
    }
    if (!inQuote && ch === ' ') {
      if (cur) tokens.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  if (cur) tokens.push(cur);
  return tokens;
}

function parse(input) {
  const raw = input.trim();
  if (!raw) return null;
  const tokens = tokenize(raw);
  const first = tokens[0];

  let area = null;
  let action = null;
  let subject = null;
  let flags = {};

  // leading slash area: /spaces list ...
  if (first && first.startsWith('/')) {
    area = first.slice(1).toLowerCase();
    action = tokens[1] ? tokens[1].toLowerCase() : 'help';
    // determine if there's a subject (first non-flag token after action)
    const maybe = tokens[2];
    if (maybe && !maybe.startsWith('-')) {
      subject = maybe;
      // flags come after the subject
      flags = parseFlags(tokens.slice(3));
    } else {
      subject = null;
      // flags start immediately after action
      flags = parseFlags(tokens.slice(2));
    }

    return { area, action, subject, flags, raw };
  }

  // no slash: assume action first (short commands) e.g., list, add, edit 2
  action = tokens[0].toLowerCase();
  // if the second token is a non-flag, treat as subject; otherwise subject is null
  const maybe2 = tokens[1];
  if (maybe2 && !maybe2.startsWith('-')) {
    subject = maybe2;
    flags = parseFlags(tokens.slice(2));
  } else {
    subject = null;
    flags = parseFlags(tokens.slice(1));
  }
  return { area: null, action, subject, flags, raw };
}

module.exports = { parse, tokenize, parseFlags };
