import { setItems } from '../contents.js';
import { MediaInfo } from './yt-download.js';
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
        // set content into global
        setItems(searching);

        return searching;
    } catch (error) {        
        return [];
    }
}
