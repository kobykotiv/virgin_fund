export const ADJECTIVES = ['silent', 'red', 'quick', 'clever', 'brave', 'wise', 'neon', 'iron', 'lucky', 'calm', 'bold', 'silver', 'golden', 'fierce', 'mighty', 'gentle', 'swift']
export const NOUNS = ['falcon', 'otter', 'tiger', 'raccoon', 'puppy', 'whale', 'rocket', 'vector', 'quasar', 'monolith', 'harbor', 'bridge', 'forge', 'comet', 'phoenix', 'lynx', 'orca']

export function randomName() {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const b = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const num = Math.floor(Math.random() * 9000) + 1000 // 1000-9999
  return `${a}-${b}-${num}`
}

export function randomNameWithSeed(seed?: number) {
  // simple seeded fallback for deterministic tests if needed
  if (typeof seed === 'number') {
    const a = ADJECTIVES[seed % ADJECTIVES.length]
    const b = NOUNS[(Math.floor(seed / ADJECTIVES.length)) % NOUNS.length]
    const num = 1000 + (seed % 9000)
    return `${a}-${b}-${num}`
  }
  return randomName()
}
