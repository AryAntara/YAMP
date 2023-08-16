/** OFFLINE HANDLER */

/**
 * @var {boolean} offline - indicate the player using only downloaded songs 
 */
let offline = false;

export function isOffline(){
    return offline;
} 

export function goOffline(){
    offline = true;
}

export function goOnline(){
    offline = false; 
}