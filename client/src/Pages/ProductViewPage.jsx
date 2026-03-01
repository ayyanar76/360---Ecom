import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CART_STORAGE_KEY = "shop_cart_items";
const PENDING_CHECKOUT_KEY = "pending_checkout";

const ProductView = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);
  const {id} = useParams()
  const [product, setProduct] = useState(null);
  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

  const api = import.meta.env.VITE_API_KEY

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const data = await axios.get(`${api}/product/${id}`,{withCredentials:true})
        setProduct(data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProductById()
  }, [api, id])

  const handleAddToCart = () => {
    const selectedProduct = product?.product;
    if (!selectedProduct) return;

    const cartItem = {
      id: selectedProduct._id,
      name: selectedProduct.name,
      price: Number(selectedProduct.price) || 0,
      quantity,
      image: selectedProduct.image_url,
      description: selectedProduct.description,
    };

    try {
      const existingItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
      const matchedIndex = existingItems.findIndex((item) => item.id === cartItem.id);

      if (matchedIndex >= 0) {
        existingItems[matchedIndex].quantity += quantity;
      } else {
        existingItems.push(cartItem);
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(existingItems));
      navigate("/cart");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const handleBuyNow = async () => {
    const selectedProduct = product?.product;
    if (!selectedProduct || isBuying) return;

    setIsBuying(true);
    try {
      const checkoutContext = {
        source: "buy_now",
        items: [
          {
            product: selectedProduct._id,
            quantity,
            name: selectedProduct.name,
            price: Number(selectedProduct.price) || 0,
            image_url: selectedProduct.image_url,
          },
        ],
        total: (Number(selectedProduct.price) || 0) * quantity,
      };
      localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(checkoutContext));

      const payload = {
        cart: [
          {
            name: selectedProduct.name,
            image_url: selectedProduct.image_url,
            price: Number(selectedProduct.price) || 0,
            qty: quantity,
          },
        ],
      };

      const response = await axios.post(`${api}/checkout`, payload, {
        withCredentials: true,
      });

      if (response?.data?.url) {
        window.location.href = response.data.url;
        return;
      }
      alert("Unable to start checkout. Please try again.");
    } catch (error) {
      console.error("Buy now failed:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8">

        {/* Product Section */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* Product Images */}
          <div>
            <img
              src={product?.product?.image_url}
              alt="Product"
              className="w-full rounded-xl shadow-md"
            />

            {/* Thumbnail Images */}
            <div className="flex gap-4 mt-4">
              <img
                src={product?.product?.image_url }
                alt="thumb"
                className="w-20 h-20 rounded-lg border cursor-pointer"
              />
              {/* <img
                src="https://images.unsplash.com/photo-1585386959984-a4155224f74d?w=200"
                alt="thumb"
                className="w-20 h-20 rounded-lg border cursor-pointer"
              />
              <img
                src="https://images.unsplash.com/photo-1518444028785-8c0c9c0f8d0c?w=200"
                alt="thumb"
                className="w-20 h-20 rounded-lg border cursor-pointer"
              /> */}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">
       {        product?.product?.name }
            </h1>

            <p className="text-xl text-orange-600 font-semibold">
          {product?.product?.price}
            </p>

            <p className="text-gray-600">
       {   product?.product?.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-lg">★★★★★</span>
              <span className="text-gray-500 text-sm">(120 Reviews)</span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={decreaseQty}
                  className="px-4 py-2 text-lg font-bold"
                >
                  -
                </button>
                <span className="px-6">{quantity}</span>
                <button
                  onClick={increaseQty}
                  className="px-4 py-2 text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                className="bg-orange-600 text-white px-6 py-3 rounded-lg shadow hover:bg-orange-700 transition"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button
                className="border border-orange-600 text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleBuyNow}
                disabled={isBuying}
              >
                {isBuying ? "Redirecting..." : "Buy Now"}
              </button>
            </div>

            {/* Extra Info */}
            <div className="border-t pt-6 text-sm text-gray-500 space-y-2">
              <p>✔ Free Delivery</p>
              <p>✔ 7 Days Replacement</p>
              <p>✔ 1 Year Warranty</p>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">
            Product Description
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Experience immersive sound with advanced active noise
            cancellation technology. Designed for comfort and
            durability, these headphones are perfect for travel,
            gaming, and daily use.
          </p>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            Customer Reviews
          </h2>

          <div className="space-y-6">
            <div className="border rounded-xl p-4">
              <p className="font-semibold">Ravi Kumar</p>
              <p className="text-yellow-400">★★★★★</p>
              <p className="text-gray-600 mt-2">
                Amazing sound quality and battery backup!
              </p>
            </div>

            <div className="border rounded-xl p-4">
              <p className="font-semibold">Priya Sharma</p>
              <p className="text-yellow-400">★★★★☆</p>
              <p className="text-gray-600 mt-2">
                Very comfortable and worth the price.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductView;
