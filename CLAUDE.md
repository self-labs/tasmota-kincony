# Tasmota for KinCony: repository conventions (for AI agents)

A static web flasher, published on GitHub Pages, for the Tasmota builds made for
KinCony boards. There is no build step and no package manager: the site is
plain HTML in `site/`, and one workflow assembles and publishes it.

## Layout

```text
site/
├── index.html            the page, with its CSS and a few lines of JavaScript inline
└── manifests/
    ├── ag8.json          ESP Web Tools manifest for the AG8
    └── a16v3.json        ESP Web Tools manifest for the A16v3
.github/workflows/
└── pages.yml             fetch the latest firmware release, stamp it, publish
```

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
- **Say what is unverified.** The A16v3 build has been flashed and runs on a
  board, and its relays and inputs are still being verified; the status line
  and the FAQ say so. Keep both in step with what has been checked on hardware.
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
- **Never write that flashing from the page keeps the settings.** It does not,
  on these boards, erase or not: the factory image carries a 4 MB partition
  table, Tasmota grows the filesystem to 16 MB on the first boot and rewrites
  the table, and writing the image again formats the filesystem. Updating a
  board means Firmware Upgrade with the plain `.bin`. `RECOGNISE_BOARDS` stays
  `false` until the builds carry the 16 MB table, and turning it on needs a
  test on a board with its configuration backed up.
- **Never use em dashes or en dashes**, anywhere: page, README, commits.

## Commits

- Conventional Commits, in English: `feat(site): ...`, `fix(pages): ...`.
- **Never commit or push without the maintainer explicitly asking.**
- The default branch is `master`.

## Changelog

`CHANGELOG.md` follows Keep a Changelog 1.1.0. Changes land in `[Unreleased]`
before a task is reported as done. The site has no version of its own; the
firmware version is the release tag stamped into the manifests.
