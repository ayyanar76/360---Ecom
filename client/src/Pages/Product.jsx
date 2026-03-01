import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const navigate = useNavigate()
  const categories = [
    "Electronics",
    "Clothing",
    "Footwear",
    "Home Appliances",
    "Accessories",
    "Furniture"
  ];
  const api = import.meta.env.VITE_API_KEY
  const [products,setProducts] = React.useState([])
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${api}/allproducts`)
        const data = res.data
        setProducts(data.msg)
      } catch (error) {
        console.log(error);
      }
    }
    fetchProducts()
  }, [api]) 
  return (
    <div className="w-full min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-orange-600 to-orange-600 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Discover Amazing Products at Best Prices
            </h1>
            <p className="text-lg text-gray-200">
              Shop the latest collections with exclusive offers and AI-powered
              product guidance.
            </p>
            <button className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition">
              Shop Now
            </button>
          </div>

          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src="https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?w=800"
              alt="Shopping"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Shop by Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition cursor-pointer"
            >
              <h3 className="font-semibold text-gray-700">{cat}</h3>
            </div>
          ))}
        </div>
      </section>
      
     <div className="">
      {
        /* Product Grid */
        products.length > 0 ? (
          <section className="max-w-6xl mx-auto py-16 px-6">
            <h2 className="text-3xl font-bold text-center mb-10">
              All Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center" onClick={()=>{navigate(`/product/${product._id}`)}}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-orange-600 font-bold mt-2">₹{product.price}</p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <p className="text-center text-gray-500">Loading products...</p>
        ) 
      }
     </div>
    </div>
  );
};

export default Product;
