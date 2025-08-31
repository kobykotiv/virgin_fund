// Ambient module declarations to satisfy TypeScript for packages without proper .d.ts
// Removed explicit 'bcryptjs' and 'cookie' module shims because @types packages are installed.
declare module 'jsonwebtoken' {
  const jwt: any
  export default jwt
}

declare module 'react-resizable' {
  export const ResizableBox: any
}

declare module 'react-draggable' {
  const Draggable: any
  export default Draggable
}

// Minimal shims for modules without shipped types in this workspace.
// These provide a typed 'any' surface so the compiler can continue while
// proper types or @types packages are added/updated.
declare module 'bcryptjs' {
  const bcrypt: any
  export default bcrypt
}

declare module 'cookie' {
  export function parse(s: string): Record<string, string>
  export function serialize(name: string, val: string, opts?: any): string
}
