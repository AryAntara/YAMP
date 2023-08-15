import blessed from "blessed";
function createSearchInput() {
    const searchInput = blessed.textbox({
        bottom: '0',
        right: '0',
        height: '100%',
        width: '90%',
        border: 'line',
        keys: true,
        mouse: true,
        inputOnFocus: true,
        style: {
            fg: 'white',
            border: {
                fg: 'white'
            }
        }
    });
    return searchInput;
}
function createSearchBox() {
    // initlize input 
    const searchInput = createSearchInput();
    const searchLabel = blessed.textbox({
        bottom: '0',
        left: '0',
        value: "Search : ",
        width: '10%',
        height: '100%',
        border: 'line',
        style: {
            fg: 'white',
            border: {
                fg: 'white'
            }
        }
    });
    const searchBox = blessed.box({
        bottom: '0',
        width: '100%',
        height: 3,
    });
    // append search input and label into box
    searchBox.append(searchLabel);
    searchBox.append(searchInput);
    return searchBox;
}
export default createSearchBox;
