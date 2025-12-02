# Simple SSA Transistor DAO Demo

A minimal working demo of the SSA transistor pattern bridging Web2 API and Web3 using [Thirdweb](https://thirdweb.com/) for DAOs.

---

## Features

- REST API to create proposals (off-chain or on-chain)
- SSA transistor logic: auth, checks, on-chain trigger
- **Thirdweb SDK v5 integration** for smart contract actions
- Webhook/events for proposal creation

---

## Thirdweb Configuration

This project uses Thirdweb basic account for Web3 integration.

### 1. Create a Thirdweb Account

1. Go to [https://thirdweb.com/](https://thirdweb.com/)
2. Sign up for a free account
3. Navigate to **Settings > API Keys**
4. Create a new API key and copy the **Secret Key**

### 2. Configure Environment Variables

Update the `.env` file with your Thirdweb credentials:

```bash
# Get your secret key from: https://thirdweb.com/create-api-key
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key_here

# Chain configuration (e.g., Polygon Mumbai testnet)
CHAIN_ID=80001
RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your-api-key

# Your DAO contract address
CONTRACT_ADDRESS=0xYourDAOContractAddress

# Admin wallet private key (for signing transactions)
ADMIN_PK=0xYourPrivateKey
```

---

## Requirements

- **Node.js 18+** (required for native fetch support)

---

## Quickstart

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd transistor/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your `.env` file with Thirdweb credentials (see above)

4. Start the server:
   ```bash
   npm start
   ```

5. Test the API:
   ```bash
   # Health check
   curl http://localhost:4000/api/health

   # Create a proposal
   curl -X POST http://localhost:4000/api/proposals \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","content":"Hello","on_chain":true,"proposer":"0xUserAddress"}'
   ```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check and configuration status |
| GET | `/api/proposals` | List all proposals |
| POST | `/api/proposals` | Create a new proposal |

---

## Next Steps

- Add a React frontend in `/client`
- Expand SSA logic (real auth, security checks)
- Swap in persistent DB for production
- Extend contract calls for voting, bounties, etc.
- Deploy your DAO contract via [Thirdweb Dashboard](https://thirdweb.com/dashboard)
