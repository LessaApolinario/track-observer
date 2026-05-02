> 🇺🇸 Read in English: [README.md](README.md)

# Track Observer

Uma aplicação de compartilhamento de músicas e chat em tempo real. Conecte sua conta do Spotify, veja o que está ouvindo no momento, compartilhe com outros ouvintes em uma sala e converse — tudo ao mesmo tempo.

---

## Funcionalidades

- **Integração com Spotify** — login via OAuth 2.0, renovação automática de token, polling da faixa atual
- **Presença na sala** — veja o que outros participantes estão ouvindo no momento (persistido no MongoDB com expiração automática por TTL)
- **Chat ao vivo** — feed de mensagens em memória com usuários anônimos e apelidos personalizados
- **Busca de faixas** — filtre as faixas visíveis na sala localmente, sem requisições extras
- **UI responsiva** — layout em grid com Tailwind CSS do mobile ao desktop
- **React 19 Compiler** — memoização automática para desempenho de renderização otimizado

---

## Stack de Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript 5 |
| UI | React 19, Tailwind CSS v4 |
| Estado | `use-context-selector` |
| HTTP Client | Axios |
| Banco de Dados | MongoDB 7 (driver nativo) |
| WebSocket | ws |
| Testes | Jest 30, React Testing Library |
| Containerização | Docker Compose (MongoDB) |

---

## Visão Geral da Arquitetura

```
src/
├── app/
│   ├── page.tsx              # Página principal
│   ├── layout.tsx            # Layout raiz (providers)
│   └── api/
│       ├── spotify/          # OAuth login, callback, current-track
│       ├── chat/             # Armazenamento de mensagens em memória (GET / POST)
│       └── room/
│           └── current-tracks/  # Presença no MongoDB (GET / POST)
├── core/
│   ├── domain/models/        # ChatMessage, Track, User, RoomCurrentTrack
│   ├── infrastructure/mongodb/  # Client de conexão com cache global
│   ├── @types/spotify/       # Definições de tipos da API do Spotify
│   └── mappers/              # SpotifyToTrackMapper
└── ui/
    ├── components/           # Painel de chat, cards de faixa, busca
    └── contexts/             # ChatProvider, TrackProvider + hooks
```

---

## Rotas da API

| Rota | Método | Descrição |
|---|---|---|
| `/api/spotify/login` | GET | Inicia o fluxo OAuth 2.0 e redireciona para o Spotify |
| `/api/spotify/callback` | GET | Troca o código de autorização por tokens e os armazena em cookies seguros |
| `/api/spotify/current-track` | GET | Retorna a faixa atual, renovando o token se necessário |
| `/api/chat` | GET | Lista mensagens do chat |
| `/api/chat` | POST | Envia uma nova mensagem no chat |
| `/api/room/current-tracks` | GET | Lista todos os participantes da sala e suas faixas atuais |
| `/api/room/current-tracks` | POST | Insere ou remove a faixa de um usuário da sala |

---

## Configuração

### Pré-requisitos

- Node.js 20+
- Conta de desenvolvedor no Spotify
- Docker (para a instância local do MongoDB)

---

### 1. Crie um App no Spotify

1. Acesse o [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Clique em **Create an App** e preencha o nome e a descrição.
3. Abra **Edit Settings** e adicione o seguinte Redirect URI:
   ```
   http://localhost:3000/api/spotify/callback
   ```
4. Salve e copie o **Client ID** e o **Client Secret**.

---

### 2. Inicie o MongoDB

```bash
docker compose up -d
```

Isso inicia uma instância do MongoDB na porta `8200` (configurável via `MONGO_HOST_SERVER_PORT`).

---

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Spotify
SPOTIFY_CLIENT_ID=seu_client_id
SPOTIFY_CLIENT_SECRET=seu_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback
SPOTIFY_APP_BASE_URL=http://localhost:3000

# MongoDB
MONGO_URL=mongodb://root:password@localhost:8200
MONGO_DATABASE=track-observer
```

---

### 4. Instale as dependências e execute

```bash
yarn install
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000), clique em **Conectar com Spotify** e autorize o aplicativo.

---

## Executando os Testes

```bash
yarn test
```

Os testes utilizam Jest com React Testing Library e jsdom.

---

## Escopos necessários no Spotify

- `user-read-currently-playing`
- `user-read-playback-state`
