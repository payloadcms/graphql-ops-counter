// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, CollectionConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { opsCounterPlugin } from './plugins/opsCounter'
// import { mongooseAdapter } from '@payloadcms/db-mongodb'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const createSampleCollection = (number?: number): CollectionConfig => ({
  slug: `posts${number ? `-${number}` : ''}`,
  versions: { drafts: true },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
    },
    {
      name: 'writtenBy',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
})

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    createSampleCollection(),
    createSampleCollection(2),
    createSampleCollection(3),
    createSampleCollection(4),
    createSampleCollection(5),
    createSampleCollection(6),
    createSampleCollection(7),
    createSampleCollection(8),
    createSampleCollection(9),
    createSampleCollection(10),
    createSampleCollection(11),
    createSampleCollection(12),
  ],
  endpoints: [
    {
      path: '/test-graphql',
      method: 'get',
      handler: async (req: PayloadRequest) => {
        const { payload } = req
        const email = 'dev@payloadcms.com'
        const password = 'test'

        const existingUserQuery = await payload.find({
          collection: 'users',
          where: {
            email: {
              equals: email,
            },
          },
        })

        if (!existingUserQuery.docs[0]) {
          await payload.create({
            collection: 'users',
            data: {
              email,
              password,
            },
          })
        }

        const { token } = await payload.login({
          collection: 'users',
          data: {
            email,
            password,
          },
        })

        const variables = {
          draft: true,
          slug: 'hello',
        }

        const query = `query pageTypeBySlug($slug: String!, $draft: Boolean = false) {
        Posts(where: { slug: { equals: $slug } }, draft: $draft) {
          docs {
            id
          }
        }
        Posts2s(where: { slug: { equals: $slug } }, draft: $draft) {
          docs {
            id
          }
        }
        Posts3s(where: { slug: { equals: $slug } }, draft: $draft) {
          docs {
            id
          }
        }
        Posts4s(where: { slug: { equals: $slug } }, draft: $draft) {
          docs {
            id
          }
        }
        Posts5s(where: { slug: { equals: $slug } }, draft: $draft) {
          docs {
            id
          }
        }
        Posts6s(where: { slug: { equals: $slug } }, draft: $draft) {
          docs {
            id
          }
        }
        Posts7s(where: { slug: { equals: $slug } }, draft: $draft) {
          docs {
            id
          }
        }
        Posts8s(where: { slug: { equals: $slug } }, draft: $draft) {
          docs {
            id
          }
        }
        Posts9s(where: { slug: { equals: $slug } }, draft: $draft) {
          docs {
            id
          }
        }
        Posts10s(where: { slug: { equals: $slug } }, draft: $draft) {
          docs {
            id
          }
        }
        Posts11s(where: { slug: { equals: $slug } }, draft: $draft) {
          docs {
            id
          }
        }
        Posts12s(where: { slug: { equals: $slug } }, draft: $draft) {
          docs {
            id
          }
        }
      }`

        const json = await fetch('http://127.0.0.1:3000/api/graphql', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables,
          }),
        }).then((res) => res.json())

        return Response.json(json)
      },
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
    },
  }),
  // db: mongooseAdapter({
  //   url: process.env.MONGODB_URI!
  // }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    opsCounterPlugin({
      max: 15,
      warnAt: 12,
    }),
    // storage-adapter-placeholder
  ],
})
