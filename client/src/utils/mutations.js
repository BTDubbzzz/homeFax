import { gql } from '@apollo/client';

export const LOGIN = gql`
	mutation login($identifier: String!, $password: String!) {
		login(identifier: $identifier, password: $password) {
			token
			transfers {
				_id
				transferer
				receiver
				home {
					_id
					address {
						_id
						street1
						street2
						city
						state
						zip
					}
				}
			}
			user {
				_id
				firstName
				lastName
				username
				email
				dob
				homes {
					_id
					address {
						_id
						street1
						street2
						city
						state
						zip
					}
					areas {
						_id
						name
						icon
						attributes {
							_id
							type
							detail {
								_id
								key
								value
								date
							}
						}
					}
				}
			}
		}
	}
`;

export const ADD_USER = gql`
	mutation addUser(
		$firstName: String!
		$lastName: String!
		$email: String!
		$username: String!
		$password: String!
		$dob: Date!
	) {
		addUser(
			firstName: $firstName
			lastName: $lastName
			username: $username
			email: $email
			password: $password
			dob: $dob
		) {
			token
			user {
				_id
				username
				email
			}
		}
	}
`;

export const DELETE_USER = gql`
	mutation DeleteUser($password: String!) {
		editUser(password: $password) {
			_id
		}
	}
`;

export const ADD_HOME = gql`
	mutation Addhome($address: HomeAddress!) {
		addHome(address: $address) {
			_id
			address {
				street1
				street2
				city
				state
				zip
			}
		}
	}
`;

export const EDIT_HOME = gql`
	mutation EditHome($homeId: ID!, $address: HomeAddress) {
		editHome(homeId: $homeId, address: $address) {
			_id
			address {
				street1
				street2
				city
				state
				zip
			}
		}
	}
`;

export const DELETE_HOME = gql`
	mutation DeleteHome($homeId: ID!) {
		deleteHome(homeId: $homeId) {
			_id
		}
	}
`;

export const ADD_AREA = gql`
	mutation AddArea($homeId: ID!, $name: String!, $icon: String) {
		addArea(homeId: $homeId, name: $name, icon: $icon) {
			_id
			address {
				street1
				street2
				city
				state
				zip
			}
			areas {
				_id
				name
				icon
				attributes {
					_id
					type
					detail {
						_id
						key
						value
						date
					}
				}
			}
		}
	}
`;

export const EDIT_AREA = gql`
	mutation EditArea($areaId: ID!, $name: String, $icon: String) {
		editArea(areaId: $areaId, name: $name, icon: $icon) {
			_id
			address {
				street1
				street2
				city
				state
				zip
			}
			areas {
				_id
				name
				icon
				attributes {
					_id
					type
					detail {
						_id
						key
						value
						date
					}
				}
			}
		}
	}
`;

export const DELETE_AREA = gql`
	mutation DeleteArea($areaId: ID!) {
		deleteArea(areaId: $areaId) {
			_id
			address {
				street1
				street2
				city
				state
				zip
			}
			areas {
				_id
				name
				icon
				attributes {
					_id
					type
					detail {
						key
						value
						date
						_id
					}
				}
			}
		}
	}
`;

export const ADD_ATTRIBUTE = gql`
	mutation AddAttribute($areaId: ID!, $type: String!) {
		addAttribute(areaId: $areaId, type: $type) {
			_id
			address {
				street1
				street2
				city
				state
				zip
			}
			areas {
				_id
				name
				icon
				attributes {
					_id
					type
					detail {
						key
						value
						date
						_id
					}
				}
			}
		}
	}
`;

export const EDIT_ATTRIBUTE = gql`
	mutation EditAttribute($attributeId: ID!, $type: String!) {
		editAttribute(attributeId: $attributeId, type: $type) {
			_id
			address {
				street1
				street2
				city
				state
				zip
			}
			areas {
				_id
				name
				icon
				attributes {
					_id
					type
					detail {
						_id
						key
						value
						date
					}
				}
			}
		}
	}
`;

