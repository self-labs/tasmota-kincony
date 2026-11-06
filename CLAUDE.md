# Tasmota for KinCony: repository conventions (for AI agents)

A static web flasher, published on GitHub Pages, for the Tasmota builds made for
KinCony boards. There is no build step and no package manager: the site is
plain HTML in `site/`, and one workflow assembles and publishes it.

## Layout

```text
site/
├── index.html            the page, with its CSS and a few lines of JavaScript inline
├── i18n.js               the page in Brazilian Portuguese, keyed by data-i18n
├── favicon.svg           the icon's mark in white on the Tasmota blue tile
├── files/                what the steps tell to upload to the board
│   ├── pcf8574.dat       the A16v3's 32 expander pins
│   ├── autoexec.be       the network watchdog, for both boards
│   └── display.ini       the SSD1306, only for a board that turns it on; not linked
└── manifests/
    ├── ag8.json          ESP Web Tools manifest for the AG8
    └── a16v3.json        ESP Web Tools manifest for the A16v3
assets/
├── icon.svg              project icon, black, for light backgrounds (README)
├── icon-dark.svg         the same in Tasmota blue (#1fa3ec), for dark ones
└── icon.png, icon-dark.png   both at 512 px, for places that take no SVG
.github/workflows/
└── pages.yml             fetch the latest firmware release, stamp it, publish
```

The icon is the Tasmota symbol (`tools/logo` in `arendst/Tasmota`) with a
firmware chip in the bottom right, in the style of the IR badge of
`self-labs/tasmota-ir`. The SVGs are the source and are edited by hand; the
two variants differ only in the `fill` of the outer group, and the chip and
its mask live in `site/favicon.svg` too, so a change to the chip goes to all
three. The PNGs are rendered from them, never edited:
`rsvg-convert -w 512 assets/icon.svg -o assets/icon.png` (same for the dark
one). `assets/` is outside `site/`, so it is never published.

`site/firmware/` does not exist in the repository. The workflow creates it at
deploy time from the latest release of `cateim/Tasmota`, and it is git-ignored.

## Where the firmware comes from

