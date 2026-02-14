import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Divider,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

import SettingsImportExport from "./settings/SettingsImportExport";
import SettingsAbout from "./settings/SettingsAbout";

export default function SettingsDialog({ open, onClose }) {
  const [settingsTab, setSettingsTab] = useState(0);
  const handleTabChange = (event, newSettingsTab) => {
    setSettingsTab(newSettingsTab);
  };

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSettingsTab(0);
      }, 150);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            height: "100%",
            maxHeight: "80vh",
          },
        },
      }}
    >
      <DialogTitle
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Ustawienia
        <IconButton aria-label="delete" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        style={{ display: "flex", flexDirection: "row", padding: 0 }}
      >
        <Stack>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            scrollButtons="hidden"
            value={settingsTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none !important",
                whiteSpace: "nowrap !important",
                fontSize: ".9rem",
                color: "#222",
                borderBottom: "1px solid #eee",
                minHeight: "3rem",
                padding: "0 1rem",
                justifyContent: "flex-start",
              },
              "& .Mui-selected": {
                backgroundColor: "action.selected",
                color: "",
              },
              "& .MuiTab-iconWrapper": {
                maxHeight: "1.2rem",
                marginLeft: "-.5rem",
              },
              //   "& .MuiTabs-indicator": { display: "none" },
            }}
          >
            {/* Przyciski po lewej */}
            <Tab
              label="Import/Eksport"
              icon={<UploadFileIcon />}
              iconPosition="start"
            />
            <Tab
              label="O aplikacji"
              icon={<InfoOutlineIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Stack>

        <Divider orientation="vertical" flexItem />

        {/* Zawartość wyświetlana po prawej */}
        <Stack sx={{ p: 2.5, pl: 3.5, width: "100%", overflowY: "auto" }}>
          {/* Ustawienia - Import/Eksport/Reset */}
          {settingsTab == 0 && <SettingsImportExport />}

          {/* Ustawienia - O aplikacji */}
          {settingsTab == 1 && <SettingsAbout />}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
