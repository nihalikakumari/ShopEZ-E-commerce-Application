const mongoose = require("mongoose")
const dotenv = require("dotenv")
const User = require("./models/User")
const Product = require("./models/Product")
const Order = require("./models/Order")
const Admin = require("./models/Admin")

// Load env vars
dotenv.config()

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Sample data
const users = [
  {
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
    isAdmin: true,
  },
  {
    username: "sarah",
    email: "sarah@example.com",
    password: "sarah123",
    firstName: "Sarah",
    lastName: "Johnson",
  },
]

const products = [
  {
    name: "Crystal Charm Bracelet",
    description: "Elegant crystal charm bracelet with adjustable chain.",
    price: 89.99,
    category: "Bracelets",
    image: "/placeholder.svg?height=300&width=300",
    countInStock: 15,
    rating: 4.5,
    numReviews: 12,
    isNew: true,
    featured: true,
    sizes: ["S", "M", "L"],
    colors: ["Silver", "Gold"],
  },
  {
    name: "Leather Crossbody Bag",
    description: "Stylish leather crossbody bag with multiple compartments.",
    price: 129.99,
    originalPrice: 159.99,
    category: "Handbags",
    image: "/placeholder.svg?height=300&width=300",
    countInStock: 8,
    rating: 4.2,
    numReviews: 8,
    isSale: true,
    featured: true,
    colors: ["Black", "Brown", "Tan"],
  },
  {
    name: "Pearl Drop Earrings",
    description: "Classic pearl drop earrings suitable for any occasion.",
    price: 69.99,
    category: "Jewelry",
    image: "/placeholder.svg?height=300&width=300",
    countInStock: 20,
    rating: 4.8,
    numReviews: 15,
    isNew: true,
    featured: true,
  },
  {
    name: "Gold Chain Necklace",
    description: "Delicate gold chain necklace with pendant.",
    price: 99.99,
    category: "Jewelry",
    image: "/placeholder.svg?height=300&width=300",
    countInStock: 12,
    rating: 4.0,
    numReviews: 6,
    featured: true,
  },
]

const adminData = {
  categories: [
    {
      name: "Bracelets",
      description: "Elegant designs for every occasion",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      name: "Handbags",
      description: "Stylish and functional accessories",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      name: "Jewelry",
      description: "Timeless pieces that make a statement",
      image: "/placeholder.svg?height=400&width=300",
    },
  ],
  banners: [
    {
      title: "Summer Collection",
      description: "Discover our new summer styles",
      image: "/placeholder.svg?height=600&width=1200",
      link: "/products",
      isActive: true,
    },
    {
      title: "Special Offer",
      description: "Get 20% off on selected items",
      image: "/placeholder.svg?height=600&width=1200",
      link: "/sale",
      isActive: true,
    },
  ],
  settings: {
    siteName: "ShopEZ",
    contactEmail: "contact@shopez.com",
    contactPhone: "+1 (555) 123-4567",
    socialLinks: {
      facebook: "https://facebook.com/shopez",
      instagram: "https://instagram.com/shopez",
      twitter: "https://twitter.com/shopez",
    },
  },
}

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany()
    await Product.deleteMany()
    await Order.deleteMany()
    await Admin.deleteMany()

    // Create users
    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers[0]._id

    // Add user reference to products
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser }
    })

    // Create products
    await Product.insertMany(sampleProducts)

    // Create admin settings
    await Admin.create(adminData)

    console.log("Data Imported!")
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

// Destroy data
const destroyData = async () => {
  try {
    await User.deleteMany()
    await Product.deleteMany()
    await Order.deleteMany()
    await Admin.deleteMany()

    console.log("Data Destroyed!")
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

// Run script based on command line argument
if (process.argv[2] === "-d") {
  destroyData()
} else {
  importData()
}
