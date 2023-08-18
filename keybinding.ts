import {screen} from './blessed/index.js'
import { killPlayer, isPlaying, stopPlaying, startPlaying} from './lib/yt/yt-play.js';

// Capture keyboard input
screen.key(['escape', 'q', 'C-c'], () => { 
    killPlayer();
    process.exit(0); 
});

// toggle music player 
screen.key(['space'], () => {
    if(isPlaying()){
        stopPlaying();
    } else {
        startPlaying();
    }
})
