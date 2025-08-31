import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs'
import path from 'path'

import { setAlpacaKeysInStore, getAlpacaKeysFromStore } from '@/lib/supabaseAdmin'
import { readAlpacaKeys } from '@/lib/server-keys'

describe('supabaseAdmin file fallback', () => {
  const tmpDir = path.join(process.cwd(), 'data', 'secrets')
  const backupPath = path.join(tmpDir, 'alpaca-keys.json.bak')

  beforeAll(() => {
    // backup existing file if present
    try {
      const src = path.join(tmpDir, 'alpaca-keys.json')
      if (fs.existsSync(src)) fs.copyFileSync(src, backupPath)
    } catch (e) {
      // ignore
    }
  })

  afterAll(() => {
    // restore backup if it existed
    try {
      const src = path.join(tmpDir, 'alpaca-keys.json')
      if (fs.existsSync(backupPath)) fs.copyFileSync(backupPath, src)
      else if (fs.existsSync(src)) fs.unlinkSync(src)
    } catch (e) {
      // ignore
    }
  })

  it('writes and reads keys using file fallback', async () => {
    const keyId = 'testKey'
    const secret = 'testSecret'
    await setAlpacaKeysInStore(keyId, secret)
    const keys = readAlpacaKeys()
    expect(keys).not.toBeNull()
    expect(keys!.keyId).toBe(keyId)
    expect(keys!.secret).toBe(secret)

    const fromStore = await getAlpacaKeysFromStore()
    expect(fromStore).not.toBeNull()
    expect(fromStore!.keyId).toBe(keyId)
    expect(fromStore!.secretExists).toBe(true)
  })
})
