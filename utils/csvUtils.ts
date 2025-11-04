import Papa from "papaparse";
import { saveAs } from "file-saver";
import { User } from "../store/tableSlice";

export const importCSV = (file: File): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (!result.data.length) return reject("CSV file is empty");
        const rows = result.data.map((row: any, index: number) => ({
          id: index + 1,
          ...row,
        }));
        resolve(rows);
      },
      error: (err) => reject(err.message),
    });
  });
};

export const exportCSV = (rows: User[], visibleCols: string[]) => {
  const filtered = rows.map((r) => {
    const out: any = {};
    visibleCols.forEach((c) => (out[c] = r[c]));
    return out;
  });
  const csv = Papa.unparse(filtered);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "table_data.csv");
};
