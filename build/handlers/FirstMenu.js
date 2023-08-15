import { Menu } from "../lib/menu.js";
import { getYtMediaByName } from "../lib/yt-search.js";
import { useRoute } from "../route.js";
/**
 * display 10 media from youtube
 */
export async function media(menu) {
    // map video 
    const videos = await getYtMediaByName('taruh nadin amizah');
    const videosMap = videos.map(item => {
        return {
            title: item.title,
            value: item,
        };
    });
    const ensensialMenu = [
        {
            title: '< Back',
            value: {}
        }
    ];
    const MenuSong = new Menu([...videosMap, ...ensensialMenu], 'choose_media', 'Choose a media, you wanna listen');
    menu.stop = true;
    // start other chain
    await menu.otheMenuChain(MenuSong, async (currentMenu, choice) => {
        if (!choice.id) {
            // return back into previous menu 
            currentMenu.stop = true;
            menu.stop = false;
            // start other chain 
            await currentMenu.otheMenuChain(menu, async (currentMenu, choice) => {
                await useRoute(choice)?.handler(currentMenu);
            });
        }
        // downloading files 
        currentMenu.message = `Playing ${choice.title}`;
        console.log('Play song with id ', choice.id);
        console.log('Loading...');
    });
    return {
        status: 'success'
    };
}
