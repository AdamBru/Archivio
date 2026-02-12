import { invoke } from "@tauri-apps/api/core";

export function getSets() {
  return invoke("get_sets");
}

export function addSet(data) {
  return invoke("add_set", { data });
}

// export function addSet(data) {
//   return invoke("add_set", {
//     data: {
//       id: data.id,
//       number: data.number,
//       shelf_id: data.shelfId,
//       status: data.status ?? 1,
//     },
//   });
// }

export function updateSet(data) {
  return invoke("update_set", { data });
}

// export function updateSet(data) {
//   return invoke("update_set", {
//     data: {
//       id: data.id,
//       number: data.number,
//       shelf_id: data.shelfId,
//       status: data.status,
//     },
//   });
// }

export function deleteSet(id) {
  return invoke("delete_set", { id });
}

export function shredSet(id) {
  return invoke("shred_set", { id });
}
