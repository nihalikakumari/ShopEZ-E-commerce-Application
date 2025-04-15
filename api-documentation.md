# ShopEZ API Documentation

## Base URL
\`\`\`
http://localhost:5000/api
\`\`\`

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

## Error Handling
All API endpoints return appropriate HTTP status codes:
- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required or failed
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses include a message field explaining the error:
\`\`\`json
{
  "message": "Error message details"
}
\`\`\`

## API Endpoints

### Authentication

#### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  \`\`\`json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  \`\`\`
- **Success Response**: `200 OK`
  \`\`\`json
  {
    "_id": "user_id",
    "username": "username",
    "email": "user@example.com",
    "isAdmin": false,
    "token": "jwt_token"
  }
  \`\`\`

#### Get User Profile
- **URL**: `/auth/profile`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  \`\`\`json
  {
    "_id": "user_id",
    "username": "username",
    "email": "user@example.com",
    "isAdmin": false,
    "firstName": "John",
    "lastName": "Doe",
    "phone": "123-456-7890",
    "address": {
      "street": "123 Main St",
      "city": "Boston",
      "state": "MA",
      "zipCode": "02108",
      "country": "USA"
    }
  }
  \`\`\`

### Users

#### Register User
- **URL**: `/users`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  \`\`\`json
  {
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123"
  }
  \`\`\`
- **Success Response**: `201 Created`
  \`\`\`json
  {
    "_id": "user_id",
    "username": "newuser",
    "email": "newuser@example.com",
    "isAdmin": false,
    "token": "jwt_token"
  }
  \`\`\`

#### Update User Profile
- **URL**: `/users/profile`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Request Body**:
  \`\`\`json
  {
    "username": "updatedname",
    "email": "updated@example.com",
    "password": "newpassword",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "123-456-7890",
    "address": {
      "street": "123 Main St",
      "city": "Boston",
      "state": "MA",
      "zipCode": "02108",
      "country": "USA"
    }
  }
  \`\`\`
- **Success Response**: `200 OK`
  \`\`\`json
  {
    "_id": "user_id",
    "username": "updatedname",
    "email": "updated@example.com",
    "isAdmin": false,
    "firstName": "John",
    "lastName": "Doe",
    "phone": "123-456-7890",
    "address": {
      "street": "123 Main St",
      "city": "Boston",
      "state": "MA",
      "zipCode": "02108",
      "country": "USA"
    },
    "token": "jwt_token"
  }
  \`\`\`

#### Get All Users (Admin Only)
- **URL**: `/users`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)
- **Success Response**: `200 OK`
  \`\`\`json
  [
    {
      "_id": "user_id",
      "username": "username",
      "email": "user@example.com",
      "isAdmin": false
    },
    // More users...
  ]
  \`\`\`

#### Delete User (Admin Only)
- **URL**: `/users/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin)
- **Success Response**: `200 OK`
  \`\`\`json
  {
    "message": "User removed"
  }
  \`\`\`

### Products

#### Get All Products
- **URL**: `/products`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `keyword`: Search term
  - `pageNumber`: Page number for pagination
  - `category`: Filter by category
  - `price`: Price range (format: "min-max")
  - `featured`: Filter featured products ("true")
  - `new`: Filter new products ("true")
  - `sale`: Filter sale products ("true")
- **Success Response**: `200 OK`
  \`\`\`json
  {
    "products": [
      {
        "_id": "product_id",
        "name": "Product Name",
        "description": "Product description",
        "price": 99.99,
        "originalPrice": 129.99,
        "category": "Category",
        "image": "/image-url.jpg",
        "countInStock": 10,
        "rating": 4.5,
        "numReviews": 12,
        "isNew": true,
        "isSale": false,
        "sizes": ["S", "M", "L"],
        "colors": ["Black", "White"],
        "featured": true
      },
      // More products...
    ],
    "page": 1,
    "pages": 5,
    "count": 100
  }
  \`\`\`

#### Get Product by ID
- **URL**: `/products/:id`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK`
  \`\`\`json
  {
    "_id": "product_id",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "originalPrice": 129.99,
    "category": "Category",
    "image": "/image-url.jpg",
    "countInStock": 10,
    "rating": 4.5,
    "numReviews": 12,
    "isNew": true,
    "isSale": false,
    "sizes": ["S", "M", "L"],
    "colors": ["Black", "White"],
    "featured": true,
    "reviews": [
      {
        "user": "user_id",
        "name": "User Name",
        "rating": 5,
        "comment": "Great product!"
      }
    ]
  }
  \`\`\`

#### Create Product (Admin Only)
- **URL**: `/products`
- **Method**: `POST`
- **Auth Required**: Yes (Admin)
- **Request Body**:
  \`\`\`json
  {
    "name": "New Product",
    "price": 99.99,
    "description": "Product description",
    "image": "/image-url.jpg",
    "category": "Category",
    "countInStock": 10,
    "sizes": ["S", "M", "L"],
    "colors": ["Black", "White"],
    "isNew": true,
    "isSale": false,
    "originalPrice": 129.99,
    "featured": true
  }
  \`\`\`
- **Success Response**: `201 Created`
  \`\`\`json
  {
    "_id": "product_id",
    "name": "New Product",
    "price": 99.99,
    "description": "Product description",
    "image": "/image-url.jpg",
    "category": "Category",
    "countInStock": 10,
    "sizes": ["S", "M", "L"],
    "colors": ["Black", "White"],
    "isNew": true,
    "isSale": false,
    "originalPrice": 129.99,
    "featured": true
  }
  \`\`\`

#### Update Product (Admin Only)
- **URL**: `/products/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (Admin)
- **Request Body**: Same as Create Product
- **Success Response**: `200 OK`
  \`\`\`json
  {
    "_id": "product_id",
    "name": "Updated Product",
    "price": 89.99,
    "description": "Updated description",
    "image": "/image-url.jpg",
    "category": "Category",
    "countInStock": 15,
    "sizes": ["S", "M", "L"],
    "colors": ["Black", "White"],
    "isNew": true,
    "isSale": false,
    "originalPrice": 129.99,
    "featured": true
  }
  \`\`\`

#### Delete Product (Admin Only)
- **URL**: `/products/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin)
- **Success Response**: `200 OK`
  \`\`\`json
  {
    "message": "Product removed"
  }
  \`\`\`

#### Create Product Review
- **URL**: `/products/:id/reviews`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  \`\`\`json
  {
    "rating": 5,
    "comment": "Great product!"
  }
  \`\`\`
- **Success Response**: `201 Created`
  \`\`\`json
  {
    "message": "Review added"
  }
  \`\`\`

#### Get Top Products
- **URL**: `/products/top`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK`
  \`\`\`json
  [
    {
      "_id": "product_id",
      "name": "Product Name",
      "price": 99.99,
      "image": "/image-url.jpg",
      "rating": 4.8
    },
    // More products...
  ]
  \`\`\`

#### Get Featured Products
- **URL**: `/products/featured`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK`
  \`\`\`json
  [
    {
      "_id": "product_id",
      "name": "Product Name",
      "price": 99.99,
      "image": "/image-url.jpg"
    },
    // More products...
  ]
  \`\`\`

#### Get New Products
- **URL**: `/products/new`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK`
  \`\`\`json
  [
    {
      "_id": "product_id",
      "name": "Product Name",
      "price": 99.99,
      "image": "/image-url.jpg"
    },
    // More products...
  ]
  \`\`\`

#### Get Sale Products
- **URL**: `/products/sale`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK`
  \`\`\`json
  [
    {
      "_id": "product_id",
      "name": "Product Name",
      "price": 79.99,
      "originalPrice": 99.99,
      "image": "/image-url.jpg"
    },
    // More products...
  ]
  \`\`\`

### Orders

#### Create Order
- **URL**: `/orders`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  \`\`\`json
  {
    "orderItems": [
      {
        "name": "Product Name",
        "quantity": 2,
        "image": "/image-url.jpg",
        "price": 99.99,
        "product": "product_id"
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Boston",
      "postalCode": "02108",
      "country": "USA"
    },
    "paymentMethod": "PayPal",
    "itemsPrice": 199.98,
    "taxPrice": 20.00,
    "shippingPrice": 0.00,
    "totalPrice": 219.98
  }
  \`\`\`
- **Success Response**: `201 Created`
  \`\`\`json
  {
    "_id": "order_id",
    "user": "user_id",
    "orderItems": [
      {
        "name": "Product Name",
        "quantity": 2,
        "image": "/image-url.jpg",
        "price": 99.99,
        "product": "product_id"
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Boston",
      "postalCode": "02108",
      "country": "USA"
    },
    "paymentMethod": "PayPal",
    "itemsPrice": 199.98,
    "taxPrice": 20.00,
    "shippingPrice": 0.00,
    "totalPrice": 219.98,
    "isPaid": false,
    "isDelivered": false,
    "status": "Pending",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
  \`\`\`

#### Get Order by ID
- **URL**: `/orders/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  \`\`\`json
  {
    "_id": "order_id",
    "user": {
      "_id": "user_id",
      "username": "username",
      "email": "user@example.com"
    },
    "orderItems": [
      {
        "name": "Product Name",
        "quantity": 2,
        "image": "/image-url.jpg",
        "price": 99.99,
        "product": "product_id"
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Boston",
      "postalCode": "02108",
      "country": "USA"
    },
    "paymentMethod": "PayPal",
    "itemsPrice": 199.98,
    "taxPrice": 20.00,
    "shippingPrice": 0.00,
    "totalPrice": 219.98,
    "isPaid": false,
    "isDelivered": false,
    "status": "Pending",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
  \`\`\`

#### Update Order to Paid
- **URL**: `/orders/:id/pay`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Request Body**:
  \`\`\`json
  {
    "id": "payment_id",
    "status": "COMPLETED",
    "update_time": "2023-01-01T00:00:00Z",
    "payer": {
      "email_address": "payer@example.com"
    }
  }
  \`\`\`
- **Success Response**: `200 OK`
  \`\`\`json
  {
    "_id": "order_id",
    "isPaid": true,
    "paidAt": "2023-01-01T00:00:00.000Z",
    "paymentResult": {
      "id": "payment_id",
      "status": "COMPLETED",
      "update_time": "2023-01-01T00:00:00Z",
      "email_address": "payer@example.com"
    }
    // Other order fields...
  }
  \`\`\`

#### Get User Orders
- **URL**: `/orders/myorders`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  \`\`\`json
  [
    {
      "_id": "order_id",
      "user": "user_id",
      "totalPrice": 219.98,
      "isPaid": true,
      "isDelivered": false,
      "status": "Processing",
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    // More orders...
  ]
  \`\`\`

#### Get All Orders (Admin Only)
- **URL**: `/orders`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)
- **Success Response**: `200 OK`
  \`\`\`json
  [
    {
      "_id": "order_id",
      "user": {
        "id": "user_id",
        "username": "username"
      },
      "totalPrice": 219.98,
      "isPaid": true,
      "isDelivered": false,
      "status": "Processing",
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    // More orders...
  ]
  \`\`\`

### Cart

#### Get User Cart
- **URL**: `/cart`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  \`\`\`json
  {
    "_id": "cart_id",
    "user": "user_id",
    "cartItems": [
      {
        "_id": "cart_item_id",
        "product": {
          "_id": "product_id",
          "name": "Product Name",
          "price": 99.99,
          "image": "/image-url.jpg",
          "countInStock": 10
        },
        "name": "Product Name",
        "image": "/image-url.jpg",
        "price": 99.99,
        "quantity": 2,
        "size": "M",
        "color": "Black"
      }
    ]
  }
  \`\`\`

#### Add to Cart
- **URL**: `/cart`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  \`\`\`json
  {
    "productId": "product_id",
    "quantity": 1,
    "size": "M",
    "color": "Black"
  }
  \`\`\`
- **Success Response**: `201 Created`
  \`\`\`json
  {
    "_id": "cart_id",
    "user": "user_id",
    "cartItems": [
      {
        "_id": "cart_item_id",
        "product": {
          "_id": "product_id",
          "name": "Product Name",
          "price": 99.99,
          "image": "/image-url.jpg",
          "countInStock": 10
        },
        "name": "Product Name",
        "image": "/image-url.jpg",
        "price": 99.99,
        "quantity": 1,
        "size": "M",
        "color": "Black"
      }
    ]
  }
  \`\`\`

#### Update Cart Item
- **URL**: `/cart/:itemId`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Request Body**:
  \`\`\`json
  {
    "quantity": 3
  }
  \`\`\`
- **Success Response**: `200 OK`
  \`\`\`json
  {
    "_id": "cart_id",
    "user": "user_id",
    "cartItems": [
      {
        "_id": "cart_item_id",
        "product": {
          "_id": "product_id",
          "name": "Product Name",
          "price": 99.99,
          "image": "/image-url.jpg",
          "countInStock": 10
        },
        "name": "Product Name",
        "image": "/image-url.jpg",
        "price": 99.99,
        "quantity": 3,
        "size": "M",
        "color": "Black"
      }
    ]
  }
  \`\`\`

#### Remove from Cart
- **URL**: `/cart/:itemId`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  \`\`\`json
  {
    "_id": "cart_id",
    "user": "user_id",
    "cartItems": []
  }
  \`\`\`

#### Clear Cart
- **URL**: `/cart`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  \`\`\`json
  {
    "message": "Cart cleared"
  }
  \`\`\`

### Admin

#### Get Admin Settings
- **URL**: `/admin/settings`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)
- **Success Response**: `200 OK`
  \`\`\`json
  {
    "categories": [
      {
        "_id": "category_id",
        "name": "Category Name",
        "description": "Category description",
        "image": "/image-url.jpg"
      }
    ],
    "banners": [
      {
        "_id": "banner_id",
        "title": "Banner Title",
        "description": "Banner description",
        "image": "/image-url.jpg",
        "link": "/link-url",
        "isActive": true
      }
    ],
    "settings": {
      "siteName": "ShopEZ",
      "logo": "/logo-url.jpg",
      "contactEmail": "contact@shopez.com",
      "contactPhone": "+1 (555) 123-4567",
      "socialLinks": {
        "facebook": "https://facebook.com/shopez",
        "instagram": "https://instagram.com/shopez",
        "twitter": "https://twitter.com/shopez"
      }
    }
  }
  \`\`\`

#### Get Categories
- **URL**: `/admin/categories`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK`
  \`\`\`json
  [
    {
      "_id": "category_id",
      "name": "Category Name",
      "description": "Category description",
      "image": "/image-url.jpg"
    },
    // More categories...
  ]
  \`\`\`

#### Get Banners
- **URL**: `/admin/banners`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK`
  \`\`\`json
  [
    {
      "_id": "banner_id",
      "title": "Banner Title",
      "description": "Banner description",
      "image": "/image-url.jpg",
      "link": "/link-url",
      "isActive": true
    },
    // More banners...
  ]
  \`\`\`

## Testing the API

You can test the API using tools like Postman or curl. Here are some example requests:

### Register a new user
\`\`\`bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"  \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
\`\`\`

### Login

\`\`\`bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
\`\`\`

### Get products

\`\`\`bash
curl -X GET http://localhost:5000/api/products
\`\`\`

### Create an order (authenticated)

\`\`\`bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "orderItems": [
      {
        "name": "Crystal Charm Bracelet",
        "quantity": 1,
        "image": "/placeholder.svg",
        "price": 89.99,
        "product": "PRODUCT_ID"
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Boston",
      "postalCode": "02108",
      "country": "USA"
    },
    "paymentMethod": "PayPal",
    "itemsPrice": 89.99,
    "taxPrice": 9.00,
    "shippingPrice": 0,
    "totalPrice": 98.99
  }'
\`\`\`

## Running the Application

### Frontend (Next.js)

1. Navigate to the frontend directory:
\`\`\`bash
cd shopez-frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Access the application at http://localhost:3000

### Backend (Node.js/Express)

1. Navigate to the backend directory:
\`\`\`bash
cd shopez-backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables in .env file:
\`\`\`
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopez
JWT_SECRET=your_jwt_secret
\`\`\`

4. Seed the database with sample data:
\`\`\`bash
npm run data:import
\`\`\`

5. Start the server:
\`\`\`bash
npm run server
\`\`\`

6. The API will be available at http://localhost:5000/api

## API Documentation Link

You can access the full API documentation at:
\`\`\`
http://localhost:5000/api-docs
\`\`\`

Or view the markdown documentation in the project at:
\`\`\`
/shopez-backend/api-documentation.md
