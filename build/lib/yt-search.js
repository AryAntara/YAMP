import search from "youtube-search";
/**
 * Get youtube videos by name
 */
export async function getYtMediaByName(query) {
    let opts = {
        key: process.env.YOUTUBE_API_KEY,
        maxResults: 10,
        type: 'video'
    };
    let searching = await search(query, opts);
    return searching?.results;
}
