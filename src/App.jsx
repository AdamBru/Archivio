import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { plPL } from "@mui/material/locale";
import { Stack } from "@mui/material";
import SystemBar from "./components/SystemBar";
import SystemDialog from "./components/SystemDialog";
import ShelfView from "./views/ShelfView";
import SetView from "./views/SetView";
import FolderView from "./views/FolderView";
// DB imports
import { getShelves, addShelf, updateShelf, deleteShelf } from "./api/shelves";

// -- MOCKI --
const initialFolders = [
  {
    id: 1,
    sign: "1234",
    title: "Umowa najmu i wynajmu odzieży oraz ubrań",
    dateFrom: "2021",
    dateTo: "",
    category: "A",
    amount: 3,
    shelfId: null,
    setId: 1,
    status: 0, // 1 = dostępna, 0 = zniszczona
  },
  {
    id: 2,
    sign: "2040",
    title:
      "Dokumentacja izomtrycznie symetrycznych opakowań produkowanych w latach 2022 - 2023",
    dateFrom: "2022",
    dateTo: "2023",
    category: "B",
    amount: 1,
    shelfId: 4,
    setId: 2,
    status: 1,
  },
  {
    id: 3,
    sign: "2040",
    title: "Teczka z tajnymi informacjami",
    dateFrom: "1989",
    dateTo: "",
    category: "T",
    amount: 3,
    shelfId: null,
    setId: null,
    status: 1,
  },
];

const initialSets = [
  {
    id: 1,
    number: "20240201",
    shelfId: 1,
    status: 1,
  },
  {
    id: 2,
    number: "20240217",
    shelfId: 4,
    status: 0,
  },
];

const initialShelves = [
  { id: 1, name: "A-1" },
  { id: 2, name: "A-2" },
  { id: 3, name: "B-1" },
  { id: 4, name: "B-2" },
];

///// Motyw i język /////
const theme = createTheme(
  {
    // Motyw
    palette: {
      //   primary: { main: "#1976d2" },
    },
  },
  // Język
  plPL,
);

