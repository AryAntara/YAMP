import { YouTubeSearchResults } from "youtube-search";

// localvariable
let contents: YouTubeSearchResults[] = [];

// set contents 
export function setItems(items: YouTubeSearchResults[]){
    contents = items; 
}

// get content by Index 
export function getItem(index: number): YouTubeSearchResults | null {
    return contents[index];
}

export function getAll(): YouTubeSearchResults[] {
    return contents;
}