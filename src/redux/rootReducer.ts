import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import listReducer from './slices/lists';
import calendarReducer from './slices/calendar';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const rootReducer = combineReducers({
  list: listReducer,
  calendar: calendarReducer
});

export { rootPersistConfig, rootReducer };
