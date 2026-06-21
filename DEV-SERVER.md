# Dev server stability — DBM

Investigation date: 2026-06-21

## Summary

The Astro dev server **starts cleanly and stays up** when left running. There is **no evidence of crash logs, OOM kills, or HMR syntax failures** in recent terminal output. The repeated `ERR_CONNECTION_REFUSED` reports are almost certainly from **(1) the server process being stopped when a Cursor terminal/session ends**, **(2) hitting the wrong port after multiple dev instances were started**, or **(3) connecting via `127.0.0.1` while the server is bound to IPv6 `[::1]` only**.

`npm run build` **passes** (static site, 1 page, ~845ms).

---

## Likely causes (ranked)

### 1. Cursor / integrated terminal lifecycle (most likely)

Every recent `npm run dev` session in Cursor terminals ended with `exit_code: unknown` — not `137` (SIGKILL/OOM), not `1` (error). The server log shows normal `[200] /` responses right up until the session ends. **No stack trace, no “killed”, no Astro fatal error.**

**What this looks like:** Browser tab still open at `http://localhost:4321/` but the terminal that owned the process was closed, the agent restarted dev in a new terminal (old one orphaned or killed), or the Cursor session ended → instant `ERR_CONNECTION_REFUSED`. This is **not an Astro crash**.

### 2. Port confusion (4321 vs 4322)

At least **11 separate** `npm run dev` invocations appear in terminal history. When 4321 is already taken, Vite logs:

```
[vite] Port 4321 is in use, trying another one...
┃ Local    http://localhost:4322/
```

If you keep a bookmark or preview URL on **4321** while the live server moved to **4322**, you get connection refused on 4321 even though a server is running elsewhere.

**Check:** `lsof -nP -iTCP:4321 -sTCP:LISTEN` and same for `4322`.

### 3. IPv6-only bind on localhost

A running dev server was observed listening on **`[::1]:4321` only**, not `127.0.0.1:4321`. Requests to `http://127.0.0.1:4321/` fail; `http://[::1]:4321/` and usually `http://localhost:4321/` succeed.

Some tools, proxies, or explicit `127.0.0.1` URLs will show refused while the server is healthy.

**Optional fix:** run with host binding, e.g. `npm run dev -- --host 127.0.0.1` or set `server.host: true` in `astro.config.mjs`.

### 4. Not the cause (ruled out)

| Checked | Result |
|--------|--------|
| Syntax / HMR in `CinematicHero.astro`, `GuinnessSurge.astro` | Valid; HMR `[watch]` + `[200]` in logs |
| `npm run build` | Passes |
| OOM / `killed` in logs | None found |
| `astro.config.mjs` | Default empty config — no misconfiguration |
| Node version | v26.3.0 (requires `>=22.12.0`) |
| Project size | ~231 MB total, ~115 MB `node_modules` — normal |
| `.gitignore` | Ignores `node_modules/`, `dist/`, `.astro/` — fine |
| WebGL inline script | Large client-side script; does not crash the dev server |

---

## How to run stably

**Recommended: Terminal.app (or iTerm), not a disposable Cursor agent terminal**

```bash
cd /Users/errinhenderson/DBM
npm run dev
```

Use the URL printed in the terminal (`http://localhost:4321/` or `4322` if redirected). Keep that terminal window open for the whole session.

For explicit IPv4 + fixed port:

```bash
npm run dev -- --host 127.0.0.1 --port 4321
```

---

## How to restart

1. Stop any existing servers:
   ```bash
   lsof -nP -iTCP:4321 -sTCP:LISTEN
   lsof -nP -iTCP:4322 -sTCP:LISTEN
   # kill the node PID if needed: kill <PID>
   ```
2. Start fresh:
   ```bash
   cd /Users/errinhenderson/DBM && npm run dev
   ```
3. Open **exactly** the URL shown in the output (check port number).
4. Quick health check:
   ```bash
   curl -g -s -o /dev/null -w "%{http_code}\n" "http://[::1]:4321/"
   ```
   Expect `200`.

Production preview (after build):

```bash
npm run build && npm run preview
```

---

## Real crash vs session end

| Sign | Session ended / wrong URL | Real crash |
|------|---------------------------|------------|
| Terminal | Closed or `exit_code: unknown`, no error text | Exit code `1`, stack trace, or `137` (OOM) |
| Log before stop | `[200] /`, `watching for file changes...` | `Error`, `FATAL`, `Unhandled`, Vite red error |
| Same command again | Starts immediately, “ready in ~600ms” | Same failure repeating with error message |
| Port | Nothing listening on the URL you use | Port free but server dies seconds after start |

---

## Current status (last check)

- **Dev server:** running on `http://localhost:4321/` (PID from investigation session)
- **HTTP:** `200` via `[::1]:4321`
- **Build:** passing

If the browser shows refused again, assume the process stopped first — restart using the steps above and confirm the port with `lsof`.
