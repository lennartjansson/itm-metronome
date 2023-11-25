export function staticPath(path) {
    if (!path.startsWith('/')) {
        path = '/' + path;
    }

    return process.env.PUBLIC_URL + path;
}
