import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Box,
  Typography,
} from "@mui/material";

// Generic ListTable
// columns: [ { key: 'id', label: 'ID', render?: row => JSX } ]
// rows: array of objects (each must have an `id`)
// selected: currently selected row object or null
// onSelect: callback(row)

export default function ListTable({
  columns = [],
  rows = [],
  selected = null,
  onSelect = () => {},
  rowsPerPage = 10,
}) {
  const [page, setPage] = useState(1);
  const start = (page - 1) * rowsPerPage;
  const pageRows = rows.slice(start, start + rowsPerPage);

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={1}
        sx={{ borderTop: "1px solid #f5f5f5" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Table size="small" sx={{ tableLayout: "auto", width: "100%" }}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key || col.label} sx={col.headerSx || {}}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {col.label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {pageRows.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={() => onSelect(row)}
                selected={selected?.id == row.id}
                sx={{
                  cursor: "pointer",
                  "&.Mui-selected": {
                    backgroundColor: "rgba(25,118,210,0.08) !important",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "rgba(25,118,210,0.12) !important",
                  },
                }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={(col.key || col.label) + "-" + row.id}
                    sx={
                      col.cellSx ||
                      col.sx || {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }
                    }
                  >
                    {typeof col.render == "function"
                      ? col.render(row)
                      : col.key
                        ? row[col.key]
                        : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {pageRows.length == 0 && (
              <TableRow key="no-rows">
                <TableCell colSpan={columns.length} align="center">
                  Brak rekordów
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={Math.max(1, Math.ceil(rows.length / rowsPerPage))}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
      </Box>
    </>
  );
}
