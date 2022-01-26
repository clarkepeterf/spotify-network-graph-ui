const apiUrl = 'https://www.peterclarke.org/spotify-network-graph-api';

async function httpGet(url) {
  const response = await fetch(encodeURI(url));
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const result = await response.json();
  return result;
}

async function getSpotifySuggestions(searchString) {
  const suggestions = await httpGet(`${apiUrl}/search?q=${searchString}`);
  return suggestions;
}
export { getSpotifySuggestions };

async function getArtistById(id) {
  const artist = await httpGet(`${apiUrl}/artist/${id}`);
  return artist;
}
export { getArtistById };

async function getArtistByName(name) {
  const artist = await httpGet(`${apiUrl}/artist?name=${name}`);
  return artist;
}

export { getArtistByName };

async function getRelatedArtists(id) {
  const relatedArtists = await httpGet(`${apiUrl}/related/${id}`);
  return relatedArtists;
}

export { getRelatedArtists };
