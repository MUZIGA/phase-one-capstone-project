
export async function fetchGoogleBooks(query) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  const data = await res.json();
  const items = Array.isArray(data.items) ? data.items : [];
  return items.map((item) => {
    const info = item && item.volumeInfo ? item.volumeInfo : {};
    const imageLinks = info.imageLinks || {};
    const image = imageLinks.thumbnail || imageLinks.smallThumbnail || 'book.jpeg';
    return {
      id: item.id,
      title: info.title || 'Untitled',
      author: Array.isArray(info.authors) && info.authors.length > 0 ? info.authors[0] : 'Unknown Author',
      image
    };
  });
}
