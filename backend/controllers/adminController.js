const Admin = require("../models/Admin")

// @desc    Get admin settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getAdminSettings = async (req, res) => {
  try {
    let admin = await Admin.findOne()

    if (!admin) {
      // Create default admin settings if none exist
      admin = new Admin({
        categories: [],
        banners: [],
        settings: {
          siteName: "ShopEZ",
          contactEmail: "contact@shopez.com",
        },
      })
      await admin.save()
    }

    res.json(admin)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Update admin settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateAdminSettings = async (req, res) => {
  try {
    const { settings } = req.body

    let admin = await Admin.findOne()

    if (!admin) {
      admin = new Admin({
        categories: [],
        banners: [],
        settings,
      })
    } else {
      admin.settings = {
        ...admin.settings,
        ...settings,
      }
    }

    await admin.save()
    res.json(admin)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const admin = await Admin.findOne()

    if (!admin) {
      return res.json([])
    }

    res.json(admin.categories)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Add a category
// @route   POST /api/admin/categories
// @access  Private/Admin
const addCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body

    let admin = await Admin.findOne()

    if (!admin) {
      admin = new Admin({
        categories: [],
        banners: [],
        settings: {
          siteName: "ShopEZ",
        },
      })
    }

    // Check if category already exists
    const categoryExists = admin.categories.find((category) => category.name.toLowerCase() === name.toLowerCase())

    if (categoryExists) {
      res.status(400)
      throw new Error("Category already exists")
    }

    admin.categories.push({
      name,
      description,
      image,
    })

    await admin.save()
    res.status(201).json(admin.categories)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Update a category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body
    const categoryId = req.params.id

    const admin = await Admin.findOne()

    if (!admin) {
      res.status(404)
      throw new Error("Admin settings not found")
    }

    const categoryIndex = admin.categories.findIndex((category) => category._id.toString() === categoryId)

    if (categoryIndex === -1) {
      res.status(404)
      throw new Error("Category not found")
    }

    admin.categories[categoryIndex] = {
      ...admin.categories[categoryIndex],
      name: name || admin.categories[categoryIndex].name,
      description: description || admin.categories[categoryIndex].description,
      image: image || admin.categories[categoryIndex].image,
    }

    await admin.save()
    res.json(admin.categories)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id

    const admin = await Admin.findOne()

    if (!admin) {
      res.status(404)
      throw new Error("Admin settings not found")
    }

    admin.categories = admin.categories.filter((category) => category._id.toString() !== categoryId)

    await admin.save()
    res.json({ message: "Category removed" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Get all banners
// @route   GET /api/admin/banners
// @access  Public
const getBanners = async (req, res) => {
  try {
    const admin = await Admin.findOne()

    if (!admin) {
      return res.json([])
    }

    // Only return active banners for public access
    const activeBanners = admin.banners.filter((banner) => banner.isActive)
    res.json(activeBanners)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Add a banner
// @route   POST /api/admin/banners
// @access  Private/Admin
const addBanner = async (req, res) => {
  try {
    const { title, description, image, link, isActive } = req.body

    let admin = await Admin.findOne()

    if (!admin) {
      admin = new Admin({
        categories: [],
        banners: [],
        settings: {
          siteName: "ShopEZ",
        },
      })
    }

    admin.banners.push({
      title,
      description,
      image,
      link,
      isActive: isActive !== undefined ? isActive : true,
    })

    await admin.save()
    res.status(201).json(admin.banners)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Update a banner
// @route   PUT /api/admin/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res) => {
  try {
    const { title, description, image, link, isActive } = req.body
    const bannerId = req.params.id

    const admin = await Admin.findOne()

    if (!admin) {
      res.status(404)
      throw new Error("Admin settings not found")
    }

    const bannerIndex = admin.banners.findIndex((banner) => banner._id.toString() === bannerId)

    if (bannerIndex === -1) {
      res.status(404)
      throw new Error("Banner not found")
    }

    admin.banners[bannerIndex] = {
      ...admin.banners[bannerIndex],
      title: title || admin.banners[bannerIndex].title,
      description: description || admin.banners[bannerIndex].description,
      image: image || admin.banners[bannerIndex].image,
      link: link || admin.banners[bannerIndex].link,
      isActive: isActive !== undefined ? isActive : admin.banners[bannerIndex].isActive,
    }

    await admin.save()
    res.json(admin.banners)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Delete a banner
// @route   DELETE /api/admin/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
  try {
    const bannerId = req.params.id

    const admin = await Admin.findOne()

    if (!admin) {
      res.status(404)
      throw new Error("Admin settings not found")
    }

    admin.banners = admin.banners.filter((banner) => banner._id.toString() !== bannerId)

    await admin.save()
    res.json({ message: "Banner removed" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
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
}
