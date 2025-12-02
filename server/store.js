// In-memory store for proposals (MVP)
const proposals = [];

export function addProposal(p) {
  proposals.push(p);
}

export function getProposals() {
  return proposals;
}
