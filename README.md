# Simple SSA Transistor DAO Demo

A minimal working demo of the SSA transistor pattern bridging Web2 API and Web3 using [Thirdweb](https://thirdweb.com/) for DAOs.

---

## Features

- REST API to create proposals (off-chain or on-chain)
- SSA transistor logic: auth, checks, on-chain trigger
- [Thirdweb SDK](https://portal.thirdweb.com/) integration for smart contract actions
- Webhook/events for proposal creation

---

## Thirdweb Account Setup

Before running the server, you need to create a Thirdweb account and get your API credentials:

1. **Create a Thirdweb Account**
   - Go to [thirdweb.com](https://thirdweb.com/)
   - Click "Get Started" and sign up using your wallet, email, or social login
   - Verify your email if required

2. **Create an API Key**
   - Navigate to your [Thirdweb Dashboard](https://thirdweb.com/dashboard)
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Give it a name (e.g., "transistor-dao")
   - Choose allowed domains (use "*" for development, restrict for production)
   - Copy your **Client ID** and **Secret Key**

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env` in the project root:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your Thirdweb credentials:
     ```
     THIRDWEB_CLIENT_ID=your_client_id_here
     THIRDWEB_SECRET_KEY=your_secret_key_here
     ```

4. **Set Up Your Wallet** (for transaction signing)
   - Export your wallet's private key
   - Add it to `.env`:
     ```
     WALLET_PRIVATE_KEY=0xYourPrivateKey
     ```
   - ⚠️ **Never commit your `.env` file with real credentials!**

---

## Quickstart

1. Clone the repository:
   ```bash
   git clone https://github.com/pinkycollie/transistor.git
   cd transistor
   ```

2. Configure your `.env` file with Thirdweb credentials (see above)

3. Install dependencies and start the server:
   ```bash
   cd server
   npm install
   npm start
   ```

4. Test the API:
   ```bash
   # Check health
   curl http://localhost:4000/health

   # Check Thirdweb configuration
   curl http://localhost:4000/api/config

   # Create a proposal
   curl -X POST http://localhost:4000/api/proposals \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","content":"Hello","on_chain":true,"proposer":"0xUserAddress"}'

   # Get all proposals
   curl http://localhost:4000/api/proposals
   ```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check with Thirdweb status |
| GET | `/api/config` | Get current configuration status |
| POST | `/api/proposals` | Create a new proposal |
| GET | `/api/proposals` | Get all proposals |

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `THIRDWEB_CLIENT_ID` | Thirdweb API client ID | Yes |
| `THIRDWEB_SECRET_KEY` | Thirdweb API secret key | Yes |
| `WALLET_PRIVATE_KEY` | Wallet private key for signing | For on-chain |
| `CHAIN_ID` | Blockchain chain ID (default: 11155111 Sepolia) | No |
| `CONTRACT_ADDRESS` | DAO smart contract address | For on-chain |
| `WEBHOOK_URL` | Webhook URL for notifications | No |
| `PORT` | Server port (default: 4000) | No |

---

## Next Steps

- Add a React frontend in `/client`
- Expand SSA logic (real auth, security checks)
- Swap in persistent DB for production
- Extend contract calls for voting, bounties, etc.
- Deploy to production with proper security configuration

---

## Resources

- [Thirdweb Documentation](https://portal.thirdweb.com/)
- [Thirdweb SDK Reference](https://portal.thirdweb.com/typescript/v5)
- [Thirdweb Dashboard](https://thirdweb.com/dashboard)
