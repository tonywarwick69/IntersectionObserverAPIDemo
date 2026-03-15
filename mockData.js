// Mock data for testing IntersectionObserver behavior.
// Generates 100 items with an "offer" object containing name, location, start/end dates, region, and an image URL.

const items = Array.from({ length: 100 }, (_, index) => {
  const id = index + 1;
  const start = new Date(2026, 0, 1 + index); // Jan 1, 2026 + index days
  const end = new Date(start);
  end.setDate(start.getDate() + 7); // 1 week duration

  const pad = (n) => String(n).padStart(2, "0");
  const formatDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const regions = [
    "North", "South", "East", "West", "Central", "Northeast", "Southwest", "Midwest",
  ];
  const region = regions[index % regions.length];

  return {
    id,
    offer: {
      name: `Special Offer #${id}`,
      location: `City ${((index % 20) + 1)}`,
      startDate: formatDate(start),
      endDate: formatDate(end),
      region,
      imageUrl: `https://picsum.photos/seed/offer-${id}/400/300`,
    },
  };
});

// Exporting for use by other scripts (modules) or as a global variable in a browser.
export default items;
