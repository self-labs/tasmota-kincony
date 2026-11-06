# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/).
Versions follow **CalVer `YYYY.M.R`** (year, month without a leading zero,
revision within the month) and are git tags of this repository, `vYYYY.M.R`:
they date the page, the README and the workflow. The firmware the page serves
has an identity of its own, the `cateim/Tasmota` release it was taken from,
shown at the bottom of the page.

## [Unreleased]

### Added

- **A project icon, at the top of both READMEs.** It is the Tasmota symbol with a firmware chip in the bottom right, drawn like the IR badge of `self-labs/tasmota-ir`, with a gap opened in the symbol around the chip. `assets/icon.svg` is black for light backgrounds and `assets/icon-dark.svg` is Tasmota blue for dark ones; the READMEs pick between them with `prefers-color-scheme`, and `icon.png` and `icon-dark.png` are the same two at 512 px, rendered with `rsvg-convert`, for anywhere an SVG is not taken.
- **A network watchdog for both boards, `autoexec.be`.** Tasmota sets the Ethernet up once, at boot, and the restart it does after 100 failed Wi-Fi attempts never runs with the Wi-Fi off, so a board on the cable alone (`Wifi 0`) whose Ethernet fails at boot stays off the network until it is power cycled. The script, served from `site/files/`, restarts the board when the network has not come up 10 minutes after boot, doubling the wait after each restart in a row up to 80 minutes, and leaves alone a network that came up and dropped later; `EthWatchdog` in the console shows its state. The A16v3 uploads it with `pcf8574.dat` in step 4, and the AG8 card gains a step of its own, seven steps now. No firmware change. Checked on an A16v3 on 6 November 2026 by forcing the trigger, and running on seven boards of two clients the same day; a board left without its cable, and any AG8, are still to be tried, and the page says so. Both READMEs follow.

### Changed

- **The page's favicon carries the chip too.** It is the same white mark on the Tasmota blue tile as before, now with the chip, and moved out of the inline data URI into `site/favicon.svg`, which the Pages workflow publishes with the rest of `site/`.
- **The logo in the navigation bar carries the chip too.** It was still an inline copy of the plain Tasmota symbol; it now loads `site/favicon.svg`, so the tab and the bar show the same icon and the chip has one copy on the page. In dark mode the tile is the favicon's `#1fa3ec`, a shade darker than the `--blue` the inline copy used.
- **`display.ini` is no longer a download on the page.** No board here turns the display on, and none is expected to. The file stays in `site/files/`, and the A16v3 template note links it for a board without the strip that wants the display; the files step and its footer now carry `pcf8574.dat` and `autoexec.be`. Both READMEs follow.

## [2026.10.4] - 2026-10-30

### Added

- **Optional A16v3 relay names, `OUT1` to `OUT16`.** After the input names, the Inputs step offers two more lines: `FriendlyName1` to `FriendlyName8` as `OUT1` to `OUT8`, the names Home Assistant gives relays 1 to 8, and `WebButton1` to `WebButton16` as `OUT1` to `OUT16`, the text of the relay buttons on the board's own page. Tasmota keeps only 8 relay names (`FriendlyName9` answers `Command Error`), so the step says that relays 9 to 16 arrive as `switch 9` to `switch 16` and the strip as `light 17`, to be renamed in Home Assistant itself (`config_get_friendlyname` in `hatasmota/utils.py`). Both READMEs follow. The buttons were checked on five boards in two clients on 30 October 2026, with the entity ids already in Home Assistant left untouched, and a board that joined Home Assistant that day with the names already set came in as `switch.<device>_out1` to `out8`.

## [2026.10.3] - 2026-10-25

### Changed

- **A16v3 inputs show up in Home Assistant, and each one still toggles its own relay, through rules.** The Inputs step now sends `Backlog SetOption114 1; SwitchMode0 2`, then two rules, `Rule1` for inputs 1 to 8 and `Rule2` for 9 to 16, each `ON Switch<n>#State DO Power<n> TOGGLE ENDON` (319 and 333 characters of the 511 a rule holds), each on its own copy button and never inside a `Backlog`, then `Backlog Rule1 1; Rule2 1`. With `SetOption114 1` an input never drives a relay by itself but still reaches the rules and is announced to Home Assistant, which creates the 16 inputs as binary sensors next to the relays; in `SwitchMode 2` a rule with no value fires on both edges, so every flip of a wall switch toggles the relay, on the board, with no Home Assistant and no network. Per channel the step says how to point an input at another relay, make it a pushbutton (`Switch<n>#State=1`, mode 2 kept) or leave it out of the rule, and an optional `SwitchText1` to `SwitchText16` line names the inputs `IN1` to `IN16`. The previous setup, `SetOption114 0; SwitchMode0 0`, became the variant, with `Rule1 0; Rule2 0` added so it also undoes the rules. The README's table and notes follow. Checked on two boards in a client's restaurant on 25 October 2026, switch by switch: every flip toggles its relay and the input changes in Home Assistant at once.

