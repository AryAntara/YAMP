import ytdl from "ytdl-core";
import { JSDB } from "../jsdb.js";
import { createWriteStream, statSync } from "fs";
import { get } from "https";
import { notification } from "../../events.js";
import { blue } from "kolorist";
import { icon } from "../icons.js";
const DOWNLOAD_PATH = `${process.cwd()}/downloads/`;
const DB_PATH = `${DOWNLOAD_PATH}db.json`;
const B_TO_MB = 1024 * 1024;
const MS_IN_SEC = 1000;
export const db = new JSDB(DB_PATH);
export async function downloadMedia(media) {
    const filename = `${media.id} - ${media.title}.mp3`;
    const filesDownloaded = db.read();
    // send notif
    notification.emit('alert', 'find song...');
    // is exist ?
    const exist = filesDownloaded.find((e) => e.id == media.id);
    if (exist) {
        notification.emit('alert', 'song was downloaded');
        return { filename, duration: exist.duration };
    }
    notification.emit('alert', 'starting download song');
    const duration = await download(media.id, filename);
    const mediaInfo = {
        id: media.id,
        filename: filename,
        publish_at: media.publishedAt,
        title: media.title,
        duration: duration + 3
    };
    filesDownloaded.push(mediaInfo);
    db.setData(filesDownloaded);
    db.write();
    notification.emit('success', 'song was downloaded');
    return { filename, duration };
}
// download youtube media into disk
async function download(id, filename) {
    const info = await ytdl.getInfo(id);
    const audio = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
    const link = audio.url;
    await storeFile(link, filename);
    return parseInt(audio.approxDurationMs) ?? 1000 / MS_IN_SEC;
}
// store file into disk
function storeFile(url, filename) {
    return new Promise(resolve => {
        get(url, (res) => {
            const path = `${DOWNLOAD_PATH}${filename}`;
            // notif every percent
            const contentLength = res.headers['content-length'];
            notifEveryPercent(path, Number(contentLength));
            res.pipe(createWriteStream(path).on('finish', () => {
                resolve(true);
                notification.emit('success', 'Download Done!');
            }));
        });
    });
}
function notifEveryPercent(path, actualSize) {
    const downloadIntervalInfo = setInterval(() => {
        const actualSizeInMegaByte = Math.ceil(actualSize / B_TO_MB);
        const wasDownloadSize = statSync(path);
        const wasDownloadSizeInMb = Math.ceil(wasDownloadSize.size / B_TO_MB);
        // check was done 
        if (wasDownloadSize.size == actualSize) {
            clearInterval(downloadIntervalInfo);
        }
        notification.emit('alert', `${blue(icon('download'))} ${wasDownloadSizeInMb} MB/${actualSizeInMegaByte} MB`);
    });
}
