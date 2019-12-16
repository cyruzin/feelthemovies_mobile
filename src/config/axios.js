import axios from 'axios'
import {
    baseURL,
    tmbdURL,
    tmdbToken
} from './constants'

export default axios.create({
    baseURL
})

export const axiosTMDB = axios.create({
    baseURL: tmbdURL,
    params: {
        api_key: tmdbToken
    }
})
