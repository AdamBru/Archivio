import React, { useState } from "react";
import ListTable from "../components/ListTable";
import SearchBar from "../components/SearchBar";
import { Link, Tooltip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

/**
 * SetView - widok spisów (sets)
 * props:
 *  - rows: tablica spisów
 *  - shelves: tablica półek
 *  - folders: tablica teczek
 *  - prefill: prefill wyszukiwarki (np. nazwa półki)
 *  - onOpenFolders: callback(idSetu) -> otwórz teczki dla tego spisu
 *  - selection, onSelect - zunifikowane selection
 */
export default function SetView({
  rows = [],
  shelves = [],
  folders = [],
  prefill = "",
  onOpenFolders,
  selection,
  onSelect,
  linkStatus,
}) {
  // stan wyboru sortowania
  const [filters, setFilters] = useState({
    text: prefill || "",
    sort: "id_desc",
    status: "1", // domyślnie dostępne
  });

  // helper do przypisania (asocjacji) nazwy do id półki
  const getShelfName = (shelfId) =>
    shelves.find((s) => s.id === shelfId)?.name || "—";

  // pomoc: normalizacja (usuwa diakrytyki i zamienia na małe litery)
  const normalize = (s) =>
    s == undefined || s == null
      ? ""
      : String(s)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

  const applyFilters = () => {
    let list = Array.isArray(rows) ? [...rows] : [];

    // -- filtr tekstowy (id, number, shelf)
    if (filters.text && filters.text.trim() != "") {
      const q = normalize(filters.text.trim());

      list = list.filter((row) => {
        // pola które chcemy przeszukać
        const candidates = [
          normalize(row.id), // surowe ID (1)
          normalize("S-" + String(row.id).padStart(8, "0")), // pełny format (S-00000001)
          normalize(row.number), // numer spisu
          normalize(getShelfName(row.shelfId)), // półka
        ];

        // jeśli którykolwiek kandydat zawiera q -> pasuje
        return candidates.some((c) => c.includes(q));
      });
    }

    // -- filtr stanu
    if (filters.status != "all") {
      list = list.filter((row) => String(row.status) == String(filters.status));
    }

    // -- sortowanie
    switch (filters.sort) {
      case "id_desc":
        list.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
        break;
      case "id_asc":
        list.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
        break;
      case "num_asc":
        list.sort((a, b) => {
          const A = normalize(a.number);
          const B = normalize(b.number);
          return A.localeCompare(B);
        });
        break;
      case "num_desc":
        list.sort((a, b) => {
          const A = normalize(a.number);
          const B = normalize(b.number);
          return B.localeCompare(A);
        });
        break;
      case "shelf_asc":
        list.sort((a, b) =>
          normalize(getShelfName(a.shelfId)).localeCompare(
            normalize(getShelfName(b.shelfId)),
          ),
        );
        break;
      case "shelf_desc":
        list.sort((a, b) =>
          normalize(getShelfName(b.shelfId)).localeCompare(
            normalize(getShelfName(a.shelfId)),
          ),
        );
        break;
      default:
        // fallback: id_desc
        list.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
        break;
    }

    return list;
  };

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (row) => "S-" + String(row.id).padStart(8, "0"),
      width: 140,
    },
    { key: "number", label: "Nr spisu", width: 160 },
    {
      key: "shelf",
      label: "Półka",
      width: 120,
      render: (row) => getShelfName(row.shelfId),
    },

    {
      key: "folders",
      label: "Teczki",
      render: (row) => {
        const foldersCount = folders.filter(
          (f) => f.setId === row.id && f.status === 1,
        ).length;

        return (
          <Tooltip title="Pokaż teczki w tym spisie" arrow>
            <span>
              <Link
                href="#"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (foldersCount > 0) {
                    onOpenFolders && onOpenFolders(row.id);
                  }
                }}
                sx={{
                  color: foldersCount === 0 ? "text.disabled" : "primary.main",
                  pointerEvents: foldersCount === 0 ? "none" : "auto",
                  cursor: foldersCount === 0 ? "default" : "pointer",
                }}
              >
                Teczki ({foldersCount})
              </Link>
            </span>
          </Tooltip>
        );
      },
      width: 140,
    },
    {
      key: "status",
      label: "Stan",
      render: (row) =>
        row.status == 1 ? (
          <>
            <CheckIcon
              sx={{ fontSize: "1rem", mb: "-0.25rem", color: "green" }}
            />{" "}
            dostępne
          </>
        ) : (
          <>
            <CloseIcon
              sx={{ fontSize: "1rem", mb: "-0.25rem", color: "red" }}
            />{" "}
            zniszczone
          </>
        ),
      width: 120,
    },
  ];

  return (
    <>
      <SearchBar
        view="set"
        onChange={setFilters}
        prefill={prefill}
        statusFromLink={linkStatus}
      />

      <ListTable
        columns={columns}
        rows={applyFilters()}
        selected={selection?.item}
        onSelect={onSelect}
      />
    </>
  );
}
