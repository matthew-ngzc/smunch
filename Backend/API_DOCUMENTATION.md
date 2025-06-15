
# 📘 SMUNCH API Documentation

**Base URL:** `/api`

---

## 🔐 Authentication (`/auth`)

### `POST /auth/signup`
Starts signup and sends a verification email.

**Request Body:**
```json
{
  "email": "user@smu.edu.sg",
  "name": "John Doe",
  "phoneNo": "91234567",
  "password": "securePassword"
}
```

**Responses:**
- `200 OK` – Email sent
- `400 Bad Request` – Missing fields or invalid domain
- `409 Conflict` – Email already exists

---

### `GET /auth/verify?token=<jwt>`
Verifies email and creates the account.

**Responses:**
- `201 Created` – Account created
- `400 Bad Request` – Missing or expired token
- `409 Conflict` – Account already exists

---

### `POST /auth/login`
Logs in and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@smu.edu.sg",
  "password": "securePassword"
}
```

**Responses:**
- `200 OK` – `{ "token": "..." }`
- `400 Bad Request` – Missing fields
- `401 Unauthorized` – Invalid credentials

---

## 🏪 Merchants (`/merchants`)

### `GET /merchants`
Fetch all merchants.

---

### `GET /merchants/:id`
Fetch merchant by ID.

---

### `GET /merchants/:id/menu`
Fetch menu items for a merchant.

---

### `POST /merchants`
Create a new merchant.

**Request Body:**
```json
{
  "name": "The Sandwich Club",
  "location": "SCIS L1",
  "contact": "+6591234567",
  "image_url": "https://...",
  "payout_frequency": "weekly"
}
```

---

### `PUT /merchants/:id`
Update merchant details (partial updates allowed).

---

### `POST /merchants/:id/menu`
Add a new menu item.

**Request Body:**
```json
{
  "name": "Chicken Sandwich",
  "description": "Grilled chicken with mayo",
  "price_cents": 650,
  "image_url": "https://...",
  "is_available": true
}
```

---

### `PUT /merchants/:merchantId/menu/:menuItemId`
Update menu item. Must belong to merchant.

---

## 📦 Orders (`/orders`)

### `POST /orders`
Creates an order and returns:
- Order details
- QR code for PayNow
- Payment reference
- PayNow number

**Request Body:**
```json
{
  "customer_id": 1,
  "merchant_id": 2,
  "delivery_fee_cents": 100,
  "building": "SCIS",
  "room_type": "SR",
  "room_number": "2-2",
  "delivery_time": "2025-01-01T12:00:00Z",
  "order_items": [
    { "menu_item_id": 10, "quantity": 1, "price_cents": 650 }
  ]
}
```

---

### `PUT /orders/:orderId/order-status`
Update the status of an order.

**Accepted Values:**
- `created`
- `payment_verified`
- `preparing`
- `collected_by_runner`
- `delivered`
- `completed`
- `cancelled`

---

### `PUT /orders/:orderId/payment-status`
Update the payment status of an order.

**Accepted Values:**
- `awaiting_payment`
- `awaiting_verification`
- `payment_confirmed`

---

### `GET /orders/user/:userId?type=active|history`
Fetch orders for a user.

- `type=active`: shows orders in progress
- `type=history`: shows completed/cancelled orders

---

## 💳 Payment (`/orders/:orderId/payment`)

### `POST /orders/:orderId/payment/confirm`
Confirms payment and sends receipt.

**Response:**
- `200 OK` – Receipt sent
- `202 Accepted` – Payment not yet verified

---

### `GET /orders/:orderId/payment`
Regenerates:
- PayNow QR code
- Payment reference
- PayNow number

---

## ✅ Future Enhancements

- Swagger UI integration
- Role-based auth
- Merchant-side order dashboard
