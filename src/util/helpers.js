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
            return 'Serie'
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

export const toMoney = (number) => {
    var number = number.toFixed(2).split('.');
    number[0] = "U$ " + number[0].split(/(?=(?:...)*$)/).join('.');
    return number.join(',');
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
 * 
 */
export const onBackPress = () => {
    if (Actions.state.index === 0) {
        return false
    }
    Actions.pop()
    return true
}
