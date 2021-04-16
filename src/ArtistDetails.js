import React, { useMemo } from "react";
import './ArtistDetails.css';

const ArtistDetails = ({artist}) => {
    const artistDetailsComponent = useMemo( () => {
        if(artist){
            const {name, images} = artist;
            console.log(name);
            return(
                <div className="artistDetails">
                    <h3>{name}</h3>
                    {images && images[0] &&
                        <div className="circular">
                            <img src={images[0].url} alt={name}/>
                        </div>
                    }
                </div>
            );
        } else {
            return null;
        }
    }, [artist]);
    return artistDetailsComponent;
}

export default ArtistDetails;