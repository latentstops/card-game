export function joinWithSlash(){
    return join(Array.apply(null, arguments), '/');
}

export function join(paths, separator = '/'){
    return paths.join( separator );
}
