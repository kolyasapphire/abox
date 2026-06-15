import { executeSsh } from './execute.ts'
import { wait } from './utils.ts'

export const waitForSetup = async (ip: string) => {
  while (true) {
    const { stdout: status } = await executeSsh(ip, ['cloud-init status'])

    if (status.includes('status: error')) {
      const err = await executeSsh(ip, ['cloud-init status --long'])
      throw new Error(`Setup failed: ${err.stdout}`)
    }

    if (status.includes('status: done')) break

    await wait()
  }
}
