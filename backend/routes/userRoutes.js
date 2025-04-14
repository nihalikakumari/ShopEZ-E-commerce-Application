const express = require("express")
const { registerUser, updateUserProfile, getUsers, deleteUser } = require("../controllers/userController")
const { protect, admin } = require("../middleware/authMiddleware")

const router = express.Router()

router.route("/").post(registerUser).get(protect, admin, getUsers)
router.route("/profile").put(protect, updateUserProfile)
router.route("/:id").delete(protect, admin, deleteUser)

module.exports = router
