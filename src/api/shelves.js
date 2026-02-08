import { invoke } from "@tauri-apps/api/core";

export function getShelves() {
  return invoke("get_shelves");
}

export function addShelf(name) {
  return invoke("add_shelf", { name });
}

export function updateShelf(id, name) {
  return invoke("update_shelf", { id, name });
}

export function deleteShelf(id) {
  return invoke("delete_shelf", { id });
}
