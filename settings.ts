import type { Settings } from './types.ts'

let TOKEN = ''
let REGION = 'lon1'
let SIZE = 's-2vcpu-4gb-amd'
let IMAGE = 'ubuntu-25-04-x64'

const loadSettings = async () => {
  const home = Deno.env.get('HOME') ?? Deno.env.get('USERPROFILE')
  if (!home) throw new Error('Cannot determine home directory')

  try {
    const text = await Deno.readTextFile(`${home}/.abox.json`)
    const json = JSON.parse(text) as Settings

    TOKEN = json.TOKEN
    REGION = json.REGION || REGION
    SIZE = json.SIZE || SIZE
    IMAGE = json.IMAGE || IMAGE
  } catch (error) {
    throw new Error('Error loading settings', { cause: error })
  }
}

await loadSettings()

export const settings: Settings = { TOKEN, REGION, SIZE, IMAGE }

export const WAIT_TIME = 3_000
