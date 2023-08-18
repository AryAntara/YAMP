import axios from 'axios';
import { db } from "./yt/yt-download.js";
import { goOffline } from "./system.js";
const TIMEOUT = 5000; // milisecond
const API_KEY = '77b7b1b0b9e57f8e3e1465c8'; // 10 search count
export async function search(query) {
    const media = await youtubeSearch(encodeURI(query));
    if (!media?.result) {
        return media;
    }
    return media?.result.map((e) => {
        return {
            id: e.videoId,
            title: e.title,
            publish_at: e.published,
            thumbnail: e.thumbnail
        };
    }) ?? [];
}
/**
 *
 * @param query - must be encoded
 */
async function youtubeSearch(query) {
    try {
        const url = `https://api.lolhuman.xyz/api/ytsearch?apikey=${API_KEY}&query=${query}`;
        const res = await axios(url, { timeout: TIMEOUT });
        return res.data;
    }
    catch (e) {
        goOffline();
        const offlineMedia = db.read();
        return offlineMedia;
    }
}
