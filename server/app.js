/**
 * SSA Transistor DAO Demo - Main Server Application
 * Configured with Thirdweb basic account
 * 
 * @see https://thirdweb.com/
 */

require("dotenv").config({ path: "../.env" });
const express = require("express");
const { createThirdwebClient, getContract } = require("thirdweb");
const { defineChain } = require("thirdweb/chains");
const { privateKeyToAccount } = require("thirdweb/wallets");
const { addProposal, getProposals } = require("./proposals");

const app = express();
app.use(express.json());

// Thirdweb client configuration
const thirdwebClient = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

// Define chain (default to Polygon testnet)
const chain = defineChain({
  id: parseInt(process.env.CHAIN_ID || "80001"),
  rpc: process.env.RPC_URL,
});

// Initialize admin account from private key (for on-chain transactions)
let adminAccount = null;
if (process.env.ADMIN_PK && process.env.ADMIN_PK.startsWith("0x") && process.env.ADMIN_PK.length === 66) {
  try {
    adminAccount = privateKeyToAccount({
      client: thirdwebClient,
      privateKey: process.env.ADMIN_PK,
    });
  } catch (error) {
    console.warn("Warning: Invalid ADMIN_PK format, on-chain transactions disabled");
  }
}

/**
 * Get contract instance
 * @param {string} address - Contract address
 * @returns {object} Contract instance
 */
function getContractInstance(address) {
  return getContract({
    client: thirdwebClient,
    chain: chain,
    address: address || process.env.CONTRACT_ADDRESS,
  });
}

// REST API Routes

/**
 * GET /api/proposals
 * Retrieve all proposals
 */
app.get("/api/proposals", (req, res) => {
  const proposals = getProposals();
  res.json({ success: true, proposals });
});

/**
 * POST /api/proposals
 * Create a new proposal (off-chain or on-chain)
 * 
 * Body:
 * - title: string
 * - content: string
 * - on_chain: boolean (optional)
 * - proposer: string (wallet address)
 */
app.post("/api/proposals", async (req, res) => {
  try {
    const { title, content, on_chain, proposer } = req.body;

    if (!title || !content || !proposer) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: title, content, proposer",
      });
    }

    const proposal = {
      id: Date.now().toString(),
      title,
      content,
      proposer,
      on_chain: on_chain || false,
      created_at: new Date().toISOString(),
      tx_hash: null,
    };

    // If on-chain, trigger smart contract transaction
    if (on_chain && process.env.CONTRACT_ADDRESS && adminAccount) {
      console.log("Creating on-chain proposal via Thirdweb...");
      try {
        const contract = getContractInstance();
        // Note: Actual contract call depends on your DAO contract ABI
        // This is a placeholder for the contract interaction
        console.log(`Would create proposal on contract: ${process.env.CONTRACT_ADDRESS}`);
        proposal.on_chain_status = "pending";
      } catch (contractError) {
        console.error("Contract interaction error:", contractError.message);
        proposal.on_chain_status = "failed";
        proposal.on_chain_error = contractError.message;
      }
    }

    // Store proposal in memory
    addProposal(proposal);

    // Trigger webhook if configured
    if (process.env.WEBHOOK_URL) {
      try {
        fetch(process.env.WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: "proposal_created", proposal }),
        }).catch(console.error);
      } catch (webhookError) {
        console.error("Webhook error:", webhookError.message);
      }
    }

    console.log("Proposal created:", proposal);
    res.status(201).json({ success: true, proposal });
  } catch (error) {
    console.error("Error creating proposal:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    thirdweb_configured: !!process.env.THIRDWEB_SECRET_KEY,
    contract_configured: !!process.env.CONTRACT_ADDRESS,
    admin_configured: !!adminAccount,
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n🚀 SSA Transistor DAO Demo running on port ${PORT}`);
  console.log(`📡 Thirdweb configured: ${!!process.env.THIRDWEB_SECRET_KEY}`);
  console.log(`📝 Contract address: ${process.env.CONTRACT_ADDRESS || "Not configured"}`);
  console.log(`\nAPI Endpoints:`);
  console.log(`  GET  /api/health     - Health check`);
  console.log(`  GET  /api/proposals  - List all proposals`);
  console.log(`  POST /api/proposals  - Create a new proposal`);
});
