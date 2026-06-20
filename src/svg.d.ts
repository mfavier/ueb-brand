// The build (tsup) loads .svg files as text strings.
declare module '*.svg' {
  const content: string;
  export default content;
}
