
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (message, alertType) => {
    return async (dispatch) => {
        const id = uuidv4();

        dispatch({
            type: SET_ALERT,
            payload: { id, message, alertType }
        });

        setTimeout(() => {
            dispatch({
                type: REMOVE_ALERT,
                payload: id
            })
        }, 3000)
    }
}


export const removeAlert = (id) => {
    return async (dispatch) => {
        dispatch({
            type: REMOVE_ALERT,
            payload: id
        })
    }
}