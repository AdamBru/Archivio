import { useState } from "react";
import { AppBar, Box, Button, Menu, MenuItem, Paper, Tab, Tabs, Toolbar, Divider } from '@mui/material';
import AppOptionsMenu from "./AppOptionsMenu";
// Icons
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ShelvesIcon from '@mui/icons-material/Shelves';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HelpIcon from '@mui/icons-material/Help';
import RemoveIcon from '@mui/icons-material/Remove';
import SettingsIcon from '@mui/icons-material/Settings';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeselectIcon from '@mui/icons-material/Deselect';

export default function SystemBar({
	activeView, 
	onChangeView, 
	onAdd,
	onDelete,
	onDeselect,
	disableButton,
	onHelp,
	onSettings
}) {

	const [editAnchor, setEditAnchor] = useState(null);
	const editOpen = Boolean(editAnchor);

	const handleEditClick = (event) => {
		setEditAnchor(event.currentTarget);
	};

	const handleEditClose = () => {
		setEditAnchor(null);
	};

	return (
		<AppBar
			position="fixed"
			elevation={0}
			className="system-menu"
		>

			{/* GÓRNY PASEK */}
			<Toolbar disableGutters sx={{minHeight: "0 !important", boxShadow: "0 0 2px 0 #555", zIndex: 2}}>

				<AppOptionsMenu />

				{/* Karty */}
				<Tabs
					value={activeView}
					onChange={(e, v) => onChangeView(v)}
					textColor="inherit"
					className="view-tabs"
					variant="scrollable"
					scrollButtons="auto"
				>
					<Tab label="Teczki" value={0} icon={<TextSnippetIcon />} iconPosition="start" />
					<Tab label="Spisy" value={1} icon={<FormatListBulletedIcon />} iconPosition="start" />
					<Tab label="Półki" value={2} icon={<ShelvesIcon />} iconPosition="start" />
				</Tabs>

				<Box sx={{ flexGrow: 1 }} />
				
				{/* Po prawej na górnym pasku */}
				<Divider orientation="vertical" flexItem />
				<Button color="inherit" size="small" startIcon={<HelpIcon />} onClick={onHelp}>Pomoc</Button>
				<Divider orientation="vertical" flexItem />
				<Button color="inherit" size="small" startIcon={<SettingsIcon />} onClick={onSettings}>Ustawienia</Button>
			</Toolbar>

			{/* PASEK NARZĘDZI */}
			<Toolbar className="tools-menu" disableGutters sx={{minHeight: "0 !important"}}>
				<Button sx={{color: "text.primary"}} size="small" startIcon={<AddIcon />} onClick={onAdd}>Dodaj</Button>
				<Divider orientation="vertical" flexItem />
				<Button sx={{color: "text.primary"}} size="small" startIcon={<RemoveIcon />} onClick={onDelete} disabled={disableButton}>Usuń</Button>
				<Divider orientation="vertical" flexItem />
				<Button sx={{color: "text.primary"}} size="small" startIcon={<DeleteIcon />} onClick={""} disabled={disableButton}>Zniszcz</Button>
				<Divider orientation="vertical" flexItem />
				<Button
					sx={{ color: "text.primary" }}
					size="small"
					startIcon={<EditIcon />}
					onClick={handleEditClick}
					disabled={disableButton}
				>
					Edytuj
				</Button>
					<Menu
						anchorEl={editAnchor}
						open={editOpen}
						onClose={handleEditClose}
						MenuListProps={{ dense: true }}
						sx={{
							"& .MuiMenuItem-root": {
								paddingX: 1.5,
							}
						}}
					>
						<MenuItem onClick={handleEditClose}> <TextFormatIcon sx={{marginRight: 1, fontSize: "1.1rem"}} /> Nazwa </MenuItem>
						<MenuItem onClick={handleEditClose}> <CalendarMonthIcon sx={{marginRight: 1, fontSize: "1.1rem"}} /> Data </MenuItem>
						<MenuItem onClick={handleEditClose}> <ShelvesIcon sx={{marginRight: 1, fontSize: "1.1rem"}} /> Półka </MenuItem>
						<MenuItem onClick={handleEditClose}> <FormatListBulletedIcon sx={{marginRight: 1, fontSize: "1.1rem"}} /> Spis </MenuItem>
					</Menu>
				<Divider orientation="vertical" flexItem />

				<Button sx={{color: "text.primary"}} size="small" startIcon={<DeselectIcon />} onClick={onDeselect} disabled={disableButton}>Odznacz</Button>
				<Divider orientation="vertical" flexItem />
			</Toolbar>
		</AppBar>
	);

}
