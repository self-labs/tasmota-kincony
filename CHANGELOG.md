# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/).
The site has no version of its own: the firmware it serves is identified by the
`cateim/Tasmota` release it was taken from, shown at the bottom of the page.

## [Unreleased]

### Added

- **Web flasher for the KinCony AG8 and the KC868-A16v3**, built on ESP Web Tools: plug the board in by USB-C, click **Install** in Chrome or Edge, and the house Tasmota build is written, after the installer asks whether to erase the flash. After flashing the installer offers Wi-Fi setup, since these builds keep Improv serial on.
- **The setup commands for each board on the page**, ready to copy: the GPIO template, `Module 0` sent separately, `EthType 8`, `SetOption58 1` on the AG8, and on the A16v3 the `pcf8574.dat` and `display.ini` downloads plus `SetOption114 1`.
- **A backup warning before anything else**, with the exact esptool command for the 16 MB backup, because erasing, which the installer offers and a board coming from KCS needs, removes everything the board held, and the browser cannot read the flash back.
- **How to move to a newer Tasmota**, in the README and on the page: merge the upstream release into the `tasmota-kincony` branch and push. Only two files carry the house changes, so that is the whole update, and the site serves the release that comes out of it.
- **Publishing workflow** that takes the latest `kincony-*` release of `cateim/Tasmota`, copies its `.factory.bin` files next to the page (release downloads send no CORS headers, so they cannot be linked), writes the release into each manifest, and deploys to GitHub Pages on every push, once a day and on demand.

### Changed

- **The page says which Tasmota it installs, and recognises a board that already runs it.** The footer shows `Tasmota 15.6.0.1 · kincony-YYYYMMDD-<sha>`, with the tag linked to its release: the workflow reads `TASMOTA_VERSION` at the release tag, writes it the way Tasmota does, dropping a fourth number that is zero, into a `tasmota` field, and keeps the release tag as the manifest `version`. The manifest names stay descriptive. ESP Web Tools would only recognise a board whose Improv name equals the manifest name, so each manifest also says what its board announces, in `improv_firmware` (`Tasmota AG8`, `Tasmota A16v3`), and the page hands ESP Web Tools a `checkSameFirmware` that compares against that field. A recognised board gets **Update**, written without erasing. It always does: ESP Web Tools skips the install when the board reports the manifest `version`, a board reports only the bare Tasmota version, and every house build of one Tasmota reports the same, so the manifest `version` is the release tag, which never matches. Otherwise a house-build fix would never be offered.
- **The page follows the Tasmota blue**: a hero over the blue gradient, a section on why the published binaries do not fit these boards, one card per board with its own drawing, its feature chips and whether it has been flashed on real hardware, the three steps of an install, where the firmware comes from, and a FAQ. Light and dark themes both, one column on a phone, and every command copyable in one click.
- **The page states what installing does**: it writes the whole factory image at offset 0, and on a board coming from another firmware the installer asks first whether to erase, with the box unticked, which the page says to tick coming from KCS. A board already on one of these builds is updated without erasing, from the page or by an ordinary OTA of the plain `.bin`.


### Fixed

- **The page no longer promises that Update keeps the settings**, and says to back the configuration up first. Whether it keeps them is to be tested on a board with the build that carries the 16 MB partition table.
- **The page said the installer always erases the flash.** ESP Web Tools asks, with the "Erase device" box unticked by default, and does not erase at all when it updates a board it recognises. The backup warning, the install steps, the update tile and the FAQ now say what actually happens.
- **The A16v3 was still described as never flashed.** It was flashed from the page and runs on a board, with the expanders, the clock and the analog inputs detected at boot; the status line and the FAQ say that its relays and inputs are what is left to verify.
- **The board name is KC868-A16v3**, with no space, everywhere on the page and in the documentation.
- **The A16v3 file downloads answered 404 to everyone.** `pcf8574.dat` and `display.ini` were linked from `raw.githubusercontent.com` in a private repository, which serves nothing without a token, not even to its owner. Both files are now served from the site itself, from [`site/files/`](./site/files/).
- **Three links led to a private repository.** The two "full guide" links and the one in the footer opened only for someone with access to it. They are gone rather than promising a page the reader cannot open; the AG8 card points at Tasmota IR, which is public.
- **What it takes to go back to KCS.** The page claimed KinCony does not publish the KCS image and that without a backup there was no way back. They do publish it, on their [forum](https://www.kincony.com/forum/forumdisplay.php?fid=75), one zip per board and no account needed, and the file inside is a complete image with bootloader and partition table, so `write_flash 0x0` restores it. The backup still matters, for the settings, the scenes and the IR codes learned into the KCS slots, which no download brings back.

[Unreleased]: https://github.com/self-labs/tasmota-kincony/commits/master
