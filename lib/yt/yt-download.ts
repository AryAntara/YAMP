import ytdl from "ytdl-core";
import { JSDB } from "../jsdb.js";
import { createWriteStream, statSync, unlinkSync } from "fs";
import { get } from "https";
import { notification } from "../../events.js";
import { blue } from "kolorist";
import { icon } from "../icons.js";
import sharp from 'sharp';

const DOWNLOAD_PATH = `${process.cwd()}/downloads/`;
const DB_PATH = `${DOWNLOAD_PATH}db.json`;
const B_TO_KB = 1024;
const MS_IN_SEC = 1000;
const SPARE_TIME = 5000;

export const db = new JSDB(DB_PATH);
export type MediaInfo = {
    id: string,
    filename?: string,
    publish_at: string,
    title: string,
    duration?: number,
    thumbnail?: string,
}

export async function downloadMedia(media: MediaInfo): Promise<MediaInfo> {
    const filename = `${media.id} - ${media.title}.mp3`
    const filesDownloaded = db.read() as MediaInfo[];

    // send notif
    notification.emit('alert', 'find song...')

    // is exist ?
    const exist = filesDownloaded.find((e: MediaInfo) => e.id == media.id);
    if (exist) {
        notification.emit('alert', 'song was downloaded')
        return exist;
    }

    notification.emit('alert', 'starting download song')
    const duration = await download(media.id, filename) as number;

    const mediaInfo: MediaInfo = {
        id: media.id,
        filename: filename,
        publish_at: media.publish_at,
        title: media.title,
        duration: duration + SPARE_TIME,
        thumbnail: media.thumbnail ? await downloadThumb(media.thumbnail, media.title) : undefined
    }

    filesDownloaded.push(mediaInfo);
    db.setData(filesDownloaded);
    db.write();
    notification.emit('success', 'song was downloaded')

    return mediaInfo;
}

// download youtube media into disk
async function download(id: string, filename: string) {
    const info = await ytdl.getInfo(id);
    const audio = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
    const link = audio.url;
    await storeFile(link, filename);
    return parseInt(audio.approxDurationMs as string) ?? 1000 / MS_IN_SEC;
}

// store file into disk
function storeFile(url: string, filename: string, notif = true): Promise<boolean> {
    return new Promise(resolve => {
        get(url, (res) => {
            const path = `${DOWNLOAD_PATH}${filename}`;

            // notif every percent
            const contentLength = res.headers['content-length'];
            notif && notifEveryPercent(path, Number(contentLength));

            res.pipe(createWriteStream(path).on('finish', () => {
                resolve(true)
                notification.emit('success', 'Download Done!');
            }))
        })
    })
}

function notifEveryPercent(path: string, actualSize: number) {
    const downloadIntervalInfo = setInterval(() => {
        const actualSizeInMegaByte = Math.ceil(actualSize / B_TO_KB);
        const wasDownloadSize = statSync(path);
        const wasDownloadSizeInMb = Math.ceil(wasDownloadSize.size / B_TO_KB);

        // check was done 
        if (wasDownloadSize.size == actualSize) {
            clearInterval(downloadIntervalInfo);
        }

        notification.emit('alert', `${blue(icon('download'))} Downloading... ${wasDownloadSizeInMb} KB/${actualSizeInMegaByte} KB`)
    })
}

async function downloadThumb(link: string, title: string) {
    const filename = `thumbs - ${title} - ${Date.now()}`;
    await storeFile(link, `.thumbs/${filename}-raw.png`, false);

    // convert image into actual png
    sharp(`${DOWNLOAD_PATH}.thumbs/${filename}-raw.png`).toFile(`${DOWNLOAD_PATH}.thumbs/${filename}.png`)
        .then(() => {
            // deleting the broken png file
            unlinkSync(`${DOWNLOAD_PATH}.thumbs/${filename}-raw.png`)
        })
    return `${filename}.png`;
}