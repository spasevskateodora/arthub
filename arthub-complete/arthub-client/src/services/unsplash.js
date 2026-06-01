const ACCESS_KEY = "qOeI50relVeqJF7xJMBvAgLsJPS6pdb-P2g7Y7QS2uo";

async function getDecor() {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=home%20decor&per_page=6&client_id=${ACCESS_KEY}`
  );

  const data = await res.json();
  return data.results;
}

export { getDecor };