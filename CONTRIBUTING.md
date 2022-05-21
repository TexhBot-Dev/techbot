# Contributing

1. [Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) or [clone](https://github.com/git-guides/git-clone) the repository.
1. TODO: mention something about ts nightly extension / `this.container.prisma` issue
1. Install [`pnpm`](https://pnpm.io) if you haven't already, `npm i pnpm -D -g`.
   a. Run `pnpm i` to install dependencies.
1. Make your changes.
1. Submit a pull request with a description of what your changes do.

### Configuring .env

-   Rename `example.env` to `.env`.
-   Replace `<DISCORD_TOKEN>` with your [discord token](https://discord.com/developers/applications)
-   Put your Discord user ID temporarily into the line
-   Fill out DB Credentials, OPTIONAL use read-only DB

### Database

TODO

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