export default function App() {
  ////////// DB ///////////
  // Pobranie półek z bazy danych
  useEffect(() => {
    getShelves().then(setShelves);
  }, []);
  /////////////////////////

  // -- STANY DANYCH --
  const [folders, setFolders] = useState(initialFolders);
  const [sets, setSets] = useState(initialSets);
  const [shelves, setShelves] = useState(initialShelves);

  // widoki jako czytelne stringi
  const [view, setView] = useState("folder"); // "folder" | "set" | "shelf"

  // jednorazowy prefill wyszukiwarki (np. nazwa półki)
  const [searchPrefill, setSearchPrefill] = useState("");

  // ujednolicony selection
  const [selection, setSelection] = useState({ type: null, item: null });

  // jeśli przejście między widokami FolderView i SetView (w obie strony) to wybierz stan "all"
  const [linkStatus, setLinkStatus] = useState(null);

  // callbacki przekazywane do FolderView, SetView, ShelfView
  const openSetsForShelf = (shelfName) => {
    setSearchPrefill(shelfName || "");
    setView("set");
    setSelection({ type: null, item: null });
  };

  const openFoldersForShelf = (shelfName) => {
    setSearchPrefill(shelfName || "");
    setView("folder");
    setSelection({ type: null, item: null });
  };

  const openSetById = (setId) => {
    setSearchPrefill("S-" + String(setId).padStart(8, "0"));
    setView("set");
    setSelection({ type: null, item: null });
    setLinkStatus("all");
  };

  const openFoldersBySetId = (setId) => {
    // formatuj ID spisu jako S-00000001
    const formattedId = "S-" + String(setId).padStart(8, "0");
    setSearchPrefill(formattedId);
    setView("folder");
    setSelection({ type: null, item: null });
    setLinkStatus("all");
  };

  // handler do SystemBar — żeby przełączanie kart czyściło prefill i selection
  const handleChangeView = (newView) => {
    setView(newView);
    setSearchPrefill("");
    setSelection({ type: null, item: null });
    setLinkStatus(null);
  };

  // Obsługa dialogu
  const [dialog, setDialog] = useState({
    open: false,
    mode: null,
    type: null,
    data: null,
  });

  // Przekazanie wartości do dialogu
  const [formValues, setFormValues] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <SystemBar
        activeView={view}
        onChangeView={handleChangeView}
        disableButton={!selection.item}
        selection={selection}
        onAdd={() =>
          setDialog({
            open: true,
            mode: "add",
            type: view, // "folder", "set", "shelf"
            data: null,
          })
        }
        onDelete={(item) => {
          // blokada usuwania spisu, jeśli ma przypisane jakieś niezniszczone teczki
          if (view == "set") {
            const hasActiveFolders = folders.some(
              (f) => f.setId === item.id && f.status === 1,
            );

            if (hasActiveFolders) {
              setDialog({
                open: true,
                mode: "blocked",
                type: "set",
                data: {
                  title: "Nie można usunąć spisu",
                  message: "Do spisu są przypisane niezniszczone teczki.",
                },
              });
              return;
            }
          }

          // blokada usunięcia półki, jeśli coś jest do niej przypisane i niezniszczone
          if (view == "shelf") {
            const shelfId = item.id;

            const hasActiveSets = sets.some(
              (s) => s.shelfId === shelfId && s.status === 1,
            );

            const hasActiveFolders = folders.some(
              (f) => f.shelfId === shelfId && f.status === 1,
            );

            if (hasActiveSets || hasActiveFolders) {
              setDialog({
                open: true,
                mode: "blocked",
                type: "shelf",
                data: {
                  title: "Nie można usunąć półki",
                  message: "Na półce znajdują się spisy lub teczki.",
                },
              });
              return;
            }
          }

          // jeśli OK — otwórz dialog usuwania
          setDialog({
            open: true,
            mode: "delete",
            type: view,
            data: item,
          });
        }}
        onShred={(item) => {
          if (view == "set") {
            // sprawdza tylko niezniszczone teczki
            const hasActiveFolders = folders.some(
              (f) => f.setId === item.id && f.status === 1,
            );

            if (hasActiveFolders) {
              setDialog({
                open: true,
                mode: "blocked",
                type: "set",
                data: {
                  title: "Nie można zniszczyć spisu",
                  message:
                    "Do wybranego spisu są przypisane niezniszczone teczki.",
                },
              });
              return;
            }
          }

          setDialog({
            open: true,
            mode: "shred",
            type: view,
            data: item,
          });
        }}
        onEdit={(item) => {
          setDialog({
            open: true,
            mode: "edit",
            type: view,
            data: item,
          });
        }}
        onDeselect={() => setSelection({ type: null, item: null })}
        onHelp={() => {}}
        onSettings={() => {}}
      />
      {/* END SysremBar */}

      <Stack
        style={{
          minHeight: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "5rem 1rem",
          gap: 15,
          flex: 1,
        }}
        // kliknięcie tła odznacza (wykorzystuje unified selection)
        onClick={() => setSelection({ type: null, item: null })}
      >
        {view == "folder" && (
          <FolderView
            prefill={searchPrefill}
            selection={selection}
            onSelect={(item) => setSelection({ type: "folder", item })}
            rows={folders}
            shelves={shelves}
            onOpenSet={openSetById}
            linkStatus={linkStatus}
          />
        )}

        {view == "set" && (
          <SetView
            // przekazuje prefill do SetView, żeby ustawić SearchBar
            prefill={searchPrefill}
            selection={selection}
            onSelect={(item) => setSelection({ type: "set", item })}
            rows={sets}
            shelves={shelves}
            folders={folders}
            onOpenFolders={openFoldersBySetId}
            linkStatus={linkStatus}
          />
        )}

        {view == "shelf" && (
          <ShelfView
            onOpenSets={openSetsForShelf}
            onOpenFolders={openFoldersForShelf}
            selection={selection}
            onSelect={(item) => setSelection({ type: "shelf", item })}
            rows={shelves}
            sets={sets}
            folders={folders}
          />
        )}
      </Stack>

      {/* Modal dialogowy */}
      <SystemDialog
        open={dialog.open}
        mode={dialog.mode}
        type={dialog.type}
        data={dialog.data}
        folders={folders}
        sets={sets}
        shelves={shelves}
        onChange={(v) => setFormValues(v)}
        onClose={() => {
          setDialog((d) => ({
            ...d,
            open: false,
          }));
          setSelection({ type: null, item: null });
        }}
        onSave={(formValues) => {
          // ADD
          if (dialog.mode == "add") {
            if (dialog.type == "folder") {
              const folder = { ...formValues };

              if (folder.setId) {
                const parentSet = sets.find((s) => s.id === folder.setId);
                folder.shelfId = parentSet ? parentSet.shelfId : null;
              } else {
                folder.shelfId = null;
              }

              setFolders((prev) => [...prev, folder]);
            }
            if (dialog.type == "set") {
              setSets((prev) => [...prev, formValues]);
            }
            if (dialog.type == "shelf") {
              setShelves((prev) => [...prev, formValues]);
            }
          }

          // EDIT
          if (dialog.mode == "edit") {
            if (dialog.type == "folder") {
              setFolders((prev) =>
                prev.map((f) =>
                  f.id === formValues.id
                    ? {
                        ...formValues,
                        shelfId: formValues.setId
                          ? (sets.find((s) => s.id === formValues.setId)
                              ?.shelfId ?? null)
                          : null,
                      }
                    : f,
                ),
              );
            }
            if (dialog.type == "set") {
              const updatedSet = formValues;

              // krok 1. aktualizuj spis
              setSets((prev) =>
                prev.map((s) => (s.id === updatedSet.id ? updatedSet : s)),
              );

              // krok 2. kaskadowo zaktualizuj półki teczek przypisanych do spisu
              setFolders((prev) =>
                prev.map((f) =>
                  f.setId === updatedSet.id
                    ? { ...f, shelfId: updatedSet.shelfId }
                    : f,
                ),
              );
            }
            if (dialog.type == "shelf") {
              setShelves((prev) =>
                prev.map((sh) => (sh.id == formValues.id ? formValues : sh)),
              );
            }
          }

          // SHRED
          if (dialog.mode == "shred") {
            const id = dialog.data?.id;
            if (id) {
              if (dialog.type == "folder") {
                setFolders((prev) =>
                  prev.map((f) => (f.id == id ? { ...f, status: 0 } : f)),
                );
              }
              if (dialog.type == "set") {
                setSets((prev) =>
                  prev.map((s) => (s.id == id ? { ...s, status: 0 } : s)),
                );
              }
            }
          }

          // DELETE
          if (dialog.mode == "delete") {
            const id = dialog.data?.id;
            if (!id) {
              setDialog((d) => ({ ...d, open: false }));
              return;
            }

            if (dialog.type == "folder") {
              // usuń teczkę
              setFolders((prev) => prev.filter((f) => f.id !== id));
            }

            if (dialog.type == "set") {
              // usuń spis; dodatkowo usuń referencję setId z teczek przypisanych do tego spisu
              setSets((prev) => prev.filter((s) => s.id !== id));

              setFolders((prev) =>
                prev.map((f) => (f.setId === id ? { ...f, setId: null } : f)),
              );
            }

            if (dialog.type == "shelf") {
              setShelves((prev) => prev.filter((sh) => sh.id !== id));
            }
          }

          // zamknij dialog po wykonaniu akcji
          setDialog((d) => ({
            ...d,
            open: false,
          }));
          setSelection({ type: null, item: null });
        }}
      />
    </ThemeProvider>
  );
}
