import { media } from "./handlers/FirstMenu.js";
import { quit } from "./handlers/Quit.js";
// register routing here 
const ROUTE = [
    {
        name: 'media',
        handler: media
    },
    {
        name: 'quit',
        handler: quit
    }
];
export function useRoute(routeName) {
    return ROUTE.find(e => e.name == routeName);
}
