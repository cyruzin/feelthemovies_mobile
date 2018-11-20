import { Actions } from 'react-native-router-flux'

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

export const removeHTML = str => {
    str = str.replace(/<{1}[^<>]{1,}>{1}/g, " ")
    return str
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

Number.prototype.format = function (n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

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
 * 
 */
export const onBackPress = () => {
    if (Actions.state.index === 0) {
        return false
    }
    Actions.pop()
    return true
}
