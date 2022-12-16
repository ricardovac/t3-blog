declare global {
  namespace JSX {
    namespace IntrinsicElements {
      interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
        src: string | null;
      }
    }
  }
}
