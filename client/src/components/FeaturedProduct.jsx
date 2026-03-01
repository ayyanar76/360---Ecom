import React from 'react'
import ProductCard from './ProductCard'

const CART_STORAGE_KEY = "shop_cart_items";

const FetauredProducts = () => {
   const products = [
      {
        name:        'Wireless Headphones',
        description: 'Premium noise-cancelling, 30hr battery',
        price:       99.99,
        category:    'Electronics',
        stock:       50,
        image_url:   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        isSeed:      true,
      },
      {
        name:        'Leather Wallet',
        description: 'Slim genuine leather, RFID protection',
        price:       39.99,
        category:    'Accessories',
        stock:       100, 
        image_url:   'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
        isSeed:      true,
      },
      {
        name:        'Running Shoes',
        description: 'Lightweight for all terrain running',
        price:       79.99,
        category:    'Footwear',
        stock:       75,
        image_url:   'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',   
        isSeed:      true,
      },
      {
        name:        'Smartwatch',
        description: 'Track fitness, sleep and notifications',
        price:       149.99,
        category:    'Electronics',
        stock:       30,
        image_url:   'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        isSeed:      true,
      },
      {
        name:        'Sunglasses',
        description: 'UV400 polarized lenses, titanium frame',
        price:       59.99,
        category:    'Accessories',
        stock:       60,
        image_url:   'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
        isSeed:      true,
      },
      {
        name:        'Backpack',
        description: 'Waterproof 30L, dedicated laptop pocket',
        price:       89.99,
        category:    'Bags',
        stock:       40,
        image_url:   'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        isSeed:      true,
      },
    ]

  const handleAddToCart = (product) => {
    const itemId = `featured-${product.name.toLowerCase().replace(/\s+/g, "-")}`;
    const cartItem = {
      id: itemId,
      name: product.name,
      price: Number(product.price) || 0,
      quantity: 1,
      image: product.image_url,
      description: product.description,
    };

    try {
      const existingItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
      const itemIndex = existingItems.findIndex((item) => item.id === cartItem.id);

      if (itemIndex >= 0) {
        existingItems[itemIndex].quantity += 1;
      } else {
        existingItems.push(cartItem);
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(existingItems));
    } catch (error) {
      console.error("Failed to add featured product to cart:", error);
    }
  };


  return (
    <div className='w-full max-w-6xl mx-auto flex flex-col gap-4 px-4 sm:px-6'>
      <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold' >Featured Product</h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product,_) => (
          <ProductCard
            key={_}
            name={product.name}
            price={product.price}
            image={product.image_url}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}


      </div>
    </div>
  )
}

export default FetauredProducts
