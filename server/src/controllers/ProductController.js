import Product from "../models/productSchema.js";

export const allProduct = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    const product = await Product.find(filter);
    res.status(200).json({
      success: true,
      msg: product,
    });
  } catch (error) {
    res.json({
      success: false,
      msg: error.message,
    });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    //  const {image} = req.file
    // if (!name || !price || !description || !category) {
    //   res.status(404).json({
    //     success: false,
    //     msg: "Fields Are Required",
    //   });
    // }
    const product = await Product.create({
      name,
      stock:req.body.stock || 1,
      image_url:req.body.image_url || null,
      price,
      description,
      category,
    });
    res.json({
      success: true,
      msg: product,
    });
  } catch (error) {
    res.json({
      success: false,
      msg: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatePayload = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      image_url: req.body.image_url,
    };

    Object.keys(updatePayload).forEach((key) => {
      if (updatePayload[key] === undefined) delete updatePayload[key];
    });

    const product = await Product.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    res.json({
      success: true,
      msg: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    res.json({
      success: true,
      msg: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json({ success: true, product })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getProductById = async (req, res) => { 
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json({ success: true, product })  
  } catch (error) {
    res.status(500).json({ error: err.message })
  }
}

// export const seedProducts = async (req, res) => {
//   try {
//     await Product.deleteMany()    // clear old products first

//     await Product.insertMany([
//       {
//         name:        'Wireless Headphones',
//         description: 'Premium noise-cancelling, 30hr battery',
//         price:       99.99,
//         category:    'Electronics',
//         stock:       50,
//         image_url:   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
//         isSeed:      true,
//       },
//       {
//         name:        'Leather Wallet',
//         description: 'Slim genuine leather, RFID protection',
//         price:       39.99,
//         category:    'Accessories',
//         stock:       100, 
//         image_url:   'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
//         isSeed:      true,
//       },
//       {
//         name:        'Running Shoes',
//         description: 'Lightweight for all terrain running',
//         price:       79.99,
//         category:    'Footwear',
//         stock:       75,
//         image_url:   'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',   
//         isSeed:      true,
//       },
//       {
//         name:        'Smartwatch',
//         description: 'Track fitness, sleep and notifications',
//         price:       149.99,
//         category:    'Electronics',
//         stock:       30,
//         image_url:   'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
//         isSeed:      true,
//       },
//       {
//         name:        'Sunglasses',
//         description: 'UV400 polarized lenses, titanium frame',
//         price:       59.99,
//         category:    'Accessories',
//         stock:       60,
//         image_url:   'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
//         isSeed:      true,
//       },
//       {
//         name:        'Backpack',
//         description: 'Waterproof 30L, dedicated laptop pocket',
//         price:       89.99,
//         category:    'Bags',
//         stock:       40,
//         image_url:   'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
//         isSeed:      true,
//       },
//     ])

//     res.json({ success: true, message: '✅ Database seeded with 6 products!' })

//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// }
