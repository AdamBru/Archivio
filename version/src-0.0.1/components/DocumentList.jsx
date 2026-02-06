import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Link } from "@mui/material";
import SearchBar from "./SearchBar";
import TitlePopover from "./TitlePopover";

export default function DocumentList({ documents, selected, onSelect, activeView }) {

	// Widok Dokumenty przejął teraz nową nazwę - "Teczki", w celu zachowania poprawnego działania kodu, należy nadale używać nazwy "documents" w propsach i zmiennych.

	// Paginacja
	const [page, setPage] = useState(1);
	const rowsPerPage = 10;
	const start = (page - 1) * rowsPerPage;
	const pageDocs = documents.slice(start, start + rowsPerPage);

	// Helper: prosty format dat — tylko `dateFrom` i `dateTo`
	const formatDateRange = (doc) => {
		const from = doc.dateFrom;
		const to = doc.dateTo;
		if (!from && !to) return "-";
		if (!to) return `${from}`;
		return `${from} — ${to}`;
	};

	return (
		<>
			{/* Pasek wyszukiwania */}
			<SearchBar activeView={activeView} />
			
			{/* Lista dokumentów */}
			<TableContainer 
				component={Paper} 
				sx={{ borderTop: "1px solid #f5f5f5" }}
				onClick={(e) => e.stopPropagation()}
			>
				<Table size="small" sx={{ tableLayout: "fixed", width: "100%", '& tr *': {textAlign: "center"} }}>

					<TableHead>
						<TableRow>
							<TableCell sx={{ width: 115 }}> <strong>ID</strong> </TableCell>
							<TableCell sx={{ width: 110 }}> <strong>Znak teczki</strong> </TableCell>
							<TableCell sx={{ width: "auto" }}> <strong>Tytuł teczki</strong> </TableCell>
							<TableCell sx={{ width: 120 }}> <strong>Daty <br />(od — do)</strong> </TableCell>
							<TableCell sx={{ width: 70 }}> <strong>Kat. akt</strong> </TableCell>
							<TableCell sx={{ width: 80 }}> <strong>Liczba teczek</strong> </TableCell>
							<TableCell sx={{ width: 70 }}> <strong>Półka</strong> </TableCell>
							<TableCell sx={{ width: 115 }}> <strong>W spisie</strong> </TableCell>
							<TableCell sx={{ width: 110 }}> <strong>Status</strong> </TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{pageDocs.map(doc => (
							<TableRow
								key={doc.id} 
								hover 
								onClick={() => onSelect(selected?.id === doc.id ? null : doc)} 
								selected={selected?.id == doc.id} 
								sx={{ cursor: "pointer" }}
							>
								<TableCell>{doc.id}</TableCell>
								<TableCell>{doc.sign || "-"}</TableCell>
								<TableCell sx={{ textAlign: "start !important" }}>{<TitlePopover id={doc.id} title={doc.title}/> || "-"}</TableCell>
								<TableCell>{formatDateRange(doc)}</TableCell>
								<TableCell>{doc.category || "-"}</TableCell>
								<TableCell>{doc.count ?? "-"}</TableCell>
								<TableCell>
									<Link href="#" underline="hover">
										{doc.shelf || "-"}
									</Link>
								</TableCell>
								<TableCell>
									<Link href="#" underline="hover">
										{doc.set || "-"}
									</Link>
								</TableCell>
								<TableCell>{doc.status || "-"}</TableCell>
							</TableRow>
						))}

						{pageDocs.length == 0 && (
							<TableRow>
								<TableCell colSpan={9} align="center">
									Brak teczek
								</TableCell>
							</TableRow>
						)}
					</TableBody>

				</Table>
			</TableContainer>

			<Pagination 
				count={Math.ceil(documents.length / rowsPerPage)} 
				page={page} 
				onChange={(e, value) => setPage(value)} 
				sx={{ display: "flex", justifyContent: "center", mt: 2 }}
			/>
			
		</>
	);
}