# dsh-w-paper

**[English](README.md) · [中文](README.zh.md)**

Wallpaper for the [DeepSeek Harness](https://github.com/deepseek-ai) Web UI — a picture behind the whole
app, with live controls for the look and for how much each surface lets it through.

<p align="center"><img src="icon.svg" alt="dsh-w-paper icon" width="96" height="96"></p>

## What it gives you

- **Presets drawn in the browser** — Starry, Blue sky, Dusk and Sunrise are painted with `<canvas>` at
  runtime, so the package ships no image assets and every preset re-renders crisply at any size.
- **Your own picture** — import a file; it is downscaled to 1920 px on the long edge and kept locally.
- **A clear entry point** — a bordered **背景 / Wallpaper** pill with a picture mark sits at the left of the
  chat header and opens the settings panel.
- **The same panel in Settings** — Settings → General → Background shows the current preset, and its
  *Adjust / 调整* button opens the very same panel.

## Controls

| Group | Control | Range |
| --- | --- | --- |
| Look | Blur | 0–24 px |
| Look | Sharpen | 0–100 (unsharp mask through an SVG convolution filter) |
| Look | Saturation | 0–200 % |
| Look | Contrast | 50–160 % |
| Offset | Horizontal / vertical | ±40 % |
| Motion | Mouse parallax | 0–100 |
| Surfaces | Sidebar / top bar / chat area transparency | 0–100 % (higher = more see-through) |
| Surfaces | Chat area border | on / off |

Parallax follows the pointer with an eased trail and is disabled automatically when the system asks for
reduced motion. Every value is stored in `localStorage` and survives reloads.

## Install

### From npm

In DSH, open **Settings → Plugins**, choose to install a bundle, and give it `dsh-w-paper`:

```
dsh-w-paper
```

### From a local checkout

Install the folder itself as a bundle (absolute path), then enable it in the profile:

```
<your workspace>/dsh-w-paper
```

## How it works

- The Host half is intentionally empty (`apply() {}`); the wallpaper lives entirely in the browser.
- The background is a `body::before` layer: `background-size: cover`, a `filter` chain and a small
  `translate3d` for parallax. A second layer (`body::after`) is the readability scrim.
- Surfaces stay native where it matters: the sidebar keeps its own border and is tinted through
  `--dsw-specific-sidebar-fill`, the top bar and chat card are drawn per-surface. Removing the plugin
  restores the stock theme because every rule is scoped to the `dshbg-on` class on `<html>`.
- Slot seats used: `conversation.header.leading` (the pill), `shell.overlay` (panel and filter),
  `settings.general.item` (the General row).

## Compatibility

Built against the DSH 0.2.x Web profile. The chat card targets `[data-conversation-scroll]` and the top
bar targets the header that owns `[data-conversation-header-leading]`; both are stable, semantic hooks.

## Development

This package is plain JavaScript — no build step. Edit `client.js`, then refresh the page so the client
module loader picks up the new generation. The bundle patch is `cordis.patch.yml`; the Host entry is
`index.js`.

Before publishing, replace `your-github-name` in `package.json` with the real repository owner.

## License

MIT — see [LICENSE](LICENSE).
