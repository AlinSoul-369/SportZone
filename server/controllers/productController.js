const multer = require('multer');
const Product = require('../models/product');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

exports.upload = upload;

// Get all products (supports category and price <= filter)
exports.getAllProducts = async (req, res) => {
  try {
    const { category, price } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (price !== undefined && price !== '') {
      const parsedPrice = Number(price);
      if (Number.isNaN(parsedPrice)) {
        return res.status(400).json({ message: 'Price must be a valid number' });
      }
      filter.price = { $lte: parsedPrice };
    }

    const products = await Product.find(filter);

    res.status(200).json({
      status: 'success',
      results: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, countInStock } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({ message: 'Name, description, price, and category are required' });
    }

    const uploadedImages = req.files && req.files.length > 0
      ? req.files.map(file => `/images/${file.filename}`)
      : [];

    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      images: uploadedImages,
      countInStock: countInStock !== undefined ? countInStock : 0
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => `/images/${file.filename}`);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

// Get total countInStock of all products
exports.getTotalInStock = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalCountInStock: { $sum: '$countInStock' }
        }
      }
    ]);

    res.status(200).json({
      totalCountInStock: result[0] ? result[0].totalCountInStock : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to calculate total stock', error: error.message });
  }
};

// Get total number of products that are out of stock
exports.getOutOfStockCount = async (req, res) => {
  try {
    const outOfStockCount = await Product.countDocuments({ countInStock: 0 });

    res.status(200).json({
      outOfStockCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to count out-of-stock products', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};
