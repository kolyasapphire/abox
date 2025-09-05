<p align="center">
  <img width="200" height="234" alt="logo" src="https://github.com/user-attachments/assets/c260f63a-32e0-4092-992b-3928b5f9c9d4" />
</p>

# abox

A small CLI tool to spin up a temporary [DigitalOcean](https://www.digitalocean.com/?refcode=c428dc58f014) VPS for safe remote [Zed](https://zed.sh/) coding sessions. It allows installing any dependencies you need and running Zed Agent without worrying about safety. When no longer needed, it takes just one command to destroy the box.

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg)](https://www.digitalocean.com/?refcode=c428dc58f014)

## Notable Features

- End-to-end automated setup and teardown - even Zed is opened for you.
- Automatically copies your local files to the box on creation and back to your machine on deletion so you are ready to code asap and never lose your work.
- Updates, installs packages and reboots the box after creation if needed so you work on an a fully up-to-date fresh box.
- Automatically adds all SSH keys from your DigitalOcean to the box. Private keys are NEVER accessed or stored.
- Doesn't require adding public SSH keys to `known_hosts` so you don't have lots of temporary keys there.
- Allows configuring VPS image, size and region - get a tiny droplet or a beast of a server if required.
- Always waits until the box is fully ready to go - no manual checking necessary.

## Usage

```bash
abox
```

- Simply run `abox` in your terminal in any directory to create a box.
- Run it again in the same directory to destroy the box.

That's it!

## Safety

- Runs in a [Deno sandbox](https://docs.deno.com/runtime/fundamentals/security/) with [only necessary permissions](https://github.com/kolyasapphire/abox/blob/main/deno.json#L11), you can even compile it with no pre-approved permissions at all.
- Just one third-party dependency - [dots-wrapper](https://www.npmjs.com/package/dots-wrapper), a simple DigitalOcean API wrapper.

## Installation

### Pre-Built Binaries

1. Grab the latest binary for your platform from [GitHub Releases](https://github.com/kolyasapphire/abox/releases).
2. Give it executable permissions:

```bash
chmod +x abox
```

3. Move it to a directory in your `PATH` (`sudo` will request your password):

```bash
sudo mv abox /usr/local/bin/abox
```

If your OS doesn't want to execute the binary, allow this in settings.

If you have any security doubts, check the [GitHub Workflow](https://github.com/kolyasapphire/abox/blob/main/.github/workflows/publish.yml) for building the binaries.

### From Source

Make sure you have [Deno](https://deno.land/) installed.

Run the installation script in the project directory:

```bash
deno task install
```

That's it!

This task will compile a binary for your platform and place it in the `bin` directory (`sudo` is needed for that).

By default, the binary sandbox will be configured with these flags, but you can limit the permissions further if needed.

```bash
deno compile --allow-env --allow-read --allow-write=abox.json --allow-net=api.digitalocean.com:443 --allow-run=ssh,scp,zed
```

## Configuration

The only thing you need to do is create a [DigitalOcean API token](https://cloud.digitalocean.com/account/api/tokens) with the following permissions:

- Create Access: droplet
- Read Access: droplet / ssh_key
- Update Access: droplet
- Delete Access: droplet

Add the token to a configuration file and put it in your home directory `~/.abox.json`:

```json
{
  "TOKEN": "your_token_here"
}
```

Full options with default values:

```json
{
  "TOKEN": "your_token_here"
  "REGION": "lon1"
  "SIZE": "s-2vcpu-4gb-amd"
  "IMAGE": "ubuntu-25-04-x64"
}
```

## How It Works

1. Gets all your SSH key ids from DigitalOcean
2. Creates a droplet with the specified image, size, region and includes a cloud init script
3. Waits for the droplet to spin up, gets the IP address
4. Waits for the droplet to finish cloud init updates/installs/reboot
5. Creates a working directory on the droplet
6. Copies local files to the droplet
7. Opens Zed on your machine pointing at the working directory on the droplet
8. After `abox` is ran again, remote working directory is copied back to your local machine
9. Droplet is destroyed

After box creation, `abox` creates a `abox.json` file in the project directory with droplet ID and IP address.
It gets deleted after the box is destroyed.

## Improvement Ideas

General:
- Create a proper non-admin user instead of using the `root` account
- Windows support

Customisation:
- Custom cloud config or ability to disable its parts (no upgrades, no Deno, etc)
- Custom IDE command
- Allow disabling IDE command completely
- Allow disabling file transfers
