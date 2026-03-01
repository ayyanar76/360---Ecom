import e from "express";
import { RoleAuth, UserAuth } from "../middleware/AuthController.js";
import { CreateOrder, getMyOrders, getOrder, updateOrderStatus } from "../controllers/OrderController.js";


const OrderRouter = e.Router()

OrderRouter.route('/admin/orders').get(UserAuth,RoleAuth(['admin']),getOrder)
OrderRouter.route('/admin/orders/:id/status').put(UserAuth, RoleAuth(['admin']), updateOrderStatus)

OrderRouter.route('/myorders').get(UserAuth,getMyOrders)

OrderRouter.route('/order').post(UserAuth,CreateOrder)

export default OrderRouter
