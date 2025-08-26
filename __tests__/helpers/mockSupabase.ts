// Shared in-memory Supabase admin mock for API tests
// Exports:
// - makeSupabaseAdminMock(): returns a client-like object with .from(table) chainable builder
// - sessionMock: simple session verifier mock

export function makeSupabaseAdminMock() {
  const store = new Map<string, any>()

  function makeBuilder(table: string) {
    const context: any = { table, op: null, payload: null, filters: [] }
    const builder: any = {
      insert(rows: any[]) {
        context.op = 'insert'
        context.payload = rows[0]
        return builder
      },
      select(_cols?: any) {
        context.op = context.op || 'select'
        return builder
      },
      update(changes: any) {
        context.op = 'update'
        context.payload = changes
        return builder
      },
      delete() {
        context.op = 'delete'
        return builder
      },
      eq(col: string, val: any) {
        context.filters.push({ col, val })
        return builder
      },
      order() {
        return builder
      },
      limit() {
        return builder
      },
      maybeSingle() {
        return builder.single(true)
      },
      single(isMaybe?: boolean) {
        return new Promise((res) => {
          // insert
          if (context.op === 'insert') {
            const id = Math.random().toString(36).slice(2, 10)
            const row = { id, ...context.payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
            store.set(row.id, row)
            res({ data: row, error: null })
            return
          }

          // select
          const all = Array.from(store.values()).filter((r) => r)
          let results = all
          for (const f of context.filters) {
            results = results.filter((r) => r[f.col] === f.val)
          }

          if (context.op === 'update') {
            const matched = results
            if (matched.length === 0) return res({ data: null, error: { message: 'Not found' } })
            const updatedRow = { ...matched[0], ...context.payload, updated_at: new Date().toISOString() }
            store.set(updatedRow.id, updatedRow)
            return res({ data: updatedRow, error: null })
          }

          if (context.op === 'delete') {
            const matched = results
            if (matched.length === 0) return res({ data: null, error: { message: 'Not found' } })
            store.delete(matched[0].id)
            return res({ data: matched[0], error: null })
          }

          // default select single — when nothing found, return no error and null data so routes can return 404
          if (results.length === 0) return res({ data: null, error: null })
          res({ data: results[0], error: null })
        })
      },
      in(_col: string, _vals: any[]) {
        return builder
      },
      // thenable support so await builder returns { data, error }
      then(onFulfilled: any, onRejected: any) {
        return new Promise((resolve) => {
          // handle insert
          if (context.op === 'insert') {
            const id = Math.random().toString(36).slice(2, 10)
            const row = { id, ...context.payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
            store.set(row.id, row)
            resolve({ data: [row], error: null })
            return
          }

          const all = Array.from(store.values()).filter((r) => r)
          let results = all
          for (const f of context.filters) {
            results = results.filter((r) => r[f.col] === f.val)
          }

          if (context.op === 'update') {
            const matched = results
            if (matched.length === 0) return resolve({ data: null, error: { message: 'Not found' } })
            const updatedRow = { ...matched[0], ...context.payload, updated_at: new Date().toISOString() }
            store.set(updatedRow.id, updatedRow)
            return resolve({ data: [updatedRow], error: null })
          }

          if (context.op === 'delete') {
            const matched = results
            if (matched.length === 0) return resolve({ data: null, error: { message: 'Not found' } })
            store.delete(matched[0].id)
            return resolve({ data: [matched[0]], error: null })
          }

          resolve({ data: results, error: null })
        }).then(onFulfilled, onRejected)
      },
    }

    return builder
  }

  const client = {
    from(table: string) {
      return makeBuilder(table)
    },
  }

  return client
}

export const sessionMock = {
  verifySessionToken: async (token: string) => {
    if (!token) return null
    return { id: 'sess-1', user_id: 'user-test-1', expires_at: new Date(Date.now() + 10000).toISOString() }
  },
}
