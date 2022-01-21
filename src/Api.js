const ec2Url = 'https://www.peterclarke.org/spotify-network-graph-api';

const simpleGet = async (url) => {
  const response = await fetch(encodeURI(url));
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const result = await response.json();
  return result;
}

const getSpotifySuggestions = async (searchString) => {
  const suggestions = await simpleGet(`${ec2Url}/search?q=${searchString}`);
  return suggestions;
}
export { getSpotifySuggestions };

const getArtistById = async (id) => {
  const artist = await simpleGet(`${ec2Url}/artist/${id}`);
  return artist;
}
export { getArtistById };

const getArtistByName = async (name) => {
  const artist = await simpleGet(`${ec2Url}/artist?name=${name}`);
  return artist;
}

export { getArtistByName };

const getRelatedArtists = async (id) => {
  const relatedArtists = await simpleGet(`${ec2Url}/related/${id}`);
  return relatedArtists;
}

export { getRelatedArtists };
