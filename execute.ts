const withStdDecoded = (res: Deno.CommandOutput) => ({
  ...res,
  stdout: new TextDecoder().decode(res.stdout),
  stderr: new TextDecoder().decode(res.stderr),
})

export const execute = async ([cmd, ...args]: string[]) => {
  const res = await Deno.spawnAndWait(cmd, args)
  if (!res.success) throw new Error(`Command failed with exit code ${res.code}`)
  return withStdDecoded(res)
}

const skipHostKeyChecking = ['-o', 'StrictHostKeyChecking=no']

export const executeSsh = async (ip: string, cmd: string[]) => {
  const res = await Deno.spawnAndWait('ssh', [...skipHostKeyChecking, `root@${ip}`, ...cmd])
  return withStdDecoded(res)
}

export const executeSshStreamed = async (ip: string, cmd: string[]) => {
  const { stdout } = Deno.spawn(
    'ssh',
    [...skipHostKeyChecking, `root@${ip}`, ...cmd],
    { stdout: 'piped' },
  )
  for await (const chunk of stdout) process.stdout.write(new TextDecoder().decode(chunk))
}
