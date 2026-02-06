import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Link } from "@mui/material";
import SearchBar from "./SearchBar";

export default function SetList({ sets, selected, onSelect, activeView }) {

	// Paginacja
	const [page, setPage] = useState(1);
	const rowsPerPage = 10;
	const start = (page - 1) * rowsPerPage;
	const pageSets = sets.slice(start, start + rowsPerPage);

	return (
		<>
			{/* Pasek wyszukiwania */}
			<SearchBar activeView={activeView} />

			{/* Lista spisów */}
			<TableContainer 
				component={Paper} 
				sx={{ borderTop: "1px solid #f5f5f5" }}
				onClick={(e) => e.stopPropagation()}
			>
				<Table size="small" sx={{ tableLayout: "fixed", width: "100%", '& tr *': {textAlign: "center"} }}>

					<TableHead>
						<TableRow>
							<TableCell sx={{ width: 140 }}> <strong>ID</strong> </TableCell>
							<TableCell sx={{ width: "auto" }}> <strong>Nazwa</strong> </TableCell>
							<TableCell sx={{ width: 120 }}> <strong>Data</strong> </TableCell>
							<TableCell sx={{ width: 80 }}> <strong>Półka</strong> </TableCell>
							<TableCell sx={{ width: 140 }}> <strong>Zawartość</strong> </TableCell>
							<TableCell sx={{ width: 140 }}> <strong>Status</strong> </TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{pageSets.map(set => (
							<TableRow
								key={set.id} 
								hover 
								onClick={() => onSelect(selected?.id === set.id ? null : set)} 
								selected={selected?.id == set.id} 
								sx={{ cursor: "pointer" }}
							>
								{console.log(set)}
								
								<TableCell>{set.id}</TableCell>
								<TableCell sx={{ textAlign: "start !important" }}>{set.title}</TableCell>
								<TableCell>{set.date}</TableCell>
								<TableCell>
									<Link href="#" underline="hover">
										{set.shelf}
									</Link>
								</TableCell>
								<TableCell>
									<Link href="#" underline="hover">
										{set.content}
									</Link>
								</TableCell>
								<TableCell>{set.status}</TableCell>
							</TableRow>
						))}

						{pageSets.length == 0 && (
							<TableRow>
								<TableCell colSpan={6} align="center">
									Brak spisów
								</TableCell>
							</TableRow>
						)}
					</TableBody>

				</Table>
			</TableContainer>

			<Pagination 
				count={Math.ceil(sets.length / rowsPerPage)} 
				page={page} 
				onChange={(e, value) => setPage(value)} 
				sx={{ display: "flex", justifyContent: "center", mt: 2 }}
			/>
			
		</>
	);
}