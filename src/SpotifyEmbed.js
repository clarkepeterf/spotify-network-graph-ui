import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import "./SpotifyEmbed.css"

export default function SpotifyEmbed({ storeSetStateCallback }) {
    const [artist, setArtist] = useState(null)
    const [containerHeight, setContainerHeight] = useState(0);
    const [embedSize, setEmbedSize] = useState("small")

    if (containerHeight <= 500 && embedSize !== "small") {
        setEmbedSize("small")
    }

    storeSetStateCallback(setArtist, setContainerHeight)

    function toggleEmbedSize() {
        embedSize === "small" ? setEmbedSize("large") : setEmbedSize("small")
    }

    return (
        <div
            className={"spotifyEmbed"}
            style={{
                position: "absolute",
                zIndex: 100,
                marginTop: embedSize === "small" ? containerHeight - 110 : containerHeight - 430,
                transition: "margin-top 0.25s"
            }}
        >
            {artist && containerHeight > 500 &&
                <button className={"chevronWrapper"} onClick={(e) => { toggleEmbedSize() }}>
                    <FontAwesomeIcon
                        icon={["fas", embedSize === "small" ? "chevron-up" : "chevron-down"]}
                        size="lg"
                    />
                </button>
            }
            {artist &&
                <iframe
                    title="spotifyEmbed"
                    src={`https://open.spotify.com/embed/artist/${artist.id}`}
                    style={{
                        width: "300px",
                        height: embedSize === "small" ? "80px" : "400px",
                        transition: "height 0.25s",
                    }}
                    frameBorder="0"
                    allowtransparency="true"
                    allow="encrypted-media">
                </iframe>
            }
        </div >
    )
}