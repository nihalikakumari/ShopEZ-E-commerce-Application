const express = require("express")
const {
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
} = require("../controllers/productController")
const { protect, admin } = require("../middleware/authMiddleware")

const router = express.Router()

router.route("/").get(getProducts).post(protect, admin, createProduct)
router.get("/top", getTopProducts)
router.get("/featured", getFeaturedProducts)
router.get("/new", getNewProducts)
router.get("/sale", getSaleProducts)
router.route("/:id").get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct)
router.route("/:id/reviews").post(protect, createProductReview)

module.exports = router
