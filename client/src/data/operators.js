 const AIRTEL_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='25' fill='%23ED1C24'/><text x='50' y='68' font-family='Arial,sans-serif' font-size='65' font-weight='900' fill='white' text-anchor='middle'>a</text></svg>`;
 const JIO_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='25' fill='%230066CC'/><text x='50' y='62' font-family='Arial,sans-serif' font-size='38' font-weight='900' fill='white' text-anchor='middle'>Jio</text></svg>`;
 const VI_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='25' fill='%23E11D48'/><text x='42' y='65' font-family='Arial,sans-serif' font-size='55' font-weight='900' fill='white' text-anchor='middle'>V</text><text x='72' y='65' font-family='Arial,sans-serif' font-size='35' font-weight='900' fill='%23FBBF24' text-anchor='middle'>!</text></svg>`;
 const BSNL_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='25' fill='%23005CAF'/><text x='50' y='62' font-family='Arial,sans-serif' font-size='32' font-weight='900' fill='white' text-anchor='middle'>BSNL</text></svg>`;

export const mobileOperators = [
  {
    id: "airtel",
    name: "Airtel",
    logo: AIRTEL_LOGO,
    tagline: "5G Ready",
    colorClass: "hover:bg-[#ED1C24] hover:border-[#ED1C24]",
    activeClass: "bg-[#ED1C24] border-[#ED1C24]",
  },
  {
    id: "jio",
    name: "Jio",
    logo: JIO_LOGO,
    tagline: "True 5G",
    colorClass: "hover:bg-[#0066CC] hover:border-[#0066CC]",
    activeClass: "bg-[#0066CC] border-[#0066CC]",
  },
  {
    id: "vi",
    name: "Vi",
    logo: VI_LOGO,
    tagline: "Best Value",
    colorClass: "hover:bg-[#E11D48] hover:border-[#E11D48]",
    activeClass: "bg-[#E11D48] border-[#E11D48]",
  },
  {
    id: "bsnl",
    name: "BSNL",
    logo: BSNL_LOGO,
    tagline: "Pan-India",
    colorClass: "hover:bg-[#FF6600] hover:border-[#FF6600]",
    activeClass: "bg-[#FF6600] border-[#FF6600]",
  },
];

export const dthOperators = [
  {
    id: "tataplay",
    name: "Tata Play",
    logo: "TP",
    tagline: "HD Quality",
    colorClass: "hover:bg-[#E30A5C] hover:border-[#E30A5C]",
    activeClass: "bg-[#E30A5C] border-[#E30A5C]",
  },
  {
    id: "airteldth",
    name: "Airtel DTH",
    logo: "AT",
    tagline: "HD Quality",
    colorClass: "hover:bg-[#ED1C24] hover:border-[#ED1C24]",
    activeClass: "bg-[#ED1C24] border-[#ED1C24]",
  },
  {
    id: "dishtv",
    name: "Dish TV",
    logo: "DT",
    tagline: "Best Value",
    colorClass: "hover:bg-[#E2231A] hover:border-[#E2231A]",
    activeClass: "bg-[#E2231A] border-[#E2231A]",
  },
  {
    id: "d2h",
    name: "d2h",
    logo: "D2",
    tagline: "Popular",
    colorClass: "hover:bg-[#8CC63F] hover:border-[#8CC63F]",
    activeClass: "bg-[#8CC63F] border-[#8CC63F]",
  },
];

export const datacardOperators = [
  {
    id: "jiofi",
    name: "JioFi",
    logo: "JF",
    tagline: "High Speed",
    colorClass: "hover:bg-[#0066CC] hover:border-[#0066CC]",
    activeClass: "bg-[#0066CC] border-[#0066CC]",
  },
  {
    id: "airtel4g",
    name: "Airtel 4G",
    logo: "A4",
    tagline: "Pan-India",
    colorClass: "hover:bg-[#ED1C24] hover:border-[#ED1C24]",
    activeClass: "bg-[#ED1C24] border-[#ED1C24]",
  },
  {
    id: "vi_dongle",
    name: "Vi Dongle",
    logo: "VI",
    tagline: "Best Value",
    colorClass: "hover:bg-[#E11D48] hover:border-[#E11D48]",
    activeClass: "bg-[#E11D48] border-[#E11D48]",
  },
  {
    id: "bsnl_evdo",
    name: "BSNL",
    logo: "BS",
    tagline: "Wide Coverage",
    colorClass: "hover:bg-[#FF6600] hover:border-[#FF6600]",
    activeClass: "bg-[#FF6600] border-[#FF6600]",
  },
];

