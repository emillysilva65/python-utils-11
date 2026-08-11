function parseJson(data) {
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error('Parsing error:', error);
        return null;
    }
}

function stringifyData(data) {
    return JSON.stringify(data, (key, value) => {
        if (value instanceof Map) {
            return {
                dataType: 'Map',
                value: Array.from(value.entries()),
            };
        } else if (value instanceof Set) {
            return {
                dataType: 'Set',
                value: Array.from(value),
            };
        }
        return value;
    });
}

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function mergeDeep(target, source) {
    for (const key in source) {
        if (source[key] instanceof Object) {
            if (!target[key]) Object.assign(target, { [key]: {} });
            mergeDeep(target[key], source[key]);
        } else {
            Object.assign(target, { [key]: source[key] });
        }
    }
    return target;
}

const utils = {
    parseJson,
    stringifyData,
    deepClone,
    mergeDeep,
};

export default utils;
