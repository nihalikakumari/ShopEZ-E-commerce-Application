const mongoose = require("mongoose")

const adminSchema = mongoose.Schema(
  {
    categories: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
        },
        image: {
          type: String,
        },
      },
    ],
    banners: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        image: {
          type: String,
          required: true,
        },
        link: {
          type: String,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    settings: {
      siteName: {
        type: String,
        default: "ShopEZ",
      },
      logo: {
        type: String,
      },
      contactEmail: {
        type: String,
      },
      contactPhone: {
        type: String,
      },
      socialLinks: {
        facebook: String,
        instagram: String,
        twitter: String,
        pinterest: String,
      },
    },
  },
  {
    timestamps: true,
  },
)

const Admin = mongoose.model("Admin", adminSchema)

module.exports = Admin
