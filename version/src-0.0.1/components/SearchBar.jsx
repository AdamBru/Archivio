import React, { useState } from "react";
import { Box, Toolbar, Typography, Paper, OutlinedInput, IconButton, FormControl, InputLabel, Select, MenuItem, InputAdornment } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

export default function SearchBar({activeView}) {

	const [sortBy, setSortBy] = useState(1);
	const [orderBy, setOrderBy] = useState(1);
	const [statusBy, setStatusBy] = useState(1);

	const placeholderText = 
		activeView == 0 ? "Szukaj po nazwie, id, dacie, spisie..." :
		activeView == 1 ? "Szukaj po nazwie, id, dacie..." :
					"Szukaj...";

	return (
		<>
			<Toolbar component={Paper} disableGutters className="search-bar" sx={{ flexWrap: "wrap" }}>

				{/* Belka wyszukiwarki / filtrów / sortowania / 
					filtr - status: wszystkie / zniszcone / obecne */}

				{/* Wyszukiwarka */}
				<FormControl size="small" sx={{ minWidth: 300, flex: "1 1 320px" }}>
					<OutlinedInput
						placeholder={placeholderText}
						endAdornment={
							<InputAdornment position="end">
								<IconButton 
									edge="end" 
									children={<ClearIcon />} 
								/>
							</InputAdornment>
						}
					/>
				</FormControl>

				<Box sx={{ display: "flex", flexWrap: "nowrap", gap: "1rem", flex: 1 }}>
					{/* Sortowanie i Kolejność */}
					<Box sx={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", flex: 2 }}>
						<Box sx={{ minWidth: 200, flex: 1 }}>
							<FormControl fullWidth size="small" >
								<InputLabel id="sort-by-select-label">Sortowanie</InputLabel>
								<Select
									labelId="sort-by-select-label"
									id="sort-by-select"
									value={sortBy}
									label="Sortowanie"
									onChange={(e) => setSortBy(e.target.value)}
									sx={{ borderRadius: "4px 0 0 4px" }}
								>
									<MenuItem value={1}>ID dokumentu</MenuItem>
									<MenuItem value={2}>Nazwa dokumentu</MenuItem>
									<MenuItem value={3}>Data</MenuItem>
									<MenuItem value={4}>Półka</MenuItem>
									<MenuItem value={4}>ID spisu</MenuItem>
								</Select>
							</FormControl>
						</Box>

						<Box sx={{ minWidth: 110, flex: 1 }}>
							<FormControl fullWidth size="small">
								<InputLabel id="order-by-select-label">Kolejność</InputLabel>
								<Select
									labelId="order-by-select-label"
									id="order-by-select"
									value={orderBy}
									label="Kolejność"
									onChange={(e) => setOrderBy(e.target.value)}
									sx={{ borderRadius: "0 4px 4px 0" }}
								>
									<MenuItem value={1}>Malejąco</MenuItem>
									<MenuItem value={2}>Rosnąco</MenuItem>
								</Select>
							</FormControl>
						</Box>
					</Box>

					{/* Status */}
					<Box sx={{ minWidth: 130, flex: 1 }}>
						<FormControl fullWidth size="small">
							<InputLabel id="sort-by-select-label">Status</InputLabel>
							<Select
								labelId="sort-by-select-label"
								id="sort-by-select"
								value={statusBy}
								label="Status"
								onChange={(e) => setStatusBy(e.target.value)}
							>
								<MenuItem value={1}>dostępny</MenuItem>
								<MenuItem value={2}>zniszczony</MenuItem>
								<MenuItem value={3}>wszystkie</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</Box>

			</Toolbar>
		</>
	);
}