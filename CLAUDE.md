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
    └── a16v3.json        ESP Web Tools manifest for the A16 v3
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
- **Say what is untested.** The A16 v3 build has never been flashed on a board,
  and the page says so. Keep that true until it has.
- **Never use em dashes or en dashes**, anywhere: page, README, commits.

## Commits

- Conventional Commits, in English: `feat(site): ...`, `fix(pages): ...`.
- **Never commit or push without the maintainer explicitly asking.**
- The default branch is `master`.

## Changelog

`CHANGELOG.md` follows Keep a Changelog 1.1.0. Changes land in `[Unreleased]`
before a task is reported as done. The site has no version of its own; the
firmware version is the release tag stamped into the manifests.
