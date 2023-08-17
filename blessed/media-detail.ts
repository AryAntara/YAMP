import { boxMediaDetailEvent } from "../events.js";
import blessed from "blessed";
import { MediaInfo } from "../lib/yt/yt-download.js";
import { screen } from "./index.js";
import { existsSync, statSync } from "fs";
import contrib from 'blessed-contrib';

const DOWNLOAD_PATH = `${process.cwd()}/downloads`;
const MS_IN_MINUTE = 1000 * 60;

function createAnsiiImageOfThumb(media: MediaInfo | null) {    
    const ansiiBox = contrib.picture({
        file: media ? imageResolver(media.thumbnail ?? '') : '',
        top: 6,
        left: '22%',
        height: 12,
        width: 56,
        border: 'line',
        onReady: function () {
            screen.render();
        },
        style: {
            bg: 'red'
        }
    });

    return ansiiBox;
}

function createMediaDetail(media: MediaInfo | null) {
    const ansiiBox = blessed.list({
        width: "80%",
        left: 9,
        height: 15,
        top: 22,
        items: [
            `Title      : -`,
            `ID         : -`,
            `Durations  : -`,
            `Thumbnail  : -`,
            `Filename   : -`,
            `Released   : -`
        ],
    });

    if (media) {
        ansiiBox.setItems([
            '1'
        ])
    }

    return ansiiBox;
}

function imageResolver(filename: string) {

    const path = `${DOWNLOAD_PATH}/.thumbs/${filename}`

    if (!existsSync(path) || statSync(path).isDirectory() ) {
        throw new Error('file does not exist');
    }

    return path;
}

function createMediaDetailBox() {

    const boxMediaDetail = blessed.box(
        {
            border: {
                type: 'line'
            },
            height: "95%",
            width: '50%',
            right: 0,
            mouse: true,
            keys: true,
            style: {
                selected: {
                    bg: 'white',
                    fg: 'black'
                }
            },
        }
    )

    // other compponent 

    const mediaDetail = createMediaDetail(null);

    // append into media detail    
    boxMediaDetail.append(mediaDetail);

    // events 
    boxMediaDetailEvent.on('set', async (media: MediaInfo) => {
        try {
            const thumbnail = createAnsiiImageOfThumb(media) // first rendering        
            boxMediaDetail.append(thumbnail);
        } catch {
            // error
        }

        mediaDetail.setItems([
            `Title      : ${media.title}`,
            `ID         : ${media.id}`,
            `Durations  : ${(media.duration ?? 0) / MS_IN_MINUTE} Minutes`,
            `Thumbnail  : ${media.thumbnail}`,
            `Filename   : ${media.filename}`,
            `Released   : ${media.publish_at}`
        ],);
        screen.render();
    })
    return boxMediaDetail;
}


export default createMediaDetailBox