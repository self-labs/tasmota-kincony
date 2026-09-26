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

| Board               | Build               | Status                                                        |
| ------------------- | ------------------- | ------------------------------------------------------------- |
| KinCony AG8         | `tasmota32s3-ag8`   | in use: 8 emitters, receiver, Ethernet without USB            |
| KinCony KC868-A16v3 | `tasmota32s3-a16v3` | in use: 16 relays, 16 inputs, LED strip, Ethernet without USB |

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

## Installing

1. Open [the page](https://self-labs.github.io/tasmota-kincony/) and plug the
   board in by USB-C.
2. Click **Install** on the board's card and pick its port. Not listed? Put the
   board in download mode: hold **DW**, tap **RST**, release **DW**.
3. Coming from KCS, tick **Erase device** when the installer asks. A board
   already on one of these builds is offered **Update** instead, which keeps
   its settings.
4. When the installer asks for your Wi-Fi, fill it in. The board restarts to
   join it, and the installer shows **Disconnected**: that is expected, see
   [Troubleshooting](#troubleshooting).
5. Follow the after-flashing steps on the board's card, described
   [below](#setting-the-board-up-after-flashing).

## What Install and Update write

**The install button writes the factory image** at offset 0: bootloader,
partition table, application and safeboot. What happens before that depends on
the board.

- **A board already running one of these builds** is recognised. It announces
  itself over Improv as `Tasmota AG8` or `Tasmota A16v3` (the `CODE_IMAGE_STR`
  of its build), each manifest names that string in `improv_firmware`, and the
  page hands ESP Web Tools a `checkSameFirmware` that compares the two, keeping
  the descriptive `name`. The page offers **Update**, written without erasing,
  and the settings are kept: tested on the A16v3 with
  `kincony-20260924-97ba55c`. A configuration backup (Configuration, Backup)
  first still costs nothing.
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

Each card on the page lists its steps, one copyable block per command, all typed
in the board's own page under **Tools → Console**.

**KinCony AG8**, six steps:

| Step                 | What to send                                                     |
| -------------------- | ---------------------------------------------------------------- |
| Wi-Fi                | the installer's own screen, right after flashing                 |
| Template             | `Template {...}` from the card, then `Module 0` on its own       |
| Ethernet             | `EthType 8`                                                      |
| Learning any remote  | `SetOption58 1`                                                  |
| Protection and clock | `Backlog SetOption65 1; SetOption36 0; Timezone -3`              |
| Home Assistant       | [Tasmota IR](https://github.com/self-labs/tasmota-ir), from HACS |

**KinCony KC868-A16v3**, seven steps:

| Step                 | What to send                                                                           |
| -------------------- | -------------------------------------------------------------------------------------- |
| Wi-Fi                | the installer's own screen, right after flashing                                       |
| Template             | `Template {...}` from the card, then `Module 0` on its own                             |
| Ethernet             | `EthType 8`                                                                            |
| The two files        | `pcf8574.dat` and `display.ini` under **Tools → Manage File system**, then `Restart 1` |
| Inputs               | `Backlog SetOption114 1; SwitchMode0 2`                                                |
| Protection and clock | `Backlog SetOption65 1; SetOption36 0; Timezone -3`                                    |
| LED strip            | `Backlog Pixels 7; Dimmer 30`, only with a strip wired                                 |

### Why each one

- **`Module 0`** goes as a second command because the template only takes
  effect once the module points at it. The board restarts after it.
- **`EthType 8`** is the W5500 chip of both boards.
- **`SetOption58 1`** lets the AG8 learn remotes whose protocol the library
  does not know: their raw timings come through instead of nothing.
- **`SetOption65 1`**: seven quick power cycles in a row erase every setting
  (`QPC_COUNT = 7` in `settings.ino`). A board in an electrical panel sees that
  in a bad afternoon.
- **`SetOption36 0`**: the boot loop protection clears the GPIO template after
  five quick restarts and resets the module after six (`tasmota.ino`). These
  boards come back from it with no relays and no Ethernet.
- **`Timezone`**: Tasmota ships set to UTC+1 (`APP_TIMEZONE 1`). `-3` is
  Brazil; put your own offset.
- **`SetOption114 1`** stops the A16v3 inputs from switching the relays: without
  it, closing input 1 flips relay 1.
- **`SwitchMode0 2`** sets all 16 inputs at once to read on while the contact
  is closed, and it is what makes Home Assistant create them as binary sensors.
  In mode 0, Tasmota's default, the integration only offers automation
  triggers.

### The A16v3 files, strip and display

The two files are served from [`site/files/`](./site/files/) and linked from
the page:

- `pcf8574.dat` declares the 32 expander pins, 16 inputs as switches and 16
  relays inverted. Without it the expanders are detected and nothing is
  switchable. The inputs come with their halves swapped, as measured on the
  board: the chip at `0x21` carries inputs 9 to 16, and `0x22` inputs 1 to 8.
- `display.ini` describes the SSD1306 panel, which no longer has a build flag
  of its own. It is only read on a board that turns the display on.

**The template brings a WS2812 LED strip** on `GPIO41`, pin 3 of the `P12`
header beside the ESP32-S3 (`39 40 41 GND 3V3`, square pad on `3V3`, from
KinCony's own board drawing). With no strip wired, the light it creates lights
nothing. `Pixels` is how many LEDs the strip has, and `Dimmer 30` keeps it at
30% because the strip draws from the board's 5 V, the rail the ESP32 runs on.

**The display stays off on purpose.** Turning it on takes an Option A3 mark on
`GPIO45` (`6210`), and the display then claims a power slot of its own
(`UpdateDevicesPresent(1)` in `xdrv_13_display.ino`): after the 16 relays it
becomes power 17, the strip light moves to 18 and stops answering in Home
Assistant, as seen on the board. On an A16v3 without the strip, set `GPIO45` to
`6210` in the template and the display comes on.

## Finding the board on the network

The page has a **Find my board** section. With the board on USB and the
installer's window closed, it opens the port, asks `Status 5`, and shows the
Wi-Fi and cable addresses as links to the board's own page. Nothing is written.

By hand: **Install** on the board's card, pick the port, **Logs & Console**,
type `Status 5` and press Enter. `IPAddress` is the Wi-Fi address and the one
inside `"Ethernet"` is the cable's; `0.0.0.0` means that side is not connected.

The board only listens on USB when the cable was already plugged in as it
started (`tasmota.ino`, "no SOF packet detected on USB port"). A board powered
from 12 V first does not answer: the page's second button, **Restart it over
USB and ask again**, restarts it through the USB reset lines so it does.

## Troubleshooting

- **The installer says "Disconnected" after the Wi-Fi step.** Tasmota restarts
  to join the network as soon as Improv hands it the Wi-Fi
  (`xdrv_62_improv.ino`), and these boards expose USB straight from the
  ESP32-S3, so the restart makes the port vanish. The Wi-Fi is saved: wait 20
  seconds and look for the board on the router, in Home Assistant, or with
  **Find my board**.
- **The Wi-Fi screen was skipped.** With no Wi-Fi saved, the board opens a
  network of its own, `tasmota-XXXX`. Join it and open `http://192.168.4.1`.
- **The A16v3 never joins the Wi-Fi.** Its module is the ESP32-S3-WROOM-1U,
  which has no antenna on the module, only a connector for an external one.
  Without it, the board only joins a router close by. The cable works
  anywhere.
- **The serial log says "SHA-256 comparison failed".** It is harmless: the
  lines after it say `Attempting to boot anyway...`, and the board does.
  Builds from before 24 September 2026 declared 4 MB in the bootloader header;
  on its first boot Tasmota rewrites that byte to the real 16 MB and leaves the
  hash alone. A board installed or updated from the page since then stops
  printing it; an OTA keeps the old bootloader, and the message with it.

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

## Licences

The page and the workflow are MIT, see [LICENSE](./LICENSE). The firmware is
Tasmota, GPL-3.0, built from the public branch
[`tasmota-kincony`](https://github.com/cateim/Tasmota/tree/tasmota-kincony) of
`cateim/Tasmota`, which is its complete source.

Not affiliated with KinCony or with the Tasmota project.
