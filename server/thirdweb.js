/**
 * Thirdweb SDK Configuration
 * 
 * This module initializes the Thirdweb SDK for Web3 operations.
 * Configure your Thirdweb account at https://thirdweb.com/
 * 
 * Required environment variables:
 * - THIRDWEB_SECRET_KEY: Your Thirdweb API secret key from dashboard
 * - THIRDWEB_CLIENT_ID: Your Thirdweb client ID from dashboard
 * - WALLET_PRIVATE_KEY: Private key for signing transactions (backend only)
 * - CHAIN_ID: Chain ID to connect to (e.g., 1 for Ethereum, 137 for Polygon)
 */

import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";

// Placeholder values that indicate unconfigured state
const PLACEHOLDER_PRIVATE_KEY = "0xYourPrivateKey";

// Initialize Thirdweb client with your credentials
export function createClient() {
  const secretKey = process.env.THIRDWEB_SECRET_KEY;
  const clientId = process.env.THIRDWEB_CLIENT_ID;
  
  if (!secretKey && !clientId) {
    console.warn("Warning: Neither THIRDWEB_SECRET_KEY nor THIRDWEB_CLIENT_ID is set. Some features may not work.");
    return null;
  }

  return createThirdwebClient({
    secretKey: secretKey,
    clientId: clientId,
  });
}

// Get account from private key for transaction signing
export function getWalletAccount(client) {
  const privateKey = process.env.WALLET_PRIVATE_KEY;
  
  if (!privateKey || privateKey === PLACEHOLDER_PRIVATE_KEY) {
    console.warn("Warning: WALLET_PRIVATE_KEY is not configured. Transaction signing will not work.");
    return null;
  }

  try {
    return privateKeyToAccount({
      client,
      privateKey: privateKey,
    });
  } catch (error) {
    console.warn("Warning: Invalid WALLET_PRIVATE_KEY format. Transaction signing will not work.");
    return null;
  }
}

// Get the configured chain
export function getChain() {
  const chainId = parseInt(process.env.CHAIN_ID || "1", 10);
  return defineChain(chainId);
}

// Get contract instance
export function getContractInstance(client, contractAddress) {
  if (!client) {
    throw new Error("Thirdweb client is not initialized");
  }

  const chain = getChain();
  
  return getContract({
    client,
    chain,
    address: contractAddress,
  });
}

// Export a convenience function to get configured Thirdweb setup
export function initializeThirdweb() {
  const client = createClient();
  const account = client ? getWalletAccount(client) : null;
  const chain = getChain();

  return {
    client,
    account,
    chain,
    getContract: (address) => client ? getContractInstance(client, address) : null,
  };
}
