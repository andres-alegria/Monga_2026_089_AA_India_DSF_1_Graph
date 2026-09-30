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
    boats: "Boats approved, 2020–2025",
    funds: "Total approved amount (₹ million)",
    info: "More info",
  },
  none: "No boats approved",        // a state with zero boats approved
  unavailable: "Data not available", // a state with no figures at all
  utTag: "UT", // shown after the names of union territories

  // hover text
  tip: {
    sanctioned: "approved, 2020–2025",
    built: "ordered (built or under construction)",
    idle: "not ordered",
    awaited: "Boats ordered: data not available",
    total: "approved",
    central: "Central government",
    state: "State government",
    beneficiary: "Beneficiary",
    na: "data not available",
    ut: "not applicable (union territory)",
    unaccounted: "Not broken down", // when the three shares don't add up to the total
    million: "million",
  },

  // footer lines, each on its own line
  notes: [
    "Note: Union territories (UT) have no state government share.",
    "* Andaman and Nicobar Islands: possibly an error in the source Lok Sabha document, since the sum doesn’t match " +
      "the total figure.",
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

  // the reporter's notes (column K of the original sheet; the 30 Sep update has none), edited;
  // a state without a note gets no info button
  reasons: {
    "Karnataka":
      "Fewer boats have been ordered than the centre approved. Fishers are reluctant to apply because the boats " +
      "are not designed for their needs and are priced too high.",
    "Maharashtra":
      "Fewer boats have been ordered than the centre approved. Fishers are reluctant to apply because the boats " +
      "are not designed for their needs and are priced too high.",
    "Andhra Pradesh":
      "State officials say fishers are reluctant to apply because the boats are not designed for their needs and " +
      "loans are hard to get. Market and processing facilities are also lacking.",
    "Gujarat":
      "No one applied, the head of the state’s largest fisheries cooperative says, because deep-sea boats got no " +
      "diesel VAT refunds until June 2026. Now, he says, 30 members will apply.",
    "Kerala":
      "The six fishers who got boats are suffering: they cannot use them profitably and are steeped in debt. " +
      "They blame a bad boat design and defects.",
    "Lakshadweep":
      "Nine under construction so far. The scheme started late in 2025 because they needed a standard " +
      "government-approved design for pole-and-line boats, which they were not getting.",
    "Puducherry": "", // the update gives no order figures ("Data not available"), so the old note is gone
    "Andaman & Nicobar Islands":
      "Only three boats, all still under construction. No money has been spent on any tuna-related infrastructure.",
    "Goa":
      "State officials said boat owners did not want to do longlining or gillnetting. They prefer purse seining, " +
      "and those boat designs were not available.",
    "Odisha":
      "A 2024 state fisheries document said fishers wanted existing vessels modified, not new steel boats. It said " +
      "the design was for 21-day trips, but tuna grounds are about 15–16 days away.",
    "Tamil Nadu": "Not one fisher came forward to apply. Construction costs are too high.",
    "West Bengal":
      "The state neither approved nor applied: its former Trinamool Congress government, at odds with the " +
      "BJP-led centre, refused all central schemes.",
    "Daman & Diu": "",
  },
};
