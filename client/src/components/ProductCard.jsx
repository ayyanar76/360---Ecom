import { ShoppingCart } from 'lucide-react'
import React from 'react'

const ProductCard = ({name,price,image,onAddToCart}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition duration-300 w-full">
      
      <img
       src={image}
        alt={name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      <h3 className="text-lg font-semibold mb-2">{name}</h3>

      <p className="text-orange-500 font-bold mb-3">${price}</p>

      <button
        className="flex items-center justify-center gap-2 bg-black text-white w-full py-2 rounded-lg hover:bg-orange-500 transition"
        onClick={onAddToCart}
      >
        <ShoppingCart size={18} />
        Add to Cart
      </button>
    </div>
  )
}

export default ProductCard
