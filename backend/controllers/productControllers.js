const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

// Create Product --Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  
  req.body.user = req.user.id;
  
  const product = await Product.create(req.body);
  res.status(201).json({
    success:true,
    product,
  });
});

//Get All products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  
  const resultPerPage = 5;
  // const productCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
  .search()
  .filter()
  .pagination(resultPerPage);
  const products = await apiFeatures.query //without query using this -- Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

//Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  const productCount = await Product.countDocuments();

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
    productCount
  });
});

//Update Product --Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  if (!product) {
    next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

//Delete Product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// Create New Review And Update Review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  // Ensure User is Authenticated
  if (!req.user || !req.user._id) {
    return next(new ErrorHandler("User not authenticated", 401));
  }
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const existingReviewIndex = product.reviews.findIndex(
    (rev) => rev.user && rev.user.toString() === req.user._id.toString()
  );

  if (existingReviewIndex !== -1) {
    // Update the existing review
    product.reviews[existingReviewIndex].rating = Number(rating);
    product.reviews[existingReviewIndex].comment = comment;
  } else {
    // Add a new review
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }

  // Recalculate the average rating
  let totalRating = 0;
  product.reviews.forEach((rev) => {
    totalRating += rev.rating;
  });
  product.ratings = totalRating / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});


// Get All Reviews Of a Product
exports.getProductReviews = catchAsyncErrors(async(req, res, next)=>{
  const product = await Product.findById(req.query.id);

  if(!product){
    return next(new ErrorHandler("product not found", 404));
  }

  res.status(200).json({
    success: true,
  })
});