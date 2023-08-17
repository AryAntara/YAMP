import axios from 'axios'
import { MediaInfo, db } from "./yt/yt-download.js";
import { goOffline } from "./system.js";

const TIMEOUT = 5; // second
const API_KEY = '77b7b1b0b9e57f8e3e1465c8'; // 10 search count

type LolHumanYoutubeSearch = {
    videoId: string,
    thumbnail: string,
    published: string,
    views: string,
    title: string,
}

export async function search(query: string): Promise<MediaInfo[]> {
    const media = await youtubeSearch(encodeURI(query));
    if(!media?.result){
        return media;
    }

    return media?.result.map((e: LolHumanYoutubeSearch) => {
        return {
            id: e.videoId,
            title: e.title,
            publish_at: e.published,
            thumbnail: e.thumbnail
        }
    }) ?? [] as MediaInfo[];
}

/**
 * 
 * @param query - must be encoded
 */
async function youtubeSearch(query: string) {
    try {
        const url = `https://api.lolhuman.xyz/api/ytsearch?apikey=${API_KEY}&query=${query}`
        const res = await axios(url, { timeout: TIMEOUT });
        console.log(res.data);
        return res.data;
    } catch (e) {               
        goOffline()
        const offlineMedia = db.read() as MediaInfo[];                
        return offlineMedia;
    }
}