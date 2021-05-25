function autocomplete(input, arr) {
    input.addEventListener("input", function (e) {

        close();
        let value = this.value;

        if (!value) {
            return false;
        }

        let matchList = document.createElement("div");
        matchList.setAttribute("class", "matches");
        this.parentNode.appendChild(matchList);

        for (let i = 0; i < arr.length; i++) {

            let loc = isAutoCompleteValid(value, arr[i]);

            if (loc != -1) {

                let match = document.createElement("div");

                if (loc == -2) {
                    match.innerHTML = arr[i];
                }
                else {
                    match.innerHTML = arr[i].substring(0, loc);
                    match.innerHTML += "<strong>" + arr[i].substring(loc, value.length + loc) + "</strong>";
                    match.innerHTML += arr[i].substring(value.length + loc);
                    match.style.color = "#d2d2d2";
                }

                match.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";

                match.addEventListener("click", function (e) {
                    input.value = this.getElementsByTagName("input")[0].value;
                    close();
                });

                matchList.appendChild(match);
            }
        }
    });

    const close = (element) => {
        let match = document.getElementsByClassName("matches");
        for (let i = 0; i < match.length; i++) {
            if (element != match[i] && element != input) {
                match[i].parentNode.removeChild(match[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        close(e.target);
    });

}

const isAutoCompleteValid = (input, target) => {
    for (let i = 0; i < target.length - input.length + 1; i++) {
        if (target.substring(i, input.length + i).toUpperCase() == input.toUpperCase()) {
            return i;
        }
    }
    for (let i = 0; i < target.length - input.length + 1; i++) {
        if (checkSpellingErrors(input, target.substring(i, input.length + i))) {
            return -2;
        }
    }
    return -1;
}


const checkSpellingErrors = (input, target) => {

    if (input.length < 4) {
        return false;
    }

    if (input.length < 8) {
        const dist = getDistance(input.toUpperCase(), target.toUpperCase());
        return (dist < 2) ? true : false;
    }

    if (input.length < 12) {
        const dist = getDistance(input.toUpperCase(), target.toUpperCase());
        return (dist < 3) ? true : false;
    }

    const dist = getDistance(input.toUpperCase(), target.toUpperCase());
    return (dist < 4) ? true : false;

}


const getDistance = (str1 = '', str2 = '') => {
    const track = Array(str2.length + 1).fill(null).map(() =>
        Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator, // substitution
            );
        }
    }
    return track[str2.length][str1.length];
}

window.onload = async function (e) {
    var selectedSong = null;
    try {
        const response = await axios.get('/search/all');
        const data = response.data;
        const allSongs = data.map((song) => song.title);
        autocomplete(document.getElementById("search"), allSongs);
    } catch (e) {
        console.error(e)
    }


}