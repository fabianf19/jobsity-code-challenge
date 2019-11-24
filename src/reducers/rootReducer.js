/*
 src/reducers/rootReducer.js
*/

import { combineReducers } from 'redux'
import mainReducer from './mainReducer'

import { connectRouter } from 'connected-react-router'

export default (history) => combineReducers({
  router: connectRouter(history),
  mainReducer
})
