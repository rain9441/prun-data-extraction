export {}
declare global {
    interface Array<T> {
        groupBy(func: (x: T) => string): { [key: string]: Array<T> },
        flatten() : T,
    }

}

Array.prototype.groupBy = function groupBy<T>(func:(x:T)=>string): { [key: string]: Array<T> } {
    return this.reduce((obj, acc) => {
        var key = func(acc);
        obj[key] = (obj[key] ?? []).concat([acc]);
        return obj;
    }, {});
}

Array.prototype.flatten = function flatten<T>(): T {
    return this.reduce((obj, x) => obj.concat(x), [])
}

