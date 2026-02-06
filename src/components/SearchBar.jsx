import React, { useState, useEffect } from "react";
import { Box, Paper, Toolbar, TextField, MenuItem } from "@mui/material";

export default function SearchBar({ view, onChange, prefill, statusFromLink }) {
  const [text, setText] = useState(prefill || "");
  const [status, setStatus] = useState("1"); // dostępne
  // Domyślne sortwanie dla każdego widoku
  const defaultSortByView = {
    folder: "id_desc",
    set: "id_desc",
    shelf: "name_asc",
  };
  const [sort, setSort] = useState(defaultSortByView[view] || "id_desc");

  // Ustawienie prefill i status="all" przy kliknięciu linku
  useEffect(() => {
    if (prefill !== undefined) setText(prefill);
  }, [prefill]);

  useEffect(() => {
    if (statusFromLink) {
      setStatus(statusFromLink);
    }
  }, [statusFromLink]);

  // wywołanie callbacka z rodzicem przy zmianie
  useEffect(() => {
    onChange && onChange({ text, sort, status });
  }, [text, sort, status]);

  // Placeholder zależny od widoku
  const placeholder =
    view == "folder"
      ? "Szukaj po ID, znaku, tytule, dacie, kategorii, ID spisu, półce…"
      : view == "set"
        ? "Szukaj po ID, numerze spisu, półce…"
        : "Szukaj po półce…";

  // Opcje sortowania
  const sortOptions = {
    folder: [
      // —— ID ——
      { value: "id_desc", label: "ID ↓" },
      { value: "id_asc", label: "ID ↑" },
      { divider: true },

      // —— znak ——
      { value: "sign_asc", label: "Znak ↑" },
      { value: "sign_desc", label: "Znak ↓" },
      { divider: true },

      // —— tytuł ——
      { value: "title_asc", label: "Tytuł A → Z" },
      { value: "title_desc", label: "Tytuł Z → A" },
      { divider: true },

      // —— daty ——
      { value: "date_asc", label: "Data ↑" },
      { value: "date_desc", label: "Data ↓" },
      { divider: true },

      // —— kategoria ——
      { value: "category_asc", label: "Kategoria ↑" },
      { value: "category_desc", label: "Kategoria ↓" },
      { divider: true },

      // —— półka ——
      { value: "shelf_asc", label: "Półka ↑" },
      { value: "shelf_desc", label: "Półka ↓" },
      { divider: true },

      // —— spis ——
      { value: "set_asc", label: "Spis ↑" },
      { value: "set_desc", label: "Spis ↓" },
    ],
    set: [
      // —— ID ——
      { value: "id_desc", label: "ID ↓" },
      { value: "id_asc", label: "ID ↑" },
      { divider: true },

      // —— numer spisu ——
      { value: "num_asc", label: "Nr spisu ↑" },
      { value: "num_desc", label: "Nr spisu ↓" },
      { divider: true },

      // —— półka ——
      { value: "shelf_asc", label: "Półka ↑" },
      { value: "shelf_desc", label: "Półka ↓" },
    ],
    shelf: [
      // —— ID ——
      { value: "id_desc", label: "ID ↓" },
      { value: "id_asc", label: "ID ↑" },
      { divider: true },

      // —— nazwa półki ——
      { value: "name_asc", label: "Nazwa A → Z" },
      { value: "name_desc", label: "Nazwa Z → A" },
    ],
  };

  return (
    <Toolbar
      component={Paper}
      elevation={2}
      disableGutters
      className="search-bar"
    >
      {/* -- Pole wyszukiwania -- */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
        <TextField
          type="search"
          size="small"
          fullWidth
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Box>

      {/* -- Sortowanie -- */}
      <TextField
        select
        size="small"
        label="Sortowanie"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        sx={{ width: 160 }}
      >
        {sortOptions[view].map((opt, i) =>
          opt.divider ? (
            <MenuItem key={"div-" + i} disabled dense>
              ────────
            </MenuItem>
          ) : (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ),
        )}
      </TextField>

      {/* -- Status (brak dla shelf) -- */}
      {view != "shelf" && (
        <TextField
          select
          size="small"
          label="Stan"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="1">dostępne</MenuItem>
          <MenuItem value="0">zniszczone</MenuItem>
          <MenuItem value="all">wszystkie</MenuItem>
        </TextField>
      )}
    </Toolbar>
  );
}
