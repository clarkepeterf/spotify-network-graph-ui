import React from "react";
import './ArtistDetails.css';

const ArtistDetails = ({artist}) => {
    if(artist){
        console.log(artist.images[0]);
        return(
            <div>
                <h3>{artist.name}</h3>
                {artist.images && artist.images[0] &&
                    <div class="circular">
                        <img src={artist.images[0].url} alt={artist.name}/>
                    </div>
                }
            </div>
        );
    } else {
        return null;
    }
}

export default ArtistDetails;