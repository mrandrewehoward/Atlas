// src/lib/cli/spacesCliHandler.ts
// CLI command handler for /spaces entity
import type { CliContext } from './cliStore';
import { get } from 'svelte/store';
import { spaces } from '$lib/stores/spaces';
import { updateSpace, deleteSpace, addSpace } from '$lib/stores/spaces'; // adjust as needed
import { pushCliContext, popCliContext, cliLines } from './cliStore';

export function spacesCliHandler(cmd: string, ctx?: CliContext): boolean {
  // Remove leading /spaces if present
  const rest = cmd.replace(/^\/spaces\s*/i, '').trim();
  const args = rest.match(/(?:"[^"]*"|[^\s"]+)/g) || [];
  const spacesArr = get(spaces);

  // Help
  if (rest === '-h' || rest === '--help' || rest === 'help') {
    cliLines.update(lines => [...lines, {
      text:
`/spaces area commands:\n\nls - List all spaces\nsel n - Select space by number\nfields - List fields for selected space\nedit n [value] - Edit field n (prompt or direct)\nadd - Add a new space (prompts for fields)\nadd -d "Title" - Add a new space with name/title\norder n up/down - Move space n up or down\ndel n - Delete space n (confirmation)\nstats n - Show stats/details for space n\nedit "Name" -set "NewName" - Edit by name, set name\nedit "Name" -o 2 - Edit by name, set order\nsearch term - Search spaces\nback - Return to top\nexit - Exit terminal\n\nAll commands are case-insensitive. See docs/cli-commands.md for full reference.`,
      type: 'info', blurred: false }]);
    return true;
  }
  // List spaces
  if (args.length === 0 || args[0].toLowerCase() === 'ls') {
    if (!spacesArr || spacesArr.length === 0) {
      cliLines.update(lines => [...lines, { text: 'No spaces found.', type: 'info', blurred: false }]);
      return true;
    }
    let out = 'Spaces:\n';
    spacesArr.forEach((s, i) => {
      out += `${i + 1}. ${s.name} (order: ${s.order ?? '-'})\n`;
    });
    cliLines.update(lines => [...lines, { text: out.trim(), type: 'info', blurred: false }]);
    return true;
  }
  // sel n
  if (args[0].toLowerCase() === 'sel' && args[1]) {
    const n = parseInt(args[1]);
    if (!spacesArr || isNaN(n) || n < 1 || n > spacesArr.length) {
      cliLines.update(lines => [...lines, { text: 'Invalid space number.', type: 'error', blurred: false }]);
      return true;
    }
    // Drill into space details (context stack)
    pushCliContext('spaces', { level: 'spaceDetails', space: spacesArr[n - 1] });
    cliLines.update(lines => [...lines, { text: `Selected: ${spacesArr[n - 1].name}\nType 'fields' to list fields, 'back' to return.`, type: 'success', blurred: false }]);
    return true;
  }
  // fields (in spaceDetails context)
  if (ctx?.data?.level === 'spaceDetails' && args[0].toLowerCase() === 'fields') {
    let out = 'Fields:\n1. name\n2. order';
    cliLines.update(lines => [...lines, { text: out, type: 'info', blurred: false }]);
    return true;
  }
  // sel n (field selection in spaceDetails)
  if (ctx?.data?.level === 'spaceDetails' && args[0].toLowerCase() === 'sel' && args[1]) {
    const n = parseInt(args[1]);
    const space = ctx.data.space;
    if (n === 1) {
      pushCliContext('spaces', { level: 'fieldDetails', space, field: 'name' });
      cliLines.update(lines => [...lines, { text: `Field: name\nCurrent value: ${space.name}\nType 'edit "NewName"' to change, or 'back' to return.`, type: 'info', blurred: false }]);
      return true;
    } else if (n === 2) {
      pushCliContext('spaces', { level: 'fieldDetails', space, field: 'order' });
      cliLines.update(lines => [...lines, { text: `Field: order\nCurrent value: ${space.order ?? '-'}\nType 'edit <number>' to change, or 'back' to return.`, type: 'info', blurred: false }]);
      return true;
    } else {
      cliLines.update(lines => [...lines, { text: 'Invalid field number.', type: 'error', blurred: false }]);
      return true;
    }
  }
  // edit in fieldDetails
  if (ctx?.data?.level === 'fieldDetails' && args[0].toLowerCase() === 'edit' && args[1]) {
    const { space, field } = ctx.data;
    const value = args.slice(1).join(' ').replace(/^"|"$/g, '');
    updateSpace(space, { [field]: field === 'order' ? Number(value) : value });
    cliLines.update(lines => [...lines, { text: `Field '${field}' updated to '${value}'.`, type: 'success', blurred: false }]);
    popCliContext();
    return true;
  }
  // add -d "Title"
  if (args[0].toLowerCase() === 'add') {
    if (args[1] && args[1] === '-d' && args[2]) {
      const title = args.slice(2).join(' ').replace(/^"|"$/g, '');
      addSpace(title);
      cliLines.update(lines => [...lines, { text: `Space '${title}' added.`, type: 'success', blurred: false }]);
      return true;
    }
    cliLines.update(lines => [...lines, { text: 'Interactive add not implemented. Use add -d "Title".', type: 'info', blurred: false }]);
    return true;
  }
  // del n
  if (args[0].toLowerCase() === 'del' && args[1]) {
    const n = parseInt(args[1]);
    if (!spacesArr || isNaN(n) || n < 1 || n > spacesArr.length) {
      cliLines.update(lines => [...lines, { text: 'Invalid space number.', type: 'error', blurred: false }]);
      return true;
    }
    deleteSpace(spacesArr[n - 1]);
    cliLines.update(lines => [...lines, { text: `Space '${spacesArr[n - 1].name}' deleted.`, type: 'success', blurred: false }]);
    return true;
  }
  // back/exit
  if (args[0].toLowerCase() === 'back' || args[0].toLowerCase() === 'exit') {
    popCliContext();
    cliLines.update(lines => [...lines, { text: 'Returning to previous menu.', type: 'info', blurred: false }]);
    return true;
  }
  cliLines.update(lines => [...lines, { text: 'Unknown /spaces command. Type help for help.', type: 'error', blurred: false }]);
  return true;
}
