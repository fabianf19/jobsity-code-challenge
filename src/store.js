/*
 * src/store.js
 * No initialState
 */

import { createBrowserHistory } from 'history'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers/rootReducer'

export const history = createBrowserHistory()

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['navigation'], // navigation will not be persisted
  version: 0, // New version 0, default or previous version -1
  debug: false
}

const persistedReducer = persistReducer(persistConfig, rootReducer(history))
const loggerMiddleware = createLogger()

export const store = createStore(
  persistedReducer,
  applyMiddleware(
    routerMiddleware(history), // for dispatching history actions
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)

export const persistor = persistStore(store)
