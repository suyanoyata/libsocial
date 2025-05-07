export type BaseTitle = {
  otherNames?: string[]
  ageRestriction: {
    id: number
    label: string
  }
  id: number
  name: string
  eng_name?: string
  slug_url: string
  cover: {
    default: string
  }
  site: string
  model: string
  genres: Genre[]
  summary: string
  isLicensed?: boolean
}

export type Genre = {
  id: number
  name: string
  adult: boolean
}

export interface Title extends BaseTitle {
  background: {
    url: string
  }
  metadata: {
    count: number
  }
  type: {
    id: number
    label: string
  }
}
