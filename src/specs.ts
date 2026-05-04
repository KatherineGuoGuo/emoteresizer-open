import type { Platform, AssetType, Variant, PlatformSpec, VariantSpec } from './types';

import twitch from '../data/twitch.json';
import discord from '../data/discord.json';
import kick from '../data/kick.json';
import youtube from '../data/youtube.json';
import slack from '../data/slack.json';
import sevenTv from '../data/seven-tv.json';

const SPECS: Record<Platform, PlatformSpec> = {
  twitch: twitch as PlatformSpec,
  discord: discord as PlatformSpec,
  kick: kick as PlatformSpec,
  youtube: youtube as PlatformSpec,
  slack: slack as PlatformSpec,
  'seven-tv': sevenTv as PlatformSpec,
};

export function getPlatform(platform: Platform): PlatformSpec | null {
  return SPECS[platform] ?? null;
}

export function getSpec(
  platform: Platform,
  asset: AssetType,
  variant: Variant = 'static',
): VariantSpec | null {
  const p = SPECS[platform];
  if (!p) return null;
  const a = p.assets[asset];
  if (!a) return null;
  return a[variant] ?? null;
}

export function listPlatforms(): Platform[] {
  return Object.keys(SPECS) as Platform[];
}

export function listAssets(platform: Platform): string[] {
  const p = SPECS[platform];
  return p ? Object.keys(p.assets) : [];
}

export function getAllSpecs(): Record<Platform, PlatformSpec> {
  return SPECS;
}
