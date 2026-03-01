import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    price:{
        type:Number,
        required:true
    },
    image_url:{
        type:String
    },
    category:{
        type:String
    },
    stock:{
        type:Number,
        default:1
    },
    isSeed:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
})

const Product = mongoose.model("Product",productSchema)

export default Product
