# Simple SSA Transistor DAO Demo

A minimal working demo of the SSA transistor pattern bridging Web2 API and Web3 (Thirdweb) for DAOs.

---

## Features

- REST API to create proposals (off-chain or on-chain)
- SSA transistor logic: auth, checks, on-chain trigger
- Thirdweb SDK integration for smart contract actions
- Webhook/events for proposal creation

---

## Quickstart

1. `git clone ... && cd simple-ssa-demo/server`
2. Set up `.env` with your contract, private key, and RPC.
3. `npm install`
4. `node app.js`
5. `curl -X POST http://localhost:4000/api/proposals -H "Content-Type: application/json" -d '{"title":"Test","content":"Hello","on_chain":true,"proposer":"0xUserAddress"}'`
6. Watch console for result and webhook events.

---

## Next Steps

- Add a React frontend in `/client`
- Expand SSA logic (real auth, security checks)
- Swap in persistent DB for production
- Extend contract calls for voting, bounties, etc.
