import { useEffect, useState } from "react";
import { TextField, Stack, MenuItem, Autocomplete } from "@mui/material";

export default function FolderForm({
  formRef,
  mode,
  data,
  folders,
  sets,
  shelves,
  onChange,
}) {
  const [values, setValues] = useState({
    id: "",
    sign: "",
    title: "",
    dateFrom: "",
    dateTo: "",
    category: "",
    amount: "",
    shelfId: null,
    setId: null,
    status: 1,
  });

  // --- ustalenie ID oraz uzupełnienie pól przy edycji ---
  useEffect(() => {
    if (mode == "edit" && data) {
      // wczytywanie danych do formularza
      setValues({
        id: data.id,
        sign: data.sign || "",
        title: data.title || "",
        dateFrom: data.dateFrom || "",
        dateTo: data.dateTo || "",
        category: data.category || "",
        amount: data.amount || "",
        shelfId: data.shelfId ?? null,
        setId: data.setId ?? null,
        status: data.status ?? 1,
      });
    }

    // Uzyskanie nowego ID większego o 1 od ostatniego
    if (mode == "add" && folders) {
      const lastId = folders.reduce((max, r) => Math.max(max, Number(r.id)), 0);
      const newId = lastId + 1;

      setValues((v) => ({
        ...v,
        id: newId,
      }));
    }
  }, [mode, data, folders]);

  // Obsługa zmian
  const handleChange = (field, value) => {
    let newValues = { ...values, [field]: value };

    // gdy zmienia się spis → odziedzicz półkę
    if (field === "setId") {
      const setObj = sets.find((s) => s.id === value);
      newValues = {
        ...values,
        setId: value,
        shelfId: setObj ? setObj.shelfId : null,
      };
    }

    setValues(newValues);

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });

    // walidacja daty
    if (field === "dateFrom" || field === "dateTo") {
      validateDates(
        field === "dateFrom" ? value : newValues.dateFrom,
        field === "dateTo" ? value : newValues.dateTo,
      );
    }

    onChange && onChange(newValues);
  };

  // Obsługa komunikatów o błędzie
  const [errors, setErrors] = useState({});

  // Walidator dat
  const validateDates = (from, to) => {
    const y4 = /^\d{4}$/;

    const newErrors = { ...errors };

    // czyści poprzednie błędy, ale tylko z dat
    delete newErrors.dateFrom;
    delete newErrors.dateTo;

    if (from && !y4.test(from)) {
      newErrors.dateFrom = "Rok musi mieć 4 cyfry (np. 2025)";
    }

    if (to && !y4.test(to)) {
      newErrors.dateTo = "Rok musi mieć 4 cyfry (np. 2025)";
    }

    if (
      from &&
      to &&
      y4.test(from) &&
      y4.test(to) &&
      Number(to) < Number(from)
    ) {
      newErrors.dateTo = "Data 'do' nie może być mniejsza niż 'od'";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length == 0;
  };

  // Walidator pustych pól
  const validateRequired = () => {
    const newErrors = {};

    if (!values.sign) newErrors.sign = "Wymagane";
    if (!values.title) newErrors.title = "Wymagane";
    if (!values.category) newErrors.category = "Wymagane";

    if (!values.amount || Number(values.amount) <= 0) {
      newErrors.amount = "Liczba teczek musi być większa od zera";
    }

    if (!values.dateFrom) newErrors.dateFrom = "Wymagane";

    // walidacja relacyjna przy próbie przypisania do zniszczonego spisu
    const selectedSet = sets?.find((s) => s.id === values.setId);
    if (selectedSet && selectedSet.status === 0) {
      newErrors.setId = "Nie można przypisać do zniszczonego spisu";
    }

    setErrors(newErrors);

    // jeśli pole puste lub błędne — blokuje zapis
    return (
      Object.keys(newErrors).length === 0 &&
      validateDates(values.dateFrom, values.dateTo)
    );
  };

  useEffect(() => {
    if (formRef) {
      formRef.current = {
        validate: validateRequired,
        getValues: () => values,
      };
    }
  }, [formRef, values, errors]);

  // Lista ID spisów z istniejących spisów
  //   												const setOptions = Array.isArray(sets)
  //   												  ? sets.map((s) => "S-" + String(s.id).padStart(8, "0"))
  //   												  : [];
  // Lista znaków z istniejących teczek
  const signOptions = Array.isArray(folders)
    ? [...new Set(folders.map((f) => f.sign).filter(Boolean))]
    : [];
  // Lista tytułów z istniejących teczek
  const titleOptions = Array.isArray(folders)
    ? [...new Set(folders.map((f) => f.title).filter(Boolean))]
    : [];
  // Lista półek z listy półek
  //														   const shelfOptions = Array.isArray(shelves) ? shelves.map((s) => s.name) : [];
  // Lista kategori z listy istniejących teczek
  const categoryOptions = Array.isArray(folders)
    ? [...new Set(folders.map((f) => f.category).filter(Boolean))]
    : [];

  return (
    <form autoComplete="off">
      <Stack spacing={2}>
        {/* ID */}
        <TextField
          label="ID"
          value={"T-" + String(values.id).padStart(8, "0")}
          fullWidth
          disabled
          size="small"
        />
        {/* Znak */}
        <Autocomplete
          freeSolo
          options={signOptions}
          value={values.sign}
          onChange={(e, val) => handleChange("sign", val || "")}
          onInputChange={(e, val) => handleChange("sign", val)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Znak"
              required
              fullWidth
              size="small"
              error={!!errors.sign}
              helperText={errors.sign}
            />
          )}
        />
        {/* Tytuł */}
        <Autocomplete
          freeSolo
          options={titleOptions}
          value={values.title}
          onChange={(e, val) => handleChange("title", val || "")}
          onInputChange={(e, val) => handleChange("title", val)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tytuł"
              required
              fullWidth
              size="small"
              error={!!errors.title}
              helperText={errors.title}
            />
          )}
        />
        {/* Data od */}
        <TextField
          label="Data od"
          value={values.dateFrom}
          onChange={(e) =>
            handleChange("dateFrom", e.target.value.replace(/\D/g, ""))
          }
          required
          fullWidth
          size="small"
          error={!!errors.dateFrom}
          helperText={errors.dateFrom}
        />
        {/* Data do */}
        <TextField
          label="Data do"
          value={values.dateTo}
          onChange={(e) =>
            handleChange("dateTo", e.target.value.replace(/\D/g, ""))
          }
          fullWidth
          size="small"
          error={!!errors.dateTo}
          helperText={errors.dateTo}
        />
        {/* Kategoria */}
        <Autocomplete
          freeSolo
          options={categoryOptions}
          value={values.category}
          onChange={(e, val) => handleChange("category", val || "")}
          onInputChange={(e, val) => handleChange("category", val)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Kategoria"
              required
              fullWidth
              size="small"
              error={!!errors.category}
              helperText={errors.category}
            />
          )}
        />
        {/* Liczba teczek */}
        <TextField
          label="Liczba teczek"
          type="number"
          value={values.amount}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "");
            handleChange("amount", digits === "" ? "" : Number(digits));
          }}
          required
          fullWidth
          size="small"
          error={!!errors.amount}
          helperText={errors.amount}
        />
        {/* Półka */}{" "}
        {/* NIE MOŻNA DODAĆ TECZKI BEZ SPISU DO PÓŁKI (czyli między innymi nowotworzonej, jak tu, więc jest to zakomentowane) */}
        {/* <Autocomplete
        options={shelves}
        getOptionLabel={(option) => option.name}
        value={shelves.find((s) => s.id === values.shelfId) || null}
        onChange={(e, val) => handleChange("shelfId", val ? val.id : null)}
        renderInput={(params) => (
          <TextField {...params} label="Półka" fullWidth size="small" />
		  renderOption={(props, option) => (
  		  	<li key={option.id} {...props}>{option.name}</li>
		  )}
        )}
      /> */}
        {/* ID Spisu */}
        <Autocomplete
          options={sets.filter((s) => s.status === 1)} // do wyboru do przypisaniateczki do spisu wyłącznie dostępne niezniszczone spisy
          getOptionLabel={(option) =>
            `S-${String(option.id).padStart(8, "0")} (nr ${option.number})`
          }
          value={sets.find((s) => s.id === values.setId) || null}
          onChange={(e, val) => handleChange("setId", val ? val.id : null)}
          renderOption={(props, option) => (
            <li key={option.id} {...props}>
              S-{String(option.id).padStart(8, "0")}{" "}
              <span style={{ color: "#888", marginLeft: "1em" }}>
                (nr {option.number})
              </span>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="W spisie"
              fullWidth
              size="small"
              error={!!errors.setId}
              helperText={errors.setId}
            />
          )}
        />
        {/* Status */}
        <TextField
          label="Status"
          select
          value={values.status}
          onChange={(e) => handleChange("status", Number(e.target.value))}
          fullWidth
          size="small"
        >
          <MenuItem value={1}>Dostępne</MenuItem>
          <MenuItem value={0}>Zniszczone</MenuItem>
        </TextField>
      </Stack>
    </form>
  );
}
