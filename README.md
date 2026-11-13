## TheEmbassy

TheEmbassy is a full-stack hotel booking application built with React, TypeScript, Express, Prisma, PostgreSQL, Auth0 and Paystack

This platform allows guests to move to browse hotels, view room types, make bookings, complete payments, manage their reservations and cancel bookings.

Administrators can manage hotels, room types, pricing and publishing status through protected admin functionality.

## Tech Stack

### Frontend 
 
- React 
- TypeScript 
- Vite
- Tailwind CSS
- Shadcn/ui
- Redux Toolkit 
- Auth0
- Hugeicons
- Sonner

### Backend 

- Node.js 
- Express
- TypeScript
- Prisma
- PostgreSQL
- Neon
- Auth0
- Paystack
- Zod

## Main Features

- Browse hotels
- View hotel details
- View room types and prices
- Login/register with Auth0
- Google login
- Create bookings
- Pay using Paystack
- View bookings
- Cancel bookings

## Admin 

- Create hotels
- Edit hotels
- Add rooms
- Edit rooms
- Manage prices and quantity
- Publish or unpublish hotels
- View draft and published hotels

The application uses two roles:

```bash
USER
ADMIN
```

## Main API Endpoints

Hotels

```bash
GET /api/hotels
GET /api/hotels/:slug

POST /api/hotels
PATCH /api/hotels/:id
PATCH /api/hotels/:id/publish

GET /api/hotels/admin/all

POST /api/hotels/:id/rooms
PATCH /api/hotels/:hotelId/rooms/:roomId
```

Users 

```bash
POST /api/users/sync
GET /api/users/me
```

Bookings 

```bash
POST /api/bookings
GET /api/bookings/me
PATCH /api/bookings/:id/cancel
```

Payments 

```bash
POST /api/payments/initialize
```

Booking Flow

```bash
Browse hotel
→ Select room
→ Choose dates and guests
→ Create booking
→ Pay with Paystack
→ Verify payment
→ Booking confirmed
```

Hotel Publishing 

```bash
quantity > 0
capacity > 0
price > 0
```

## Project Structure 

```bash
Full-Stack-APP-Hotel-App
├── Client
├── Server
└── README.md
```

## Local Setup

```bash
# clone  

git clone https://github.com/NeeloByron/Full-Stack-APP-Hotel-App.git
```

## Install dependencies 

```bash
# cd CLient 
npm install 

## cd ../Server
npm install 
```

## Deployment 

Frontend:

```bash
https://full-stack-app-hotel-app-lac.vercel.app
```

Backend 
```bash
https://github.com/NeeloByron/Full-Stack-APP-Hotel-App
```

## Current Status

Core functionality completed:

- Authentication
- Hotel browsing 
- Hotel details
- Room types
- Booking system
- Paystack payments
- My bookings
- Booking cancellation
- Admin authorization
- Hotel management APIs
- Room management APIs
- Publish/unpublish system
- Neon database
- Vercel frontend deployment
- Render backend deployment 

Auther: Neelo Byron Nkhuna