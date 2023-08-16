import axios from 'axios';
const API_KEY = '77b7b1b0b9e57f8e3e1465c8';
export async function search(query) {
    const media = await youtubeSearch(encodeURI(query));
    console.log(media);
    return media?.result?.map((e) => {
        return {
            id: e.videoId,
            title: e.title,
            publish_at: e.published,
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
        const res = await axios(url);
        return res.data;
    }
    catch (e) {
        console.log(e);
        return [];
    }
}
