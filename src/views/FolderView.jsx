import React, { useState } from "react";
import ListTable from "../components/ListTable";
import SearchBar from "../components/SearchBar";
import { Link, Tooltip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export default function FolderView({
  rows,
  shelves = [],
  prefill,
  onOpenSet,
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
    shelves.find((s) => s.id === shelfId)?.name || "";

  // tworzenie ładnego, pełnego id dla spisu (aka formatuj ID spisu jako S-00000001)
  const getSetLabel = (setId) =>
    setId ? "S-" + String(setId).padStart(8, "0") : "";

  // normalizacja do wyszukiwania i sortowania
  const normalize = (s) =>
    s == undefined || s == null
      ? ""
      : String(s)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

  // filtrująco-sortująca
  const applyFilters = () => {
    let list = [...rows];

    // --- filtr tekstowy ---
    const textQuery = String(filters.text || "").trim();
    if (textQuery != "") {
      const q = normalize(textQuery);

      list = list.filter((row) => {
        const fields = [
          normalize(row.id),
          normalize("T-" + String(row.id).padStart(8, "0")),
          normalize(row.sign),
          normalize(row.title),
          normalize(row.dateFrom),
          normalize(row.dateTo),
          normalize(row.category),
          normalize(getSetLabel(row.setId)),
          normalize(getShelfName(row.shelfId)),
        ];

        return fields.some((f) => f.includes(q));
      });
    }

    // --- filtr stanu ---
    if (filters.status != "all") {
      list = list.filter((row) => String(row.status) == filters.status);
    }

    // --- sortowanie ---
    switch (filters.sort) {
      // ID (numeryczne)
      case "id_desc":
        list.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
        break;
      case "id_asc":
        list.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
        break;

      // Znak (4 cyfry)
      case "sign_asc":
        list.sort((a, b) => normalize(a.sign).localeCompare(normalize(b.sign)));
        break;
      case "sign_desc":
        list.sort((a, b) => normalize(b.sign).localeCompare(normalize(a.sign)));
        break;

      // Tytuł
      case "title_asc":
        list.sort((a, b) =>
          normalize(a.title).localeCompare(normalize(b.title)),
        );
        break;
      case "title_desc":
        list.sort((a, b) =>
          normalize(b.title).localeCompare(normalize(a.title)),
        );
        break;

      // Data — po dateFrom numerycznie
      case "date_asc":
        list.sort((a, b) =>
          normalize(a.dateFrom).localeCompare(normalize(b.dateFrom)),
        );
        break;
      case "date_desc":
        list.sort((a, b) =>
          normalize(b.dateFrom).localeCompare(normalize(a.dateFrom)),
        );
        break;

      // Kategoria (np. A, B-2)
      case "category_asc":
        list.sort((a, b) =>
          normalize(a.category).localeCompare(normalize(b.category)),
        );
        break;
      case "category_desc":
        list.sort((a, b) =>
          normalize(b.category).localeCompare(normalize(a.category)),
        );
        break;

      // Półka (A-1, B-2)
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

      // ID spisu (string)
      case "set_asc":
        list.sort((a, b) =>
          normalize(a.setId).localeCompare(normalize(b.setId)),
        );
        break;
      case "set_desc":
        list.sort((a, b) =>
          normalize(b.setId).localeCompare(normalize(a.setId)),
        );
        break;

      // fallback
      default:
        list.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
        break;
    }

    return list;
  };

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (row) => "T-" + String(row.id).padStart(8, "0"),
      width: 120,
    },
    { key: "sign", label: "Znak", width: 80 },
    {
      key: "title",
      label: "Tytuł",
      cellSx: {
        width: 1,
        minWidth: "100%",
        maxWidth: "260px",
        display: "flex",
      },
      render: (row) => (
        <Tooltip title={row.title}>
          <span
            style={{
              display: "inline-block",
              maxWidth: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {row.title}
          </span>
        </Tooltip>
      ),
    },
    {
      key: "date",
      label: "Daty od – do",
      render: (row) => {
        if (row.dateFrom && row.dateTo)
          return `${row.dateFrom} – ${row.dateTo}`;
        if (row.dateFrom) return row.dateFrom;
        return "—";
      },
      width: 140,
    },
    { key: "category", label: "Kat.", width: 50 },
    { key: "amount", label: "Liczba", width: 50 },
    {
      key: "shelf",
      label: "Półka",
      width: 50,
      render: (row) => getShelfName(row.shelfId),
    },
    {
      key: "set",
      label: "W spisie",
      render: (row) => (
        <Link
          href="#"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onOpenSet(row.setId);
          }}
        >
          {getSetLabel(row.setId)}
        </Link>
      ),
      width: 140,
    },
    {
      key: "status",
      label: "Stan",
      render: (row) =>
        row.status == 1 ? (
          <>
            <CheckIcon
              sx={{
                fontSize: "1rem",
                marginBottom: "-0.25rem",
                color: "green",
              }}
            />{" "}
            dostępne
          </>
        ) : (
          <>
            <CloseIcon
              sx={{ fontSize: "1rem", marginBottom: "-0.25rem", color: "red" }}
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
        view="folder"
        onChange={setFilters}
        prefill={prefill}
        statusFromLink={linkStatus}
      />

      <ListTable
        columns={columns}
        rows={applyFilters()}
        selected={selection.item}
        onSelect={onSelect}
      />
    </>
  );
}
