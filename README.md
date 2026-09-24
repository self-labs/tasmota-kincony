# ⚡ Tasmota for KinCony

A web flasher for the Tasmota builds made for KinCony boards. Open the page in
Chrome or Edge, plug the board in by USB-C, and click **Install**: no Python, no
esptool, no PlatformIO.

**[self-labs.github.io/tasmota-kincony](https://self-labs.github.io/tasmota-kincony/)**

## Why not the official Tasmota installer

The official binaries do not fit these boards:

- **KinCony AG8.** The standard `tasmota32s3` build has the basic IR driver,
  which cannot choose among the 8 emitters. The `tasmota32-ir` preset has the
  full one but drops 97 features to fit a 4 MB ESP32, SPI among them, and with
  it the W5500 Ethernet. This build is the full `tasmota32s3` plus the full IR
  driver.
- **KinCony KC868-A16v3.** Its 16 relays and 16 inputs sit behind PCF8574
  expanders, and `USE_PCF8574` is off in every official build, so the board
  boots with nothing to switch.

Both builds also carry a fix that official Tasmota only gets in the release
after 15.6.0 ([arendst/Tasmota#25047](https://github.com/arendst/Tasmota/pull/25047)):
without it, the W5500 Ethernet of these boards only comes up while a USB cable
is plugged in.

## Boards

| Board                | Build               | Status                                                     |
| -------------------- | ------------------- | ---------------------------------------------------------- |
| KinCony AG8          | `tasmota32s3-ag8`   | in use: 8 emitters, receiver, Ethernet without USB         |
| KinCony KC868-A16v3  | `tasmota32s3-a16v3` | flashed in September 2026; relays and inputs being verified |

## Before you flash

- **Chrome or Edge on a desktop.** Flashing uses Web Serial, which Firefox,
  Safari, Android and iOS do not have.
- **Back up the board.** Erasing, which the installer offers and a board
  coming from KCS needs, wipes the whole flash, and the browser cannot read it
  back. The KCS firmware itself is published per board on the
  [KinCony forum](https://www.kincony.com/forum/forumdisplay.php?fid=75), and
  the file inside the zip is a complete image that goes back at offset 0, so a
  board is never stranded. What no download brings back is what the board held:
  the settings, the scenes and the IR codes learned into the KCS slots. Take
  the 16 MB backup with esptool first; the page has the exact command.
- If the board is not found, put it in download mode: hold **DW**, tap
  **RST**, release **DW**.

## How it works

```text
cateim/Tasmota, branch tasmota-kincony
  └── every push builds both boards and publishes a release, kincony-YYYYMMDD-<sha>

self-labs/tasmota-kincony (this repository)
  └── the Pages workflow takes the latest of those releases, copies the
      .factory.bin files next to the page, stamps the release into the
      manifests, and publishes the site
```

The binaries are copied onto the site rather than linked, because ESP Web Tools
fetches them from the browser and GitHub release downloads send no CORS
headers. The site redeploys on every push here, once a day, and on demand from
the **Actions** tab.

## Updating to a newer Tasmota

The firmware is Tasmota itself plus the two environments these boards need, on
the `tasmota-kincony` branch of `cateim/Tasmota`. Updating is merging upstream
into it:

```bash
git remote add upstream https://github.com/arendst/Tasmota.git   # once
git fetch upstream --tags
git checkout tasmota-kincony
git merge v15.7.0          # or whichever release you are moving to
git push origin tasmota-kincony
```

The push builds both boards, publishes `kincony-YYYYMMDD-<sha>` and marks it as
the latest release. This site picks that up on its next run, which is daily, on
any push here, or on demand from the **Actions** tab. The version served is the
one printed at the bottom of the page.

Only two files carry the house changes: `platformio_tasmota_cenv.ini`, with the
two environments, and the workflow that builds and releases them. A merge
conflict in either is the only thing an upstream release can break.

**The install button writes the factory image** at offset 0: bootloader,
partition table, application and safeboot. What happens before that depends on
the board.

- **A board already running one of these builds** is recognised. It announces
  itself over Improv as `Tasmota AG8` or `Tasmota A16v3` (the `CODE_IMAGE_STR`
  of its build), each manifest names that string in `improv_firmware`, and the
  page hands ESP Web Tools a `checkSameFirmware` that compares the two, keeping
  the descriptive `name`. The page offers **Update**, written without erasing.
  Back the configuration up first (Configuration, Backup).
- **The partition table matters.** On the first boot with fresh settings
  Tasmota grows the filesystem to the end of the flash and rewrites the table
  (`resize_fs_to_max`, run from `xdrv_52_7_berry_embedded.ino` when the boot
  count is 0). The images carry that grown 16 MB table, so writing one again
  does not shrink the filesystem where the settings live.
- **Why always Update.** ESP Web Tools skips the install when the version the
  board reports equals the manifest `version`, and a board reports the bare
  Tasmota version, the same for every house build of that Tasmota. So the
  manifest `version` is the release tag, which never matches, and a house-build
  fix is always offered; the Tasmota version sits in a `tasmota` field that the
  footer shows. The cost is that the page cannot say a board is up to date.
- **Any other board** gets **Install**, and the installer first asks whether to
  erase the flash, with the box unticked. Coming from KCS, tick it.

Uploading the plain `.bin` of the release under **Firmware Upgrade**, in the
board's own web interface, updates a board without the site; it replaces the
application and nothing else.

## Setting the board up after flashing

The page lists the commands for each board: the GPIO template, `EthType 8`,
and the board specific ones.

The A16v3 also needs two files on its own filesystem, served from
[`site/files/`](./site/files/) and linked from the page:

- `pcf8574.dat` declares the 32 expander pins, 16 inputs as switches and 16
  relays inverted. Without it the expanders are detected and nothing is
  switchable.
- `display.ini` describes the SSD1306 panel, which no longer has a build flag
  of its own.

For infrared in Home Assistant, the AG8 pairs with
[Tasmota IR](https://github.com/self-labs/tasmota-ir).

## Licences

The page and the workflow are MIT, see [LICENSE](./LICENSE). The firmware is
Tasmota, GPL-3.0, built from the public branch
[`tasmota-kincony`](https://github.com/cateim/Tasmota/tree/tasmota-kincony) of
`cateim/Tasmota`, which is its complete source.

Not affiliated with KinCony or with the Tasmota project.
