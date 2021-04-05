import React, {useState} from 'react';
import {Button} from 'react-bootstrap';
import {SearchIcon} from '@primer/octicons-react';

const SearchBar = ({getRelatedArtists}) => {
  const BarStyling = {width:"20rem",background:"#F2F1F9", border:"none", padding:"0.5rem"};
  const [searchString, setSearchString] = useState("");
  return (
    <div>
        <input 
        style={BarStyling}
        placeholder={"search artist"}
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        />
        <Button variant="primary" onClick={() => getRelatedArtists(searchString)}><SearchIcon size={24}/></Button>
    </div>

  );
}

export default SearchBar