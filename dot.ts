import { createApiClient } from 'dots-wrapper'
import { cloudConfig } from './cloudConfig.ts'
import { settings } from './settings.ts'
import { wait } from './utils.ts'

const dots = createApiClient({ token: settings.TOKEN })

const getSshKeyIds = async () => {
  const sshKeys = await dots.sshKey.listSshKeys({})
  return sshKeys.data.ssh_keys.map((key) => key.id)
}

const createDroplet = async () => {
  const creation = await dots.droplet.createDroplet({
    name: 'ai-box',
    region: settings.REGION,
    size: settings.SIZE,
    image: settings.IMAGE,
    ssh_keys: await getSshKeyIds(),
    user_data: cloudConfig,
  })
  return creation.data.droplet.id
}

const waitForDropletIp = async (id: number) => {
  while (true) {
    const droplet = await dots.droplet.getDroplet({ droplet_id: id })
    if (droplet.data.droplet.status === 'active') {
      return droplet.data.droplet.networks.v4[0].ip_address
    }
    await wait()
  }
}

const deleteDroplet = async (id: number) => {
  try {
    await dots.droplet.deleteDroplet({ droplet_id: id })
    console.log('Deleted!')
  } catch (error) {
    if ((error as Error).message.includes('status code 404')) {
      console.error('Droplet not found, probably already deleted')
      console.log('Check the dashboard just in case')
    } else throw new Error('Failed to delete droplet', { cause: error })
  }
}

export const dot = { createDroplet, waitForDropletIp, deleteDroplet }
