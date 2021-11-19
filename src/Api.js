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

const getRelatedArtistGraph = async (searchString, degreesOfSeparation) => {
  const graph = await simpleGet(`${ec2Url}/graph?searchString=${searchString}&degreesOfSeparation=${degreesOfSeparation}`);
  return graph;
}
export { getRelatedArtistGraph }

const updateRelatedArtistGraph = async (nodes, edges, id, x, y) => {
  const response = await fetch(`${ec2Url}/update?id=${id}&x=${x}&y=${y}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nodes: nodes, edges })
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const updates = await response.json();
  return updates;
}
export { updateRelatedArtistGraph };
