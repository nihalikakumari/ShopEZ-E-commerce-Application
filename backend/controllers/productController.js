const Product = require("../models/Product")

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = 12
    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {}

    const category = req.query.category ? { category: req.query.category } : {}
    const priceRange = req.query.price
      ? {
          price: {
            $gte: Number(req.query.price.split("-")[0]),
            $lte: Number(req.query.price.split("-")[1]),
          },
        }
      : {}

    const featured = req.query.featured === "true" ? { featured: true } : {}
    const isNew = req.query.new === "true" ? { isNew: true } : {}
    const isSale = req.query.sale === "true" ? { isSale: true } : {}

    const count = await Product.countDocuments({
      ...keyword,
      ...category,
      ...priceRange,
      ...featured,
      ...isNew,
      ...isSale,
    })

    const products = await Product.find({
      ...keyword,
      ...category,
      ...priceRange,
      ...featured,
      ...isNew,
      ...isSale,
    })
      .limit(pageSize)
      .skip(pageSize * (page - 1))

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      res.json(product)
    } else {
      res.status(404)
      throw new Error("Product not found")
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      category,
      countInStock,
      sizes,
      colors,
      isNew,
      isSale,
      originalPrice,
      featured,
    } = req.body

    const product = new Product({
      name,
      price,
      description,
      image,
      category,
      countInStock: countInStock || 0,
      sizes: sizes || [],
      colors: colors || [],
      isNew: isNew || false,
      isSale: isSale || false,
      originalPrice: originalPrice || 0,
      featured: featured || false,
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      category,
      countInStock,
      sizes,
      colors,
      isNew,
      isSale,
      originalPrice,
      featured,
    } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
      product.name = name || product.name
      product.price = price || product.price
      product.description = description || product.description
      product.image = image || product.image
      product.category = category || product.category
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock
      product.sizes = sizes || product.sizes
      product.colors = colors || product.colors
      product.isNew = isNew !== undefined ? isNew : product.isNew
      product.isSale = isSale !== undefined ? isSale : product.isSale
      product.originalPrice = originalPrice !== undefined ? originalPrice : product.originalPrice
      product.featured = featured !== undefined ? featured : product.featured

      const updatedProduct = await product.save()
      res.json(updatedProduct)
    } else {
      res.status(404)
      throw new Error("Product not found")
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      await product.remove()
      res.json({ message: "Product removed" })
    } else {
      res.status(404)
      throw new Error("Product not found")
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
      const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString())

      if (alreadyReviewed) {
        res.status(400)
        throw new Error("Product already reviewed")
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      }

      product.reviews.push(review)

      product.numReviews = product.reviews.length

      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

      await product.save()
      res.status(201).json({ message: "Review added" })
    } else {
      res.status(404)
      throw new Error("Product not found")
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(5)
    res.json(products)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8)
    res.json(products)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Get new products
// @route   GET /api/products/new
// @access  Public
const getNewProducts = async (req, res) => {
  try {
    const products = await Product.find({ isNew: true }).limit(8)
    res.json(products)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Get sale products
// @route   GET /api/products/sale
// @access  Public
const getSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ isSale: true }).limit(8)
    res.json(products)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getFeaturedProducts,
  getNewProducts,
  getSaleProducts,
}
