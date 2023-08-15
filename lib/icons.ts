const icons: any = {
    'check' : '',
    'play' : '',
    'search' : '',
    'download': ''
}

export function icon(name: string){
    return icons[name] ?? 'x';
}