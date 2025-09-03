import { WAIT_TIME } from './settings.ts'

export const wait = () => new Promise((r) => setTimeout(r, WAIT_TIME))
