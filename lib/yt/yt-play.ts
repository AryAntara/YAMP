import { ChildProcess, exec } from "child_process";
import { getAll, getItem } from "../contents.js";
import { MediaInfo, db, downloadMedia } from "./yt-download.js";
import { boxMediaListEvent, notification } from "../../events.js";
import { icon } from "../icons.js";
import { green } from "kolorist";
import { isOffline } from "../system.js";

let play: ChildProcess | null;

export async function playMedia(item: any) {
    const offlineMode = isOffline();
    const title = item.content;
    const index = Number(title.split('.')[0]) - 1;

    // if you are in offline mode
    if(offlineMode){
       // try using downloaded song 
       const downloadedSongs = db.read() as MediaInfo[];
       const song = downloadedSongs[index];

       if (!song) {
           return
       }

       player(song.title, song.filename ?? '', song.duration);
       return
    }

    // Online Songs
    const mediaInfo = getItem(index);
    if (!mediaInfo) {
        return
    }

    boxMediaListEvent.emit('re-render');
    boxMediaListEvent.emit('set-by-index', item, `${index + 1}. (${green(icon('play'))}) ${mediaInfo.title}`);

    const { filename, duration } = await downloadMedia(mediaInfo);
    player(mediaInfo.title, filename, duration)
    return;
}

function player(title: string, filename: string, duration?: number) {

    // info music is playing now
    notification.emit('success', `${icon('play')} ${title}`)

    if (play) {
        play.kill();
    }

    play = exec(`ffplay -nodisp -autoexit -loglevel quiet "./downloads/${filename}"`)

    setTimeout(() => {
        playNextSong(filename)
    }, duration ?? 10000)
}

async function playNextSong(filename: string) {
    const downloadedSong = await db.read() as MediaInfo[];
    const currentSong = downloadedSong.find((e: MediaInfo) => e.filename == filename);
    const index = downloadedSong.indexOf(currentSong as MediaInfo);
    const nextSong = downloadedSong[index + 1];

    if (nextSong) {
        return player(nextSong.title, nextSong.filename ?? 'none', nextSong.duration);
    }

    const firstSong = downloadedSong[0];
    return player(firstSong.title, firstSong.filename ?? 'none', firstSong.duration);
}

export function killPlayer(){
    if(play){
        play.kill()
    }
}

export function isPlaying(){
    return !!play;
}