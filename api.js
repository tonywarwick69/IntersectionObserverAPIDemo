// Simple API helper for the IntersectionObserver demo.
// Provides a `fetchOffers` method that returns the mock `items` list.

import items from "./mockData.js";

/**
 * Simulate fetching offers from an API.
 *
 * @param {{delay?: number}} [options]
 * @returns {Promise<import("./mockData.js").default>}
 */
export async function fetchOffers(options = {}) {
  const { delay = 200 } = options;

  // Simulate network latency.
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Return a fresh copy so consumers can mutate safely.
  let response = items.map((item) => ({ ...item, offer: { ...item.offer } }));
//   console.log("Fetched offers:", response);
  return response;
}

export async function renderOffers() {
  const offers = await fetchOffers(); // returns the 100 mock items

  const container = document.getElementById("offers");
  if (!container) {
    console.warn("renderOffers: #offers container not found");
    return null;
  }
//   const article = document.getElementById("offer");
//   if (!article) {
//     console.warn("renderOffers: #offer article not found");
//     return null;
//   }

  // Add a single sentinel at the end of the rendered list for IntersectionObserver.
    const sentinel = document.createElement("div");
    sentinel.id = "bottom-observer";
    sentinel.className = "bottom-observer";
    sentinel.style.height = "50px"; // Minimal height to be observed
    sentinel.style.width = "100%";
    sentinel.style.backgroundColor = "red"; 

  container.innerHTML = offers
    .map(
      ({ id, offer }) => `
      <article id="offer" class="offer" data-id="${id}">
        <img src="${offer.imageUrl}" alt="${offer.name}" loading="lazy" />
        <h3>${offer.name}</h3>
        <p>${offer.location} — ${offer.region}</p>
        <p>${offer.startDate} → ${offer.endDate}</p>
      </article>
      ${sentinel.outerHTML} <!-- Add the sentinel after each offer for testing -->
      `
    )
    .join("");

// Invisible but still observable
  //article.appendChild(sentinel)
//   offers.forEach((offer) => {
//     if(offer){
//         article.appendChild(sentinel);
//     }
    
//   });

//   return sentinel;
}



export const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            console.log('You have reached the bottom of the page!');
            // observer.unobserve(entry.target); // Stop observing after the first time
        }
    });
}, {
    threshold: 0, // Trigger when the target is visible
});

