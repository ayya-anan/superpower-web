export const REMOVEIDS = (obj: any): any => {
    if (obj instanceof Array) {
        return obj.map((item) => REMOVEIDS(item));
    } else if (obj instanceof Object && obj !== null) {
        const newObj: any = {};
        for (const key in obj) {
            if (key !== '_id') {
                newObj[key] = REMOVEIDS(obj[key]);
            }
        }
        return newObj;
    } else {
        return obj;
    }
};
