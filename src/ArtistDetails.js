import React from "react";
import './ArtistDetails.css';

const ArtistDetails = ({artist}) => {
    if(artist){
        return(
            <div>
                <h3>{artist.name}</h3>
            </div>
        );
    } else {
        return null;
    }
}

export default ArtistDetails;