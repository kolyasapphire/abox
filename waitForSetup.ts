import { executeSsh } from './execute.ts'
import { wait } from './utils.ts'

export const waitForSetup = async (ip: string) => {
  while (true) {
    const ssh = await executeSsh(ip, [
      'cloud-init status --wait --format json',
    ])
    if (ssh.code === 0) break
    await wait()
  }
}
