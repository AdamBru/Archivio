import { invoke } from "@tauri-apps/api/core";

export function getSets() {
  return invoke("get_sets");
}

export function addSet(data) {
  return invoke("add_set", { data });
}

export function updateSet(data) {
  return invoke("update_set", { data });
}

export function deleteSet(id) {
  return invoke("delete_set", { id });
}

export function shredSet(id) {
  return invoke("shred_set", { id });
}
