
import { PersistConfig } from "redux-persist";

// Only import storage in the browser
let storage: any = undefined;

if (typeof window !== "undefined") {
  
  storage = require("redux-persist/lib/storage").default;
}

const persistConfig: PersistConfig<any> = {
  key: "table",
  storage,
  whitelist: ["columns"],
};

export default persistConfig;
