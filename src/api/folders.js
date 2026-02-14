import { invoke } from "@tauri-apps/api/core";

export function getFolders() {
  return invoke("get_folders");
}

export function addFolder(data) {
  return invoke("add_folder", { data });
}

export function updateFolder(data) {
  return invoke("update_folder", { data });
}

export function deleteFolder(id) {
  return invoke("delete_folder", { id });
}

export function shredFolder(id) {
  return invoke("shred_folder", { id });
}