## [2026.10.2] - 2026-10-23

### Added

- **The page in Brazilian Portuguese, with a language switch.** An EN | PT switch sits in the top bar. The visitor's own choice comes first and is remembered in the browser; with no choice made, a browser in any Portuguese (pt-BR, pt-PT) gets pt-BR and any other language gets English. The English stays in `index.html`; the Portuguese lives in `site/i18n.js`, keyed by each element's `data-i18n`, and also covers the messages of Find my board, the Copy buttons and the version line. The installer's own dialog stays in English: it comes from ESP Web Tools. Checked in Chromium with pt-BR, pt-PT, en-US and es-ES browsers, switching both ways and reloading.
- **The README in Brazilian Portuguese**, `README.pt-BR.md`, with a link between the two at the top of each.

### Changed

- **The name is Tasmota KinCony**, the same in both languages: the top bar sets "KinCony" in a lighter weight instead of joining the two with "for", and the browser tab, the link preview and both READMEs follow.
- **A16v3 inputs default to latching switches.** The Inputs step now sends `Backlog SetOption114 0; SwitchMode0 0`: every flip of a wall switch toggles its relay, which is what most houses have, and the switch position never has to match the relay when Home Assistant switches it too. A pushbutton became the per-channel exception, `SwitchMode<n> 3`. The README's table and notes follow. Two boards in a client's restaurant were set this way on 23 October 2026, read back from the boards; the switches themselves have not been flipped yet.
- **On a phone the top bar keeps only the name and the language switch**, since the hero already leads to the boards and the footer links the source.

### Fixed

- **The page scrolled sideways on a phone.** The board cards asked for at least 330 px, wider than a 360 px screen leaves after its margins; they now shrink to the screen.

## [2026.10.1] - 2026-10-02

### Changed

- **Each A16v3 input now drives its own relay, always.** The Inputs step sends `Backlog SetOption114 0; SwitchMode0 3`: input 1 switches relay 1 and so on, on the board itself, with no Home Assistant and no network, and each press of a pushbutton, the usual case, toggles the relay. The step also shows how to give a single input a latching switch (`SwitchMode<n> 0`, every flip toggles the relay, so the switch never has to match the relay when Home Assistant switches it too) and how to make a single relay pulse (`PulseTime<n>`), and keeps the previous setup, `Backlog SetOption114 1; SwitchMode0 2`, as a variant with its own copy button for inputs that only report to Home Assistant. It says what each choice costs: with `SetOption114 0` Tasmota announces no inputs (`xdrv_12_discovery.ino`), so Home Assistant shows only the relays, and moving between the two removes or recreates the 16 input sensors there. Read from the firmware code; on the house board only the variant has been tried so far. The README's table and notes follow.

## [2026.9.1] - 2026-09-26

### Added

- **Find my board**, a section of its own: it opens the board's USB port from the page, asks `Status 5` and shows the Wi-Fi and cable addresses as links to the board's own page, with its hostnames; nothing is written. A board started from 12 V before the USB went in does not listen on USB, so when there is no answer a second button restarts it through the USB-Serial-JTAG reset lines, the way the installer's console does, waits for the port to come back and asks until an address appears. Only boards with Espressif's USB id are offered. Tried on both boards, the AG8 and the A16v3: it showed their addresses.
- **How to find a board on the network, in the FAQ**: `Status 5` in the installer's Logs & Console gives the Wi-Fi address in `IPAddress` and the cable's inside `"Ethernet"`. It also says the one condition that bites: Tasmota only takes the USB as its console when a host is there at boot (`tasmota.ino`, "Fall back to serial port, no SOF packet detected on USB port"), so a board already running from 12 V has to be restarted with the USB plugged in.
- **Web flasher for the KinCony AG8 and the KC868-A16v3**, built on ESP Web Tools: plug the board in by USB-C, click **Install** in Chrome or Edge, and the house Tasmota build is written, after the installer asks whether to erase the flash. After flashing the installer offers Wi-Fi setup, since these builds keep Improv serial on.
- **The setup commands for each board on the page**, ready to copy: the GPIO template, `Module 0` sent separately, `EthType 8`, `SetOption58 1` on the AG8, and on the A16v3 the `pcf8574.dat` and `display.ini` downloads plus `SetOption114 1`.
- **A backup warning before anything else**, with the exact esptool command for the 16 MB backup, because erasing, which the installer offers and a board coming from KCS needs, removes everything the board held, and the browser cannot read the flash back.
- **How to move to a newer Tasmota**, in the README and on the page: merge the upstream release into the `tasmota-kincony` branch and push. Only two files carry the house changes, so that is the whole update, and the site serves the release that comes out of it.
- **Publishing workflow** that takes the latest `kincony-*` release of `cateim/Tasmota`, copies its `.factory.bin` files next to the page (release downloads send no CORS headers, so they cannot be linked), writes the release into each manifest, and deploys to GitHub Pages on every push, once a day and on demand.

