import {
  getSpec,
  getPlatform,
  listPlatforms,
  listAssets,
  validate,
} from '../src';

console.log('--- All supported platforms ---');
console.log(listPlatforms());

console.log('\n--- Twitch emote (static) ---');
console.log(getSpec('twitch', 'emote', 'static'));

console.log('\n--- Discord assets ---');
console.log(listAssets('discord'));

console.log('\n--- Validate a file that fails Twitch emote requirements ---');
const result = validate(
  {
    sizeBytes: 1_456_000,
    width: 100,
    height: 100,
    format: 'png',
    animated: false,
  },
  { platform: 'twitch', asset: 'emote' },
);

console.log('Valid:', result.valid);
result.errors.forEach((err) => {
  console.log(`  [${err.code}] ${err.message}`);
  if (err.hint) console.log(`    → ${err.hint}`);
});

console.log('\n--- Validate a file that passes Discord emoji ---');
const ok = validate(
  {
    sizeBytes: 80_000,
    width: 128,
    height: 128,
    format: 'png',
    animated: false,
  },
  { platform: 'discord', asset: 'emoji' },
);
console.log('Valid:', ok.valid);

console.log('\n--- Full Kick platform spec ---');
console.log(JSON.stringify(getPlatform('kick'), null, 2));