export const DELETE_ATTRIBUTE = gql`
	mutation DeleteAttribute($attributeId: ID!) {
		deleteAttribute(attributeId: $attributeId) {
			_id
			address {
				street1
				street2
				city
				state
				zip
			}
			areas {
				_id
				name
				icon
				attributes {
					_id
					type
					detail {
						_id
						key
						value
						date
					}
				}
			}
		}
	}
`;

export const ADD_DETAIL = gql`
	mutation AddDetail($attributeId: ID!, $key: String!, $value: String!) {
		addDetail(attributeId: $attributeId, key: $key, value: $value) {
			_id
			address {
				street1
				street2
				city
				state
				zip
			}
			areas {
				_id
				name
				icon
				attributes {
					_id
					type
					detail {
						key
						value
						date
						_id
					}
				}
			}
		}
	}
`;

export const EDIT_DETAIL = gql`
	mutation EditDetail($detailId: ID!, $key: String, $value: String) {
		editDetail(detailId: $detailId, key: $key, value: $value) {
			_id
			address {
				street1
				street2
				city
				state
				zip
			}
			areas {
				_id
				name
				icon
				attributes {
					_id
					type
					detail {
						_id
						key
						value
						date
					}
				}
			}
		}
	}
`;

export const DELETE_DETAIL = gql`
	mutation DeleteDetail($detailId: ID!) {
		deleteDetail(detailId: $detailId) {
			_id
			address {
				street1
				street2
				city
				state
				zip
			}
			areas {
				_id
				name
				icon
				attributes {
					_id
					type
					detail {
						_id
						key
						value
						date
					}
				}
			}
		}
	}
`;

export const CREATE_TRANSFER = gql`
	mutation CreateTransfer($transferer: String, $receiver: String, $home: ID!) {
		createTransfer(transferer: $transferer, receiver: $receiver, home: $home) {
			_id
			transferer
			receiver
			home {
				_id
				address {
					_id
					street1
					street2
					city
					state
					zip
				}
			}
		}
	}
`;

export const TRANSFER_HOME = gql`
	mutation TransferHome($transferer: String, $receiver: String, $home: ID!) {
		transferHome(transferer: $transferer, receiver: $receiver, home: $home) {
			user {
				_id
				firstName
				lastName
				username
				email
				dob
				homes {
					_id
					address {
						_id
						street1
						street2
						city
						state
						zip
					}
					areas {
						_id
						name
						icon
						attributes {
							_id
							type
							detail {
								_id
								key
								value
								date
							}
						}
					}
				}
			}
			transfers {
				_id
				transferer
				receiver
				home {
					_id
					address {
						_id
						street1
						street2
						city
						state
						zip
					}
				}
			}
		}
	}
`;

export const EDIT_TRANSFER = gql`
	mutation EditTransfer($transferer: String, $receiver: String, $home: ID!) {
		editTransfer(transferer: $transferer, receiver: $receiver, home: $home) {
			_id
			transferer
			receiver
			home {
				address {
					street1
					street2
					city
					state
					zip
				}
			}
		}
	}
`;

export const UPDATE_USER = gql`
	mutation updateUser(
		$firstName: String
		$lastName: String
		$email: String
		$username: String
	) {
		updateUser(
			firstName: $firstName
			lastName: $lastName
			username: $username
			email: $email
		) {
			token
			user {
				_id
				firstName
				lastName
			}
		}
	}
`;

export const UPDATE_PASSWORD = gql`
	mutation updatePassword($password: String, $currentPassword: String) {
		updatePassword(password: $password, currentPassword: $currentPassword) {
			token
			user {
				_id
				firstName
				lastName
			}
		}
	}
`;

export const DELETE_PROFILE = gql`
	mutation deleteProfile($password: String!) {
		deleteProfile(password: $password)
	}
`;
