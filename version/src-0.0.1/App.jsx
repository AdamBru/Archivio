import { Stack } from '@mui/material';
import { useState } from 'react';
import DocumentList from './components/DocumentList';
import SystemBar from './components/SystemBar';
import SetList from './components/SetList';

const mockDocuments = [
    { id: "T-00000001", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000001", title: "Umowa najmu", shelf: "A-2", date: "2021-02-03", status: "dostępny" },
    { id: "T-00000002", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000002", title: "Faktura 404", shelf: "B-1", date: "2022-08-10", status: "zniszczony" },
    { id: "T-00000003", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000001", title: "Instrukcja ISO", shelf: "A-1", date: "2023-01-12", status: "dostępny" },
    { id: "T-00000004", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000003", title: "Protokół odbioru", shelf: "C-3", date: "2022-05-15", status: "dostępny" },
    { id: "T-00000005", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000004", title: "Faktura 101", shelf: "B-2", date: "2021-11-23", status: "zniszczony" },
    { id: "T-00000006", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000002", title: "Raport kwartalny", shelf: "A-3", date: "2023-03-30", status: "dostępny" },
    { id: "T-00000007", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000005", title: "Umowa o pracę", shelf: "D-1", date: "2020-12-01", status: "zniszczony" },
    { id: "T-00000008", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000001", title: "Polisa ubezpieczeniowa", shelf: "A-2", date: "2022-07-19", status: "dostępny" },
    { id: "T-00000009", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000006", title: "Faktura 202", shelf: "C-1", date: "2021-09-05", status: "zniszczony" },
    { id: "T-00000010", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000003", title: "Protokół zdawczo-odbiorczy", shelf: "B-3", date: "2023-04-10", status: "dostępny" },
    { id: "T-00000011", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000007", title: "Umowa sprzedaży", shelf: "E-2", date: "2020-06-22", status: "zniszczony" },
    { id: "T-00000012", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000004", title: "Rachunek kosztów", shelf: "B-1", date: "2023-02-28", status: "dostępny" },
    { id: "T-00000013", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000002", title: "Faktura 303", shelf: "A-1", date: "2021-08-18", status: "zniszczony" },
    { id: "T-00000014", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000005", title: "Raport miesięczny", shelf: "D-2", date: "2022-09-12", status: "dostępny" },
    { id: "T-00000015", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000006", title: "Protokół kontroli", shelf: "C-2", date: "2021-04-14", status: "zniszczony" },
    { id: "T-00000016", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000001", title: "Umowa dzierżawy", shelf: "A-3", date: "2023-01-25", status: "dostępny" },
    { id: "T-00000017", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000003", title: "Faktura 505", shelf: "B-3", date: "2022-10-03", status: "zniszczony" },
    { id: "T-00000018", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000004", title: "Instrukcja BHP", shelf: "D-1", date: "2021-03-07", status: "dostępny" },
    { id: "T-00000019", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000007", title: "Rachunek sprzedaży", shelf: "E-1", date: "2020-08-30", status: "zniszczony" },
    { id: "T-00000020", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000002", title: "Protokół audytu", shelf: "A-2", date: "2023-05-01", status: "dostępny" },
    { id: "T-00000021", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000001", title: "Umowa zlecenie", shelf: "B-2", date: "2022-01-16", status: "zniszczony" },
    { id: "T-00000022", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000005", title: "Faktura 606", shelf: "D-3", date: "2023-02-09", status: "dostępny" },
    { id: "T-00000023", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000003", title: "Protokół spotkania", shelf: "C-1", date: "2021-07-11", status: "zniszczony" },
    { id: "T-00000024", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000004", title: "Raport roczny", shelf: "B-3", date: "2022-11-21", status: "dostępny" },
    { id: "T-00000025", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000006", title: "Umowa licencyjna", shelf: "C-2", date: "2020-05-05", status: "zniszczony" },
    { id: "T-00000026", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000001", title: "Faktura 707", shelf: "A-1", date: "2023-06-18", status: "dostępny" },
    { id: "T-00000027", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000007", title: "Protokół reklamacji", shelf: "E-2", date: "2021-12-09", status: "zniszczony" },
    { id: "T-00000028", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000002", title: "Instrukcja obsługi", shelf: "B-1", date: "2022-03-14", status: "dostępny" },
    { id: "T-00000029", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000003", title: "Rachunek inwestycji", shelf: "C-3", date: "2021-09-25", status: "zniszczony" },
    { id: "T-00000030", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000004", title: "Umowa współpracy", shelf: "D-1", date: "2023-04-07", status: "dostępny" },
    { id: "T-00000031", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000005", title: "Faktura 808", shelf: "B-2", date: "2020-07-19", status: "zniszczony" },
    { id: "T-00000032", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000001", title: "Protokół odbiorczy", shelf: "A-3", date: "2022-12-01", status: "dostępny" },
    { id: "T-00000033", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000006", title: "Umowa najmu lokalu", shelf: "C-1", date: "2021-05-20", status: "zniszczony" },
    { id: "T-00000034", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000002", title: "Faktura 909", shelf: "B-3", date: "2023-01-09", status: "dostępny" },
    { id: "T-00000035", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000003", title: "Raport techniczny", shelf: "C-2", date: "2022-08-14", status: "zniszczony" },
    { id: "T-00000036", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000004", title: "Instrukcja wewnętrzna", shelf: "D-2", date: "2021-10-30", status: "dostępny" },
    { id: "T-00000037", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000007", title: "Rachunek materiałów", shelf: "E-1", date: "2020-11-11", status: "zniszczony" },
    { id: "T-00000038", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000001", title: "Protokół serwisowy", shelf: "A-2", date: "2023-03-21", status: "dostępny" },
    { id: "T-00000039", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000005", title: "Umowa pożyczki", shelf: "D-3", date: "2021-01-29", status: "zniszczony" },
    { id: "T-00000040", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000002", title: "Faktura 1001", shelf: "B-1", date: "2022-06-08", status: "dostępny" },
    { id: "T-00000041", count: '1', sign: "0206", dateFrom: "2020", category: "B2", set: "S-00000003", title: "Raport finansowy", shelf: "C-3", date: "2021-09-12", status: "zniszczony" },
    { id: "T-00000042", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000004", title: "Instrukcja bezpieczeństwa", shelf: "D-1", date: "2023-05-14", status: "dostępny" },
    { id: "T-00000043", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000006", title: "Protokół jakości", shelf: "C-2", date: "2022-02-17", status: "zniszczony" },
    { id: "T-00000044", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000001", title: "Umowa dostawy", shelf: "A-1", date: "2023-07-01", status: "dostępny" },
    { id: "T-00000045", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000007", title: "Faktura 1111", shelf: "E-2", date: "2020-09-09", status: "zniszczony" },
    { id: "T-00000046", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000002", title: "Raport projektowy", shelf: "B-2", date: "2022-04-05", status: "dostępny" },
    { id: "T-00000047", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000003", title: "Protokół spotkania zespołu", shelf: "C-1", date: "2021-06-23", status: "zniszczony" },
    { id: "T-00000048", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000004", title: "Instrukcja procedur", shelf: "D-3", date: "2023-03-17", status: "dostępny" },
    { id: "T-00000049", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000005", title: "Umowa franchisingowa", shelf: "E-1", date: "2020-12-28", status: "zniszczony" },
    { id: "T-00000050", count: '1', sign: "0206", dateFrom: "2020", dateTo: "2022", category: "B2", set: "S-00000006", title: "Faktura 1212", shelf: "C-3", date: "2023-06-30", status: "dostępny" }
];

const mockSets = [
    { id: "S-00000001", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "A-2", date: "2021-02-03", status: "dostępny" },
    { id: "S-00000002", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "B-1", date: "2022-08-10", status: "zniszczony" },
    { id: "S-00000003", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "A-1", date: "2023-01-12", status: "dostępny" },
    { id: "S-00000004", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "C-3", date: "2022-05-15", status: "dostępny" },
    { id: "S-00000005", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "B-2", date: "2021-11-23", status: "zniszczony" },
    { id: "S-00000006", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "A-3", date: "2023-03-30", status: "dostępny" },
    { id: "S-00000007", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "D-1", date: "2020-12-01", status: "zniszczony" },
    { id: "S-00000008", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "A-2", date: "2022-07-19", status: "dostępny" },
    { id: "S-00000009", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "C-1", date: "2021-09-05", status: "zniszczony" },
    { id: "S-00000010", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "B-3", date: "2023-04-10", status: "dostępny" },
    { id: "S-00000011", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "E-2", date: "2020-06-22", status: "zniszczony" },
    { id: "S-00000012", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "B-1", date: "2023-02-28", status: "dostępny" },
    { id: "S-00000013", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "A-1", date: "2021-08-18", status: "zniszczony" },
    { id: "S-00000014", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "D-2", date: "2022-09-12", status: "dostępny" },
    { id: "S-00000015", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "C-2", date: "2021-04-14", status: "zniszczony" },
    { id: "S-00000016", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "A-3", date: "2023-01-25", status: "dostępny" },
    { id: "S-00000017", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "B-3", date: "2022-10-03", status: "zniszczony" },
    { id: "S-00000018", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "D-1", date: "2021-03-07", status: "dostępny" },
    { id: "S-00000019", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "E-1", date: "2020-08-30", status: "zniszczony" },
    { id: "S-00000020", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "A-2", date: "2023-05-01", status: "dostępny" },
    { id: "S-00000021", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "B-2", date: "2022-01-16", status: "zniszczony" },
    { id: "S-00000022", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "D-3", date: "2023-02-09", status: "dostępny" },
    { id: "S-00000023", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "C-1", date: "2021-07-11", status: "zniszczony" },
    { id: "S-00000024", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "B-3", date: "2022-11-21", status: "dostępny" },
    { id: "S-00000025", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "C-2", date: "2020-05-05", status: "zniszczony" },
    { id: "S-00000026", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "A-1", date: "2023-06-18", status: "dostępny" },
    { id: "S-00000027", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "E-2", date: "2021-12-09", status: "zniszczony" },
    { id: "S-00000028", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "B-1", date: "2022-03-14", status: "dostępny" },
    { id: "S-00000029", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "C-3", date: "2021-09-25", status: "zniszczony" },
    { id: "S-00000030", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "D-1", date: "2023-04-07", status: "dostępny" },
    { id: "S-00000031", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "B-2", date: "2020-07-19", status: "zniszczony" },
    { id: "S-00000032", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "A-3", date: "2022-12-01", status: "dostępny" },
    { id: "S-00000033", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "C-1", date: "2021-05-20", status: "zniszczony" },
    { id: "S-00000034", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "B-3", date: "2023-01-09", status: "dostępny" },
    { id: "S-00000035", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "C-2", date: "2022-08-14", status: "zniszczony" },
    { id: "S-00000036", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "D-2", date: "2021-10-30", status: "dostępny" },
    { id: "S-00000037", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "E-1", date: "2020-11-11", status: "zniszczony" },
    { id: "S-00000038", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "A-2", date: "2023-03-21", status: "dostępny" },
    { id: "S-00000039", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "D-3", date: "2021-01-29", status: "zniszczony" },
    { id: "S-00000040", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "B-1", date: "2022-06-08", status: "dostępny" },
    { id: "S-00000041", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "C-3", date: "2021-09-12", status: "zniszczony" },
    { id: "S-00000042", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "D-1", date: "2023-05-14", status: "dostępny" },
    { id: "S-00000043", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "C-2", date: "2022-02-17", status: "zniszczony" },
    { id: "S-00000044", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "A-1", date: "2023-07-01", status: "dostępny" },
    { id: "S-00000045", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "E-2", date: "2020-09-09", status: "zniszczony" },
    { id: "S-00000046", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "B-2", date: "2022-04-05", status: "dostępny" },
    { id: "S-00000047", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "C-1", date: "2021-06-23", status: "zniszczony" },
    { id: "S-00000048", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "D-3", date: "2023-03-17", status: "dostępny" },
    { id: "S-00000049", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "E-1", date: "2020-12-28", status: "zniszczony" },
    { id: "S-00000050", content: "content link", title: "Spis zdawczo-odbiorczy nr 123", shelf: "C-3", date: "2023-06-30", status: "dostępny" }
];

export default function App() {

	const [view, setView] = useState(0); // 0 = Teczki (documents), 1 = Spisy, 2 = Półki
	const [selectedDocument, setSelectedDocument] = useState(null);
	const [selectedSet, setSelectedSet] = useState(null);
	const [selectedShelf, setSelectedShelf] = useState(null);

	// Aktywna selekcja w zależności od widoku
	const selectedItem =
		view === 0 ? selectedDocument :
		view === 1 ? selectedSet :
					 selectedShelf;

	const setSelectedItem =
		view === 0 ? setSelectedDocument :
		view === 1 ? setSelectedSet :
					 setSelectedShelf;

	// Zmiana aktywnej selekcji przy zmianie widoku
	function handleViewChange(v) {
		setView(v);
		setSelectedDocument(null);
		setSelectedSet(null);
		setSelectedShelf(null);
	}

	return (
		<>
		{/* Górny pasek z kartami i narzędziami */}
            <SystemBar 
                    activeView={view}
                    onChangeView={setView}
                    disableButton={!selectedItem} 
                    onAdd={() => console.log("Dodaj")} 
                    onDelete={() => console.log("Usuń: ", selectedItem)}
                    onDeselect={() => setSelectedItem(null)}
                    onHelp={() => {}}
                    onSettings={() => {}}
                />

			{/* Treść główna pod paskiem */}
            <Stack 
                style={{ minHeight: "100%", maxWidth: 1200, margin: "0 auto", padding: "5rem 1rem", gap: 15, flex: 1 }} 
                onClick={() => setSelectedItem(null)}
            >

				{view == 0 && (
					// Lista teczek - oryginalnie nazwana "Document"
					<DocumentList 
						documents={mockDocuments}
						selected={selectedDocument}
						onSelect={setSelectedDocument}
						activeView={view}
					/>
				)}

				{view == 1 && (
					// Lista spisów
					<SetList 
						sets={mockSets}
						selected={selectedSet}
						onSelect={setSelectedSet}
						activeView={view}
					/>
				)}

				{view == 2 && (
					// Lista półek
					"PÓŁKI"
					// <SetList 
					// 	shelves={mockShelves}
					// 	selected={selectedShelf}
					// 	onSelect={setSelectedShelf}
					// 	activeView={view}
					// />
				)}
			</Stack>

		</>
	);
}