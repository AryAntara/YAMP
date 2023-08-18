import { ChildProcess, exec } from "child_process";
import { getAll, getItem } from "../contents.js";
import { MediaInfo, db, downloadMedia } from "./yt-download.js";
import { boxMediaDetailEvent, boxMediaListEvent, notification } from "../../events.js";
import { icon } from "../icons.js";
import { green } from "kolorist";

let play: ChildProcess | null;
let stopped = false;

export async function playMedia(item: any) {
    const title = item.content;
    const index = Number(title.split('.')[0]) - 1;

    let mediaInfo = getItem(index);
    if (!mediaInfo) {
        return
    }

    boxMediaListEvent.emit('re-render');
    boxMediaListEvent.emit('set-by-index', item, `${index + 1}. (${green(icon('play'))}) ${mediaInfo.title}`);

    mediaInfo = await downloadMedia(mediaInfo);

    // display detil
    boxMediaDetailEvent.emit('set', mediaInfo);

    player(mediaInfo.title, mediaInfo.filename ?? '', mediaInfo.duration);
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
        // display detil
        boxMediaDetailEvent.emit('set', nextSong);
        return player(nextSong.title, nextSong.filename ?? 'none', nextSong.duration);
    }

    const firstSong = downloadedSong[0];
    return player(firstSong.title, firstSong.filename ?? 'none', firstSong.duration);
}

export function killPlayer() {
    if (play) {
        play.kill()
    }
}

export function isPlaying() {
    return play && !stopped;
}

export function stopPlaying(){
    if(play && !stopped){
        stopped = true;
        play.kill('SIGSTOP');
    }
}

export function startPlaying(){
    if(play && stopped){
        stopped = false;
        play.kill('SIGCONT')
    }
}