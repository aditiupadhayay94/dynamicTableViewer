import { PersistConfig } from "redux-persist";
import type { WebStorage } from "redux-persist";

// Create a dummy storage fallback for SSR builds
const createNoopStorage = (): WebStorage => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? require("redux-persist/lib/storage").default
    : createNoopStorage();

const persistConfig: PersistConfig<any> = {
  key: "table",
  storage,
  whitelist: ["columns"],
};

export default persistConfig;
