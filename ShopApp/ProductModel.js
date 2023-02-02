const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//product model
let productSchema = Schema({
	name: {
		type: String, 
		required: true
	},
    price:{
        type: Number,
        required: true
    },
	stock: {
		type: Number,
		default: 0
	},
	description: {
		type: String,
		default: "No description provided."
	},
	category: {
		type: String,
		default: "N/A"
	},
	rating: {
		type: Array,
		default: [0,0]
	},
	image: {
		type: String,
		default: "/"
	}
});


module.exports = mongoose.model("Product", productSchema);
