'use strict';

/**
 * Get regexp to search strings (separated by spaces)
 *
 * @param searchString
 * @returns regexp
 */
const wordSearch = (searchString) => {
    const regString = searchString.split(' ')
        .join('.*?|.*?');
    const regexp = new RegExp('.*?' + regString + '.*?', 'i');
    return regexp;
};

module.exports = wordSearch;