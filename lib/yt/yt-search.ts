import fs from 'fs';
import crypto from 'crypto';
import search, { YouTubeSearchOptions, YouTubeSearchResults } from "youtube-search";
import { setItems } from '../contents.js';

const MAX_RESULTS = 30; 
const API_KEY = 'AIzaSyD-yq_b0lBHV2GkBczqinFV63A2gwzg1Fc';// jangan pakai bang :(

/**
 * Get Youtube videos by name
 * 
 * @param {string} query - The search query
 * @return {YouTubeSearchResults} - A list of result
 */
export async function getYtMediaByName(query: string): Promise<YouTubeSearchResults[]> {
    try {
        const opts: YouTubeSearchOptions = {
            key: API_KEY,
            maxResults: MAX_RESULTS,
            type: 'video'
        }
        const searching = await search(query, opts);
        const results = searching?.results || [];
        
        // set content into global
        setItems(results)

        return results;
    } catch (error) {
        console.log('Error when fetching data', error)
        return [];
    }
}
