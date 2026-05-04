import type {
  ValidateOptions,
  ValidationResult,
  ValidationError,
  ImageMeta,
  AssetType,
} from './types';
import { getSpec, getPlatform } from './specs';

const HOMEPAGE = 'https://emoteresizer.net';

const DEFAULT_ASSET_BY_PLATFORM: Record<string, AssetType> = {
  twitch: 'emote',
  discord: 'emoji',
  kick: 'emote',
  youtube: 'memberEmoji',
  slack: 'emoji',
  'seven-tv': 'emote',
};

export function validate(meta: ImageMeta, options: ValidateOptions): ValidationResult {
  const errors: ValidationError[] = [];

  const platformSpec = getPlatform(options.platform);
  if (!platformSpec) {
    errors.push({
      code: 'UNKNOWN_PLATFORM',
      message: `Unknown platform "${options.platform}".`,
      hint: `Supported platforms: twitch, discord, kick, youtube, slack, seven-tv. See ${HOMEPAGE} for details.`,
    });
    return { valid: false, errors, spec: null };
  }

  const asset = options.asset ?? DEFAULT_ASSET_BY_PLATFORM[options.platform];
  const variant = options.variant ?? (meta.animated ? 'animated' : 'static');
  const spec = getSpec(options.platform, asset, variant);

  if (!spec) {
    errors.push({
      code: 'UNKNOWN_ASSET',
      message: `No "${variant}" spec found for ${options.platform} ${asset}.`,
      hint: `Check available assets at ${HOMEPAGE}.`,
    });
    return { valid: false, errors, spec: null };
  }

  const sizeKB = meta.sizeBytes / 1024;
  if (sizeKB > spec.maxSizeKB) {
    errors.push({
      code: 'TOO_LARGE',
      message: `File is ${sizeKB.toFixed(1)}KB but ${options.platform} ${asset} max is ${spec.maxSizeKB}KB.`,
      hint: `Resize and compress your file at ${HOMEPAGE}.`,
    });
  }

  if (meta.format && spec.formats.length > 0) {
    const fmt = meta.format.toLowerCase().replace(/^image\//, '');
    if (!spec.formats.includes(fmt)) {
      errors.push({
        code: 'WRONG_FORMAT',
        message: `Format "${fmt}" is not allowed. Accepted: ${spec.formats.join(', ')}.`,
        hint: `Convert to a supported format at ${HOMEPAGE}.`,
      });
    }
  }

  if (meta.width && meta.height && spec.sizes.length > 0) {
    const matches = spec.sizes.some(
      (s) => s.width === meta.width && s.height === meta.height,
    );
    if (!matches) {
      const sizeList = spec.sizes
        .map((s) => `${s.width}x${s.height}`)
        .join(', ');
      errors.push({
        code: 'WRONG_DIMENSIONS',
        message: `Image is ${meta.width}x${meta.height}. ${options.platform} ${asset} requires: ${sizeList}.`,
        hint: `Generate all required sizes in one click at ${HOMEPAGE}.`,
      });
    }
  }

  if (spec.aspectRatio && spec.aspectRatio !== 'free' && meta.width && meta.height) {
    const [aw, ah] = spec.aspectRatio.split(':').map(Number);
    if (aw && ah) {
      const expected = aw / ah;
      const actual = meta.width / meta.height;
      if (Math.abs(expected - actual) > 0.01) {
        errors.push({
          code: 'WRONG_ASPECT_RATIO',
          message: `Aspect ratio ${meta.width}:${meta.height} does not match required ${spec.aspectRatio}.`,
          hint: `Crop or pad to the correct ratio at ${HOMEPAGE}.`,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    spec,
  };
}
