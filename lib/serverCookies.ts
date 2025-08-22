/**
 * lib/serverCookies.ts
 *
 * Helpers to build Set-Cookie header strings for server responses.
 * - Supports both NextResponse.cookies API and manual Set-Cookie header append.
 *
 * Usage:
 *  - setResponseCookie(res, cookieSpec)  // works with NextResponse (app router) or response-like objects
 *  - clearResponseCookie(res, name)     // clears cookie using cookies API when available
 */

type CookieOpts = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none" | string;
  path?: string;
  maxAge?: number; // seconds
  domain?: string;
  expires?: string; // optional explicit expires string (UTC)
};

export function serializeCookie(name: string, value: string, opts: CookieOpts = {}) {
  const parts: string[] = [];
  parts.push(`${name}=${value}`);

  if (opts.httpOnly) parts.push("HttpOnly");
  if (opts.secure) parts.push("Secure");
  parts.push(`Path=${opts.path ?? "/"}`);

  if (typeof opts.maxAge === "number") {
    parts.push(`Max-Age=${Math.floor(opts.maxAge)}`);
    // also set Expires for older clients
    try {
      const exp = new Date(Date.now() + opts.maxAge * 1000).toUTCString();
      parts.push(`Expires=${exp}`);
    } catch (e) {
      // ignore
    }
  } else if (opts.expires) {
    parts.push(`Expires=${opts.expires}`);
  }

  if (opts.sameSite) {
    parts.push(`SameSite=${opts.sameSite}`);
  } else {
    parts.push("SameSite=Strict");
  }

  if (opts.domain) {
    parts.push(`Domain=${opts.domain}`);
  }

  return parts.join("; ");
}

/**
 * Builds a Set-Cookie header string for a cookie shape:
 * { name, value, opts }
 */
export function buildSetCookieHeader(cookie: { name: string; value: string; opts?: CookieOpts }) {
  return serializeCookie(cookie.name, cookie.value, cookie.opts || {});
}

/**
 * setResponseCookie
 *
 * - If `res.cookies?.set` exists (NextResponse in app-router / edge runtimes), use it.
 * - Otherwise fall back to appending/setting the `Set-Cookie` header.
 *
 * Accepts:
 *  - res: NextResponse-like or Response-like that supports headers.get/set
 *  - cookie: { name, value, opts }
 */
export function setResponseCookie(res: any, cookie: { name: string; value: string; opts?: CookieOpts }) {
  // Prefer NextResponse.cookies API when available (app-router / edge)
  try {
    if (res?.cookies && typeof res.cookies.set === "function") {
      // NextResponse.cookies.set signature accepts options slightly different:
      // { httpOnly, secure, sameSite, path, maxAge, domain, expires }
      const opts = cookie.opts || {};
      // NextResponse expects sameSite in lower-case values 'lax' | 'strict' | 'none'
      res.cookies.set(cookie.name, cookie.value, {
        httpOnly: !!opts.httpOnly,
        secure: !!opts.secure,
        sameSite: (opts.sameSite as any) || "strict",
        path: opts.path || "/",
        maxAge: typeof opts.maxAge === "number" ? Math.floor(opts.maxAge) : undefined,
        domain: opts.domain,
        expires: opts.expires,
      });
      return res;
    }
  } catch (e) {
    // If cookies API exists but calling it fails for some runtimes, fall back to header approach below.
    // eslint-disable-next-line no-console
    console.warn("setResponseCookie: cookies API failed, falling back to header append", e);
  }

  // Fallback: use Set-Cookie header manipulation
  const header = buildSetCookieHeader(cookie);
  const existing = res.headers?.get?.("Set-Cookie");
  if (!existing) {
    res.headers?.set?.("Set-Cookie", header);
  } else {
    // Append; some runtimes accept multiple Set-Cookie headers, others expect a comma-joined string.
    // Prefer appending as a new header when possible, otherwise join.
    if (typeof res.headers.append === "function") {
      res.headers.append("Set-Cookie", header);
    } else {
      res.headers?.set?.("Set-Cookie", existing + ", " + header);
    }
  }
  return res;
}

/**
 * clearResponseCookie
 *
 * Clears a cookie via cookies API when available, otherwise sets Max-Age=0 header.
 */
export function clearResponseCookie(res: any, name: string, opts?: Partial<CookieOpts>) {
  try {
    if (res?.cookies && typeof res.cookies.delete === "function") {
      res.cookies.delete(name, { path: opts?.path || "/" });
      return res;
    }
  } catch (e) {
    // fallback to header approach below
    // eslint-disable-next-line no-console
    console.warn("clearResponseCookie: cookies.delete failed, falling back to header append", e);
  }

  const clearCookie = {
    name,
    value: "",
    opts: {
      path: opts?.path || "/",
      maxAge: 0,
      httpOnly: true,
      sameSite: (opts?.sameSite as any) || "Strict",
      secure: opts?.secure ?? (process.env.NODE_ENV === "production"),
      domain: opts?.domain,
    } as CookieOpts,
  };

  return setResponseCookie(res, clearCookie);
}

export default {
  serializeCookie,
  buildSetCookieHeader,
  setResponseCookie,
  clearResponseCookie,
};
