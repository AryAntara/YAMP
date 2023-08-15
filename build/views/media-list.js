import { getYtMediaByName } from "../lib/yt/yt-search.js";
import blessed from "blessed";
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
    const media = await getYtMediaByName(query);
    // mapping media results 
    const mediaListMap = media.map((e, i) => {
        return `${i + 1}. ${e.title} - ${(new Date(e.publishedAt)).getFullYear()}`;
    });
    boxMediaList.setItems(mediaListMap);
    return boxMediaList;
}
export default createMediaList;
