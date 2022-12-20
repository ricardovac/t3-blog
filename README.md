<h1 align="center" style="font-size: 40px">Minimal Blog</h1>

<p align="center"><strong>A fullstack Blog with Nextjs, Prisma, trpc</strong></p>

## Main technology used

- The t3 stack: [create.t3.gg](https://create.t3.gg/)
  - Next.js
  - tRPC
  - Prisma
  - NextAuth.js
  - Tailwind
- External dependencies:
  - timeago-react
  - sanitize-html
  - react-icons

## Features

- Auth (Google, Github soon...)
- Create posts
- Nested comments on posts
- Search for posts

## Installation

Clone the repo and cd into it

```bash
git clone https://github.com/ricardovac/t3-blog
cd t3-blog
```

Install dependencies

```bash
npm i
```

Add the environment variables required, see [.env.example](/.env.example) for reference

```bash
# Prisma
DATABASE_URL=
# Next Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
# Next Auth Google Provider
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Fire up prisma

```bash
npx prisma db push
npx prisma studio # to preview your data
```

Run the dev server

```bash
npm run dev
```
