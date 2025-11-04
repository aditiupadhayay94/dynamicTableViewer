"use client";

import React, { useRef } from "react";
import { Button, Stack, Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { importCSV, exportCSV } from "../utils/csvUtils";
import { loadColumnsFromStorage } from "../store/tableSlice";

interface Props {
  setError: (msg: string) => void;
}

export default function ImportExport({ setError }: Props) {
  const dispatch = useDispatch();
  const { data, columns } = useSelector((state: RootState) => state.table);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a valid .csv file");
      return;
    }

    try {
      const importedData = await importCSV(file);
      localStorage.setItem("tableData", JSON.stringify(importedData));
      dispatch(loadColumnsFromStorage());
      window.location.reload();
    } catch (err: any) {
      setError(err);
    }
  };

  const handleExport = () => {
    const visible = columns.filter((c) => c.visible).map((c) => c.field);
    exportCSV(data, visible);
  };

  return (
    <Stack direction="row" spacing={1}>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={handleImport}
      />
      <Button variant="contained" color="primary" onClick={() => inputRef.current?.click()}>
        Import CSV
      </Button>
      <Button variant="outlined" color="success" onClick={handleExport}>
        Export CSV
      </Button>
    </Stack>
  );
}
