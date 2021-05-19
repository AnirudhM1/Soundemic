const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    img_url: String
});

songSchema.statics.findSimilarSongs = async function(querry) {
    
    const songs = await Song.find({});

    const SUBSTRING_SONGS = songs.filter((song) => isSubstring(querry, song.title))
    const SORTED_SUBSTRING_SONGS = getSortedArray(querry, SUBSTRING_SONGS);

    if(SORTED_SUBSTRING_SONGS.length >= 10) {
        return SORTED_SUBSTRING_SONGS;
    }
    
    const NON_SUBSTRING_SONGS = songs.filter((song) => !isSubstring(querry, song.title))
    const SORTED_NON_SUBSTRING_SONGS = getSortedArray(querry, NON_SUBSTRING_SONGS);

    const REMAINING_LENGTH = 10-SORTED_SUBSTRING_SONGS.length;
    return SORTED_SUBSTRING_SONGS.concat(SORTED_NON_SUBSTRING_SONGS.slice(0,REMAINING_LENGTH));
}

const Song = mongoose.model('Song', songSchema);

module.exports = Song;




// Functions to calculate songs closest to the seearch querry

const isSubstring = (sub, sup) => {
    for(let i=0;i<sup.length-sub.length+1;i++) {
        if(sup.substring(i, sub.length+i).toUpperCase() == sub.toUpperCase()) {
            return true;
        }
    }
    return false;
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

sort = (main_arr, dist_arr) => {
    const len = dist_arr.length;
    let checked;
    do {
        checked = false;
        for (let i = 0; i < len; i++) {
            if (dist_arr[i] > dist_arr[i + 1]) {
                let tmp1 = dist_arr[i];
                dist_arr[i] = dist_arr[i + 1];
                dist_arr[i + 1] = tmp1;

                let tmp2 = main_arr[i];
                main_arr[i] = main_arr[i + 1];
                main_arr[i + 1] = tmp2;

                checked = true;
            }
        }
    } while (checked);
    return main_arr;
}
getSortedArray = (input, current_arr) => {
    const len = current_arr.length;
    var arr = new Array(len);
    for(let i=0;i<len;i+=1) {
        const dist = getDistance(input, current_arr[i].name);
        arr[i] = dist;
    }
    return sort(current_arr, arr);
}