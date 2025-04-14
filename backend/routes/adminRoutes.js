const express = require("express")
const {
  getAdminSettings,
  updateAdminSettings,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getBanners,
  addBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/adminController")
const { protect, admin } = require("../middleware/authMiddleware")

const router = express.Router()

router.route("/settings").get(protect, admin, getAdminSettings).put(protect, admin, updateAdminSettings)

router.route("/categories").get(getCategories).post(protect, admin, addCategory)
router.route("/categories/:id").put(protect, admin, updateCategory).delete(protect, admin, deleteCategory)

router.route("/banners").get(getBanners).post(protect, admin, addBanner)
router.route("/banners/:id").put(protect, admin, updateBanner).delete(protect, admin, deleteBanner)

module.exports = router
