export type BaseTitle = {
  otherNames?: string[]
  id: number
  name: string
  eng_name?: string
  slug_url: string
  cover: {
    default: string
  }
  site: number
  model: string
  genres: Genre[]
  summary: string | null
  isLicensed?: boolean
}

export type Genre = {
  id: number
  name: string
  adult: boolean
}
