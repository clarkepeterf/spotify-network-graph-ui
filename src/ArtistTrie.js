export default class ArtistTrie {

    #data = {
        children: {},
        value: null,
    }

    /*
        Artists in the trie are actually graph nodes
        {
            id: artistId,
            label: artistName,
            image: artistImage
        }
    */
    add(artist) {
        let node = this.#data
        for (const char of artist.label) {
            // Always add with lower case letters
            //When searching tree we will also convert to lowercase to make searching case insensitive
            const lowerChar = char.toLowerCase();
            if (!(lowerChar in node.children)) {
                node.children[lowerChar] =
                {
                    children: {},
                    value: null,
                }
            }
            node = node.children[lowerChar];
        }
        node.value = artist;
    }

    search(prefix) {
        // Always get based on lowercase letters (trie expects lower case letters)
        const lowerCasePrefix = prefix.toLowerCase();
        const results = [];
        const startNode = getNodeWithPrefix(this.#data, lowerCasePrefix);
        collectValuesMatchingPrefix(startNode, lowerCasePrefix, results);
        // Limit results to 20
        if (results.length > 20) {
            return results.slice(0, 20)
        } else return results;
    }

    get(artistName) {
        const node = getNodeWithPrefix(this.#data, artistName)
        const artist = node.value ?? null
        return artist
    }

    clear() {
        this.#data = {
            children: {},
            value: null,
        }
    }
}

function getNodeWithPrefix(data, prefix) {
    // Always get based on lower case letters (trie expects lower case letters)
    const lowerCasePrefix = prefix.toLowerCase();
    let node = data;
    for (const char of lowerCasePrefix) {
        if (char in node.children) {
            node = node.children[char]
        } else {
            return null;
        }
    }
    return node;
}

function collectValuesMatchingPrefix(node, prefix, results) {
    if (node === null) {
        return;
    }
    if (node.value !== null) {
        results.push(node.value.label);
    }
    const childKeys = Object.keys(node.children);
    for (const char of childKeys) {
        const newPrefix = prefix + char;
        collectValuesMatchingPrefix(node.children[char], newPrefix, results);
    }
}