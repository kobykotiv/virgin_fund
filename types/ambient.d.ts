// Ambient module declarations to satisfy TypeScript for packages without proper .d.ts
declare module 'bcryptjs' {
  const bcrypt: any
  export default bcrypt
}

declare module 'cookie' {
  const cookie: any
  export default cookie
}

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
