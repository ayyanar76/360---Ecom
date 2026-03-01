import React, { useContext } from "react";
import Home from "./Pages/Home";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import Navbar from "./components/Navbar";
import { AuthContext } from "./context/auth-context";
import CheckOut from "./Pages/CheckOut";
import PaymentSuccess from "./Pages/PaymentSucess";
import Order from "./Pages/Order";
import ProductView from "./Pages/ProductViewPage";
import MyProfile from "./Pages/MyProfile";
import AiChat from "./Pages/AiChat";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./Pages/admin/AdminLayout";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminProducts from "./Pages/admin/AdminProducts";
import AdminOrders from "./Pages/admin/AdminOrders";
import AdminUsers from "./Pages/admin/AdminUsers";

const App = () => {
    const { user } = useContext(AuthContext)
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar user={user}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register/>} />
        <Route path="/products" element={<Product />} />
         <Route path="/product/:id" element={<ProductView/>}/>
        <Route path="/cart" element={<Cart />} />
        <Route path="/check-out" element={<CheckOut/>}/>
        <Route path="/orders" element={<Order/>}/>
        <Route path="/profile" element={<MyProfile/>}/>
        <Route path="/ai-chat" element={<AiChat/>}/>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
        <Route path="/success" element={<PaymentSuccess/>}/>
        <Route path="*" element={<h1 className="text-center text-orange-600 flex items-center justify-center h-[80vh] text-2xl font-stretch-200%">404 Not Found</h1>} />
      </Routes>
    </div>
  );};

export default App;
