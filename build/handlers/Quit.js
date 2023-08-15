/**
 * Quit from yamp
 */
export function quit(menu) {
    menu.stop = true;
    console.log('Bye Bye!');
    return {
        status: 'warn'
    };
}
