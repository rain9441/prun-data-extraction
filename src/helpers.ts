export {}
declare global {
    interface Array<T> {
        flatten() : T,
        groupBy(func: (x: T) => string): { [key: string]: Array<T> },
        toDictionary(func: (x: T) => string): { [key: string]: T },
    }

}

Array.prototype.flatten = function flatten<T>(): T {
    return this.reduce((obj, x) => obj.concat(x), [])
}

Array.prototype.groupBy = function groupBy<T>(func:(x:T)=>string): { [key: string]: Array<T> } {
    return this.reduce((obj, acc) => {
        var key = func(acc);
        obj[key] = (obj[key] ?? []).concat([acc]);
        return obj;
    }, {});
}

Array.prototype.toDictionary = function toDictionary<T>(func:(x:T)=>string): { [key: string]: T } {
    return this.reduce((obj, acc) => {
        var key = func(acc);
        if (!obj[key]) {
            obj[key] = acc;
        }
        return obj;
    }, {});
}

