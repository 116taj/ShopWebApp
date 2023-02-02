const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//review model
let orderSchema = Schema({
    user:{
        type: String
    },
	userID: {
		type: Schema.Types.ObjectId, 
		ref: 'User'
	},
    products:{
        type: Array
    },
    amounts:{
		type: Array
    },
	date: {
		type: Date
	}
});



module.exports = mongoose.model("Order", orderSchema);
