# How to setup VS Code when working on SDK

-   Exclude some directories and files by placing this into your `settings.json` file.

```
"files.exclude": {
    "**/.rush": true,
    "**/*.api.json": true,
    "**/*.api.md": true,
    "**/*.d.ts": true,
    "**/dist": true,
    "**/stats.json": true,
    "**/temp": true,
    "**/umd": true,
    "**/node_modules": true,
    "**/examplesJS": true
}
```

## Development

-   When TS server is not snappy, hit `Cmd + Shift + P`, search for `TypeScript: Restart TS server` and hit `Enter`.
