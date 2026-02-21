<a name="readme-top"></a>

# AI-Powered Intelligent Chat Assistant and Meeting Summarizer using Next.js 15 and Stream Video

![AI-Powered Intelligent Chat Assistant and Meeting Summarizer using Next.js 15 and Stream Video](/.github/images/img_main.png 'AI-Powered Intelligent Chat Assistant and Meeting Summarizer using Next.js 15 and Stream Video')

[![Ask Me Anything!](https://flat.badgen.net/static/Ask%20me/anything?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy 'Ask Me Anything!')
[![GitHub license](https://flat.badgen.net/github/license/sanidhyy/meet-ai?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/meet-ai/blob/main/LICENSE 'GitHub license')
[![Maintenance](https://flat.badgen.net/static/Maintained/yes?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/meet-ai/commits/main 'Maintenance')
[![GitHub branches](https://flat.badgen.net/github/branches/sanidhyy/meet-ai?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/meet-ai/branches 'GitHub branches')
[![Github commits](https://flat.badgen.net/github/commits/sanidhyy/meet-ai?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/meet-ai/commits 'Github commits')
[![GitHub issues](https://flat.badgen.net/github/issues/sanidhyy/meet-ai?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/meet-ai/issues 'GitHub issues')
[![GitHub pull requests](https://flat.badgen.net/github/prs/sanidhyy/meet-ai?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/meet-ai/pulls 'GitHub pull requests')
[![Vercel status](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://app-meetai.vercel.app 'Vercel status')

<!-- Table of Contents -->
<details>

<summary>

# :notebook_with_decorative_cover: Table of Contents

</summary>

- [Folder Structure](#bangbang-folder-structure)
- [Getting Started](#toolbox-getting-started)
- [Screenshots](#camera-screenshots)
- [Tech Stack](#gear-tech-stack)
- [Stats](#wrench-stats)
- [Contribute](#raised_hands-contribute)
- [Acknowledgements](#gem-acknowledgements)
- [Buy Me a Coffee](#coffee-buy-me-a-coffee)
- [Follow Me](#rocket-follow-me)
- [Learn More](#books-learn-more)
- [Deploy on Vercel](#page_with_curl-deploy-on-vercel)
- [Give A Star](#star-give-a-star)
- [Star History](#star2-star-history)
- [Give A Star](#star-give-a-star)

</details>

## :bangbang: Folder Structure

Here is the folder structure of this app.

<!--- FOLDER_STRUCTURE_START --->

```bash
meet-ai/
  |- migrations/
  |- public/
    |-- cancelled.svg
    |-- empty.svg
    |-- github-white.svg
    |-- github.svg
    |-- google.svg
    |-- logo.svg
    |-- processing.svg
    |-- upcoming.svg
    |-- web-app-manifest-192x192.png
    |-- web-app-manifest-512x512.png
  |- src/
    |-- app/
        |--- (auth)/
          |---- sign-in/
          |---- sign-up/
          |---- layout.tsx
        |--- (dashboard)/
          |---- agents/
          |---- meetings/
          |---- settings/
          |---- upgrade/
          |---- layout.tsx
        |--- api/
          |---- auth/
          |---- cron/
          |---- inngest/
          |---- trpc/
          |---- webhook/
        |--- call/
          |---- [meetingId]/
          |---- layout.tsx
        |--- portal/
          |---- route.ts
        |--- apple-icon.png
        |--- favicon.ico
        |--- globals.css
        |--- icon0.svg
        |--- icon1.png
        |--- layout.tsx
        |--- manifest.json
        |--- not-found.tsx
    |-- components/
        |--- providers/
        |--- ui/
        |--- command-select.tsx
        |--- data-pagination.tsx
        |--- data-table.tsx
        |--- empty-state.tsx
        |--- error-state.tsx
        |--- generated-avatar.tsx
        |--- loading-avatar.tsx
        |--- responsive-modal.tsx
    |-- config/
        |--- http-status-codes.ts
        |--- index.ts
    |-- db/
        |--- index.ts
        |--- schema.ts
    |-- env/
        |--- client.ts
        |--- server.ts
    |-- hooks/
        |--- use-confirm.tsx
        |--- use-mobile.ts
    |-- inngest/
        |--- client.ts
        |--- functions.ts
    |-- lib/
        |--- auth-client.ts
        |--- auth.ts
        |--- avatar.tsx
        |--- encryption.ts
        |--- polar.ts
        |--- stream-chat.ts
        |--- stream-video.ts
        |--- utils.ts
    |-- modules
        |--- agents/
        |--- auth/
        |--- call/
        |--- dashboard/
        |--- meetings/
        |--- premium/
        |--- settings/
    |-- trpc/
        |--- routers/
        |--- client.tsx
        |--- init.ts
        |--- query-client.ts
        |--- server.tsx
    |-- types/
        |--- index.ts
    |-- middleware.ts
  |- .env.example
  |- .env.local
  |- .gitignore
  |- .prettierignore
  |- .prettierrc.mjs
  |- bun.lock
  |- components.json
  |- drizzle.config.ts
  |- environment.d.ts
  |- eslint.config.mjs
  |- next.config.js
  |- package.json
  |- postcss.config.mjs
  |- README.md
  |- tsconfig.json
  |- vercel.json
```

<!--- FOLDER_STRUCTURE_END --->

<br />

## :toolbox: Getting Started

1. Make sure **Git** and **NodeJS** is installed.
2. Clone this repository to your local computer.
3. Create `.env.local` file in **root** directory.
4. Contents of `.env.local`:

```env
# disable telemetry
DO_NOT_TRACK=1
BETTER_AUTH_TELEMETRY=0
NEXT_TELEMETRY_DISABLED=1

# app base url
NEXT_PUBLIC_APP_BASE_URL="http://localhost:3000"

# neon db uri
DATABASE_URL="postgresql://<username>:<password>@<hostname>/MeetAI?sslmode=require"

# better auth secret (generated by `openssl rand -hex 32`)
BETTER_AUTH_SECRET="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# github oauth client id and secret
GITHUB_CLIENT_ID="XXXXXXXXXXXXXXXXXXXXX"
GITHUB_CLIENT_SECRET="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# google oauth client id and secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# stream video api key and secret
NEXT_PUBLIC_STREAM_VIDEO_API_KEY="xxxxxxxxxxxx"
STREAM_VIDEO_API_SECRET="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# stream chat api key and secret
NEXT_PUBLIC_STREAM_CHAT_API_KEY="xxxxxxxxxxxx"
STREAM_CHAT_API_SECRET="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# polar access token
POLAR_ACCESS_TOKEN="polar_oat_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# uploadthing token
UPLOADTHING_TOKEN="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# verification and cron secret (generated by `openssl rand -hex 32`)
VERIFICATION_SECRET="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
CRON_SECRET="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

```

### 5. Disable Telemetry (Optional)

```bash
DO_NOT_TRACK=1
BETTER_AUTH_TELEMETRY=0
NEXT_TELEMETRY_DISABLED=1
```

- These disable analytics/telemetry from Better Auth and Next.js. Keep them as provided.

---

### 6. App Base URL

```bash
NEXT_PUBLIC_APP_BASE_URL="http://localhost:3000"
```

- Keep as `http://localhost:3000` during development.
- Change to your deployed URL (e.g., `https://app-meetai.vercel.app`) in production.

---

### 7. Neon (PostgreSQL Database)

- Sign up at [Neon](https://neon.tech/).
- Create a new **PostgreSQL project**.
- Go to **Connection Details** and copy the **Connection String**.
- Replace `<username>`, `<password>`, and `<hostname>` with your Neon credentials.
- Append `?sslmode=require` at the end (needed for secure connections).

---

### 8. GetStream (Video & Chat)

- **Create an Account & App**
  - Sign up at [GetStream Dashboard](https://getstream.io/dashboard/).
  - Create a new **app**.

- **Get Your API Keys**
  - From your app’s dashboard > Chat Messaging and Video & Audio, locate:
    - **API Key** → used in the frontend (`NEXT_PUBLIC_STREAM_VIDEO_API_KEY` and `NEXT_PUBLIC_STREAM_CHAT_API_KEY`)
    - **API Secret** → used in backend or server code only (`STREAM_VIDEO_API_SECRET` and `STREAM_CHAT_API_SECRET`)
      (Copy both **API Key** and **API Secret** and paste in `.env.local`)

- **Create Webhook**
  - In the GetStream Dashboard, go to:
    - **Chat Messaging** > **Settings** > **Webhooks**
    - **Video & Audio** > **Settings** > **Webhooks**
  - Create a new webhook with this URL: `http://localhost:3000/api/webhook/stream`.
  - Select all available events/endpoints for both **Chat Messaging** and **Video & Audio**.
  - Click on **Create Webhook**.
  - This ensures your backend receives real-time notifications for messages, participants, and call updates.

**NOTE**: Replace `http://localhost:3000` with your app's base URL.

---

### 9. Polar (Payments / Billing)

- **Create an Account**
  - Go to [Polar Sandbox Dashboard](https://sandbox.polar.sh/).
  - Set up your **Organization**.

- **Generate Access Token**
  - Navigate to **Settings** > **Developers** (or **Organization** > **Developers**).
  - Create a new **Organization Access Token (OAT)**.
  - Copy the token and set (`POLAR_ACCESS_TOKEN`) in `.env.local`.

---

### 10. UploadThing (File Uploads)

- Sign up at [UploadThing](https://uploadthing.com/).
- Create a new app.
- Copy the **API Token** → `UPLOADTHING_TOKEN`

---

### 11. GitHub OAuth Client ID and Secret

To obtain GitHub OAuth credentials:

- Go to [GitHub Developer Settings](https://github.com/settings/developers).
- Create a new OAuth app:
  - Homepage URL: Your app's base URL (e.g., `http://localhost:3000`).
  - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`.
- After creation, you'll get **Client ID** and **Client Secret**.

**NOTE:** Replace `http://localhost:3000` with your app's base URL.

---

### 12. Google OAuth Client ID and Secret

To obtain Google OAuth credentials:

- Visit the [Google Cloud Console](https://console.cloud.google.com/).
- Create a new project and configure **OAuth consent screen** with default settings.
- Create **OAuth 2.0 credentials**:
  - Authorised JavaScript origins: `http://localhost` and `http://localhost:3000` for one-tap sign in.
  - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`.
- After creation, you'll receive a **Client ID** and **Client Secret**.

**NOTE:** Replace `http://localhost:3000` with your app's base URL.

---

### 13. Generate Secrets

- Generate **better auth secret**, **verification secret** and **cron secret** (for cryptographic signing):

  ```bash
  openssl rand -hex 32
  ```

  Copy the output → `BETTER_AUTH_SECRET`, `VERIFICATION_SECRET` and `CRON_SECRET` separately

---

14. Install Project Dependencies using `npm install --legacy-peer-deps` or `yarn install --legacy-peer-deps` or `bun install --legacy-peer-deps`.

15. Now app is fully configured 👍 and you can start using this app using either one of `npm run dev` or `yarn dev` or `bun dev`.

**NOTE:** Please make sure to keep your API keys and configuration values secure and do not expose them publicly.

## :camera: Screenshots

![Modern UI/UX](/.github/images/img1.png 'Modern UI/UX')

![Subscriptions powered by Polar](/.github/images/img2.png 'Subscriptions powered by Polar')

![Audio and Camera Preview](/.github/images/img3.png 'Audio and Camera Preview')

![Live Meeting with GetStream](/.github/images/img4.png 'Live Meeting with GetStream')

## :gear: Tech Stack

[![React JS](https://skillicons.dev/icons?i=react 'React JS')](https://react.dev/ 'React JS') [![Next JS](https://skillicons.dev/icons?i=next 'Next JS')](https://nextjs.org/ 'Next JS') [![Typescript](https://skillicons.dev/icons?i=ts 'Typescript')](https://www.typescriptlang.org/ 'Typescript') [![PostgreSQL](https://skillicons.dev/icons?i=postgres 'PostgreSQL')](https://www.postgresql.org/ 'PostgreSQL') [![Tailwind CSS](https://skillicons.dev/icons?i=tailwind 'Tailwind CSS')](https://tailwindcss.com/ 'Tailwind CSS') [![Vercel](https://skillicons.dev/icons?i=vercel 'Vercel')](https://vercel.app/ 'Vercel')

## :wrench: Stats

[![Stats for MeetAI](/.github/images/stats.svg 'Stats for MeetAI')](https://pagespeed.web.dev/analysis?url=https://app-meetai.vercel.app 'Stats for MeetAI')

## :raised_hands: Contribute

You might encounter some bugs while using this app. You are more than welcome to contribute. Just submit changes via pull request and I will review them before merging. Make sure you follow community guidelines.

## :gem: Acknowledgements

Useful resources and dependencies that are used in MeetAI.

- Thanks to CodeWithAntonio: https://codewithantonio.com/
<!--- DEPENDENCIES_START --->
- [@dicebear/collection](https://www.npmjs.com/package/@dicebear/collection): ^9.2.4
- [@dicebear/core](https://www.npmjs.com/package/@dicebear/core): ^9.2.4
- [@hookform/resolvers](https://www.npmjs.com/package/@hookform/resolvers): ^5.2.2
- [@inngest/agent-kit](https://www.npmjs.com/package/@inngest/agent-kit): ^0.13.0
- [@neondatabase/serverless](https://www.npmjs.com/package/@neondatabase/serverless): ^1.0.1
- [@polar-sh/better-auth](https://www.npmjs.com/package/@polar-sh/better-auth): ^1.1.9
- [@polar-sh/sdk](https://www.npmjs.com/package/@polar-sh/sdk): ^0.35.4
- [@radix-ui/react-avatar](https://www.npmjs.com/package/@radix-ui/react-avatar): ^1.1.10
- [@radix-ui/react-dialog](https://www.npmjs.com/package/@radix-ui/react-dialog): ^1.1.15
- [@radix-ui/react-dropdown-menu](https://www.npmjs.com/package/@radix-ui/react-dropdown-menu): ^2.1.16
- [@radix-ui/react-label](https://www.npmjs.com/package/@radix-ui/react-label): ^2.1.7
- [@radix-ui/react-progress](https://www.npmjs.com/package/@radix-ui/react-progress): ^1.1.7
- [@radix-ui/react-scroll-area](https://www.npmjs.com/package/@radix-ui/react-scroll-area): ^1.2.10
- [@radix-ui/react-separator](https://www.npmjs.com/package/@radix-ui/react-separator): ^1.1.7
- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot): ^1.2.3
- [@radix-ui/react-tabs](https://www.npmjs.com/package/@radix-ui/react-tabs): ^1.1.13
- [@radix-ui/react-tooltip](https://www.npmjs.com/package/@radix-ui/react-tooltip): ^1.2.8
- [@stream-io/node-sdk](https://www.npmjs.com/package/@stream-io/node-sdk): ^0.7.4
- [@stream-io/openai-realtime-api](https://www.npmjs.com/package/@stream-io/openai-realtime-api): ^0.3.3
- [@stream-io/video-react-sdk](https://www.npmjs.com/package/@stream-io/video-react-sdk): ^1.23.0
- [@t3-oss/env-nextjs](https://www.npmjs.com/package/@t3-oss/env-nextjs): ^0.13.8
- [@tanstack/react-query](https://www.npmjs.com/package/@tanstack/react-query): ^5.90.2
- [@tanstack/react-table](https://www.npmjs.com/package/@tanstack/react-table): ^8.21.3
- [@trpc/client](https://www.npmjs.com/package/@trpc/client): ^11.6.0
- [@trpc/server](https://www.npmjs.com/package/@trpc/server): ^11.6.0
- [@trpc/tanstack-react-query](https://www.npmjs.com/package/@trpc/tanstack-react-query): ^11.6.0
- [better-auth](https://www.npmjs.com/package/better-auth): ^1.3.18
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority): ^0.7.1
- [client-only](https://www.npmjs.com/package/client-only): ^0.0.1
- [clsx](https://www.npmjs.com/package/clsx): ^2.1.1
- [cmdk](https://www.npmjs.com/package/cmdk): ^1.1.1
- [date-fns](https://www.npmjs.com/package/date-fns): ^4.1.0
- [dotenv](https://www.npmjs.com/package/dotenv): ^17.2.2
- [drizzle-orm](https://www.npmjs.com/package/drizzle-orm): ^0.44.5
- [humanize-duration](https://www.npmjs.com/package/humanize-duration): ^3.33.1
- [inngest](https://www.npmjs.com/package/inngest): ^3.44.1
- [jsonl-parse-stringify](https://www.npmjs.com/package/jsonl-parse-stringify): ^1.0.3
- [lodash.debounce](https://www.npmjs.com/package/lodash.debounce): ^4.0.8
- [lucide-react](https://www.npmjs.com/package/lucide-react): ^0.544.0
- [media-chrome](https://www.npmjs.com/package/media-chrome): ^4.14.0
- [nanoid](https://www.npmjs.com/package/nanoid): ^5.1.6
- [next](https://www.npmjs.com/package/next): 15.5.4
- [nuqs](https://www.npmjs.com/package/nuqs): ^2.6.0
- [openai](https://www.npmjs.com/package/openai): ^6.1.0
- [react](https://www.npmjs.com/package/react): 19.1.0
- [react-dom](https://www.npmjs.com/package/react-dom): 19.1.0
- [react-error-boundary](https://www.npmjs.com/package/react-error-boundary): ^6.0.0
- [react-highlight-words](https://www.npmjs.com/package/react-highlight-words): ^0.21.0
- [react-hook-form](https://www.npmjs.com/package/react-hook-form): ^7.63.0
- [react-hot-toast](https://www.npmjs.com/package/react-hot-toast): ^2.6.0
- [react-markdown](https://www.npmjs.com/package/react-markdown): ^10.1.0
- [server-only](https://www.npmjs.com/package/server-only): ^0.0.1
- [stream-chat](https://www.npmjs.com/package/stream-chat): ^9.20.3
- [stream-chat-react](https://www.npmjs.com/package/stream-chat-react): ^13.7.0
- [superjson](https://www.npmjs.com/package/superjson): ^2.2.2
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge): ^3.3.1
- [uploadthing](https://www.npmjs.com/package/uploadthing): ^7.7.4
- [vaul](https://www.npmjs.com/package/vaul): ^1.1.2
- [zod](https://www.npmjs.com/package/zod): ^4.1.11
- [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser): ^7.28.4
- [@eslint/eslintrc](https://www.npmjs.com/package/@eslint/eslintrc): ^3
- [@ianvs/prettier-plugin-sort-imports](https://www.npmjs.com/package/@ianvs/prettier-plugin-sort-imports): ^4.7.0
- [@tailwindcss/postcss](https://www.npmjs.com/package/@tailwindcss/postcss): ^4
- [@trivago/prettier-plugin-sort-imports](https://www.npmjs.com/package/@trivago/prettier-plugin-sort-imports): ^5.2.2
- [@types/humanize-duration](https://www.npmjs.com/package/@types/humanize-duration): ^3.27.4
- [@types/lodash.debounce](https://www.npmjs.com/package/@types/lodash.debounce): ^4.0.9
- [@types/node](https://www.npmjs.com/package/@types/node): ^20
- [@types/react](https://www.npmjs.com/package/@types/react): ^19
- [@types/react-dom](https://www.npmjs.com/package/@types/react-dom): ^19
- [@types/react-highlight-words](https://www.npmjs.com/package/@types/react-highlight-words): ^0.20.0
- [drizzle-kit](https://www.npmjs.com/package/drizzle-kit): ^0.31.4
- [eslint](https://www.npmjs.com/package/eslint): ^9
- [eslint-config-next](https://www.npmjs.com/package/eslint-config-next): 15.5.4
- [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier): ^10.1.8
- [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier): ^5.5.4
- [eslint-plugin-tailwindcss](https://www.npmjs.com/package/eslint-plugin-tailwindcss): ^4.0.0-beta.0
- [mprocs](https://www.npmjs.com/package/mprocs): ^0.7.3
- [prettier](https://www.npmjs.com/package/prettier): ^3.6.2
- [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss): ^0.6.14
- [sort-classes](https://www.npmjs.com/package/sort-classes): npm:prettier-plugin-tailwindcss
- [tailwindcss](https://www.npmjs.com/package/tailwindcss): ^4
- [tidy-imports](https://www.npmjs.com/package/tidy-imports): npm:@trivago/prettier-plugin-sort-imports
- [tw-animate-css](https://www.npmjs.com/package/tw-animate-css): ^1.4.0
- [typescript](https://www.npmjs.com/package/typescript): ^5
<!--- DEPENDENCIES_END --->

## :coffee: Buy Me a Coffee

[<img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" width="200" />](https://www.buymeacoffee.com/sanidhy 'Buy me a Coffee')

## :rocket: Follow Me

[![Follow Me](https://img.shields.io/github/followers/sanidhyy?style=social&label=Follow&maxAge=2592000)](https://github.com/sanidhyy 'Follow Me')
[![Tweet about this project](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fx.com%2F_sanidhyy)](https://x.com/intent/tweet?text=Check+out+this+amazing+app:&url=https%3A%2F%2Fgithub.com%2Fsanidhyy%2Fmeet-ai 'Tweet about this project')

## :books: Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## :page_with_curl: Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## :star: Give A Star

You can also give this repository a star to show more people and they can use this repository.

## :star2: Star History

<a href="https://star-history.com/#sanidhyy/meet-ai&Timeline">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=sanidhyy/meet-ai&type=Timeline&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=sanidhyy/meet-ai&type=Timeline" />
  <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=sanidhyy/meet-ai&type=Timeline" />
</picture>
</a>

<br />
<p align="right">(<a href="#readme-top">back to top</a>)</p>
