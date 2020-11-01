import { createStore, applyMiddleware, compose } from 'redux';
import reactotron from '../config/reactotron';

import thunk from 'redux-thunk';
import rootReducers from '../reducers';

const initialState = {};
const middleware = [thunk];

const store = createStore(
	rootReducers,
	initialState,
	compose(applyMiddleware(...middleware), reactotron.createEnhancer()),
);

export default store;
