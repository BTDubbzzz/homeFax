const { gql } = require('apollo-server-express');

const typeDefs = gql`
	scalar Date

	type User {
		_id: ID!
		firstName: String!
		lastName: String!
		password: String!
		dob: Date!
		username: String!
		email: String!
		homes: [Home]
		currentPassword: String
	}

	type Home {
		_id: ID!
		address: Address!
		areas: [Area]
	}

	type Address {
		_id: ID!
		street1: String!
		street2: String
		city: String!
		state: String!
		zip: String!
	}

	input HomeAddress {
		street1: String!
		street2: String
		city: String!
		state: String!
		zip: String!
	}

	type Area {
		_id: ID!
		name: String!
		icon: String
		attributes: [Attribute]
	}

	type Attribute {
		_id: ID!
		type: String!
		detail: [Detail]
	}

	type Detail {
		_id: ID!
		key: String!
		value: String!
		date: Date
	}

	type Auth {
		token: ID
		user: User
		transfers: [Transfer]
	}

	type Transfer {
		_id: ID!
		transferer: [String]
		receiver: [String]
		home: Home!
	}

	type TransferReturn {
		user: User
		transfers: [Transfer]
	}

	type Query {
		user: User
		home(homeId: ID!): Home
		transfers: [Transfer]
		userTransfers(userEmail: String!): [Transfer]
		transfer(transferId: ID!): Transfer
		userTransfer(useremail: String): Transfer
		area(areaId: ID!): Area
		attribute(attributeId: ID!): Attribute
		detail(detailId: ID!): Detail
	}

	type Mutation {
		addUser(
			firstName: String!
			lastName: String!
			username: String!
			email: String!
			password: String!
			dob: Date!
		): Auth
		deleteUser(password: String): User
		addHome(address: HomeAddress!): Home
		editHome(homeId: String!, address: HomeAddress): Home
		deleteHome(homeId: ID!): Home
		addArea(homeId: ID!, name: String!, icon: String): Home
		editArea(areaId: ID!, name: String, icon: String): Home
		deleteArea(areaId: ID!): Home
		addAttribute(areaId: ID!, type: String!): Home
		editAttribute(attributeId: ID!, type: String!): Home
		deleteAttribute(attributeId: ID!): Home
		addDetail(attributeId: ID!, key: String!, value: String!, date: Date): Home
		editDetail(detailId: ID!, key: String, value: String, date: Date): Home
		deleteDetail(detailId: ID!): Home
		transferHome(transferer: String, receiver: String, home: ID!): TransferReturn

		createTransfer(transferer: String, receiver: String, home: ID!): Transfer
		editTransfer(transferer: String, receiver: String, home: ID!): Transfer

		updateUser(
			firstName: String
			lastName: String
			username: String
			email: String
			password: String
		): Auth
		updatePassword(password: String, currentPassword: String): Auth
		deleteProfile(password: String!): Boolean
		login(identifier: String!, password: String!): Auth
	}
`;

module.exports = typeDefs;
