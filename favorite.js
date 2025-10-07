
const STORAGE_KEY = 'favoriteBooks';

export function getFavorites() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function addFavorite(book) {
  const favorites = getFavorites();
  if (!favorites.some(fav => fav.id === book.id)) {
    favorites.push(book);
    saveFavorites(favorites);
    emitFavoritesChanged();
  }
}

export function removeFavorite(bookId) {
  const favorites = getFavorites().filter(fav => fav.id !== bookId);
  saveFavorites(favorites);
  emitFavoritesChanged();
}

function emitFavoritesChanged() {
  try {
    const event = new CustomEvent('favorites:changed', { detail: getFavorites() });
    window.dispatchEvent(event);
  } catch (_) {
    
  }
}

export function renderFavorites(containerOrSelector) {
  const container =
    typeof containerOrSelector === 'string'
      ? document.querySelector(containerOrSelector)
      : containerOrSelector;
  if (!container) return;

  const favorites = getFavorites();
  if (favorites.length === 0) {
    container.innerHTML = '<p class="text-gray-500">No favorites yet.</p>';
    return;
  }

  container.innerHTML = favorites
    .map(
      (b) => `
      <div class="bg-white shadow rounded p-3 flex items-center justify-between mb-2">
        <div class="flex items-center gap-3">
          <img src="${b.image || 'book.jpeg'}" alt="${b.title}" class="w-12 h-12 object-cover rounded">
          <div>
            <div class="font-semibold">${b.title}</div>
            <div class="text-sm text-gray-600">${b.author}</div>
          </div>
        </div>
        <button class="remove-fav px-2 py-1 text-sm bg-red-600 text-white rounded" data-id="${b.id}">Remove</button>
      </div>`
    )
    .join('');

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.remove-fav');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    removeFavorite(id);
    renderFavorites(container);
  }, { once: true });
}
export function onFavoritesChanged(callback) {
  window.addEventListener('favorites:changed', (e) => callback(e.detail));
}

try {
  window.addEventListener('DOMContentLoaded', () => {
    const defaultContainer = document.getElementById('favorites-list');
    if (!defaultContainer) return;
    renderFavorites(defaultContainer);
    onFavoritesChanged(() => renderFavorites(defaultContainer));
  });
} catch (_) {
  
}
