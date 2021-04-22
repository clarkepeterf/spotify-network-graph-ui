const getSpotifySuggestions = (searchString, resultCallback, errorCallback) => {
    fetch(`http://localhost:8080/search?q=${searchString}`)
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