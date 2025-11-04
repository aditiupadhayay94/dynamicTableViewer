import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  [key: string]: any;
}

interface Column {
  field: string;
  headerName: string;
  visible: boolean;
}

interface TableState {
  data: User[];
  columns: Column[];
  search: string;
  originalData: User[]; 
}

const initialState = {
  data: Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    age: 20 + (i % 10),
    role: i % 2 === 0 ? "Admin" : "User",
  })),
  columns: [
    { field: "name", headerName: "Name", visible: true },
    { field: "email", headerName: "Email", visible: true },
    { field: "age", headerName: "Age", visible: true },
    { field: "role", headerName: "Role", visible: true },
  ],
  search: "",
  editing: false,
};


const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setSearch: (s, a: PayloadAction<string>) => { s.search = a.payload; },

    toggleColumnVisibility: (s, a: PayloadAction<string>) => {
      const c = s.columns.find((col) => col.field === a.payload);
      if (c) c.visible = !c.visible;
      localStorage.setItem("columns", JSON.stringify(s.columns));
    },

    addColumn: (s, a: PayloadAction<string>) => {
      const f = a.payload.trim().toLowerCase().replace(/\s+/g, "_");
      if (!s.columns.find((c) => c.field === f)) {
        s.columns.push({ field: f, headerName: a.payload, visible: true });
        s.data = s.data.map((r) => ({ ...r, [f]: "" }));
        localStorage.setItem("columns", JSON.stringify(s.columns));
      }
    },

    loadColumnsFromStorage: (s) => {
      const saved = localStorage.getItem("columns");
      if (saved) s.columns = JSON.parse(saved);
    },

    startEditing: (s) => {
      s.originalData = JSON.parse(JSON.stringify(s.data));
    },

    updateCell: (
      s,
      a: PayloadAction<{ id: number; field: string; value: any }>
    ) => {
      const row = s.data.find((r) => r.id === a.payload.id);
      if (row) row[a.payload.field] = a.payload.value;
    },

    saveAll: (s) => {
      s.originalData = [];
      localStorage.setItem("tableData", JSON.stringify(s.data));
    },

    cancelAll: (s) => {
      if (s.originalData.length) s.data = s.originalData;
      s.originalData = [];
    },
  },
});

export const {
  setSearch,
  toggleColumnVisibility,
  addColumn,
  loadColumnsFromStorage,
  startEditing,
  updateCell,
  saveAll,
  cancelAll,
} = tableSlice.actions;
export default tableSlice.reducer;
