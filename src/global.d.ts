declare global {
  declare module 'solid-js' {
    namespace JSX {
      interface IntrinsicElements {
        'md-slider': any
      }
    }
  }
}
