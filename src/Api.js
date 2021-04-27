const getSpotifySuggestions = (searchString, resultCallback, errorCallback) => {
    fetch(encodeURI(`http://localhost:8080/search?q=${searchString}`))
    .then(res => res.json())
    .then(
      (result) => {
        resultCallback(result);
      },
      (error) => {
        errorCallback(error);
      }
    );
  }
  export {getSpotifySuggestions};

  const getArtistById = (id, resultCallback, errorCallback) => {
    fetch(encodeURI(`http://localhost:8080/artist/${id}`))
    .then(res => res.json())
    .then(
      (result) => {
        resultCallback(result);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        errorCallback(error);
      }
    )
  };
  export {getArtistById};