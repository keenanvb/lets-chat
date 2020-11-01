import { GET_PROFILE, PROFILE_ERROR, UPDATE_LOCATION, UPDATE_DISTANCE, UPDATE_RANGE } from '../actions/types';

const INITIAL_STATE = {
	profile: null,
	loading: true,
	error: {},
};

export default (state = INITIAL_STATE, action) => {
	const { type, payload } = action;

	switch (type) {
		case GET_PROFILE:
			return { ...state, profile: payload, loading: false };
		case UPDATE_LOCATION:
			return {
				...state,
				profile: {
					...state.profile,
					destination: payload.destination,
					latlng: {
						latitude: payload.latitude,
						longitude: payload.longitude,
					},
				},
				loading: false,
			};
		case UPDATE_DISTANCE:
			return {
				...state,
				profile: {
					...state.profile,
					distance: payload.distance,
				},
				loading: false,
			};

		case UPDATE_RANGE:
			return {
				...state,
				profile: {
					...state.profile,
					ageRange: {
						...state.profile.ageRange,
						min: payload.ageRange.min,
						max: payload.ageRange.max,
					},
				},
				loading: false,
			};
		case PROFILE_ERROR:
			return { ...state, error: payload, loading: false };
		default:
			return state;
	}
};
