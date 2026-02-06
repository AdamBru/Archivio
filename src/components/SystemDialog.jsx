import FolderForm from "../forms/FolderForm";
import SetForm from "../forms/SetForm";
import ShelfForm from "../forms/ShelfForm";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function SystemDialog({
  open,
  mode, // "add" | "edit" | "delete" | "shred"
  type, // "folder" | "set" | "shelf"
  data,
  folders,
  sets,
  shelves,
  onClose,
  onSave,
}) {
  // Ustal tytuł modala
  const titles = {
    add: {
      folder: "Dodaj teczkę",
      set: "Dodaj spis",
      shelf: "Dodaj półkę",
    },
    edit: {
      folder: "Edytuj teczkę",
      set: "Edytuj spis",
      shelf: "Edytuj półkę",
    },
    delete: {
      folder: "Usuń teczkę",
      set: "Usuń spis",
      shelf: "Usuń półkę",
    },
    shred: {
      folder: "Zniszcz teczkę",
      set: "Zniszcz spis",
    },
  };

  const title = titles[mode]?.[type] || "";

  const formRef = React.useRef(null);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode == "blocked" ? data?.title || "Operacja zablokowana" : title}
      </DialogTitle>

      <DialogContent dividers>
        {mode == "blocked" ? (
          // tryb informacyjny — blokada usunięcia/zniszczenia, wyświetla przekazany komunikat
          <Typography>
            {data?.message || "Operacja nie jest możliwa."}
          </Typography>
        ) : mode == "delete" || mode == "shred" ? (
          <Typography>
            Czy na pewno chcesz {mode == "delete" ? "usunąć" : "zniszczyć"} tę
            pozycję?
            {mode == "delete" && (
              <>
                <br />
                <strong>Tej czynności nie można cofnąć.</strong>
              </>
            )}
          </Typography>
        ) : (
          <>
            {type == "folder" && (
              <FolderForm
                key={`${mode}-${data?.id ?? "new"}`}
                formRef={formRef}
                mode={mode}
                data={data}
                folders={folders}
                sets={sets}
                shelves={shelves}
              />
            )}

            {type == "set" && (
              <SetForm
                key={`${mode}-${data?.id ?? "new"}`}
                formRef={formRef}
                mode={mode}
                data={data}
                shelves={shelves}
                sets={sets}
              />
            )}

            {type == "shelf" && (
              <ShelfForm
                key={`${mode}-${data?.id ?? "new"}`}
                formRef={formRef}
                mode={mode}
                data={data}
                shelves={shelves}
              />
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>

        {mode == "blocked" ? (
          <Button variant="contained" onClick={onClose}>
            OK
          </Button>
        ) : mode == "delete" || mode == "shred" ? (
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (onSave) onSave();
            }}
          >
            {mode == "delete" ? "Usuń" : "Zniszcz"}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => {
              const ok = formRef.current?.validate();
              if (!ok) return; // nie pozwól zapisać jeśli błąd w formularzu
              if (onSave) {
                const values = formRef.current.getValues();
                onSave(values);
              }
            }}
          >
            Zapisz
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
