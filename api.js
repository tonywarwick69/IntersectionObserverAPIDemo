// Simple API helper for the IntersectionObserver demo.
// Provides a `fetchOffers` method that returns the mock `items` list.

import items from "./mockData.js";
let totalPages = -1;
/**
 * Simulate fetching offers from an API.
 *
 * @param {{delay?: number}} [options]
 * @returns {Promise<import("./mockData.js").default>}
 */
export async function fetchOffers(options = {}) {
  const { delay = 200, page, pageSize = 20 } = options;

  // Simulate network latency.
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Return a fresh copy so consumers can mutate safely.
  const response = items.map((item) => ({ ...item, offer: { ...item.offer } }));

  // If no page is requested, preserve the existing behavior (return full list).
  if (page == null) {
    return response;
  }

  const totalItems = response.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const result = {
    page: currentPage,
    pageSize,
    totalItems,
    totalPages,
    items: response.slice(start, end),
  }
  // console.log(result);
  return result;

}
window.renderOffers = renderOffers;
export async function renderOffers(pageNumber = 1) {
  const offers = await fetchOffers({ page: pageNumber }); // returns the offers for the specified page
  console.log("Fetched offers:", offers);

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

  container.innerHTML = offers.items
    .map(
      ({ id, offer }) => `
      <article id="offer" class="offer" data-id="${id}">
        <img src="${offer.imageUrl}" alt="${offer.name}" loading="lazy" />
        <h3>${offer.name}</h3>
        <p>${offer.location} — ${offer.region}</p>
        <p>${offer.startDate} → ${offer.endDate}</p>
      </article>
      `
    )
    .join("");

  // Add the sentinel at the end of the rendered list for IntersectionObserver.
  container.appendChild(sentinel);

  // Render pagination UI (Prev / page numbers / Next).
  const pagination = document.createElement("nav");
  pagination.className = "pagination-nav";

  const pages = [];
  for (let i = 1; i <= offers.totalPages; i += 1) {
    const isActive = i === offers.page ? "active" : "";
    pages.push(
      `<li class="page-item ${isActive}">
        <a class="page-link" href="#" data-page="${i}"
         onClick="renderOffers(${i})">${i}</a>
      </li>`
    );
  }

  pagination.innerHTML = `
    <ul class="pagination" style="display: flex; justify-content: center; padding: 1rem; list-style: none; gap: 0.5rem;">
      <li class="page-item">
        <a class="page-link" href="#" onClick="renderOffers(${Math.max(1, offers.page - 1)})" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
   
          ${pages.join("")}
   
      <li class="page-item">
        <a class="page-link" href="#" onClick="renderOffers(${Math.min(offers.totalPages, offers.page + 1)})" data-page="${Math.min(offers.totalPages, offers.page + 1)}" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  `;

  container.appendChild(pagination);

  return { sentinel, pagination };
 

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
            // console.log('You have reached the bottom of the page!');
            // observer.unobserve(entry.target); // Stop observing after the first time
        }
    });
}, {
    threshold: 0, // Trigger when the target is visible
});

