// Language-neutral clinic settings. This file is plain data (no Vite imports),
// so the backend seed script can import it too.
//
// NOTE: Nuvela is a fictional clinic created for a portfolio demo.
// Replace every value below with the real clinic's details before going live.

// Studio that designed and built the website (shown in the footer credit).
export const STUDIO = {
  name: "Renix.dev",
  url: "https://renix.dev/en",
  linkedin: "https://www.linkedin.com/company/renix-dev/",
};

export const SITE = {
  name: "Nuvela Hair Clinic",
  shortName: "Nuvela",
  legalName: "Nuvela Saç Ekim Kliniği (Demo)",
  city: "Istanbul",
  country: "TR",
  phone: "+90 212 000 00 00",
  phoneHref: "tel:+902120000000",
  whatsapp: "902120000000",
  whatsappDisplay: "+90 212 000 00 00",
  email: "hello@nuvela-clinic.example",
  address: {
    street: "Teşvikiye Mah. Valikonağı Cad. No: 00",
    district: "Şişli",
    postalCode: "34365",
    city: "İstanbul",
    country: "Türkiye",
  },
  geo: { lat: 41.0506, lng: 28.9931 },
  mapEmbedUrl:
    "https://www.openstreetmap.org/export/embed.html?bbox=28.9851%2C41.0458%2C29.0011%2C41.0554&layer=mapnik&marker=41.0506%2C28.9931",
  mapLinkUrl: "https://www.openstreetmap.org/?mlat=41.0506&mlon=28.9931#map=16/41.0506/28.9931",
  hours: [
    { days: "mon-sat", open: "09:00", close: "19:00" },
    { days: "sun", open: null, close: null },
  ],
  socials: {
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
    facebook: "https://facebook.com/",
  },
  stats: {
    procedures: 12000,
    countries: 60,
    rating: 4.9,
    reviews: 2400,
    years: 14,
  },
  airports: ["IST", "SAW"],
  currency: "EUR",
};
