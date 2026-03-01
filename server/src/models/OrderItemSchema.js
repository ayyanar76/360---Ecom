import mongoose from "mongoose";


const OrderItemSchema = mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    quantity:Number
})


const orderSchema = mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    items:[OrderItemSchema],
    total:{type:Number,required:true},
    status:{
        type:String,
        enum:["Paid","pending","shipped","delivered"],
        default:"pending",
    },
    stripePaymentId:{
            type:String
        }
},{
    timestamps:true
})

const Order = mongoose.model("Order",orderSchema)
export default Order
