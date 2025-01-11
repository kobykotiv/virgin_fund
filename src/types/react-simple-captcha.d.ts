declare module "react-simple-captcha" {
  export function loadCaptchaEnginge(digit: number): void;
  export function LoadCanvasTemplate(props: any): JSX.Element;
  export function validateCaptcha(value: string): boolean;
}
