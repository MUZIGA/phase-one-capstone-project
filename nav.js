
import { addFavorite } from './favorites.js';
import { fetchGoogleBooks } from '../lab3/fetch.js';

const grid = document.getElementById('book-grid');
const input = document.getElementById('search-input');
const btn = document.getElementById('search-btn');

function renderBooks(books) {
  if (!books.length) {
    grid.innerHTML = '<p class="col-span-full text-center text-gray-500">No results found.</p>';
    return;
  }
  grid.innerHTML = books.map(b => `
    <div class="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
      <img src="${b.image}" alt="${b.title}" class="w-full h-48 object-cover">
      <div class="p-4 flex-1 flex flex-col">
        <h3 class="font-bold text-lg">${b.title}</h3>
        <p class="text-gray-600 mb-3">by ${b.author}</p>
        <div class="mt-auto">
          <button class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 rounded fav-btn"
            data-id="${b.id}"
            data-title="${b.title}"
            data-author="${b.author}"
            data-image="${b.image}">+ Add to Favorites</button>
        </div>
      </div>
    </div>
  `).join('');
}

async function handleSearch() {
  const q = input.value.trim() || 'christian books';
  grid.innerHTML = '<p class="col-span-full text-center text-gray-500">Loading...</p>';
  try {
    const books = await fetchGoogleBooks(q);
    renderBooks(books);
  } catch (e) {
    grid.innerHTML = '<p class="col-span-full text-center text-red-500">Error fetching books.</p>';
  }
}

grid.addEventListener('click', (e) => {
  const btnEl = e.target.closest('.fav-btn');
  if (!btnEl) return;
  const book = {
    id: btnEl.dataset.id,
    title: btnEl.dataset.title,
    author: btnEl.dataset.author,
    image: btnEl.dataset.image
  };
  addFavorite(book);
  btnEl.textContent = '✅ Added';
  btnEl.disabled = true;
});

btn.addEventListener('click', handleSearch);
window.addEventListener('DOMContentLoaded', handleSearch);


