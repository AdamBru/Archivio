import React, { useState } from "react";
import ListTable from "../components/ListTable";
import SearchBar from "../components/SearchBar";
import { Link, Tooltip } from "@mui/material";

export default function ShelfView({
  rows,
  sets,
  folders,
  onOpenSets,
  onOpenFolders,
  selection,
  onSelect,
}) {
  // stan wyboru sortowania
  const [filters, setFilters] = useState({
    text: "",
    sort: "name_asc",
  });

  const normalize = (s) =>
    s == null
      ? ""
      : String(s)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

  const applyFilters = () => {
    let list = [...rows];

    // --- tekst ---
    if (filters.text && filters.text.trim() !== "") {
      const q = normalize(filters.text.trim());

      list = list.filter((row) => {
        const fields = [normalize(row.id), normalize(row.name)];
        return fields.some((f) => f.includes(q));
      });
    }

    // --- sortowanie ---
    switch (filters.sort) {
      // -- ID --
      case "id_asc":
        list.sort((a, b) => Number(a.id) - Number(b.id));
        break;
      case "id_desc":
        list.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      // -- nazwa --
      case "name_asc":
        list.sort((a, b) => normalize(a.name).localeCompare(normalize(b.name)));
        break;
      case "name_desc":
        list.sort((a, b) => normalize(b.name).localeCompare(normalize(a.name)));
        break;
      // fallback
      default:
        list.sort((a, b) => normalize(a.name).localeCompare(normalize(b.name)));
        break;
    }

    return list;
  };

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (row) => "P-" + String(row.id).padStart(8, "0"),
    },
    { key: "name", label: "Półka" },
    {
      key: "sets",
      label: "Spisy",
      render: (row) => {
        const setsCount = sets.filter(
          (s) => s.shelfId === row.id && s.status === 1,
        ).length;

        return (
          <Tooltip title="Pokaż spisy na tej półce" arrow>
            <span>
              <Link
                href="#"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (setsCount > 0) {
                    onOpenSets(row.name);
                  }
                }}
                sx={{
                  color: setsCount === 0 ? "text.disabled" : "primary.main",
                  pointerEvents: setsCount === 0 ? "none" : "auto",
                  cursor: setsCount === 0 ? "default" : "pointer",
                }}
              >
                Spisy ({setsCount})
              </Link>
            </span>
          </Tooltip>
        );
      },
    },
    {
      key: "folders",
      label: "Teczki",
      render: (row) => {
        // liczba niezniszczonych teczek przypisanych do tej półki
        const foldersCount = folders.filter(
          (f) => f.shelfId === row.id && f.status === 1,
        ).length;

        return (
          <Tooltip title="Pokaż teczki na tej półce" arrow>
            <span>
              <Link
                href="#"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (foldersCount > 0) {
                    onOpenFolders(row.name);
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
    },
  ];

  return (
    <>
      <SearchBar view="shelf" onChange={setFilters} />

      <ListTable
        columns={columns}
        rows={applyFilters()}
        selected={selection.item}
        onSelect={onSelect}
      />
    </>
  );
}
