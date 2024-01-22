const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { newOrder, getSingleOrderDetails, myOrderDetails, getAllOrderDetails, updateOrder, deleteOrder } = require("../controllers/orderController");

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrderDetails);

router.route("/orders/me").get(isAuthenticatedUser, myOrderDetails);

router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrderDetails);

router.route("/admin/order/:id")
.put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;