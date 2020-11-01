import { REMOVE_ALERT, SET_ALERT } from './types';
import { v4 as uuidv4 } from 'uuid';

export const setAlert = (message, alertType) => {
	return async (dispatch) => {
		const id = uuidv4();

		dispatch({
			type: SET_ALERT,
			payload: { id, message, alertType },
		});

		setTimeout(() => {
			dispatch({
				type: REMOVE_ALERT,
				payload: id,
			});
		}, 3000);
	};
};

export const removeAlert = (id) => {
	return async (dispatch) => {
		dispatch({
			type: REMOVE_ALERT,
			payload: id,
		});
	};
};
