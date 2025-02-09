export class CustomProperties {
  title: string
  alt: string
  caption: string
  credit: string;
  [key: string]: string;
  constructor(props: Record<string, string> = {}) {
    this.title = props.title ?? ''
    this.alt = props.alt ?? ''
    this.caption = props.caption ?? ''
    this.credit = props.credit ?? ''
    Object.keys(props).forEach((key) => {
      this[key] = props[key]
    })
  }
}
