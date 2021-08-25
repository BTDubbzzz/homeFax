import { useReducer } from 'react';
import {
	UPDATE_USER,
	UPDATE_HOME,
	UPDATE_TRANSFERS,
	ADD_HOME_TO_USER,
	REMOVE_HOME_FROM_USER,
} from './actions';
import { idbPromise } from './helpers';

export const reducer = (state, action) => {
	switch (action.type) {
		case UPDATE_USER:
			const updatedUserState = {
				...state,
				user: action.user,
				homes: action.user.homes,
			};
			idbPromise('user', 'clear');
			idbPromise('user', 'put', action.user);
			action.user.homes.forEach((home) => {
				idbPromise('homes', 'put', home);
			});
			return updatedUserState;

		case UPDATE_HOME:
			const updatedHomeArray = state.homes.map((home) => {
				if (home._id == action.home._id) {
					return action.home;
				}
				return home;
			});
			const updatedHomeState = {
				...state,
				homes: updatedHomeArray,
			};
			updatedHomeArray.forEach((home) => {
				idbPromise('homes', 'put', home);
			});
			return updatedHomeState;

		case ADD_HOME_TO_USER:
			const addedHomeArray = state.homes;
			addedHomeArray.push(action.home);

			const addedHomeState = {
				...state,
				homes: addedHomeArray,
			};
			addedHomeArray.forEach((home) => {
				idbPromise('homes', 'put', home);
			});
			return addedHomeState;

		case UPDATE_TRANSFERS:
			const updatedUserTransfers = {
				...state,
				transfers: action.transfers,
			};
			idbPromise('transfers', 'clear');
			action.transfers.forEach((transfer) => {
				idbPromise('transfers', 'put', transfer);
			});
			return updatedUserTransfers;

		case REMOVE_HOME_FROM_USER:
			const removeHomeArr = state.homes;
			removeHomeArr.pop(action.home);

			const removeHomeState = {
				...state,
				homes: removeHomeArr,
			};
			removeHomeArr.forEach((home) => {
				idbPromise('homes', 'put', home);
			});
			return removeHomeState;

		default:
			return state;
	}
};

export function useHFReducer(initialState) {
	return useReducer(reducer, initialState);
}
