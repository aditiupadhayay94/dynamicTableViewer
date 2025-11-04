"use client";

import * as React from "react";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  TextField,
  Box,
  Typography,
  Button,
  Stack,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import {
  setSearch,
  loadColumnsFromStorage,
  updateCell,
  startEditing,
  saveAll,
  cancelAll,
} from "../store/tableSlice";
import ManageColumns from "./ManageColumns";
import ImportExport from "./ImportExport";

export default function DataTable() {
  const dispatch = useDispatch();
  const { data, search, columns } = useSelector((s: RootState) => s.table);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [editing, setEditing] = React.useState(false);
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  React.useEffect(() => {
    dispatch(loadColumnsFromStorage());
  }, [dispatch]);

  const filteredData = data.filter((r) =>
    Object.values(r).some((v) =>
      v?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const visibleCols: GridColDef[] = columns
    .filter((c) => c.visible)
    .map((c) => ({
      field: c.field,
      headerName: c.headerName,
      flex: 1,
      sortable: true,
      editable: true,
    }));

  const processRowUpdate = (newRow: any, oldRow: any) => {
    const { id } = newRow;
    for (const key in newRow) {
      if (key === "age" && newRow[key] && isNaN(newRow[key])) {
        setError("Age must be a number");
        throw new Error("Invalid age");
      }
      if (newRow[key] !== oldRow[key]) {
        dispatch(updateCell({ id, field: key, value: newRow[key] }));
      }
    }
    return newRow;
  };

  const handleCellEditStart: GridEventListener<"cellEditStart"> = () => {
    if (!editing) {
      dispatch(startEditing());
      setEditing(true);
    }
  };

  const handleSave = () => {
    dispatch(saveAll());
    setEditing(false);
  };

  const handleCancel = () => {
    dispatch(cancelAll());
    setEditing(false);
  };

  return (
    <Box sx={{ width: "92%", mx: "auto", mt: 5 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(to right, #fdfbfb, #ebedee)",
          boxShadow: "0px 3px 12px rgba(0,0,0,0.08)",
        }}
      >

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          sx={{ mb: 2, gap: 2 }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              letterSpacing: 0.5,
              color: "#2d3436",
            }}
          >
            Dynamic Data Table
          </Typography>

          <Stack direction="row" spacing={1}>
            <ImportExport setError={setError} />
            <Button
              variant="contained"
              onClick={() => setOpen(true)}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 2,
                bgcolor: "#1976d2",
                ":hover": { bgcolor: "#1565c0" },
              }}
            >
              Manage Columns
            </Button>
          </Stack>
        </Stack>


        <TextField
          label="Search across all fields"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              background: "white",
            },
          }}
        />

        
        <Box
          sx={{
            height: 520,
            "& .MuiDataGrid-root": {
              borderRadius: 2,
              backgroundColor: "#fff",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.9rem",
            },
            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: "#f9fafb",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#e3f2fd",
              fontWeight: 600,
            },
          }}
        >
          <DataGrid
            rows={filteredData}
            columns={visibleCols}
            pageSizeOptions={[5, 10, 20]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pagination
            disableRowSelectionOnClick
            processRowUpdate={processRowUpdate}
            onCellEditStart={handleCellEditStart}
          />
        </Box>

        
        {editing && (
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 3 }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Save All
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancel}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Cancel All
            </Button>
          </Stack>
        )}
      </Paper>

     
      <ManageColumns open={open} onClose={() => setOpen(false)} />

     
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
