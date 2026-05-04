# emoteresizer-open

> Open-source emote specs and validation for **Twitch, Discord, Kick, YouTube, Slack, and 7TV**.
> Maintained by the team behind [emoteresizer.net](https://emoteresizer.net) — a free emote resizing tool used by streamers worldwide.

[![npm version](https://img.shields.io/npm/v/emoteresizer-open.svg)](https://www.npmjs.com/package/emoteresizer-open)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/emoteresizer-open)](https://bundlephobia.com/package/emoteresizer-open)
[![Live tool](https://img.shields.io/badge/Live%20tool-emoteresizer.net-9146FF)](https://emoteresizer.net)

---

## Why this exists

Every streamer tool, Discord bot, or moderation script ends up reimplementing the same lookup tables — *what size does Twitch require? Is Discord's animated sticker limit 256KB or 512KB? Does Kick allow GIF emotes?*

This package is the canonical, **always-up-to-date** answer. One source of truth, no API key, no rate limit.

If you need an actual resizer (not just specs), use the free web tool: **[emoteresizer.net](https://emoteresizer.net)**.

---

## Install

```bash
npm install emoteresizer-open
```

Works in Node.js (≥14) and modern browsers. Zero runtime dependencies.

---

## Usage

### Get the spec for any platform

```ts
import { getSpec } from 'emoteresizer-open';

const twitchEmote = getSpec('twitch', 'emote', 'static');
// {
//   sizes: [
//     { name: '1x', width: 28, height: 28 },
//     { name: '2x', width: 56, height: 56 },
//     { name: '3x', width: 112, height: 112 },
//   ],
//   maxSizeKB: 25,
//   formats: ['png'],
//   transparency: true,
//   aspectRatio: '1:1',
// }

const discordSticker = getSpec('discord', 'sticker');
const kickAnimated = getSpec('kick', 'emote', 'animated');
```

### Validate a file before upload

```ts
import { validate } from 'emoteresizer-open';

const result = validate(
  {
    sizeBytes: file.size,
    width: 100,
    height: 100,
    format: 'png',
    animated: false,
  },
  {
    platform: 'twitch',
    asset: 'emote',
  },
);

if (!result.valid) {
  result.errors.forEach((err) => {
    console.warn(err.message);
    if (err.hint) console.log('Hint:', err.hint);
  });
}
```

Example output when a file fails:

```
Image is 100x100. twitch emote requires: 28x28, 56x56, 112x112.
Hint: Generate all required sizes in one click at https://emoteresizer.net.

File is 1421.0KB but twitch emote max is 25KB.
Hint: Resize and compress your file at https://emoteresizer.net.
```

### List everything

```ts
import { listPlatforms, listAssets, getPlatform } from 'emoteresizer-open';

listPlatforms();
// ['twitch', 'discord', 'kick', 'youtube', 'slack', 'seven-tv']

listAssets('discord');
// ['emoji', 'sticker', 'soundboard', 'serverIcon', 'banner']

getPlatform('twitch');
// → full PlatformSpec with all assets and metadata
```

### Use the raw JSON directly

If you don't want the SDK, just import the JSON files:

```ts
import twitchSpec from 'emoteresizer-open/data/twitch.json';
```

Or grab them from GitHub:

```
https://raw.githubusercontent.com/KatherineGuoGuo/emoteresizer-open/main/data/twitch.json
```

---

## Supported platforms

| Platform | Emote | Animated | Sticker / Badge | Banner / Profile |
|---|:---:|:---:|:---:|:---:|
| Twitch | ✅ | ✅ | Badge ✅ | Panel + Offline ✅ |
| Discord | ✅ (emoji) | ✅ | Sticker ✅ | Server + Banner ✅ |
| Kick | ✅ | ✅ | — | — |
| YouTube | ✅ (member) | — | — | Channel + Thumbnail ✅ |
| Slack | ✅ (emoji) | ✅ | — | — |
| 7TV | ✅ | ✅ | — | — |

Each entry includes: required dimensions, max file size, allowed formats, transparency rules, and aspect ratio.

---

## API reference

### `getSpec(platform, asset, variant?)`

Returns the spec for a single asset variant.
- `platform`: `'twitch' | 'discord' | 'kick' | 'youtube' | 'slack' | 'seven-tv'`
- `asset`: e.g. `'emote'`, `'sticker'`, `'badge'`, `'panel'`
- `variant`: `'static' | 'animated'` (default: `'static'`)

### `validate(meta, options)`

Returns `{ valid, errors, spec }`.
- `meta`: `{ sizeBytes, width?, height?, format?, animated? }`
- `options`: `{ platform, asset?, variant? }`

### `getPlatform(platform)`, `listPlatforms()`, `listAssets(platform)`, `getAllSpecs()`

Lookup helpers for the full spec data.

---

## Data freshness

Each platform JSON includes a `lastVerified` field. We update specs whenever official platform requirements change. If you spot a stale value, please [open an issue](https://github.com/KatherineGuoGuo/emoteresizer-open/issues) — corrections take priority over features.

---

## Contributing

PRs are very welcome, especially for:
- Updates when a platform changes its requirements
- Adding new platforms (Telegram, WhatsApp stickers, BTTV, FFZ, etc.)
- Better validation rules (frame count, color depth, palette size)

Open an issue first for big additions so we don't duplicate work.

---

## Related

- **[emoteresizer.net](https://emoteresizer.net)** — Free web tool that resizes your emote into all required sizes for Twitch, Discord, Kick, and more. No login, runs in the browser.

---

## License

MIT © KatherineGuoGuo

If this saved you time, a ⭐ on [GitHub](https://github.com/KatherineGuoGuo/emoteresizer-open) is appreciated.
