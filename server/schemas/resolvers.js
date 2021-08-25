const { AuthenticationError } = require('apollo-server-express');
const { User, Home, Transfer } = require('../models');
const { signToken } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const bcrypt = require('bcrypt');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const dayjs = require('dayjs');

const resolvers = {
	Date: new GraphQLScalarType({
		name: 'Date',
		description: 'Custom Date Scalar type',
		parseValue(value) {
			console.log('value :>> ', value);
			return dayjs(value);
		},
		serialize(value) {
			return dayjs(value).format('MM-DD-YYYY');
		},
		parseLiteral(ast) {
			if (ast.kind === Kind.STRING) {
				return dayjs(ast.value);
			}
			return null;
		},
	}),

	Query: {
		user: async (parent, args, context) => {
			if (context.user) {
				const user = await User.findById(context.user._id).populate('homes');

				return user;
			}

			throw new AuthenticationError('Not logged in');
		},
		home: async (parent, { homeId }) => {
			const home = await Home.findById(homeId);
			console.log(home);
			return home;
		},
		transfers: async () => {
			return await Transfer.find({});
		},
		transfer: async (parent, { transferId }) => {
			return await Home.findById(transferId);
		},
		userTransfer: async (parent, { useremail }) => {
			return await Transfer.findOne({ receiver: useremail });
		},
		userTransfers: async (parent, { userEmail }) => {
			return await Transfer.find({ receiver: userEmail }).populate('home');
		},
		area: async (parent, { areaId }) => {
			return await Home.findOne({ 'areas._id': areaId });
		},
		attribute: async (parent, { attributeId }) => {
			return await Home.findOne({ 'areas.attributes._id': attributeId });
		},
		detail: async (parent, { detailId }) => {
			return await Home.findOne({ 'areas.attributes.detail._id': detailId });
		},
	},
	Mutation: {
		addUser: async (parent, args) => {
			console.log('trying to create user');
			const user = await User.create(args);
			const token = signToken(user);

			return { token, user };
		},
		updateUser: async (parent, args, context) => {
			if (context.user) {
				return await User.findByIdAndUpdate(context.user._id, args, {
					new: true,
				});
			}

			throw new AuthenticationError('Not logged in');
		},
		deleteUser: async (parent, args, context) => {
			const user = await User.findOneAndDelete({ _id: context.user._id });
			return;
		},
		addHome: async (parent, args) => {
			const home = await Home.create(args);
			return home;
		},
		editHome: async (parent, args) => {
			const home = await Home.findByIdAndUpdate(
				args.homeId,
				{
					address: args.address,
				},
				{ new: true }
			);
			return home;
		},
		deleteHome: async (parent, args, context) => {
			const home = await Home.findOneAndDelete({ _id: args.homeId });
			return home;
		},
		addArea: async (parent, { homeId, name, icon }) => {
			const home = await Home.findByIdAndUpdate(
				homeId,
				{
					$addToSet: { areas: { name, icon } },
				},
				{ new: true }
			);
			return home;
		},
		editArea: async (parent, { areaId, name, icon }) => {
			const home = await Home.findOne({ 'areas._id': areaId });
			const areas = home.areas.map((area) => {
				if (area._id == areaId) {
					area.name = name;
					area.icon = icon;
				}
				return area;
			});
			const updatedHome = await Home.findOneAndUpdate(
				{ 'areas._id': areaId },
				{
					areas: areas,
				},
				{ new: true }
			);
			return updatedHome;
		},
		deleteArea: async (parent, { areaId }) => {
			const home = await Home.findOne({ 'areas._id': areaId });
			const areas = home.areas.filter((area) => area._id != areaId);
			const updatedHome = await Home.findOneAndUpdate(
				{ 'areas._id': areaId },
				{
					areas: areas,
				},
				{ new: true }
			);
			return updatedHome;
		},
		addAttribute: async (parent, { areaId, type }) => {
			const home = await Home.findOne({ 'areas._id': areaId });
			const areas = home.areas.map((area) => {
				if (area._id == areaId) {
					area.attributes.push({ type: type });
				}
				return area;
			});
			const updatedHome = await Home.findOneAndUpdate(
				{ 'areas._id': areaId },
				{
					areas: areas,
				},
				{ new: true }
			);
			return updatedHome;
		},
		editAttribute: async (parent, { attributeId, type }) => {
			const home = await Home.findOne({ 'areas.attributes._id': attributeId });
			const areas = home.areas.map((area) => {
				const attributes = area.attributes.map((attribute) => {
					if (attribute._id == attributeId) {
						attribute.type = type;
					}
					return attribute;
				});
				return area;
			});
			const updatedHome = await Home.findOneAndUpdate(
				{ 'areas.attributes._id': attributeId },
				{
					areas: areas,
				},
				{ new: true }
			);

			return updatedHome;
		},
		deleteAttribute: async (parent, { attributeId }) => {
			const home = await Home.findOneAndUpdate(
				{ 'areas.attributes._id': attributeId },
				{ $pull: { 'areas.$[].attributes': { _id: attributeId } } },
				{ new: true }
			);
			return home;
		},
		addDetail: async (parent, { attributeId, key, value, date }) => {
			const home = await Home.findOne({ 'areas.attributes._id': attributeId });
			const areas = home.areas.map((area) => {
				const attributes = area.attributes.map((attribute) => {
					if (attribute._id == attributeId) {
						attribute.detail.push({ key, value, date });
					}
					return attribute;
				});
				return area;
			});
			const updatedHome = await Home.findOneAndUpdate(
				{ 'areas.attributes._id': attributeId },
				{
					areas: areas,
				},
				{ new: true }
			);

			return updatedHome;
		},
		editDetail: async (parent, { detailId, key, value, date }) => {
			const home = await Home.findOne({
				'areas.attributes.detail._id': detailId,
			});
			const areas = home.areas.map((area) => {
				const attributes = area.attributes.map((attribute) => {
					const details = attribute.detail.map((detail) => {
						if (detail._id == detailId) {
							detail.key = key;
							detail.value = value;
							detail.date = date;
						}
						return detail;
					});
					return attribute;
				});
				return area;
			});
			const updatedHome = await Home.findOneAndUpdate(
				{ 'areas.attributes.detail._id': detailId },
				{
					areas: areas,
				},
				{ new: true }
			);

			return updatedHome;
		},
		deleteDetail: async (parent, { detailId }) => {
			const home = await Home.findOneAndUpdate(
				{ 'areas.attributes.detail._id': detailId },
				{ $pull: { 'areas.$[].attributes.$[].detail': { _id: detailId } } },
				{ new: true }
			);
			return home;
		},
		transferHome: async (parent, { transferer, receiver, home }, context) => {
			console.log('hit at transferHome');
			console.log(receiver);
			if (transferer) {
				await User.findOneAndUpdate(
					{ email: transferer },
					{
						$pull: { homes: home },
					}
				);
			}
			await User.findOneAndUpdate(
				{ email: receiver },
				{ $addToSet: { homes: home } }
			);
			const newHomeUser = await User.findOne({ email: receiver }).populate(
				'homes'
			);
			console.log(newHomeUser);

			await Transfer.findOneAndDelete({ 'home._id': home._id });
			const transfers = await Transfer.find({ receiver: receiver }).populate(
				'home'
			);

			return { user: newHomeUser, transfers };

			// CODE USED FOR TESTING IN INSOMNIA - PLEASE DON'T DELETE.
			// let transferUser;
			// if (transferer) {
			//   transferUser = await User.findByIdAndUpdate(transferer, {
			//     $pull: { 'homes': home }
			//   }, { new: true }).populate('homes');
			//   return transferUser;
			// }
			// let receiptUser;
			// if (receiver) {
			//   receiptUser = await User.findByIdAndUpdate(receiver, {
			//     $addToSet: { 'homes': home }
			//   }, { new: true }).populate('homes');
			//   return receiptUser;
			// }
		},
		updateUser: async (parent, args, context) => {
			if (context.user) {
				const user = await User.findByIdAndUpdate(context.user._id, args, {
					new: true,
				});
				const token = signToken(user);

				return { token, user };
			}

			throw new AuthenticationError('Not logged in');
		},
		createTransfer: async (parent, args) => {
			const createTransfer = await Transfer.create(args);
			const newTransferId = createTransfer._id;
			const newTransfer = await Transfer.findById(newTransferId).populate(
				'home'
			);
			return newTransfer;
		},
		editTransfer: async (parent, args) => {
			return await Transfer.findOneAndUpdate({ home: args.home }, args, {
				new: true,
			});
		},
		login: async (parent, { identifier, password }) => {
			const email = identifier;
			const username = identifier;
			console.log('logging in');
			const user =
				(await User.findOne({ email }).populate('homes')) ||
				(await User.findOne({ username }).populate('homes'));
			if (!user) {
				throw new AuthenticationError('Incorrect credentials');
			}
			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw new AuthenticationError('Incorrect credentials');
			}
			const token = signToken(user);
			const receiverEmail = user.email;
			const transfers = await Transfer.find({
				receiver: receiverEmail,
			}).populate('home');
			return { token, user, transfers };
		},
		updatePassword: async (parent, args, context) => {
			if (context.user) {
				const foundUser = await User.findById(context.user._id);
				const passwordMatch = await bcrypt.compareSync(
					args.password,
					foundUser.password
				);

				if (!passwordMatch)
					throw new AuthenticationError('Password does not match');
				const hashedPassword = await bcrypt.hash(args.currentPassword, 10);
				foundUser.password = hashedPassword;
				const updatedUser = {
					...foundUser,
					password: hashedPassword,
				};
				const user = await User.findByIdAndUpdate(context.user._id, foundUser, {
					new: true,
				});
				const token = signToken(user);

				return { token, user };
			}

			throw new AuthenticationError('Not logged in');
		},
		deleteProfile: async (parent, args, context) => {
			if (context.user) {
				const user = await User.findById(context.user._id);
				const passwordMatch = await bcrypt.compareSync(
					args.password,
					user.password
				);

				if (!passwordMatch)
					throw new AuthenticationError('Password does not match!');

				await User.findByIdAndDelete(context.user._id);
				return true;
			}

			throw new AuthenticationError('Not logged in');
		},
	},
};

module.exports = resolvers;
