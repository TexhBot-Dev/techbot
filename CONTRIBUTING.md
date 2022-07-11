<h1 id="contributing">Contributing</h1>
<ol>
    <li><a href="https://docs.github.com/en/get-started/quickstart/fork-a-repo">Fork</a> or <a href="https://github.com/git-guides/git-clone">clone</a> the repository.</li>
    <li>
        Install <a href="https://pnpm.io"><code>pnpm</code></a> if you haven&#39;t already, <code>npm i pnpm -D -g</code>. a. Run <code>pnpm i</code> to install dependencies.
    </li>
    <li>Make your changes.</li>
    <li>Submit a pull request with a description of what your changes do.</li>
</ol>
<h3 id="configuring-env">Configuring .env</h3>
<ul>
    <li>Rename <code>example.env</code> to <code>.env</code>.</li>
    <li>Replace <code>&lt;DISCORD_TOKEN&gt;</code> with your <a href="https://discord.com/developers/applications">discord token</a></li>
    <li>Replace <code>&lt;Discord User ID&gt;</code> with your <a href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-">user ID</a></li>
    <li>Fill out DB Credentials</li>
</ul>
<h3 id="database">Database</h3>
<ul>
    <li>Create a new database</li>
    <li>run <code>npx prisma migrate deploy</code></li>
    <li>if the database wasnt seeded run <code>node prisma/seed.js</code></li>
    <li>DB Should be setup</li>
</ul>
<h3 id="guidelines">Guidelines</h3>
<ul>
    <li>Make sure the changes make sense and aren&#39;t API abuse.</li>
    <li>Test your changes before contributing.</li>
    <li>Be kind to reviewers, commentators, and collaborators.</li>
    <li>Try to follow the <a href="https://www.conventionalcommits.org/en/v1.0.0/">Conventional Commits standard</a> for commit messages as much as possible.</li>
</ul>
<h3 id="scripts">Scripts</h3>
<ul>
    <li><code>pnpm run dev</code> - Test the bot in dev mode.</li>
    <li><code>pnpm run devw</code>- Test the bot in dev mode and make <em>tsup</em> watch for changes.</li>
</ul>
<h3 id="stack">Stack</h3>
<ul>
    <li>This project uses <a href="https://npmjs.com/package/@prisma/client">Prisma</a> for querying the database.</li>
    <li>
        This project uses <a href="https://www.typescriptlang.org/">TypeScript</a> and <a href="https://www.npmjs.com/package/tsup"><code>tsup</code></a> is our bundler.
    </li>
    <li>This project uses the <a href="https://www.sapphirejs.dev/docs/General/Welcome">Sapphire</a> framework and <a href="https://discord.js.org">discord.js</a> for interacting with Discord.</li>
</ul>
