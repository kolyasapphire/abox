import { dot } from './dot.ts'
import { execute } from './execute.ts'
import { state } from './state.ts'
import { waitForSetup } from './waitForSetup.ts'

const currentDir = Deno.cwd()
const initialState = await state.load()

if (initialState) {
  console.log('Getting files from the droplet...')
  if (!initialState.ip) throw new Error('IP not found in state')
  await execute(['scp', '-r', `root@${initialState.ip}:/root/abox`, `${currentDir}/abox`])

  console.log('Deleting the box...')
  await dot.deleteDroplet(initialState.id)
  await state.remove()

  Deno.exit()
}

console.log('Creating a box')
const id = await dot.createDroplet()
await state.save({ id })

console.log('Waiting for the droplet to launch...')
const ip = await dot.waitForDropletIp(id)
console.log('Droplet is active!', 'IP:', ip)
await state.save({ id, ip })

console.log('Waiting for the server upgrade & installs...')
await waitForSetup(ip)

console.log('Copying files to the droplet...')
await execute(['scp', '-r', currentDir, `root@${ip}:/root/abox`])

console.log('Opening Zed...')
await execute(['zed', `ssh://root@${ip}/root/abox`, '--', '-o', 'StrictHostKeyChecking=no'])
