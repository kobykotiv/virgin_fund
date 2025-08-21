declare module "@supabase/supabase-js" {
  // Minimal shim for TypeScript until proper types are installed.
  // Avoid leaking secrets or implementation details — this file only provides
  // broad any-typed exports so existing code can compile.
  export type SupabaseClient = any;
  export function createClient(...args: any[]): SupabaseClient;
  const _default: {
    createClient: typeof createClient;
  } & any;
  export default _default;
}
