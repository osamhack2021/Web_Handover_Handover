export const LOAD_GROUP = 'LOAD_GROUP';

export function loadGroup(group) {
  return {
    type: LOAD_GROUP,
    group,
  };
}
