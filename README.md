# Lumen - Movie & TV Discovery Website

Next.js 16 (App Router) + TypeScript + Tailwind CSS, powered by the TMDB API.
Ready to deploy on Vercel.

**Features:** rotating featured hero with trailers, trending / now playing / popular / top rated / upcoming rows,
movie and TV detail pages (trailer, cast, similar titles), browse by category and genre with pagination,
live search suggestions + full search page, personal watchlist (saved in the visitor's browser),
dark responsive design, loading skeletons, empty states, error and 404 pages.

---

## 1. Get your TMDB API key (free, 3 minutes)

1. Go to https://www.themoviedb.org/signup and create an account. Verify your email.
2. Open https://www.themoviedb.org/settings/api
3. Click **Create** (or "Request an API key") -> choose **Developer** -> accept the terms.
4. Fill the form (Type of use: *Personal / Website*; the URL can be your future Vercel URL or any placeholder).
5. On the API page, copy the long **API Read Access Token** (it starts with `eyJ...`).
   You can use the short **API Key** instead, but the token is recommended.

## 2. Environment variables

| Name | Required | What it is |
|---|---|---|
| `TMDB_ACCESS_TOKEN` | Yes (or the next one) | The long "API Read Access Token" from TMDB |
| `TMDB_API_KEY` | Only if you skip the token | The short 32-character API Key |
| `NEXT_PUBLIC_SITE_URL` | No | Your public URL. Vercel is detected automatically |

These are **server-only** values. They are never exposed to the browser.
Do **not** commit `.env.local` (it is already in `.gitignore`).

## 3. Put the project in GitHub Codespaces (works from a phone)

1. On GitHub, create a **new repository** (e.g. `lumen-movies`). Tick "Add a README" so it is not empty.
2. In the repo tap **Code -> Codespaces -> Create codespace on main**. Wait for the editor to open.
3. Upload `lumen-movies.zip`: in the Explorer panel, long-press (or right-click) an empty area -> **Upload...** -> choose the zip.
4. Open the terminal (menu -> Terminal -> New Terminal) and run:

```bash
unzip -o lumen-movies.zip && rm lumen-movies.zip
node -v        # must be 20.9 or higher
npm install
```

5. Create your secrets file (replace the text with your real token):

```bash
echo 'TMDB_ACCESS_TOKEN=PASTE_YOUR_TOKEN_HERE' > .env.local
```

6. Start the site:

```bash
npm run dev
```

Codespaces shows a popup "Open in Browser" (or open the **Ports** tab and tap the globe next to port 3000).
Stop the server with `Ctrl + C`.

7. Check that a production build works (this is exactly what Vercel runs):

```bash
npm run build
```

## 4. Push to GitHub

```bash
git add .
git commit -m "Add Lumen movie website"
git push
```

Confirm on github.com that the files are there and that `.env.local` is **not** listed.

## 5. Deploy on Vercel

1. Go to https://vercel.com and sign up with **Continue with GitHub**.
2. Tap **Add New... -> Project** and **Import** your `lumen-movies` repository.
3. Framework Preset should say **Next.js** (automatic). Leave the build settings alone.
4. Open **Environment Variables** and add:
   - Name: `TMDB_ACCESS_TOKEN`
   - Value: your token
   - (Keep all environments ticked.)
5. Tap **Deploy**. After about a minute you get a live URL like `https://lumen-movies.vercel.app`.

Every future `git push` to `main` redeploys automatically.

## 6. Common errors and fixes

| Problem | Fix |
|---|---|
| Build fails: "TMDB credentials are missing" | The env var is not set on Vercel. Project -> Settings -> Environment Variables -> add `TMDB_ACCESS_TOKEN`, then Deployments -> Redeploy. |
| "TMDB rejected the credentials (401)" | The token/key was copied wrongly (extra space, cut off). Re-copy it from the TMDB API settings page. |
| Site shows "Something went wrong" after deploy | Same two causes above. Fix the variable and redeploy. A variable added after a deploy only applies to the next deploy. |
| `npm: command not found` / Node too old | In Codespaces run `node -v`. It must be 20.9+. |
| Port 3000 not opening in Codespaces | Make sure `npm run dev` is still running, then open the **Ports** tab and tap the globe icon beside 3000. |
| Posters/images missing | Check the browser is online and that `image.tmdb.org` is reachable on your network. |
| Trailer button missing on a title | TMDB has no YouTube trailer for that title. The button only appears when one exists. |
| Watchlist is empty on another device | By design: the watchlist is stored in the browser of the device you used. |
| Vercel build error mentioning TypeScript | Run `npm run typecheck` in Codespaces, fix what it reports, push again. |

## 7. Customize

- **Site name / tagline:** `lib/config.ts`
- **Colors:** `tailwind.config.ts` (`brand` and `ink` palettes)
- **Home page rows:** `app/page.tsx`
- **TMDB calls:** `lib/tmdb.ts`

## Project structure

```
app/
  layout.tsx            site shell (fonts, navbar, footer, watchlist provider)
  page.tsx              home: hero + rows
  movies/page.tsx       browse movies (category, genre, pagination)
  movies/[id]/page.tsx  movie details
  tv/page.tsx           browse TV series
  tv/[id]/page.tsx      TV details
  search/page.tsx       search results
  watchlist/page.tsx    saved titles
  api/search/route.ts   server route for live search suggestions
  loading.tsx  error.tsx  not-found.tsx  globals.css  icon.svg
components/             Navbar, SearchBar, HeroCarousel, MovieCard, MediaRow, MediaGrid,
                        MediaDetail, CastList, TrailerModal, Pagination, Watchlist*, ...
lib/
  tmdb.ts               all TMDB requests (server only)
  types.ts  utils.ts  config.ts
```

Movie and TV data provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
