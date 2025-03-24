# EventGo - Blockchain NFT Ticketing Platform

EventGo is a modern full-stack blockchain-based NFT ticketing platform that provides secure and transparent ticket sales, verification, and transfers for events of all sizes. The platform includes QR code-based ticket validation and blockchain-backed ownership verification.

## Features

- **User Authentication**: Secure signup and login system with role-based access control
- **Event Management**: Create, edit, and manage events with multiple ticket types
- **NFT Tickets**: Mint tickets as NFTs on the blockchain for verifiable ownership
- **QR Code Integration**: Each ticket includes a unique QR code for efficient verification
- **Secure Transfers**: Transfer tickets to other users with blockchain verification
- **Responsive UI**: Modern, mobile-friendly user interface

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Web3.js for blockchain integration
- QR Code generation

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Styled Components for styling
- Web3.js & Ethers.js for blockchain interaction
- Framer Motion for animations

### Blockchain
- Ethereum Smart Contracts (Solidity)
- ERC-721 NFT standard for ticket tokens
- OpenZeppelin for secure contract implementation

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Ethereum development environment (Ganache, Truffle, etc.)
- MetaMask or similar Web3 wallet for testing

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/eventgo.git
   cd eventgo
   ```

2. Install all dependencies:
   ```
   npm run install-all
   ```

3. Set up environment variables:
   - Create `.env` file in the backend directory based on `.env.example`
   - Set your MongoDB connection string, JWT secret, and Ethereum provider URL

4. Start the development server:
   ```
   npm run dev
   ```

### Docker Deployment

1. Make sure you have Docker and Docker Compose installed.

2. Build and run the application using Docker Compose:
   ```
   docker-compose up -d
   ```

3. The application will be available at http://localhost:5000

4. To stop the containers:
   ```
   docker-compose down
   ```

5. To rebuild the application after changes:
   ```
   docker-compose up -d --build
   ```

### Smart Contract Deployment

1. Install Truffle globally:
   ```
   npm install -g truffle
   ```

2. Navigate to the contracts directory and compile:
   ```
   cd backend/contracts
   truffle compile
   ```

3. Deploy to your local blockchain:
   ```
   truffle migrate --network development
   ```

## Project Structure

```
eventgo/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── contracts/
│   ├── utils/
│   ├── .env
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── contracts/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Tickets
- `POST /api/tickets/purchase` - Purchase a ticket
- `GET /api/tickets/my-tickets` - Get current user's tickets
- `GET /api/tickets/:id` - Get ticket by ID
- `PUT /api/tickets/:id/verify` - Verify a ticket
- `PUT /api/tickets/:id/transfer` - Transfer ticket to another user

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenZeppelin for providing secure smart contract implementations
- React community for their excellent documentation
- MongoDB and Node.js communities for their support 