- The builds are `[env:tasmota32s3-ag8]` and `[env:tasmota32s3-a16v3]` in
  `platformio_tasmota_cenv.ini` of [cateim/Tasmota](https://github.com/cateim/Tasmota),
  branch `tasmota-kincony`.
- Every push to that branch runs `custom-builds.yml` there, which publishes a
  release `kincony-YYYYMMDD-<sha7>` with the `.factory.bin` and `.bin` of each
  board, marked as latest.
- `pages.yml` here copies the latest release's `.factory.bin` files into the
  site and writes the release tag into each manifest's `version`.

## Rules that are not obvious

- **The binaries must be served from this site.** ESP Web Tools fetches them
  with `fetch()`, and GitHub release downloads send no CORS headers. Linking a
  release asset from a manifest fails in the browser.
- **`.factory.bin` at offset 0.** It carries bootloader, partition table,
  application and safeboot. The plain `.bin` is the application only, for OTA.
- **`new_install_prompt_erase` stays on.** Coming from the KinCony KCS firmware,
  leftover partitions and NVS cause trouble later.
- **The installer script is pinned with an integrity hash.** Upgrading ESP Web
  Tools means changing the version in the URL and recomputing the `sha384`
  of that exact file. The hash covers the entry file only; the chunks it
  imports load from the same pinned version.
- **Say what is unverified.** Both builds run on real boards, relays, inputs
  and Ethernet checked. A board or a feature that has not been checked on
  hardware gets an amber status line and says why.
- **`site/files/autoexec.be` is a copy.** The source is
  `assets/configs/tasmota/autoexec.be` in the maintainer's `homeassistant`
  repository, where the house guides explain it and the boards in the field
  get it from. Change both in the same breath and keep them byte for byte
  equal (`cmp` the two files).
- **`improv_firmware` must equal what the board announces.** The page sets
  `checkSameFirmware` to compare the board's Improv name with that field. The
  board announces `Tasmota ` plus the `CODE_IMAGE_STR` of its build, so
  renaming an image in `cateim/Tasmota` means changing the field in the same
  breath, or the page stops recognising the board.
- **The manifest `version` is the release tag, never the Tasmota version.**
  ESP Web Tools hides the install when a recognised board reports the same
  version, and every house build of one Tasmota reports the same bare
  version, so the Tasmota version there would hide house-build fixes. The
  Tasmota version goes in `tasmota`, for the footer.
- **The installer asks before erasing.** `new_install_prompt_erase` shows an
  "Erase device" box that starts unticked. Never write that the page always
  erases.
- **Update keeps the settings, and that was tested**, on the A16v3 with
  `kincony-20260924-97ba55c`, the first release carrying the 16 MB table.
  Any change to the partition table needs the same test again, with the
  configuration backed up, before the page says so. The images must carry the
  16 MB partition table Tasmota creates on the first boot
  (`partitions/esp32_partition_app2880k_fs12608k.csv` in the fork): with the
  4 MB one, writing the image again shrinks the filesystem back and formats
  it. `RECOGNISE_BOARDS` in the page turns recognition off if an Update is ever
  seen to lose settings.
- **The page speaks English and Brazilian Portuguese.** English is the HTML
  itself; every element with text carries a `data-i18n` key, and `i18n.js`
  holds the Portuguese HTML for that key. Texts the script writes (Find my
  board, Copy, the version line) live in `EN` inside `index.html` and under
  `js.*` in `i18n.js`. **Changing an English text means changing its line in
  `i18n.js` in the same commit**: a missing key falls back to English and
  warns in the console, but an outdated one silently says the old thing.
  Language order: the choice saved in `localStorage` (`lang`), then the
  browser's first language (any `pt` gives `pt-BR`), then English. Commands
  inside `<pre>` are never translated. The labels of Tasmota and of the
  installer's dialog (Tools, Console, Update, Logs & Console, Disconnected)
  stay in English in both languages, because that is what the board and the
  dialog show; the page's own buttons are translated. The README has the
  same pair, `README.md` and `README.pt-BR.md`: a change to one goes to the
  other in the same commit.
- **Never use em dashes or en dashes**, anywhere: page, README, commits.

## Commits

- Conventional Commits, in English: `feat(site): ...`, `fix(pages): ...`.
- **Never commit or push without the maintainer explicitly asking.**
- The default branch is `master`.

## Changelog

`CHANGELOG.md` follows Keep a Changelog 1.1.0. Changes land in `[Unreleased]`
before a task is reported as done.

## Versions

- **CalVer `YYYY.M.R`, as an annotated git tag `vYYYY.M.R`.** Versioning
  started on 23/10/2026: `v2026.9.1` (end of September) and `v2026.10.1`
  (2 October) were tagged afterwards on the commits of those days, with the
  tag date set to the commit's, and `v2026.10.2` is the first tagged as it
  was made. There is no version field anywhere: the tag and the changelog
  heading are the whole version. No GitHub Release either; the site ships
  through Pages, and the workflow never reads this repository's tags.
- **Closing a version:** `[Unreleased]` becomes `## [YYYY.M.R] - YYYY-MM-DD`,
  a fresh empty `[Unreleased]` opens above it, and the footer links move
  (`compare/vPREVIOUS...vNEW`, and `[Unreleased]` compares from the new tag).
  Then the commit, then `git tag -a vYYYY.M.R -m "<summary>"`, pushed together.
- **Two different versions, never mixed.** The repository's tag dates the
  page and the workflow. The firmware is identified by the `cateim/Tasmota`
  release (`kincony-YYYYMMDD-<sha>`) stamped into the manifests and shown in
  the footer; it changes without any commit here.
