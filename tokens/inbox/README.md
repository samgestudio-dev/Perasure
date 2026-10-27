# Token inbox

Upload an export from the **PeraSure Tokens Export** Figma plugin here (GitHub: **Add file → Upload files**, then
commit to `main`). The *Tokens* GitHub workflow applies it within about a minute: it bumps the version, writes
`tokens/CHANGELOG.md`, rebuilds `tokens.css` / `tokens.json`, tags `tokens-v<version>` and removes the file from here.

If nothing changed since the last version, the file is just removed.
