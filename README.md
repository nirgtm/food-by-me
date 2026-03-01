# FoodByMe - Food Delivery Application

A full-stack food delivery application built with React (frontend) and Express.js (backend).

## Features

- User authentication (signup/login with JWT)
- Browse restaurants and menu items
- Add items to cart
- Place orders with multiple payment options
- Real-time order tracking
- Responsive design

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Vite
- CSS3

### Backend
- Node.js
- Express.js
- JWT for authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd foodbyme
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

4. Configure environment variables:

Backend (.env in backend folder):
```
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Frontend (.env in root folder):
```
VITE_API_URL=http://localhost:5000
```

### Running the Application

#### Option 1: Run both servers separately

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

#### Option 2: Run both together (Unix/Mac)
```bash
npm run start:all
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID

### Orders (Protected)
- `POST /api/orders/place-order` - Place a new order
- `GET /api/orders/my-orders` - Get user's orders

## Project Structure

```
foodbyme/
├── backend/
│   ├── data/
│   │   └── restaurants.json
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── orders.js
│   │   └── restaurants.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── src/
│   ├── components/
│   ├── config/
│   │   └── api.js
│   ├── data/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── .env
└── package.json
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
