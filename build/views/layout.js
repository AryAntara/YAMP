import blessed from 'blessed';
import createMediaList from './media-list.js';
import createSearchBox from './search.js';
// Create a screen object.
const screen = blessed.screen({
    smartCSR: true,
    title: 'my window title'
});
// Initilize other components
const boxMediaList = await createMediaList();
const searchBox = createSearchBox();
// Append other components to the screen.
screen.append(boxMediaList);
screen.append(searchBox);
// Capture keyboard input
screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
// Render the screen.
screen.render();
