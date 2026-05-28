export const stateOptions = [
  { value: "all", label: "South India" },
  { value: "tamilnadu", label: "Tamil Nadu" },
  { value: "kerala", label: "Kerala" },
  { value: "karnataka", label: "Karnataka" },
  { value: "andhra", label: "Andhra Pradesh" },
  { value: "telangana", label: "Telangana" },
];

export const culturalSites = [
  {
    name: "Brihadeeswarar Temple, Thanjavur",
    state: "tamilnadu",
    lat: 10.7833,
    lon: 79.1306,
  },
  { name: "Gangaikonda Cholapuram", state: "tamilnadu", lat: 11.2, lon: 79.46 },
  {
    name: "Airavatesvara Temple, Darasuram",
    state: "tamilnadu",
    lat: 10.963,
    lon: 79.3831,
  },
  {
    name: "Shore Temple, Mahabalipuram",
    state: "tamilnadu",
    lat: 12.6229,
    lon: 80.1945,
  },
  {
    name: "Meenakshi Temple, Madurai",
    state: "tamilnadu",
    lat: 9.9195,
    lon: 78.1195,
  },
  {
    name: "Chidambaram Nataraja Temple",
    state: "tamilnadu",
    lat: 11.3991,
    lon: 79.6954,
  },
  {
    name: "Srirangam Temple, Trichy",
    state: "tamilnadu",
    lat: 10.8576,
    lon: 78.6866,
  },
  {
    name: "Thirumalai Nayakkar Mahal",
    state: "tamilnadu",
    lat: 9.9126,
    lon: 78.123,
  },
  { name: "Vellore Fort", state: "tamilnadu", lat: 12.9165, lon: 79.1288 },
  { name: "Gingee Fort", state: "tamilnadu", lat: 12.2546, lon: 79.4173 },
  {
    name: "Karaikudi Chettinad Mansions",
    state: "tamilnadu",
    lat: 10.0669,
    lon: 78.7804,
  },
  {
    name: "Padmanabhapuram Palace",
    state: "tamilnadu",
    lat: 8.2507,
    lon: 77.3267,
  },

  {
    name: "Sree Padmanabhaswamy Temple, Thiruvananthapuram",
    state: "kerala",
    lat: 8.4828,
    lon: 76.9436,
  },
  {
    name: "Mattancherry Palace, Kochi",
    state: "kerala",
    lat: 9.9585,
    lon: 76.2594,
  },
  {
    name: "Jewish Synagogue, Kochi",
    state: "kerala",
    lat: 9.9576,
    lon: 76.2592,
  },
  {
    name: "Bekal Fort, Kasaragod",
    state: "kerala",
    lat: 12.3939,
    lon: 75.0329,
  },
  {
    name: "Vadakkunnathan Temple, Thrissur",
    state: "kerala",
    lat: 10.5246,
    lon: 76.2144,
  },
  {
    name: "Edakkal Caves, Wayanad",
    state: "kerala",
    lat: 11.6258,
    lon: 76.2359,
  },

  {
    name: "Hampi Group of Monuments",
    state: "karnataka",
    lat: 15.335,
    lon: 76.46,
  },
  { name: "Mysore Palace", state: "karnataka", lat: 12.3052, lon: 76.6552 },
  {
    name: "Belur Chennakeshava Temple",
    state: "karnataka",
    lat: 13.1623,
    lon: 75.8679,
  },
  {
    name: "Halebidu Hoysaleswara Temple",
    state: "karnataka",
    lat: 13.212,
    lon: 75.9944,
  },
  {
    name: "Gol Gumbaz, Vijayapura",
    state: "karnataka",
    lat: 16.8302,
    lon: 75.7368,
  },
  {
    name: "Badami Cave Temples",
    state: "karnataka",
    lat: 15.9186,
    lon: 75.6761,
  },
  {
    name: "Pattadakal Group of Monuments",
    state: "karnataka",
    lat: 15.9487,
    lon: 75.816,
  },

  {
    name: "Lepakshi Veerabhadra Temple",
    state: "andhra",
    lat: 13.8041,
    lon: 77.607,
  },
  { name: "Amaravati Stupa", state: "andhra", lat: 16.5726, lon: 80.3575 },
  { name: "Undavalli Caves", state: "andhra", lat: 16.4969, lon: 80.58 },
  {
    name: "Simhachalam Temple, Visakhapatnam",
    state: "andhra",
    lat: 17.7668,
    lon: 83.2507,
  },
  { name: "Gandikota Fort", state: "andhra", lat: 14.814, lon: 78.2847 },
  {
    name: "Tirumala Venkateswara Temple",
    state: "andhra",
    lat: 13.6833,
    lon: 79.347,
  },

  {
    name: "Charminar, Hyderabad",
    state: "telangana",
    lat: 17.3616,
    lon: 78.4747,
  },
  {
    name: "Golconda Fort, Hyderabad",
    state: "telangana",
    lat: 17.3833,
    lon: 78.4011,
  },
  {
    name: "Ramappa Temple, Palampet",
    state: "telangana",
    lat: 18.2593,
    lon: 79.9439,
  },
  {
    name: "Thousand Pillar Temple, Hanamkonda",
    state: "telangana",
    lat: 18.0037,
    lon: 79.5748,
  },
  {
    name: "Qutb Shahi Tombs, Hyderabad",
    state: "telangana",
    lat: 17.395,
    lon: 78.3968,
  },
  { name: "Bhongir Fort", state: "telangana", lat: 17.5153, lon: 78.8856 },
];

export const filterSitesByState = (state) =>
  state === "all"
    ? culturalSites
    : culturalSites.filter((site) => site.state === state);

export const getStateLabel = (state) =>
  stateOptions.find((option) => option.value === state)?.label || "South India";

export const getDistanceKm = (a, b) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const radius = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * radius * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

export const getNearbySites = (origin, sites, radiusKm = 150) =>
  sites
    .map((site) => ({ ...site, distanceKm: getDistanceKm(origin, site) }))
    .filter((site) => site.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

export const getTrafficLocationsForSite = (site) => [
  { name: site.name, lat: site.lat, lon: site.lon },
  { name: "Approach Road", lat: site.lat + 0.01, lon: site.lon + 0.01 },
  { name: "Town Center", lat: site.lat - 0.01, lon: site.lon - 0.01 },
];
