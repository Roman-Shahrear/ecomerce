const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, "Please Enter product name"],
        trim:true
    },
    description: {
        type:String,
        required:[true, "Please Enter Product description"]
    },
    price: {
        type:Number,
        required:[true, "Please Enter Product Price"],
        maxLength:[8, "Price can not be exceess 8 character"]
    },
    raing: {
        type:Number,
        default:0
    },
    images: [
        {
            public_id: {
                type:String,
                required:true
            },
            url: {
                type:String,
                required:true
            }
        }
    ],
    category: {
        type:String,
        required:[true, "Please Enter Product Category"]
    },
    Stock: {
        type:Number,
        required:[true, "Please Enter Product Stock"],
        maxLength:[4, "Stock can not be 4 characters"],
        default:1
    },
    numberOfReviews: {
        type:Number,
        default:0
    },
    reviews: [
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("product", productSchema);