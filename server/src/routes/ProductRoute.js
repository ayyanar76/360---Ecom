import express from 'express'
import { addProduct, allProduct, deleteProduct, getProductById, updateProduct } from '../controllers/ProductController.js'
import {  RoleAuth, UserAuth } from '../middleware/AuthController.js'

const ProductRouter = express.Router()

ProductRouter.route('/allproducts').get(allProduct)
ProductRouter.route('/addproduct').post(UserAuth,RoleAuth(["admin"]),addProduct)
ProductRouter.route('/admin/product/:id')
  .put(UserAuth, RoleAuth(["admin"]), updateProduct)
  .delete(UserAuth, RoleAuth(["admin"]), deleteProduct)
ProductRouter.route('/product/:id').get(UserAuth,getProductById)

export default ProductRouter
