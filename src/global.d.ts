declare global {
  declare module 'solid-js' {
    namespace JSX {
      interface IntrinsicElements {
        'historical-chart': HTMLAttributes<HTMLElement>
      }
    }
  }
}
