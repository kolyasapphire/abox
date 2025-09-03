export const execute = async ([cmd, ...args]: string[]) => {
  const res = await new Deno.Command(cmd, { args: args }).output()

  if (!res.success) throw new Error(`Command failed with exit code ${res.code}`)

  return res
}

export const executeSsh = async (ip: string, cmd: string[]) =>
  await new Deno.Command('ssh', { args: ['-o', 'StrictHostKeyChecking=no', `root@${ip}`, ...cmd] })
    .output()
