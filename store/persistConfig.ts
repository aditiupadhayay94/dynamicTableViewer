import { PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig: PersistConfig<any> = {
  key: 'table',
  storage,
  whitelist: ['columns'],
};

export default persistConfig;
