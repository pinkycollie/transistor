// In-memory store for proposals (MVP)
const proposals = [];

function addProposal(p) {
  proposals.push(p);
}
function getProposals() {
  return proposals;
}

module.exports = { addProposal, getProposals };
