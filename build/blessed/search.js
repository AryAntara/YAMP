import blessed from "blessed";
import { boxMediaListEvent } from "../events.js";
import { getYtMediaByName } from "../lib/yt/yt-search.js";
import { screen } from "./index.js";
import { icon } from "../lib/icons.js";
import { db } from "../lib/yt/yt-download.js";
import { green } from "kolorist";
function createSearchInput() {
    const searchInput = blessed.textbox({
        bottom: '0',
        left: '10%',
        height: '100%',
        width: '50%',
        border: 'line',
        keys: true,
        mouse: true,
        inputOnFocus: true,
        style: {
            fg: 'white',
            border: {
                fg: 'white'
            }
        }
    });
    // when enter 
    searchInput.on('submit', async (value) => {
        const searchValue = value;
        // change state into loading 
        searchInput.value = 'Loading...';
        screen.render();
        await searchVideos(searchValue);
        searchInput.value = '';
        screen.render();
    });
    return searchInput;
}
async function searchVideos(value) {
    let media = await getYtMediaByName(value);
    let mediaListMap = [];
    mediaListMap = media.map((e, i) => {
        if (db.read().find((item) => item.id == e.id)) {
            return `${i + 1}. (${green(icon('check'))}) ${e.title} - ${e.publish_at}`;
        }
        return `${i + 1}. ${e.title} - ${e.publish_at}`;
    });
    // change list item
    boxMediaListEvent.emit('change-items', mediaListMap);
}
function createSearchBox() {
    // initlize input 
    const searchInput = createSearchInput();
    const searchLabel = blessed.textbox({
        bottom: '0',
        left: '0',
        value: `Search ${icon('search')} `,
        width: '10%',
        height: '100%',
        border: 'line',
        style: {
            fg: 'white',
            border: {
                fg: 'white'
            }
        }
    });
    const searchBox = blessed.box({
        bottom: '0',
        width: '100%',
        height: 3,
    });
    // append search input and label into box
    searchBox.append(searchLabel);
    searchBox.append(searchInput);
    return searchBox;
}
export default createSearchBox;
