import {
  WebviewWindow,
  getAllWebviewWindows,
} from "@tauri-apps/api/webviewWindow";

export const openHelp = async (page = "index.html") => {
  page = "help/site/" + page;

  // Sprawdzamy, czy okno o nazwie "help-window" już jest otwarte
  const allWindows = await getAllWebviewWindows();
  const helpWindow = allWindows.find((w) => w.label === "help-window");

  if (helpWindow) {
    // Jeśli jest otwarte, po prostu je "wyciągamy" na wierzch
    await helpWindow.setFocus();
  } else {
    // Jeśli go nie ma, tworzymy je od zera
    const webview = new WebviewWindow("help-window", {
      url: page,
      title: "Pomoc",
      width: 400,
      height: 600,
      resizable: false,
      alwaysOnTop: true,
      fullscreen: false,
    });
  }
};
