import { RoomCurrentTrack } from '@/core/domain/models/RoomCurrentTrack'
import { Track } from '@/core/domain/models/Track'
import { User } from '@/core/domain/models/User'
import { getMongoDatabase } from '@/core/infrastructure/mongodb/client'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface RoomTrackDocument {
  userId: string
  userName: string
  track: Track
  createdAt: Date
  updatedAt: Date
}

interface UpsertBody {
  action: 'upsert'
  payload: {
    user: User
    track: Track
  }
}

interface RemoveBody {
  action: 'remove'
  payload: {
    userId: string
  }
}

type RequestBody = UpsertBody | RemoveBody

const collectionName = 'room_current_tracks'
let hasIndexes = false

function isValidUser(user: User | undefined | null): user is User {
  return Boolean(user?.id?.trim() && user.name?.trim())
}

function isValidTrack(track: Track | undefined | null): track is Track {
  return Boolean(
    track?.id?.trim() &&
    track.title?.trim() &&
    track.artist?.trim() &&
    track.album?.trim() &&
    Number.isFinite(track.duration)
  )
}

async function ensureIndexes() {
  if (hasIndexes) {
    return
  }

  const db = await getMongoDatabase()
  const collection = db.collection<RoomTrackDocument>(collectionName)

  await collection.createIndex({ userId: 1 }, { unique: true })

  // Garbage-collect stale presence records if a browser closes unexpectedly.
  await collection.createIndex(
    { updatedAt: 1 },
    { expireAfterSeconds: 120, name: 'ttl_updated_at_120s' }
  )

  hasIndexes = true
}

function mapDocument(document: RoomTrackDocument): RoomCurrentTrack {
  return {
    user: {
      id: document.userId,
      name: document.userName,
    },
    track: document.track,
    updatedAt: document.updatedAt.toISOString(),
  }
}

async function listRoomTracks() {
  await ensureIndexes()
  const db = await getMongoDatabase()
  const collection = db.collection<RoomTrackDocument>(collectionName)

  const documents = await collection
    .find({})
    .sort({ updatedAt: -1 })
    .limit(50)
    .toArray()

  return documents.map(mapDocument)
}

export async function GET() {
  try {
    const tracks = await listRoomTracks()

    return NextResponse.json({
      tracks,
    })
  } catch (error) {
    console.error('Failed to list room current tracks', error)

    return NextResponse.json(
      {
        error: 'Nao foi possivel listar as faixas da sala.',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  let body: RequestBody

  try {
    body = (await request.json()) as RequestBody
  } catch {
    return NextResponse.json({ error: 'Payload invalido.' }, { status: 400 })
  }

  if (!body || !body.action) {
    return NextResponse.json({ error: 'Acao invalida.' }, { status: 400 })
  }

  try {
    await ensureIndexes()
    const db = await getMongoDatabase()
    const collection = db.collection<RoomTrackDocument>(collectionName)

    if (body.action === 'upsert') {
      const user = body.payload?.user
      const track = body.payload?.track

      if (!isValidUser(user) || !isValidTrack(track)) {
        return NextResponse.json(
          { error: 'Usuario ou faixa invalido.' },
          { status: 400 }
        )
      }

      const now = new Date()

      await collection.updateOne(
        {
          userId: user.id,
        },
        {
          $set: {
            userName: user.name.trim(),
            track,
            updatedAt: now,
          },
          $setOnInsert: {
            userId: user.id,
            createdAt: now,
          },
        },
        { upsert: true }
      )
    }

    if (body.action === 'remove') {
      const userId = body.payload?.userId?.trim()

      if (!userId) {
        return NextResponse.json(
          { error: 'userId e obrigatorio para remover.' },
          { status: 400 }
        )
      }

      await collection.deleteOne({ userId })
    }

    const tracks = await listRoomTracks()

    return NextResponse.json({ tracks })
  } catch (error) {
    console.error('Failed to update room current tracks', error)

    return NextResponse.json(
      {
        error: 'Nao foi possivel atualizar as faixas da sala.',
      },
      { status: 500 }
    )
  }
}
