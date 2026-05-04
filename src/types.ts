export type Platform = 'twitch' | 'discord' | 'kick' | 'youtube' | 'slack' | 'seven-tv';

export type AssetType =
  | 'emote'
  | 'badge'
  | 'panel'
  | 'offlineBanner'
  | 'emoji'
  | 'sticker'
  | 'soundboard'
  | 'serverIcon'
  | 'banner'
  | 'memberEmoji'
  | 'channelProfile'
  | 'channelBanner'
  | 'videoThumbnail';

export type Variant = 'static' | 'animated';

export interface SizeSpec {
  name: string;
  width: number;
  height: number;
}

export interface VariantSpec {
  sizes: SizeSpec[];
  maxSizeKB: number;
  formats: string[];
  transparency?: boolean;
  aspectRatio?: string;
  maxFrames?: number;
  minFps?: number;
  maxFps?: number;
  maxDurationSec?: number;
}

export interface AssetSpec {
  static?: VariantSpec;
  animated?: VariantSpec;
}

export interface PlatformSpec {
  platform: Platform;
  displayName: string;
  officialDocs: string;
  lastVerified: string;
  assets: Record<string, AssetSpec>;
}

export interface ValidateOptions {
  platform: Platform;
  asset?: AssetType;
  variant?: Variant;
}

export interface ValidationError {
  code: 'TOO_LARGE' | 'WRONG_DIMENSIONS' | 'WRONG_FORMAT' | 'WRONG_ASPECT_RATIO' | 'UNKNOWN_ASSET' | 'UNKNOWN_PLATFORM';
  message: string;
  hint?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  spec: VariantSpec | null;
}

export interface ImageMeta {
  sizeBytes: number;
  width?: number;
  height?: number;
  format?: string;
  animated?: boolean;
}
