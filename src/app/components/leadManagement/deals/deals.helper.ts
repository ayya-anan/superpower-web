export const dealStatus: any = [
  {
    listId: "1",
    name: "New",
    label: "LEAD_MANAGEMENT.DEALS.NEW",
    cards: []
  },
  {
    listId: "2",
    name: "Quote-In-Progress",
    label: "LEAD_MANAGEMENT.DEALS.QUOTE_IN_PROGRESS",
    cards: []
  },
  {
    listId: "3",
    name: "Quote Review",
    label: "LEAD_MANAGEMENT.DEALS.QUOTE_REVIEW",
    cards: []
  },
  {
    listId: "4",
    name: "Offer Sent",
    label: "LEAD_MANAGEMENT.DEALS.OFFER_SENT",
    cards: []
  },
  {
    listId: "5",
    name: "Proposal In Discussion",
    label: "LEAD_MANAGEMENT.DEALS.PROPOSAL_IN_DISCUSSION",
    cards: []
  },
  {
    listId: "6",
    name: "Contract Negotiation",
    label: "LEAD_MANAGEMENT.DEALS.CONTRACT_NEGOTIATION",
    cards: []
  },
  {
    listId: "7",
    name: "Quote Accepted",
    label: "LEAD_MANAGEMENT.DEALS.QUOTE_ACCEPTED",
    cards: []
  },
  {
    listId: "8",
    name: "Deal Lost",
    label: "LEAD_MANAGEMENT.DEALS.DEAL_LOST",
    cards: []
  }
];

export const dealStatusHierarchy: any = {
  0: ["1"],
  1: ["2", "8"],
  2: ["3", "8"],
  3: ["2", "4", "8"],
  4: ["5", "6", "7", "8"],
  5: ["6", "7", "8"],
  6: ["7", "8"],
};

