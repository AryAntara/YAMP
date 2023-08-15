import prompts from "prompts";
/**
 * Display an menu list of item in array
 */
export class Menu {
    constructor(itemList, name, message) {
        this.itemList = itemList;
        this.name = 'no name';
        this.message = 'choices something';
        this.stop = false; // continue chaining ?
        this.name = name ?? this.name;
        this.message = message ?? this.message;
    }
    /**
     * Render a menu list using each item in itemList
     * using prompts to choice the item
     */
    async run() {
        console.clear();
        const response = await prompts({
            type: 'select',
            limit: 13,
            name: this.name,
            message: this.message,
            choices: this.itemList
        });
        return (response[this.name]);
    }
    /**
     * Run with looping to it self
     */
    async runWithChain(callBack) {
        let runOut = await this.run();
        await callBack(this, runOut);
        await this.nextChain(callBack);
    }
    /**
     * Run next chain of the instance
     */
    async nextChain(callBack) {
        if (this.stop) {
            return;
        }
        await this.runWithChain(callBack);
    }
    /**
     * Start other menu chain
     */
    async otheMenuChain(menu, callBack) {
        await menu.runWithChain(callBack);
    }
}
