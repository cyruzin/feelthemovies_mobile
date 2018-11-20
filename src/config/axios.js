import axios from 'axios'
import {
    baseURL,
    apiToken,
    tmbdURL,
    tmdbToken
} from './constants'

export default axios.create({
    baseURL: baseURL,
    headers: {
        common: {
            'Api-Token': apiToken
        }
    }
})

export const axiosTMDB = axios.create({
    baseURL: tmbdURL,
    params: {
        api_key: tmdbToken
    }
})