# Registry Access Limitations

The offline environment used to prepare this update cannot reach the npm registry. Commands such as

```
npm view @supabase/auth-helpers-react versions --json
npm install --package-lock-only
```

return HTTP 403 errors, so we cannot generate an up-to-date `package-lock.json` locally. The committed
`package.json` references real, published versions of the Supabase helpers and Vite. When running in an
environment with normal registry access (for example, in Vercel), install the dependencies with

```
npm install
```

which will resolve and cache the full dependency tree before invoking `npm run build`.
