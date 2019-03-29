import { Actions } from 'react-native-router-flux'

/**
 * Receives a string and returns it limited.
 * 
 * @param {string} str - The string that needs limit.  
 * @param {number} length - The length of the string.
 * @param {number} limit - The size of the limite.
 * @returns {string} The string limited.
 */
export const limitChar = (
    str, length = 200, limit = 220
) => {
    if (str != null) {
        if (str.length > length) {
            return str.substring(0, limit) + '...';
        }
        return str
    }
}

/**
 *  Receives a number and returns a string.
 * 
 * @param {string|number} type - Recommendation number type.
 * @returns {string} Recommendation string type.
 */
export const type = type => {
    switch (parseInt(type)) {
        case 0:
            return 'Movie'
        case 1:
            return 'TV'
        case 2:
            return 'Mixed'
        default:
            return ''
    }
}

/**
 *  Receives a number and returns a string.
 * 
 * @param {string|number} type - TMDb number type.
 * @returns {string} TMDb string type.
 */
export const typeTMDB = type => {
    switch (parseInt(type)) {
        case 0:
            return 'movie'
        case 1:
            return 'tv'
        default:
            return ''
    }
}

/**
 * Go to a new scene without duplication.
 * This is a workaround.
 * 
 * @function routeFix
 * 
 * @param {string} sceneKey - Scene key
 * @param {Object} props - Props
 */
export const routeFix = (sceneKey, props = {}) => {
    if (Actions.currentScene === sceneKey) {
        return
    }
    Actions.push(sceneKey, props)
}

/**
 * Close the application if it is in the root scene.
 * This is a workaround.
 * 
 * @function onBackPress
 * @returns {bool} 
 * 
 */
export const onBackPress = () => {
    if (Actions.state.index === 0) {
        return false
    }
    Actions.pop()
    return true
}

/**
 *  Capitalize the first letter.
 */
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

/**
 *  Formats a number.
 */
Number.prototype.format = function (n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')'
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,')
}