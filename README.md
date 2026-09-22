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
- **KinCony KC868-A16 v3.** Its 16 relays and 16 inputs sit behind PCF8574
  expanders, and `USE_PCF8574` is off in every official build, so the board
  boots with nothing to switch.

Both builds also carry a fix that official Tasmota only gets in the release
after 15.6.0 ([arendst/Tasmota#25047](https://github.com/arendst/Tasmota/pull/25047)):
without it, the W5500 Ethernet of these boards only comes up while a USB cable
is plugged in.

## Boards

| Board                  | Build               | Status                                                     |
| ---------------------- | ------------------- | ---------------------------------------------------------- |
| KinCony AG8            | `tasmota32s3-ag8`   | in use: 8 emitters, receiver, Ethernet without USB         |
| KinCony KC868-A16 v3   | `tasmota32s3-a16v3` | built and checked for every driver, not flashed on a board |

## Before you flash

- **Chrome or Edge on a desktop.** Flashing uses Web Serial, which Firefox,
  Safari, Android and iOS do not have.
- **Back up the factory firmware.** Installing erases the whole flash, and the
  browser cannot read it back. Take the 16 MB backup with esptool first; the
  page has the exact command.
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

## Setting the board up after flashing

The page lists the commands for each board: the GPIO template, `EthType 8`,
and the board specific ones. The full guides are in Portuguese, in
[self-labs/homeassistant](https://github.com/self-labs/homeassistant):
[AG8](https://github.com/self-labs/homeassistant/blob/master/docs/kincony-ag8.md)
and [A16 v3](https://github.com/self-labs/homeassistant/blob/master/docs/kincony-a16v3.md).

For infrared in Home Assistant, the AG8 pairs with
[Tasmota IR](https://github.com/self-labs/tasmota-ir).

## Licences

The page and the workflow are MIT, see [LICENSE](./LICENSE). The firmware is
Tasmota, GPL-3.0, built from the public branch
[`tasmota-kincony`](https://github.com/cateim/Tasmota/tree/tasmota-kincony) of
`cateim/Tasmota`, which is its complete source.

Not affiliated with KinCony or with the Tasmota project.