### Changed

- **The README follows the page again.** It gains an install walkthrough, the after-flashing steps of each board as a table with what every command is for, the LED strip on `GPIO41` and why the display stays off, how to find a board on the network, and a troubleshooting section: "Disconnected" after the Wi-Fi step, a skipped Wi-Fi screen, the A16v3 that only joins a router close by without its external antenna, and "SHA-256 comparison failed". What Install and Update write moved out of the section on updating Tasmota, where it did not belong.
- **The A16v3 template brings the LED strip.** `GPIO41`, pin 3 of the `P12` header beside the ESP32-S3, is `WS2812` (`1376`) from the first install, and a seventh step sets `Pixels 7` and `Dimmer 30`: 30% because the strip draws from the board's 5 V, the rail the ESP32 runs on. With no strip wired, the light it creates lights nothing. The `P12` pin order, `39 40 41 GND 3V3` with the square pad on `3V3`, comes from KinCony's own board drawing.
- **The A16v3 is marked green**: 16 relays, 16 inputs and Ethernet without USB checked on the board. The FAQ entry explaining the amber mark is gone with it.
- **The page says which Tasmota it installs, and recognises a board that already runs it.** The footer shows `Tasmota 15.6.0.1 · kincony-YYYYMMDD-<sha>`, with the tag linked to its release: the workflow reads `TASMOTA_VERSION` at the release tag, writes it the way Tasmota does, dropping a fourth number that is zero, into a `tasmota` field, and keeps the release tag as the manifest `version`. The manifest names stay descriptive. ESP Web Tools would only recognise a board whose Improv name equals the manifest name, so each manifest also says what its board announces, in `improv_firmware` (`Tasmota AG8`, `Tasmota A16v3`), and the page hands ESP Web Tools a `checkSameFirmware` that compares against that field. A recognised board gets **Update**, written without erasing. It always does: ESP Web Tools skips the install when the board reports the manifest `version`, a board reports only the bare Tasmota version, and every house build of one Tasmota reports the same, so the manifest `version` is the release tag, which never matches. Otherwise a house-build fix would never be offered.
- **The page follows the Tasmota blue**: a hero over the blue gradient, a section on why the published binaries do not fit these boards, one card per board with its own drawing, its feature chips and whether it has been flashed on real hardware, the three steps of an install, where the firmware comes from, and a FAQ. Light and dark themes both, one column on a phone, and every command copyable in one click.
- **The page states what installing does**: it writes the whole factory image at offset 0, and on a board coming from another firmware the installer asks first whether to erase, with the box unticked, which the page says to tick coming from KCS. A board already on one of these builds is updated without erasing, from the page or by an ordinary OTA of the plain `.bin`.

### Fixed

