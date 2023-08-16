import { YouTubeSearchResults } from "youtube-search";
import { setItems } from '../contents.js';
import { MediaInfo, db } from './yt-download.js';
import { goOffline } from '../system.js';
import { search } from "../youtube.js";

/**
 * Get Youtube videos by name
 * 
 * @param query - The search query
 * @return {YouTubeSearchResults} - A list of result
 */
export async function getYtMediaByName(query: string): Promise<MediaInfo[]> {
    try {
        const searching = await search(query);
        const results = searching || [];

        // set content into global
        setItems(searching);

        return results;
    } catch (error) {
        console.log('Error when fetching data', error)
        goOffline()
        const offlineMedia = db.read();
        return offlineMedia as MediaInfo[];
    }
}
