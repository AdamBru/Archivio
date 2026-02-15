import { useState } from "react";
import { openHelp } from "../api/window";

import SettingsDialog from "./SettingsDialog";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Tab,
  Tabs,
  Toolbar,
} from "@mui/material";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ShelvesIcon from "@mui/icons-material/Shelves";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import DeselectIcon from "@mui/icons-material/Deselect";
import HelpIcon from "@mui/icons-material/Help";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function SystemBar({
  activeView,
  onChangeView,
  onAdd,
  onDelete,
  onShred,
  onEdit,
  onDeselect,
  disableButton,
  onHelp,
  onSettings,
  selection,
}) {
  // Odśwież widok
  function refresh() {
    window.location.reload();
  }

  // Stan otwarcia okna ustawień
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <AppBar position="fixed" elevation={0} className="system-menu">
      {/* ---- GÓRNY PASEK ---- */}
      <Toolbar
        disableGutters
        sx={{
          minHeight: "0 !important",
          boxShadow: "0 0 2px 0 #555",
          zIndex: 2,
        }}
      >
        {/* Karty */}
        <Tabs
          value={activeView}
          onChange={(e, v) => onChangeView(v)}
          textColor="inherit"
          variant="scrollable"
          scrollButtons="auto"
          className="view-tabs"
        >
          <Tab
            label="Teczki"
            value="folder"
            icon={<TextSnippetIcon />}
            iconPosition="start"
          />
          <Tab
            label="Spisy"
            value="set"
            icon={<FormatListBulletedIcon />}
            iconPosition="start"
          />
          <Tab
            label="Półki"
            value="shelf"
            icon={<ShelvesIcon />}
            iconPosition="start"
          />
        </Tabs>

        <Box sx={{ flexGrow: 1 }} />

        {/* Po prawej na górnym pasku - Odśwież, Ustawienia, Pomoc */}
        <Divider orientation="vertical" flexItem />
        <Button
          color="inherit"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={refresh}
        >
          Odśwież
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button
          color="inherit"
          size="small"
          startIcon={<SettingsIcon />}
          onClick={() => {
            if (onSettings) onSettings();
            setSettingsOpen(true);
          }}
        >
          Ustawienia
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button
          color="inherit"
          size="small"
          startIcon={<HelpIcon />}
          onClick={() => openHelp("index.html")}
        >
          Pomoc
        </Button>
      </Toolbar>

      {/* ---- DOLNY PASEK NARZĘDZI ---- */}
      <Toolbar
        className="tools-menu"
        disableGutters
        sx={{ minHeight: "0 !important" }}
      >
        <Button
          size="small"
          sx={{ color: "text.primary" }}
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          Dodaj
        </Button>
        <Divider orientation="vertical" flexItem />

        <Button
          size="small"
          sx={{ color: "text.primary" }}
          startIcon={<RemoveIcon />}
          onClick={() => onDelete(selection.item)}
          disabled={disableButton}
        >
          Usuń
        </Button>
        <Divider orientation="vertical" flexItem />

        <Button
          size="small"
          sx={{ color: "text.primary" }}
          startIcon={<DeleteIcon />}
          onClick={() => onShred(selection.item)}
          disabled={
            disableButton ||
            activeView == "shelf" ||
            (selection?.item && selection.item.status == 0)
          }
        >
          Zniszcz
        </Button>
        <Divider orientation="vertical" flexItem />

        <Button
          size="small"
          sx={{ color: "text.primary" }}
          startIcon={<EditIcon />}
          onClick={() => onEdit(selection.item)}
          disabled={disableButton}
        >
          Edytuj
        </Button>
        <Divider orientation="vertical" flexItem />

        <Button
          size="small"
          sx={{ color: "text.primary" }}
          startIcon={<DeselectIcon />}
          onClick={onDeselect}
          disabled={disableButton}
        >
          Odznacz
        </Button>
        <Divider orientation="vertical" flexItem />
      </Toolbar>

      {/* ---- Wywołanie okna ustawień ---- */}
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </AppBar>
  );
}
