import { JSDB } from "../lib/jsdb.js";
import ytdl from 'ytdl-core';
const db = new JSDB('./downloads/db.json');
for (let media of db.read()) {
    if (media.duration) {
        console.log('skipping');
        console.log(media);
        continue;
    }
    const info = await ytdl.getInfo(media.id);
    const audio = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
    media.duration = Number(audio.approxDurationMs);
    db.write();
}
