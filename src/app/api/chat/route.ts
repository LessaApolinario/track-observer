import { ChatMessage } from '@/core/domain/models/ChatMessage'
import { User } from '@/core/domain/models/User'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface CreateMessageBody {
  action: 'create'
  payload: {
    text: string
    user: User
  }
}

const inMemoryMessages: ChatMessage[] = []

function listResponse() {
  return NextResponse.json({
    action: 'list',
    payload: {
      messages: inMemoryMessages,
    },
  })
}

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get('action')

  if (action !== 'list') {
    return NextResponse.json(
      {
        error: 'Ação inválida. Apenas list é permitida no GET.',
      },
      { status: 400 }
    )
  }

  return listResponse()
}

export async function POST(request: NextRequest) {
  let body: CreateMessageBody

  try {
    body = (await request.json()) as CreateMessageBody
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  if (body.action !== 'create') {
    return NextResponse.json(
      {
        error: 'Ação inválida. Apenas create é permitida no POST.',
      },
      { status: 400 }
    )
  }

  const text = body.payload?.text?.trim()
  const user = body.payload?.user

  if (!text) {
    return NextResponse.json(
      { error: 'Texto da mensagem é obrigatório.' },
      { status: 400 }
    )
  }

  if (!user || !user.id || !user.name?.trim()) {
    return NextResponse.json({ error: 'Usuário inválido.' }, { status: 400 })
  }

  const message: ChatMessage = {
    id: crypto.randomUUID(),
    text,
    user: {
      id: user.id,
      name: user.name.trim(),
    },
    createdAt: new Date().toISOString(),
  }

  inMemoryMessages.push(message)

  return NextResponse.json(
    {
      action: 'create',
      payload: {
        message,
      },
    },
    { status: 201 }
  )
}
