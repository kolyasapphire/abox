# abox

A small CLI tool to spin up a temporary [DigitalOcean](https://www.digitalocean.com/) VPS for safe remote [Zed](https://zed.sh/) coding sessions. It allows installing any dependencies you need and running Zed Agent without worrying about safety. When no longer needed, it takes just one command to destroy the box.

## Notable Features

1. Automatically copies your local files to the box on creation and back to your machine on deletion.
2. Updates, installs packages and reboots the box (if needed) after creation.
3. Automatically adds all SSH keys from your DigitalOcean account to the box.
4. Doesn't require adding public SSH keys to `known_hosts`.
5. Allows configuring which VPS image, size and region you need.
6. Always waits until the box is fully ready to go.

## Usage

```bash
abox
```

1. Simply run `abox` in your terminal in any directory to create a box.
2. Run it again in the same directory to destroy the box.

That's it!

## Safety

1. Runs in a [Deno sandbox](https://docs.deno.com/runtime/fundamentals/security/) with [only necessary permissions](https://github.com/kolyasapphire/abox/blob/main/deno.json#L11), you can even compile it with no pre-approved permissions at all.
2. Just one third-party dependency - [dots-wrapper](https://www.npmjs.com/package/dots-wrapper), a simple DigitalOcean API wrapper.

## Installation

### Pre-Built Binaries

1. Grab the latest binary for your platform from [GitHub Releases](https://github.com/kolyasapphire/abox/releases).
2. Give it execute permissions:

```bash
chmod +x abox
```

3. Move it to a directory in your PATH:

```bash
sudo mv abox /usr/local/bin/abox
```

If your OS doesn't want to execute the binary, allow it in settings.

If you have any doubts, check the [GitHub Workflow](https://github.com/kolyasapphire/abox/blob/main/.github/workflows/publish.yml).

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

The only thing you need to do is to get a [DigitalOcean API token](https://cloud.digitalocean.com/account/api/tokens) with the following permissions:

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
1. Create a proper non-admin user instead of using the `root` account
2. Windows support

Customisation:
1. Custom cloud config or ability to disable its parts (no upgrades, no Deno, etc)
2. Custom IDE command
3. Allow disabling IDE command completely
4. Allow disabling file transfers
