import { YouTubeSearchResults } from "youtube-search";
import axios from 'axios'
import { MediaInfo } from "./yt/yt-download";

const API_KEY = '77b7b1b0b9e57f8e3e1465c8';

type LolHumanYoutubeSearch = {
    videoId: string, 
    thumbnail: string, 
    published: string,
    views: string,
    title: string,
}

export async function search(query: string ): Promise<MediaInfo[]> {
    const media = await youtubeSearch(encodeURI(query));
    return media?.result?.map((e: LolHumanYoutubeSearch) => {
        return {
            id: e.videoId,
            title: e.title,
            publish_at : e.published,
        }
    }) ?? [] as MediaInfo[]; 
}

/**
 * 
 * @param query - must be encoded
 */
async function youtubeSearch(query: string){
    try {
        const url = `https://api.lolhuman.xyz/api/ytsearch?apikey=${API_KEY}&query=${query}`
        const res = await axios(url);
        return res.data;
    } catch (e) {
        console.log(e);
        return []
    }
}