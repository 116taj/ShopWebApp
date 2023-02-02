const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//review model
let reviewSchema = Schema({
    user:{
        type: String
    },
	userID: {
		type: Schema.Types.ObjectId, 
		ref: 'User'
	},
    product:{
        type: String
    },
    productID:{
		type: Schema.Types.ObjectId, 
		ref: 'Product'
    },
	rating: {
		type: Number,
		required: [true,"Input a number rating (1-5)"]
	},
	title: {
		type: String, 
        default: ""
	},
    contents: {
		type: String,
        default: ""
	}
});



module.exports = mongoose.model("Review", reviewSchema);
