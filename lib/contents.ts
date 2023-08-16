import { MediaInfo } from "./yt/yt-download";

// localvariable
let contents: MediaInfo[] = [];

// set contents 
export function setItems(items: MediaInfo[]){
    contents = items; 
}

// get content by Index 
export function getItem(index: number): MediaInfo | null {
    return contents[index];
}

export function getAll(): MediaInfo[] {
    return contents;
}