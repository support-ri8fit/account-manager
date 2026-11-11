// Clearly illustrative dashboard figures; replace this fixture with API data when available.
const dashboardData = {
  periodLabel: "Illustrative sample · January 2026",
  summary: [
    { title: "Avg. time to hire", value: "32 days", color: "#FB923C" },
    { title: "Avg. time to fill", value: "41 days", color: "#1D4ED8" },
    { title: "Total hiring cost", value: "₹8,22,000", color: "#059669" },
    { title: "Cost per hire", value: "₹54,800", color: "#2563EB" },
  ],
  jobs: [
    { title: "Total Jobs", value: "48", change: "+8%", positive: true, description: "vs. previous month" },
    { title: "Open Jobs", value: "18", change: "+2", positive: true, description: "vs. previous month" },
    { title: "Closed Jobs", value: "30", change: "+5", positive: true, description: "vs. previous month" },
    { title: "Shortlisted Candidates", value: "42", change: "+12%", positive: true, description: "vs. previous month" },
  ],
  recentHires: [
    { name: "Aarav Mehta", country: "India", role: "Senior Data Analyst", salary: "₹18.0 LPA", hired: "28 Jan" },
    { name: "Maya Nair", country: "UAE", role: "Product Designer", salary: "AED 16.5K/mo", hired: "24 Jan" },
    { name: "Rohan Shah", country: "Germany", role: "Backend Engineer", salary: "€72K/yr", hired: "21 Jan" },
    { name: "Ananya Rao", country: "India", role: "Clinical Programmer", salary: "₹14.4 LPA", hired: "17 Jan" },
    { name: "Daniel Weber", country: "Belgium", role: "Project Manager", salary: "€68K/yr", hired: "12 Jan" },
  ],
  experience: {
    labels: ["3–5 years", "6–10 years", "11+ years"],
    values: [18, 27, 14],
  },
  interviews: {
    total: 40,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    slots: [
      { label: "9 am", counts: [1, 1, 0, 2, 1, 0, 0] },
      { label: "10 am", counts: [2, 1, 1, 1, 2, 0, 0] },
      { label: "11 am", counts: [1, 2, 1, 1, 0, 1, 0] },
      { label: "12 pm", counts: [0, 0, 1, 0, 1, 0, 0] },
      { label: "1 pm", counts: [2, 1, 2, 1, 1, 1, 1] },
      { label: "2 pm", counts: [1, 1, 1, 1, 1, 1, 1] },
      { label: "3 pm", counts: [0, 0, 1, 0, 0, 0, 0] },
      { label: "4 pm", counts: [0, 1, 0, 1, 1, 0, 1] },
    ],
  },
  talent: {
    labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
    matched: [48, 42, 55, 51, 60, 46, 58, 64, 59, 68, 63, 72],
    hired: [12, 10, 14, 13, 16, 11, 15, 18, 16, 20, 18, 22],
  },
  hiringRisk: {
    noticePeriod: 7,
    candidateDropoffs: 5,
    delayedRequisitions: 3,
    atRiskRequisitions: 7,
    onTrackRequisitions: 41,
  },
};

export default dashboardData;
