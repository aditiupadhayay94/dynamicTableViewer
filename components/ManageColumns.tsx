"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { toggleColumnVisibility, addColumn } from "../store/tableSlice";

export default function ManageColumns({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useDispatch();
  const { columns } = useSelector((state: RootState) => state.table);
  const [newColumn, setNewColumn] = useState("");

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        <FormGroup>
          {columns.map((col) => (
            <FormControlLabel
              key={col.field}
              control={
                <Checkbox
                  checked={col.visible}
                  onChange={() => dispatch(toggleColumnVisibility(col.field))}
                />
              }
              label={col.headerName}
            />
          ))}
        </FormGroup>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <TextField
            label="Add new column"
            size="small"
            fullWidth
            value={newColumn}
            onChange={(e) => setNewColumn(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => {
              if (newColumn.trim()) {
                dispatch(addColumn(newColumn));
                setNewColumn("");
              }
            }}
          >
            Add
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
