import type { State } from './types.ts'

const FILE = 'abox.json'

const tryLoadState = async () => {
  try {
    const stateFile = await Deno.readTextFile(FILE)
    const state = JSON.parse(stateFile) as State
    return state
  } catch {
    return undefined
  }
}

const saveState = async (state: State) => await Deno.writeTextFile(FILE, JSON.stringify(state))

const removeState = async () => await Deno.remove(FILE)

export const state = { remove: removeState, save: saveState, load: tryLoadState }
