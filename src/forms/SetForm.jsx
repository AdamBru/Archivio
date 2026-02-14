import React, { useEffect, useState } from "react";
import { TextField, Stack, MenuItem, Autocomplete } from "@mui/material";

export default function SetForm({
  formRef,
  mode,
  data,
  shelves,
  sets,
  onChange,
}) {
  const [values, setValues] = useState({
    id: data?.id || null,
    number: data?.number || "",
    shelfId: data?.shelfId ?? null,
    status: data?.status ?? 1,
  });

  const [errors, setErrors] = useState({});

  // --- inicjalizacja wartości przy add/edit
  useEffect(() => {
    if (mode === "edit" && data) {
      setValues({
        id: data.id,
        number: data.number || "",
        shelfId: data.shelfId ?? null,
        status: data.status ?? 1,
      });
    }

    if (mode === "add" && sets) {
      const lastId = sets.reduce((max, r) => Math.max(max, Number(r.id)), 0);
      const newId = lastId + 1;
      setValues((v) => ({ ...v, id: newId }));
    }
  }, [mode, data, sets]);

  // --- informowanie rodzica o zmianach
  useEffect(() => {
    if (onChange) onChange(values);
  }, [values]);

  // --- walidacja wszystkich wymaganych pól
  const validate = () => {
    const newErrors = {};

    if (!values.number.trim()) {
      newErrors.number = "Wymagane";
    }

    if (!values.shelfId) {
      newErrors.shelfId = "Wymagane";
    }

    // unikalność numeru spisu
    const exists = sets?.some(
      (s) => s.number === values.number && String(s.id) !== String(values.id),
    );

    if (exists) {
      newErrors.number = "Spis o tym numerze już istnieje";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  React.useImperativeHandle(formRef, () => ({
    validate,
    getValues: () => values,
  }));

  const handleChange = (field, val) => {
    setValues((v) => ({ ...v, [field]: val }));
    // automatycznie usuwaj błąd po wpisaniu
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  return (
    <form autoComplete="off">
      <Stack spacing={2}>
        {/* ID — disabled */}
        <TextField
          label="ID"
          value={"S-" + String(values.id).padStart(8, "0")}
          fullWidth
          disabled
          size="small"
        />

        {/* Numer spisu */}
        <TextField
          label="Numer spisu"
          value={values.number}
          onChange={(e) =>
            // nie pozwala wpisać czegoś innego niż cyfry
            handleChange("number", e.target.value.replace(/\D/g, ""))
          }
          required
          fullWidth
          size="small"
          error={!!errors.number}
          helperText={errors.number}
        />

        {/* Półka */}
        <Autocomplete
          options={shelves}
          getOptionLabel={(option) => option.name}
          value={shelves.find((s) => s.id === values.shelfId) || null}
          onChange={(e, val) => handleChange("shelfId", val ? val.id : null)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Półka"
              required
              size="small"
              error={!!errors.shelfId}
              helperText={errors.shelfId}
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
          <MenuItem value={1}>Dostępny</MenuItem>
          <MenuItem value={0}>Zniszczony</MenuItem>
        </TextField>
      </Stack>
    </form>
  );
}
