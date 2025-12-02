/**
 * SSA Transistor DAO Demo Server
 * 
 * REST API bridging Web2 and Web3 (Thirdweb) for DAO operations.
 * 
 * Setup:
 * 1. Create a Thirdweb account at https://thirdweb.com/
 * 2. Get your API keys from the Thirdweb dashboard
 * 3. Configure .env with your credentials
 * 4. Run: npm install && npm start
 */

import express from "express";
import dotenv from "dotenv";
import { addProposal, getProposals } from "./store.js";
import { initializeThirdweb } from "./thirdweb.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get directory name for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from project root
dotenv.config({ path: join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Initialize Thirdweb
let thirdweb = null;
try {
  thirdweb = initializeThirdweb();
  if (thirdweb.client) {
    console.log("✅ Thirdweb SDK initialized successfully");
    console.log(`   Chain ID: ${process.env.CHAIN_ID || 1}`);
  } else {
    console.log("⚠️  Thirdweb SDK not fully configured - running in limited mode");
  }
} catch (error) {
  console.error("❌ Failed to initialize Thirdweb:", error.message);
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    thirdweb: thirdweb?.client ? "connected" : "not configured",
    chainId: process.env.CHAIN_ID || "1",
  });
});

// Get Thirdweb configuration status
app.get("/api/config", (req, res) => {
  res.json({
    thirdwebConfigured: !!thirdweb?.client,
    chainId: process.env.CHAIN_ID || "1",
    contractAddress: process.env.CONTRACT_ADDRESS || null,
    hasWallet: !!thirdweb?.account,
  });
});

// Create a new proposal
app.post("/api/proposals", async (req, res) => {
  try {
    const { title, content, on_chain, proposer } = req.body;

    if (!title || !proposer) {
      return res.status(400).json({ 
        error: "Missing required fields: title and proposer are required" 
      });
    }

    const proposal = {
      id: Date.now().toString(),
      title,
      content: content || "",
      on_chain: Boolean(on_chain),
      proposer,
      created_at: new Date().toISOString(),
      tx_hash: null,
    };

    // If on-chain proposal and Thirdweb is configured
    if (on_chain && thirdweb?.client && process.env.CONTRACT_ADDRESS) {
      try {
        const contract = thirdweb.getContract(process.env.CONTRACT_ADDRESS);
        if (contract && thirdweb.account) {
          // Note: This is a placeholder for actual contract interaction
          // Replace with your contract's specific method call
          console.log(`📝 Would create on-chain proposal: ${title}`);
          console.log(`   Contract: ${process.env.CONTRACT_ADDRESS}`);
          proposal.tx_hash = "pending_implementation";
        }
      } catch (contractError) {
        console.error("Contract interaction error:", contractError.message);
      }
    }

    // Store proposal in memory
    addProposal(proposal);

    // Webhook notification (if configured)
    if (process.env.WEBHOOK_URL) {
      try {
        await fetch(process.env.WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: "proposal_created", data: proposal }),
        });
      } catch (webhookError) {
        console.warn("Webhook notification failed:", webhookError.message);
      }
    }

    res.status(201).json({
      success: true,
      proposal,
    });
  } catch (error) {
    console.error("Error creating proposal:", error);
    res.status(500).json({ error: "Failed to create proposal" });
  }
});

// Get all proposals
app.get("/api/proposals", (req, res) => {
  res.json({
    proposals: getProposals(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 SSA Transistor DAO Server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Config: http://localhost:${PORT}/api/config`);
  console.log(`   Proposals: http://localhost:${PORT}/api/proposals\n`);
});
