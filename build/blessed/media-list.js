import { getYtMediaByName } from "../lib/yt/yt-search.js";
import { boxMediaListEvent } from "../events.js";
import blessed from "blessed";
import { playMedia } from "../lib/yt/yt-play.js";
import { db } from "../lib/yt/yt-download.js";
import { green } from "kolorist";
import { icon } from "../lib/icons.js";
import { getAll } from "../lib/contents.js";
async function createMediaList() {
    const boxMediaList = blessed.list({
        border: {
            type: 'line'
        },
        height: "95%",
        mouse: true,
        keys: true,
        style: {
            selected: {
                bg: 'white',
                fg: 'black'
            }
        },
    });
    // get 10 media 
    const query = 'nadin amizah'; // search query
    let media = await getYtMediaByName(query);
    let mediaListMap = [];
    // mapping media results 
    mediaListMap = media.map((e, i) => {
        if (db.read().find((item) => item.id == e.id)) {
            return `${i + 1}. (${green(icon('check'))}) ${e.title} - ${e.publish_at}`;
        }
        return `${i + 1}. ${e.title} - ${e.publish_at}`;
    });
    console.log(mediaListMap);
    boxMediaList.setItems(mediaListMap);
    // EVENTS
    // change item list in box media
    boxMediaListEvent.on('change-items', (items) => {
        boxMediaList.setItems(items);
        boxMediaList.focus();
    });
    // change one list
    boxMediaListEvent.on('set-by-index', (child, content) => {
        boxMediaList.setItem(child, content);
    });
    // re rendering 
    boxMediaListEvent.on('re-render', function () {
        const media = getAll();
        // mapping media results 
        mediaListMap = media.map((e, i) => {
            if (db.read().find((item) => item.id == e.id)) {
                return `${i + 1}. (${green(icon('check'))}) ${e.title} - ${e.publish_at}`;
            }
            return `${i + 1}. ${e.title} - ${e.publish_at}`;
        });
        boxMediaList.setItems(mediaListMap);
        boxMediaList.setItems(mediaListMap);
    });
    // download and play video
    boxMediaList.on('select', (item) => playMedia(item));
    return boxMediaList;
}
export default createMediaList;
