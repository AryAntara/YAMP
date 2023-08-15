import { exec } from "child_process";
import { getItem } from "../contents.js";
import { db, downloadMedia } from "./yt-download.js";
import { boxMediaListEvent, notification } from "../../events.js";
import { icon } from "../icons.js";
import { green } from "kolorist";
let play;
export async function playMedia(item) {
    const title = item.content;
    const index = Number(title.split('.')[0]) - 1;
    const mediaInfo = getItem(index);
    if (!mediaInfo) {
        // try using downloaded song 
        const downloadedSongs = db.read();
        const song = downloadedSongs[index];
        if (!song) {
            return;
        }
        player(song.title, song.filename, song.duration);
        return;
    }
    boxMediaListEvent.emit('re-render');
    boxMediaListEvent.emit('set-by-index', item, `${index + 1}. (${green(icon('play'))}) ${mediaInfo.title} - (${new Date(mediaInfo.publishedAt).getFullYear()})`);
    const { filename, duration } = await downloadMedia(mediaInfo);
    player(mediaInfo.title, filename, duration);
    return;
}
function player(title, filename, duration) {
    // info music is playing now
    notification.emit('success', `${icon('play')} ${title}`);
    if (play) {
        play.kill();
    }
    play = exec(`ffplay -nodisp -autoexit -loglevel quiet "./downloads/${filename}"`);
    setTimeout(() => {
        playNextSong(filename);
    }, duration ?? 10000);
}
async function playNextSong(filename) {
    const downloadedSong = await db.read();
    const currentSong = downloadedSong.find((e) => e.filename == filename);
    const index = downloadedSong.indexOf(currentSong);
    const nextSong = downloadedSong[index + 1];
    if (nextSong) {
        return player(nextSong.title, nextSong.filename, nextSong.duration);
    }
    const firstSong = downloadedSong[0];
    return player(firstSong.title, firstSong.filename, firstSong.duration);
}
export function killPlayer() {
    if (play) {
        play.kill();
    }
}
export function isPlaying() {
    return !!play;
}
