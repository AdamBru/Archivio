import React, { useEffect, useState } from "react";
import { TextField, Stack } from "@mui/material";

export default function ShelfForm({ formRef, mode, data, shelves }) {
  const [values, setValues] = useState({
    id: null,
    name: "",
  });

  const [errors, setErrors] = useState({});

  // --- inicjalizacja przy add / edit
  useEffect(() => {
    if (mode === "edit" && data) {
      setValues({
        id: data.id,
        name: data.name || "",
      });
      setErrors({});
    }

    if (mode === "add" && shelves) {
      const lastId = shelves.reduce((max, s) => Math.max(max, Number(s.id)), 0);
      setValues({
        id: lastId + 1,
        name: "",
      });
      setErrors({});
    }
  }, [mode, data, shelves]);

  // --- walidacja
  const validate = () => {
    const newErrors = {};

    if (!values.name.trim()) {
      newErrors.name = "Wymagane";
    }

    const exists = Array.isArray(shelves)
      ? shelves.some(
          (s) =>
            typeof s?.name === "string" &&
            s.name.trim().toLowerCase() === values.name.trim().toLowerCase() &&
            String(s.id) !== String(values.id),
        )
      : false;

    if (exists) {
      newErrors.name = "Taka półka już istnieje";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- API dla SystemDialog
  React.useImperativeHandle(formRef, () => ({
    validate,
    getValues: () => values,
  }));

  const handleChange = (val) => {
    setValues((v) => ({ ...v, name: val }));
    setErrors((e) => ({ ...e, name: undefined }));
  };

  return (
    <form autoComplete="off">
      <Stack spacing={2}>
        {/* ID */}
        <TextField
          label="ID"
          value={"P-" + String(values.id).padStart(8, "0")}
          disabled
          fullWidth
          size="small"
        />

        {/* Nazwa półki */}
        <TextField
          label="Nazwa półki"
          value={values.name}
          onChange={(e) => handleChange(e.target.value)}
          required
          fullWidth
          size="small"
          error={!!errors.name}
          helperText={errors.name}
        />
      </Stack>
    </form>
  );
}
