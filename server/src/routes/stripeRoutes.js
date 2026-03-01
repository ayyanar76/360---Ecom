import e from "express";
import createCheckout from "../controllers/StripeController.js";

const StripeRoute = e.Router()

StripeRoute.route('/checkout').post(createCheckout)

export default StripeRoute