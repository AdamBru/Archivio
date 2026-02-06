import * as React from 'react';
import { MenuItem, Menu, IconButton, Box} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export default function AppOptionsMenu({  }) {

	const [anchorEl, setAnchorEl] = React.useState(null);

	return (
	<>
		<IconButton 
			children={<MenuIcon />}
			onClick={(e) => setAnchorEl(e.currentTarget)} 
			sx={{ padding: "0 .45rem", color: "#fff" }}
		/>

		<Box sx={{ height: 35, width: "1px", backgroundColor: "#266aa8" }} />

		<Menu
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			onClose={() => setAnchorEl(null)}
			PaperProps={{ sx: {left: '0 !important', top: "37px !important", borderRadius: "0 4px 4px 4px"} }}
		>
			<MenuItem onClick={() => setAnchorEl(null)} sx={{fontSize: ".96rem"}}>
				<MenuIcon fontSize='small' sx={{ margin: "-.15rem .7rem 0 -.25rem" }} />
				Opcja 1
			</MenuItem>
			<MenuItem onClick={() => setAnchorEl(null)} sx={{fontSize: ".96rem"}}>
				<MenuIcon fontSize='small' sx={{ margin: "-.15rem .7rem 0 -.25rem" }} />
				Opcja 2
			</MenuItem>
			<MenuItem onClick={() => setAnchorEl(null)} sx={{fontSize: ".96rem"}}>
				<CloseIcon fontSize='small' sx={{ margin: "-.15rem .7rem 0 -.25rem" }} />
				Zakończ
			</MenuItem>
		</Menu>
	</>
	)
}