- **Find my board showed its second button and an empty result box from the start.** `.btn` and the result box set their own `display`, which beats the browser's rule for the `hidden` attribute, so hiding them did nothing. A `.finder [hidden]` rule puts it back: the restart button now only appears when the board does not answer.
- **The A16v3 template leaves the display off, and says why.** For a few hours on 25 September it marked `GPIO45` as Option A3, which Tasmota needs before it starts its display driver (`xdsp_17_universal.ino:72`). The display then takes a power slot of its own (`xdrv_13_display.ino`, `UpdateDevicesPresent(1)`): after the 16 relays it became power 17, the strip light moved to 18 and stopped answering in Home Assistant, as seen on the board. The mark is gone again, step 2 explains the trade-off and how to turn the display on for a board without the strip, and the optional `autoexec.be` that wrote the addresses on the display is withdrawn with it. The note under the two files no longer promises a screen `display.ini` alone cannot give.
- **"Disconnected" right after the Wi-Fi step looked like a failure.** Tasmota restarts to join the network as soon as Improv hands it the Wi-Fi (`xdrv_62_improv.ino`, "Set SSID and Password and restart"), and these boards expose USB straight from the ESP32-S3, so the restart makes the port vanish from the browser. The Wi-Fi step now says so: the network is already saved, wait 20 seconds and look for the board on the router or in Home Assistant.
- **"SHA-256 comparison failed" in the serial log is now explained on the page.** It looks like a broken flash and is not: the ROM checks the hash stored at the end of the bootloader, and without secure boot a mismatch only prints a warning and boots. Builds from before 24 September 2026 declared 4 MB in the bootloader header; on its first boot Tasmota rewrites that byte to the real 16 MB (`resize_max_flash_size_k` in `partition_core.be`, called from `resize_fs_to_max`) and leaves the hash alone. Checked against the logs of both boards: the *Expected* hash is the bootloader with a 4 MB header, `0x2f`, and the *Calculated* one the same bootloader with 16 MB, `0x4f`. The current release declares 16 MB with a matching hash, verified inside both `.factory.bin`, so a board written from the page stops printing it; an OTA keeps the old bootloader and the harmless message.
- **The after-flashing steps were hard to follow.** Commands sat inline in the text, and the reader had to work out which part to type. Every step now has a title, each command is its own block with a **Copy** button (`Module 0`, `EthType 8`, `SetOption58 1`, `Restart 1` and the `Backlog` lines included), and each part of a `Backlog` is explained under it. A line above the list says where commands go, **Tools → Console**. The Wi-Fi step says the installer asks for the network right after flashing, and that the `tasmota-XXXX` access point at `http://192.168.4.1` is the way in only when that screen was skipped, since Tasmota opens it only with no Wi-Fi saved (`support_wifi.ino:1255-1257`). Commands wrap instead of scrolling sideways, so a phone shows them whole, and a long line no longer shows through the **Copy** button.
- **The file system page was under "Consoles".** Tasmota's menu is **Tools** (`D_MANAGEMENT` in `language/en_GB.h`), and the page now says **Tools → Manage File system**.
- **The step counts were wrong**: "four commands" over five steps on the AG8 and "five steps" over six on the A16v3. Both now say six, and match.
- **The A16v3 inputs came up with their halves swapped.** Closing input 16 on the board changed `Switch8`, and every other input showed the same offset of 8: the chip at `0x21` carries inputs 9 to 16 and `0x22` inputs 1 to 8, the opposite of what the name of the component in KinCony's own YAML suggested. `site/files/pcf8574.dat` now maps `0x21` to `Switch9` to `Switch16` and `0x22` to `Switch1` to `Switch8`; the relays were already in order.
- **The A16v3 inputs never reached Home Assistant.** The Tasmota integration only creates a binary sensor for switch mode 1 or 2, and offers mode 0, Tasmota's default, as automation triggers only. The after-flashing steps now include `SwitchMode0 2`, which sets all 16 at once and reads a closed contact as on.
- **Update keeps the settings, tested.** On the A16v3, an Update from the page to `kincony-20260924-97ba55c`, the first release carrying the 16 MB partition table, kept the configuration, and the filesystem came back at the same 12592 kB. The page and the README say so, and still suggest a configuration backup first.
- **The page recommends the two settings that stop these boards wiping themselves**: `SetOption65 1`, since seven quick power cycles erase every setting, and `SetOption36 0`, since five or six quick restarts clear the template and the module. It also says Tasmota ships at UTC+1 and to set `Timezone`.
- **The page said the installer always erases the flash.** ESP Web Tools asks, with the "Erase device" box unticked by default, and does not erase at all when it updates a board it recognises. The backup warning, the install steps, the update tile and the FAQ now say what actually happens.
- **The A16v3 was still described as never flashed.** It was flashed from the page and runs on a board, with the expanders, the clock and the analog inputs detected at boot; the status line and the FAQ say that its relays and inputs are what is left to verify.
- **The board name is KC868-A16v3**, with no space, everywhere on the page and in the documentation.
- **The A16v3 file downloads answered 404 to everyone.** `pcf8574.dat` and `display.ini` were linked from `raw.githubusercontent.com` in a private repository, which serves nothing without a token, not even to its owner. Both files are now served from the site itself, from [`site/files/`](./site/files/).
- **Three links led to a private repository.** The two "full guide" links and the one in the footer opened only for someone with access to it. They are gone rather than promising a page the reader cannot open; the AG8 card points at Tasmota IR, which is public.
- **What it takes to go back to KCS.** The page claimed KinCony does not publish the KCS image and that without a backup there was no way back. They do publish it, on their [forum](https://www.kincony.com/forum/forumdisplay.php?fid=75), one zip per board and no account needed, and the file inside is a complete image with bootloader and partition table, so `write_flash 0x0` restores it. The backup still matters, for the settings, the scenes and the IR codes learned into the KCS slots, which no download brings back.

[Unreleased]: https://github.com/self-labs/tasmota-kincony/compare/v2026.10.4...HEAD
[2026.10.4]: https://github.com/self-labs/tasmota-kincony/compare/v2026.10.3...v2026.10.4
[2026.10.3]: https://github.com/self-labs/tasmota-kincony/compare/v2026.10.2...v2026.10.3
[2026.10.2]: https://github.com/self-labs/tasmota-kincony/compare/v2026.10.1...v2026.10.2
[2026.10.1]: https://github.com/self-labs/tasmota-kincony/compare/v2026.9.1...v2026.10.1
[2026.9.1]: https://github.com/self-labs/tasmota-kincony/releases/tag/v2026.9.1
