import {createStore,applyMiddleware} from 'redux'
import reducer from './reducer'
import createSagaMiddleware from 'redux-saga'
import sagas from './sagas'
import {composeWithDevTools} from 'redux-devtools-extension'


const sagaMiddleware = createSagaMiddleware(sagas);

let store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(sagaMiddleware)
  )
)

sagaMiddleware.run(sagas)

export default store;
