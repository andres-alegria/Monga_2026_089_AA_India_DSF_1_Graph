// Editorial text for the report card. The figures are in data.js, generated from the spreadsheet.
// Keys are the spreadsheet's names (column B); `names` sets how they are displayed.
window.RC_CONTENT = {
  title: "Few takers for India’s deep-sea fishing scheme",
  deck:
    "The number of deep-sea fishing vessels built or under construction through the Pradhan Mantri Matsya Sampada " +
    "Yojana is far less than the numbers approved by the central government for each state.", // verbatim from the update

  legend: {
    boats: "Boats",
    built: "Ordered by beneficiaries (built or under construction), as of September 2026",
    idle: "Approved, not ordered",
    unknown: "Data not available",
    unit: "1 dot = 1 boat",
    funds: "Funds",
    central: "Central government share",
    state: "State government share",
    beneficiary: "Beneficiary share",
    na: "Data not available",
  },
  callout: { value: "₹12 million", label: "Approximate cost of one boat" },

  headers: {
    name: "State or union territory",
    boats: "Boats ordered vs. approved",
    funds: "Total approved amount (₹ million)",
  },
  none: "No boats approved",        // a state with zero boats approved
  unavailable: "Data not available", // a state with no figures at all
  utTag: "UT", // shown after the names of union territories

  // hover text
  tip: {
    sanctioned: "approved (2020–2025)",
    built: "ordered (built or under construction)",
    idle: "approved, not ordered", // the same wording as the legend
    awaited: "Boats ordered: data not available",
    total: "approved",
    central: "Central government",
    state: "State government",
    beneficiary: "Beneficiary",
    na: "data not available",
    ut: "not applicable (union territory)",
    million: "million",
  },

  // footer lines, each on its own line
  notes: [
    "Note: Union territories (UT) have no state government share.",
    "*Possible error in fund share for Andaman and Nicobar Islands in the source Lok Sabha document. The shares " +
      "don’t add up to the total approved amount.",
  ],
  source: "Source: RTI, Lok Sabha answers and state fisheries officials.",

  names: {
    "Andaman & Nicobar Islands": "Andaman and Nicobar Islands",
    "Daman & Diu": "Daman and Diu",
  },
  ut: ["Andaman & Nicobar Islands", "Lakshadweep", "Puducherry", "Daman & Diu"],

  // row order: most boats approved first (ties: more ordered first, then by name), then none, then no data
  order: [
    "Karnataka", "Maharashtra", "Andhra Pradesh", "Gujarat", "Tamil Nadu", "Kerala", "Goa", "Lakshadweep",
    "Puducherry", "Andaman & Nicobar Islands", "West Bengal", "Odisha", "Daman & Diu",
  ],
};
