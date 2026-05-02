import { MongoClient, ServerApiVersion } from 'mongodb'

declare global {
  var __trackObserverMongoClientPromise: Promise<MongoClient> | undefined
}

function getMongoUri() {
  return (
    process.env.MONGO_URL ??
    `mongodb://127.0.0.1:${process.env.MONGO_HOST_SERVER_PORT ?? '7429'}`
  )
}

function createMongoClient() {
  return new MongoClient(getMongoUri(), {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true,
    },
  })
}

export function getMongoClient() {
  if (!global.__trackObserverMongoClientPromise) {
    global.__trackObserverMongoClientPromise = createMongoClient().connect()
  }

  return global.__trackObserverMongoClientPromise
}

export async function getMongoDatabase() {
  const client = await getMongoClient()
  return client.db(
    process.env.MONGODB_DATABASE ??
      process.env.MONGO_DATABASE ??
      'track-observer'
  )
}
