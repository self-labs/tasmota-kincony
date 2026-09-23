# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/).
The site has no version of its own: the firmware it serves is identified by the
`cateim/Tasmota` release it was taken from, shown at the bottom of the page.

## [Unreleased]

### Added

- **Web flasher for the KinCony AG8 and the KC868-A16 v3**, built on ESP Web Tools: plug the board in by USB-C, click **Install** in Chrome or Edge, and the house Tasmota build is written with the flash erased first. After flashing the installer offers Wi-Fi setup, since these builds keep Improv serial on.
- **The setup commands for each board on the page**, ready to copy: the GPIO template, `Module 0` sent separately, `EthType 8`, `SetOption58 1` on the AG8, and on the A16 v3 the `pcf8574.dat` and `display.ini` downloads plus `SetOption114 1`.
- **A backup warning before anything else**, with the exact esptool command for the 16 MB backup, because installing erases the KinCony KCS firmware and the browser cannot read the flash back.
- **How to move to a newer Tasmota**, in the README and on the page: merge the upstream release into the `tasmota-kincony` branch and push. Only two files carry the house changes, so that is the whole update, and the site serves the release that comes out of it.
- **Publishing workflow** that takes the latest `kincony-*` release of `cateim/Tasmota`, copies its `.factory.bin` files next to the page (release downloads send no CORS headers, so they cannot be linked), writes the release into each manifest, and deploys to GitHub Pages on every push, once a day and on demand.

### Changed

- **The page follows the Tasmota blue**, with a header, cards, feature chips per board and a footer carrying the firmware release it is serving. It also says plainly that installing writes the whole factory image with the flash erased first, and that updating a board that already runs one of these builds is an ordinary OTA of the plain `.bin`.

[Unreleased]: https://github.com/self-labs/tasmota-kincony/commits/master
