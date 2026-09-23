# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/).
The site has no version of its own: the firmware it serves is identified by the
`cateim/Tasmota` release it was taken from, shown at the bottom of the page.

## [Unreleased]

### Added

- **Web flasher for the KinCony AG8 and the KC868-A16 v3**, built on ESP Web Tools: plug the board in by USB-C, click **Install** in Chrome or Edge, and the house Tasmota build is written with the flash erased first. After flashing the installer offers Wi-Fi setup, since these builds keep Improv serial on.
- **The setup commands for each board on the page**, ready to copy: the GPIO template, `Module 0` sent separately, `EthType 8`, `SetOption58 1` on the AG8, and on the A16 v3 the `pcf8574.dat` and `display.ini` downloads plus `SetOption114 1`.
- **A backup warning before anything else**, with the exact esptool command for the 16 MB backup, because installing erases everything the board held and the browser cannot read the flash back.
- **How to move to a newer Tasmota**, in the README and on the page: merge the upstream release into the `tasmota-kincony` branch and push. Only two files carry the house changes, so that is the whole update, and the site serves the release that comes out of it.
- **Publishing workflow** that takes the latest `kincony-*` release of `cateim/Tasmota`, copies its `.factory.bin` files next to the page (release downloads send no CORS headers, so they cannot be linked), writes the release into each manifest, and deploys to GitHub Pages on every push, once a day and on demand.

### Changed

- **The page follows the Tasmota blue**: a hero over the blue gradient, a section on why the published binaries do not fit these boards, one card per board with its own drawing, its feature chips and whether it has been flashed on real hardware, the three steps of an install, where the firmware comes from, and a FAQ. Light and dark themes both, one column on a phone, and every command copyable in one click.
- **The page states what installing does**: it writes the whole factory image with the flash erased first, so a board comes out on the release shown at the bottom whatever it was running. Updating a board that already runs one of these builds is an ordinary OTA of the plain `.bin`, and does not need the site.


### Fixed

- **What it takes to go back to KCS.** The page claimed KinCony does not publish the KCS image and that without a backup there was no way back. They do publish it, on their [forum](https://www.kincony.com/forum/forumdisplay.php?fid=75), one zip per board and no account needed, and the file inside is a complete image with bootloader and partition table, so `write_flash 0x0` restores it. The backup still matters, for the settings, the scenes and the IR codes learned into the KCS slots, which no download brings back.

[Unreleased]: https://github.com/self-labs/tasmota-kincony/commits/master
