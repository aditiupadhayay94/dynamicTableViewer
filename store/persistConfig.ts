import { PersistConfig } from 'redux-persist';

const persistConfig: PersistConfig<any> = {
  key: 'table',
  storage,
  whitelist: ['columns'], 
};

export default persistConfig;