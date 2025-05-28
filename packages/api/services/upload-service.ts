import { TRPCError } from '@trpc/server'
import { supabase } from '~/lib/supabase'

export class UploadService {
  constructor(slug_url: string) {
    this.slug_url = slug_url
  }

  private slug_url: string

  public async create() {
    await supabase()
      .storage.createBucket(this.slug_url, {
        public: true,
        allowedMimeTypes: ['image/*']
      })
      .catch((e) => {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: e.message
        })
      })
  }

  public async upload(name: string, url: string) {
    const _file = await fetch(url)

    const buffer = await _file.arrayBuffer()

    const file = new File([buffer], name, {
      type: 'image/*'
    })

    await supabase().storage.from(this.slug_url).upload(name, file, {
      upsert: true
    })
  }

  public get(name: string) {
    const {
      data: { publicUrl }
    } = supabase().storage.from(this.slug_url).getPublicUrl(name)

    return publicUrl
  }
}
