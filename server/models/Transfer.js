const mongoose = require('mongoose');

const { Schema } = mongoose;

const transferSchema = new Schema({
	transferer: [{
		type: String,
		trim: true,
	}],
	receiver: [{
		type: String,
		trim: true,
	}],
	home: {
		type: Schema.Types.ObjectId,
		required: true,
		unique: true,
		ref: 'Home'
	},
});

const Transfer = mongoose.model('Transfer', transferSchema);

module.exports = Transfer;
