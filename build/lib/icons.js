const icons = {
    'check': '',
    'play': '',
    'search': '',
    'download': ''
};
export function icon(name) {
    return icons[name] ?? 'x';
}
