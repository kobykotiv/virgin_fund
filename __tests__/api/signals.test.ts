import { beforeAll, describe, it, expect, vi } from "vitest"
import { makeSupabaseAdminMock, sessionMock } from "../helpers/mockSupabase"

// mock both alias and relative session imports
vi.mock("../../lib/session", () => sessionMock)
vi.mock("@/lib/session", () => sessionMock)

const adminClient = makeSupabaseAdminMock()
vi.mock("../../lib/supabaseAdmin", () => ({ supabaseAdmin: adminClient, getSupabaseAdmin: () => adminClient }))
vi.mock("@/lib/supabaseAdmin", () => ({ supabaseAdmin: adminClient, getSupabaseAdmin: () => adminClient }))
 

let signalsRoute: typeof import("../../app/api/signals/route")
let signalsIdRoute: typeof import("../../app/api/signals/[id]/route")

beforeAll(async () => {
  signalsRoute = await import("../../app/api/signals/route")
  signalsIdRoute = await import("../../app/api/signals/[id]/route")
})

describe("signals API (server routes)", () => {
  it("creates, lists, fetches, updates, and deletes a signal", async () => {
    // create
    const createReq: any = { json: async () => ({ name: "Test Signal", ticker: "VOO", condition: "price > sma" }), headers: new Headers({ cookie: "vf_session=token" }) }
    const createRes = await signalsRoute.POST(createReq as any)
    const createdBody = await createRes.json()
    expect(createRes.status).toBe(200)
    expect(createdBody.signal).toHaveProperty("id")
    const id = createdBody.signal.id

    // list
    const listReq: any = { headers: new Headers({ cookie: "vf_session=token" }) }
    const listRes = await signalsRoute.GET(listReq as any)
    const listBody = await listRes.json()
    expect(Array.isArray(listBody.signals)).toBe(true)
    expect(listBody.signals.find((s: any) => s.id === id)).toBeDefined()

    // get single
    const getReq: any = { headers: new Headers({ cookie: "vf_session=token" }) }
    const getRes = await signalsIdRoute.GET(getReq as any, { params: { id } } as any)
    const getBody = await getRes.json()
    expect(getRes.status).toBe(200)
    expect(getBody.signal.id).toBe(id)

    // patch
    const patchReq: any = { json: async () => ({ name: "Updated" }), headers: new Headers({ cookie: "vf_session=token" }) }
    const patchRes = await signalsIdRoute.PATCH(patchReq as any, { params: { id } } as any)
    const patchBody = await patchRes.json()
    expect(patchBody.signal.name).toBe("Updated")

    // delete
    const delReq: any = { headers: new Headers({ cookie: "vf_session=token" }) }
    const delRes = await signalsIdRoute.DELETE(delReq as any, { params: { id } } as any)
    const delBody = await delRes.json()
    expect(delBody.ok).toBe(true)

    // ensure gone
    const listRes2 = await signalsRoute.GET(listReq as any)
    const listBody2 = await listRes2.json()
    expect(listBody2.signals.find((s: any) => s.id === id)).toBeUndefined()
  })

  it("returns 401 when unauthenticated", async () => {
    const req: any = { headers: new Headers({}) }
    const res = await signalsRoute.GET(req as any)
    const body = await res.json()
    expect(res.status).toBe(401)
    expect(body.error).toBeDefined()
  })

  it("returns 404 for unknown signal id", async () => {
    const req: any = { headers: new Headers({ cookie: "vf_session=token" }) }
    const res = await signalsIdRoute.GET(req as any, { params: { id: "nonexistent-id" } } as any)
    const body = await res.json()
    expect(res.status).toBe(404)
    expect(body.error).toBeDefined()
  })
})
