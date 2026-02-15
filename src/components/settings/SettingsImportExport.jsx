import { invoke } from "@tauri-apps/api/core";
import { openHelp } from "../../api/window";

import { Button, Typography, Box, Link } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function SettingsImportExport() {
  return (
    <>
      {/* Eksport */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: "light" }}>
          Eksportowanie pliku bazy danych
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "light" }} gutterBottom>
          Utwórz kopię pliku ze stanem bazy danych.
        </Typography>

        <Button
          variant="contained"
          startIcon={<FileUploadIcon />}
          sx={{ my: 1 }}
          disableElevation
          onClick={async () => {
            try {
              const message = await invoke("export_database");
              alert(message);
            } catch (err) {
              if (err !== "Eksport został anulowany.") {
                alert("Błąd eksportu: " + err);
              }
            }
          }}
        >
          Eksportuj
        </Button>
      </Box>

      {/* Import */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "light" }}>
          Importowanie pliku bazy danych
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "light" }}>
          Zaimportuj plik bazy danych aplikacji Archivio.
        </Typography>
        <Typography sx={{ my: 1 }}>
          Uwaga: spowoduje to zastąpienie obecnego stanu aplicaji.
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: "light" }} gutterBottom>
          Jeśli nastąpił przypadkowy/błędny import, zajrzyj do{" "}
          <Link
            sx={{ cursor: "pointer" }}
            onClick={() => openHelp("problems.html#deleted-database")}
          >
            Pomocy
          </Link>
          .
        </Typography>

        <Button
          variant="contained"
          color="error"
          startIcon={<FileDownloadIcon />}
          sx={{ my: 1 }}
          disableElevation
          onClick={async () => {
            try {
              const message = await invoke("import_database");
              alert(message);
              window.location.reload();
            } catch (err) {
              if (err !== "Import został anulowany.") {
                alert("Błąd importu: " + err);
              }
            }
          }}
        >
          Importuj
        </Button>
      </Box>

      {/* Przywróć */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "light" }}>
          Przywracanie stanu początkowego
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "light" }}>
          Całkowicie wyczyść bazę danych aplikacji Archivio.
        </Typography>
        <Typography sx={{ my: 1 }}>
          Uwaga: spowoduje to skasowanie wszystkich danych aplikacji.
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: "light" }} gutterBottom>
          Jeśli nastąpiło przypadkowe/błędne przywrócenie stanu początkowego,
          zajrzyj do{" "}
          <Link
            sx={{ cursor: "pointer" }}
            onClick={() => openHelp("problems.html#deleted-database")}
          >
            Pomocy
          </Link>
          .
        </Typography>

        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteForeverIcon />}
          sx={{ my: 1 }}
          disableElevation
          onClick={async () => {
            try {
              const message = await invoke("reset_database");
              alert(message);
              window.location.reload();
            } catch (err) {
              if (err !== "Resetowanie anulowane.") {
                alert("Błąd resetowania bazy danych: " + err);
              }
            }
          }}
        >
          Resetuj
        </Button>
      </Box>
    </>
  );
}
