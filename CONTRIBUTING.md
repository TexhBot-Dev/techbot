# Contributing

1. [Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) or [clone](https://github.com/git-guides/git-clone) the repository.
1. Install [`pnpm`](https://pnpm.io) if you haven't already, `npm i pnpm -D -g`.
   a. Run `pnpm i` to install dependencies.
1. Make your changes.
1. Submit a pull request with a description of what your changes do.

### Configuring .env

-   Rename `example.env` to `.env`.
-   Replace `<DISCORD_TOKEN>` with your [discord token](https://discord.com/developers/applications)
-   Replace `<Discord User ID>` with your [user ID](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)
-   Fill out DB Credentials

### Database

-   Create a new database
-   run `npx prisma migrate deploy`
-   if the database wasnt seeded run `node prisma/seed.js`
-   DB Should be setup

### Guidelines

-   Make sure the changes make sense and aren't API abuse.
-   Test your changes before contributing.
-   Be kind to reviewers, commentators, and collaborators.
-   Try to follow the [Conventional Commits standard](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages as much as possible.

### Scripts

-   `pnpm run dev` - Test the bot in dev mode.
-   `pnpm run devw`- Test the bot in dev mode and make _tsup_ watch for changes.

### Stack

-   This project uses [Prisma](https://npmjs.com/package/@prisma/client) for querying the database.
-   This project uses [TypeScript](https://www.typescriptlang.org/) and [`tsup`](https://www.npmjs.com/package/tsup) is our bundler.
-   This project uses the [Sapphire](https://www.sapphirejs.dev/docs/General/Welcome) framework and [discord.js](https://discord.js.org) for interacting with Discord.
