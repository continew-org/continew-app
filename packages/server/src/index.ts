import process from 'node:process'
import { serve } from '@hono/node-server'
import app from './app'

const port = Number(process.env.PORT ?? 8080)

serve({ fetch: app.fetch, port }, (info) => {
  // eslint-disable-next-line no-console
  console.log(`[continew-app-server] listening on http://localhost:${info.port}`)
})
