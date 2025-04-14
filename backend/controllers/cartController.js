const Cart = require("../models/Cart")
const Product = require("../models/Product")

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "cartItems.product",
      select: "name price image countInStock",
    })

    if (!cart) {
      // Create a new cart if one doesn't exist
      cart = new Cart({
        user: req.user._id,
        cartItems: [],
      })
      await cart.save()
    }

    res.json(cart)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body

    // Validate product exists and has stock
    const product = await Product.findById(productId)
    if (!product) {
      res.status(404)
      throw new Error("Product not found")
    }

    if (product.countInStock < quantity) {
      res.status(400)
      throw new Error("Not enough stock available")
    }

    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      // Create a new cart if one doesn't exist
      cart = new Cart({
        user: req.user._id,
        cartItems: [],
      })
    }

    // Check if item already exists in cart
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.size === size && item.color === color,
    )

    if (itemIndex > -1) {
      // Item exists, update quantity
      cart.cartItems[itemIndex].quantity += quantity
    } else {
      // Item doesn't exist, add new item
      cart.cartItems.push({
        product: productId,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
        size,
        color,
      })
    }

    await cart.save()

    // Populate product details before returning
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "cartItems.product",
      select: "name price image countInStock",
    })

    res.status(201).json(populatedCart)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body
    const itemId = req.params.itemId

    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      res.status(404)
      throw new Error("Cart not found")
    }

    const itemIndex = cart.cartItems.findIndex((item) => item._id.toString() === itemId)

    if (itemIndex === -1) {
      res.status(404)
      throw new Error("Item not found in cart")
    }

    // Get product to check stock
    const product = await Product.findById(cart.cartItems[itemIndex].product)

    if (!product) {
      res.status(404)
      throw new Error("Product not found")
    }

    if (product.countInStock < quantity) {
      res.status(400)
      throw new Error("Not enough stock available")
    }

    cart.cartItems[itemIndex].quantity = quantity

    await cart.save()

    // Populate product details before returning
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "cartItems.product",
      select: "name price image countInStock",
    })

    res.json(populatedCart)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const itemId = req.params.itemId

    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      res.status(404)
      throw new Error("Cart not found")
    }

    cart.cartItems = cart.cartItems.filter((item) => item._id.toString() !== itemId)

    await cart.save()

    // Populate product details before returning
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "cartItems.product",
      select: "name price image countInStock",
    })

    res.json(populatedCart)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      res.status(404)
      throw new Error("Cart not found")
    }

    cart.cartItems = []

    await cart.save()

    res.json({ message: "Cart cleared" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
}
