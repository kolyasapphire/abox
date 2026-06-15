export const cloudConfig = `#cloud-config

package_update: true
package_upgrade: true
package_reboot_if_required: true
timezone: Etc/UTC

packages:
  - python3
  - python3-pip
  - unzip

runcmd:
  - "curl -fsSL https://deno.land/install.sh | sudo -E DENO_INSTALL=/usr/local sh -s -- -y"
  - "curl -fsSL https://chatgpt.com/codex/install.sh | CODEX_NON_INTERACTIVE=1 CODEX_INSTALL_DIR=/usr/local/bin HOME=/root sh"
`
