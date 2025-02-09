export interface BaseModelProps {
  createdAt: string
  id: number
  updatedAt?: string | null
}
export enum AllowedValueTypes {
  Color = 'color',
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Image = 'image',
  Url = 'url',
}

export interface ImageProps {
  link: string
  title: string
}

export const hasKey = <O extends object>(obj: O | null, key: PropertyKey): key is keyof O => obj !== null && key in obj
