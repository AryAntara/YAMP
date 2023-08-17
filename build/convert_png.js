import sharp from "sharp";
const DOWNLOAD_PATH = `${process.cwd()}/downloads/`;
const filename = 'thumbs - For Revenge - Serana (Official Lyric Video) - 1692237808039';
sharp(`${DOWNLOAD_PATH}.thumbs/${filename}.png`).toFile(`${DOWNLOAD_PATH}.thumbs/${filename}-conv.png`);
