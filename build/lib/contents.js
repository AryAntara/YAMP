// localvariable
let contents = [];
// set contents 
export function setItems(items) {
    contents = items;
}
// get content by Index 
export function getItem(index) {
    return contents[index];
}
export function getAll() {
    return contents;
}
