import { Dialog, DialogTitle } from "@mui/material";

export default function AddDocumentModal({ open, onClose }) {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Dodaj dokument</DialogTitle>
		</Dialog>
	);
}