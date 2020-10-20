"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRange(range) {
    let from, to;
    if (range) {
        let rangeArray = JSON.parse(range);
        from = Number(rangeArray[0]);
        to = Number(rangeArray[1]);
    }
    return [from, to];
}
exports.getRange = getRange;
function paginate(query) {
    const { sort, range, filter } = query;
    let page, perPage, field, order, from, to;
    let options = {};
    // SORT
    if (sort) {
        let sortArray = JSON.parse(sort);
        field = sortArray[0];
        order = sortArray[1];
        options.order = {
            [field]: order
        };
    }
    // RANGE
    [from, to] = getRange(range);
    if (from && to) {
        options.take = to - from;
        options.skip = from;
    }
    // WHERE
    if (filter) {
        const filterObject = JSON.parse(filter);
        if (filterObject instanceof Object) {
            // Our final output will always be in array (covers both scenarios)
            let orWhere = [];
            // Temporary collection of individual filters
            let tempWhere = {};
            // Loop through each filter search
            Object.keys(filterObject).forEach((key) => {
                if (filterObject[key] instanceof Array) {
                    // If filter is array, loop through each keys
                    filterObject[key].forEach((data) => {
                        // Merge and push previous search entries
                        let newWhere = Object.assign({ [key]: data }, tempWhere);
                        orWhere.push(newWhere);
                    });
                }
                else {
                    // Else filter is regular string, just add to search entries
                    tempWhere[key] = filterObject[key];
                    if (orWhere.length) {
                        // Array is not empty, also push update to each search entries
                        orWhere.forEach((entry) => {
                            entry[key] = filterObject[key];
                        });
                    }
                }
            });
            // if (!orWhere.length) {
            //   // orWhere.push(tempWhere)
            // }
            // Our final output will always be in array
            options.where = !orWhere.length ? tempWhere : orWhere;
        }
    }
    return options;
}
exports.default = paginate;
;
//# sourceMappingURL=paginate.js.map