declare global {
  namespace JSX {
    namespace IntrinsicElements {
      interface ImgHTMLAttributes<T> extends HTMLImageElement<T> {
        src: string | undefined;
      }
    }
  }
}
