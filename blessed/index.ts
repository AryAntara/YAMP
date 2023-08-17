import blessed from 'blessed';
import createMediaList from './media-list.js';
import createSearchBox  from './search.js';
import createNotificationBox from './notifcation.js';
import createMediaDetail from './media-detail.js';
import { killPlayer } from '../lib/yt/yt-play.js';

// Create a screen object.
export const screen = blessed.screen({
    smartCSR: true,
    title: 'A_YAM'
});

console.log('loading...')

// Initilize other components
const boxMediaList = await createMediaList();
const searchBox = createSearchBox();
const notificationBox = createNotificationBox();
const boxMediaDetail = createMediaDetail();

// Append other components to the screen.
screen.append(boxMediaList);
screen.append(searchBox);
screen.append(notificationBox);
screen.append(boxMediaDetail);

// focus on media list
boxMediaList.focus();

// Capture keyboard input
screen.key(['escape', 'q', 'C-c'], () => { 
    killPlayer();
    process.exit(0); 
});

// Render the screen.
screen.render();
