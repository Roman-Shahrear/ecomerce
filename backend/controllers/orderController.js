const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//Create new order
exports.newOrder = catchAsyncErrors(async(req, res, next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order
    });
});

// Get Single order details --Admin
exports.getSingleOrderDetails = catchAsyncErrors(async(req, res, next)=>{

    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order){
        return next(new ErrorHandler("Order not found with this id", 404));
    }

    res.status(200).json({
        success: true,
        order
    });
});

// Get Logging User Single order details --Login User
exports.myOrderDetails = catchAsyncErrors(async(req, res, next)=>{

    const orders = await Order.find({user: req.user._id});

    res.status(200).json({
        success: true,
        orders
    });
});

// Get All Orders --Admin
exports.getAllOrderDetails = catchAsyncErrors(async(req, res, next)=>{

    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach((order)=>{
        totalAmount+= order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});

// Update Order Status --Admin
exports.updateOrder = catchAsyncErrors(async(req, res, next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found", 404));
    }

    if(order.orderStatus === "Delivered"){
        return res.status(200).json({
            success: false,
            message: "Order is already delivered"
        });
    }

    for (const orderItem of order.orderItems){
        await updateStock(orderItem.product, orderItem.quantity);
    }

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt= Date.now()
    }

    await order.save({validatedBeforeSave: false});
    
    res.status(200).json({
        success: true,
    });
});

// Helper function to update stock
async function updateStock(productId, quantity){
    const product = await Product.findById(productId);

    if(!product){
        throw new ErrorHandler("Product not found", 404);
    }

    product.Stock -= quantity;
    await product.save({validateBeforeSave: false})
};

// Delete Order --Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  });

