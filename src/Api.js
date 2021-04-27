const simpleGet = async (url) => {
  const response = await fetch(encodeURI(url));
  if(!response.ok){
    throw Error(response.statusText);
  }
  const result = await response.json();
  return result;
}

const getSpotifySuggestions = async (searchString) => {
    const suggestions = await simpleGet(`http://localhost:8080/search?q=${searchString}`);
    return suggestions;
}
export {getSpotifySuggestions};

const getArtistById = async (id) => {
  const artist = await simpleGet(`http://localhost:8080/artist/${id}`);
  return artist;
}
export {getArtistById};