import e from "express";
import { getAllUsers, getMe, login, logout, register, updateUserRole } from "../controllers/UserController.js";
import { RoleAuth, UserAuth } from "../middleware/AuthController.js";

const UserRoute = e.Router()


UserRoute.route('/signup').post(register)
UserRoute.route('/login').post(login)
UserRoute.route('/logout').post(logout)
UserRoute.route('/me').get(UserAuth,getMe)
UserRoute.route('/admin/users').get(UserAuth, RoleAuth(["admin"]), getAllUsers)
UserRoute.route('/admin/users/:id/role').put(UserAuth, RoleAuth(["admin"]), updateUserRole)

export default UserRoute
