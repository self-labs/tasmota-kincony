<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/icon-dark.svg">
    <img src="./assets/icon.svg" width="128" alt="Tasmota KinCony">
  </picture>
</p>

# ⚡ Tasmota KinCony

**English** | [Português (Brasil)](./README.pt-BR.md)

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
application and nothing else. The upload restarts the board into its safeboot
partition first, and safeboot does not bring the Ethernet up: the page then
answers only at the board's **Wi-Fi** address, so keep the Wi-Fi on as a backup
of the cable (a board with `Wifi 0` has no network at that moment). Checked on an
A16v3 on 13 November 2026: the cable stayed down during safeboot, the upload over
the Wi-Fi updated the board and its configuration was intact.

## Setting the board up after flashing

Each card on the page lists its steps, one copyable block per command, all typed
in the board's own page under **Tools → Console**.

**KinCony AG8**, seven steps:

| Step                 | What to send                                                         |
| -------------------- | -------------------------------------------------------------------- |
| Wi-Fi                | the installer's own screen, right after flashing                     |
| Template             | `Template {...}` from the card, then `Module 0` on its own           |
| Ethernet             | `EthType 8`                                                          |
| Network watchdog     | `autoexec.be` under **Tools → Manage File system**, then `Restart 1` |
| Learning any remote  | `SetOption58 1`                                                      |
| Protection and clock | `Backlog SetOption65 1; SetOption36 0; Timezone -3`                  |
| Home Assistant       | [Tasmota IR](https://github.com/self-labs/tasmota-ir), from HACS     |

**KinCony KC868-A16v3**, seven steps:

| Step                 | What to send                                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Wi-Fi                | the installer's own screen, right after flashing                                                                                  |
| Template             | `Template {...}` from the card, then `Module 0` on its own                                                                        |
| Ethernet             | `EthType 8`                                                                                                                       |
| The two files        | `pcf8574.dat` and `autoexec.be` under **Tools → Manage File system**, then `Restart 1`                                            |
| Inputs               | `Backlog SetOption114 1; SwitchMode0 2`, then `Rule1` and `Rule2` from the card, each on its own, then `Backlog Rule1 1; Rule2 1` |
| Protection and clock | `Backlog SetOption65 1; SetOption36 0; Timezone -3`                                                                               |
| LED strip            | `Backlog Pixels 7; Dimmer 30`, only with a strip wired                                                                            |

### Why each one

- **`Module 0`** goes as a second command because the template only takes
  effect once the module points at it. The board restarts after it.
- **`EthType 8`** is the W5500 chip of both boards.
- **`autoexec.be`**, the same file on both boards, is a network watchdog.
  Tasmota sets the Ethernet up once, at boot (`EthernetInit` in
  `xdrv_82_esp32_ethernet.ino`), and the restart it does after 100 failed Wi-Fi
  attempts never runs with the Wi-Fi off (`support_tasmota.ino`), so a board on
  the cable alone (`Wifi 0`) whose Ethernet fails at boot keeps its rules but
  stays off the network until it is power cycled; with the Wi-Fi on as a backup
  it carries on over the Wi-Fi, but the cable stays out. The script restarts
  the board when the cable has not come up 10 minutes after boot, doubling the
  wait after each restart in a row up to 80 minutes, and back to 10 once the
  cable is up; a cable that came up and dropped later is left alone, since a
  restart brings back no cable and no switch. A board that fell back to the
  Wi-Fi stays on it when the cable returns, so the script cycles the Wi-Fi
  (`Wifi 0`, then `Wifi 1`) 5 seconds after the cable gets an address, which
  makes MQTT reconnect over the cable. `EthWatchdog` in the console shows its
  state (`Watches` says whether it watches the cable or the network). Checked on an A16v3 on 6 November 2026 by forcing the trigger: it
  restarted with `Software reset CPU`, the relays came back as they were, the
  script ran at boot and its count went back to zero. The Wi-Fi cycle was
  checked by hand on 13 November 2026 on an A16v3 whose MQTT stayed on the
  Wi-Fi after the cable came back: `Wifi 0` and `Wifi 1` moved it to the cable,
  where it stayed. Its automatic trigger (`ETH#Connected`) was checked with a
  real cable on an A16v3 the same day: cable pulled, MQTT moved to the Wi-Fi in
  the same second; cable back, the cycle ran 4 seconds later and MQTT returned to
  the cable, where it stayed. Each switchover reconnects MQTT, so the board's
  entities in Home Assistant go `unavailable` for a fraction of a second (62 ms
  and 384 ms measured). A board left without its cable at boot is still to be
  tried.
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
- **The inputs: one line of settings, then two rules.** The Inputs step sends
  `Backlog SetOption114 1; SwitchMode0 2`, then `Rule1` with
  `ON Switch1#State DO Power1 TOGGLE ENDON` and so on up to input 8, `Rule2`
  with inputs 9 to 16, each rule on a line of its own, never inside a
  `Backlog`, and `Backlog Rule1 1; Rule2 1`. Every input toggles the relay
  with the same number, on the board itself, so a wall switch works with no
  Home Assistant and no network, and the 16 inputs show up in Home Assistant
  next to the relays. The rules take 319 and 333 of the 511 characters a rule
  holds, and `Rule3` stays free.
- **Why it works**, read from the firmware code: with `SetOption114 1` an
  input never drives a relay by itself, but every change still reaches the
  rules through `SendKey` and is published at once (`SwitchHandler` in
  `support_switch_v4.ino`), and Tasmota announces the inputs only with
  `SetOption114 1` (`xdrv_12_discovery.ino`). In `SwitchMode 2` a closed
  contact sends `1` and an open one `0`, and a rule with no value
  (`Switch1#State`) fires on both, so every flip toggles the relay: the switch
  position never has to match the relay when Home Assistant switches it too.
  Mode 2 is also what makes the integration create binary sensors; in mode 0
  it only offers automation triggers. Nothing should toggle at boot, since the
  inputs are read as they are when Tasmota starts (`Pcf8574AddSwitch` in
  `xdrv_28_pcf8574_v2.ino`) and ignored for the first 4 seconds. Checked on
  two boards in a client's restaurant on 25 October 2026, switch by switch:
  every flip toggles its relay and the input changes in Home Assistant at
  once.
- **Per channel**, change that input's part and send the whole rule again:
  another relay is another number after `Power`; a pushbutton, the kind that
  springs back, keeps mode 2 and uses `Switch3#State=1`, the press; an input
  that only informs Home Assistant, or a free one, is left out of the rule.
  `PulseTime<n>` turns relay `n` off by itself after a while: 1 to 111 are
  tenths of a second, above that it is seconds plus 100, and `0` removes the
  pulse (`SetPulseTimer` in `support_tasmota.ino`). Four relays pulsing half a
  second, for a gate, a door strike or an impulse relay:
  `Backlog PulseTime13 5; PulseTime14 5; PulseTime15 5; PulseTime16 5`.
- **Optional names**: `Backlog SwitchText1 IN1; SwitchText2 IN2; ...` up to
  16 shows the inputs as `IN1` to `IN16` in Home Assistant instead of
  `Switch1` to `Switch16`. Send it before the board joins Home Assistant,
  since the entity id is born from the first name. The rules keep calling
  them `Switch1` to `Switch16`.
- **Optional relay names**: `Backlog FriendlyName1 OUT1; ...` up to 8 names
  relays 1 to 8 `OUT1` to `OUT8` in Home Assistant, sent before the board
  joins it, like the input names. Tasmota keeps only 8 relay names
  (`FriendlyName9` answers `Command Error`), so relays 9 to 16 arrive as
  `switch 9` to `switch 16` and the strip as `light 17`, and are renamed in
  Home Assistant itself. `Backlog WebButton1 OUT1; ...` up to 16 puts the same
  names on the relay buttons of the board's own page; it does not reach Home
  Assistant.
- **The variant, no rules**:
  `Backlog SetOption114 0; SwitchMode0 0; Rule1 0; Rule2 0`. Tasmota itself
  ties each input to its relay (`SwitchMode<n> 3` for a pushbutton), and Home
  Assistant shows only the relays, since Tasmota no longer announces the
  inputs. Moving between the two removes or recreates the 16 input sensors in
  Home Assistant, with any area or name given to them there.

### The A16v3 files, strip and display

The two files are served from [`site/files/`](./site/files/) and linked from
the page:

- `pcf8574.dat` declares the 32 expander pins, 16 inputs as switches and 16
  relays inverted. Without it the expanders are detected and nothing is
  switchable. The inputs come with their halves swapped, as measured on the
  board: the chip at `0x21` carries inputs 9 to 16, and `0x22` inputs 1 to 8.
- `autoexec.be` is the network watchdog above, the same file the AG8 gets.

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
`6210` in the template, upload
[`site/files/display.ini`](./site/files/display.ini), which describes the
SSD1306 panel (it no longer has a build flag of its own), and the display comes
on. The page mentions it only in a note, since no board here uses the display.

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
