# rn-ios

Expo (SDK 58) React Native app that renders Builder.io content on iOS, Android, and web.

The app fetches one Builder entry for the `page` model and renders it with the official Builder
React Native SDK.

## Requirements

- Bun (this project uses `bun.lock`)
- Xcode with an iOS Simulator, for iOS
- Expo Go on a physical device, or a development build for native modules

## Install and run

```bash
bun install

bun run ios       # start Metro and open the iOS Simulator
bun run android   # start Metro and open an Android device or emulator
bun run web       # start Metro for the web
bun start         # start Metro only
```

`bun run ios` starts Metro on port 8081 and opens Expo Go in the booted simulator. If Expo Go is
not installed, Expo installs it first.

## Project structure

| Path | Purpose |
| --- | --- |
| `index.ts` | App entry. Calls `registerRootComponent(App)`. |
| `App.tsx` | Root view. Renders `BuilderScreen` and the status bar. |
| `BuilderScreen.tsx` | Fetches Builder content, shows a loader or error state, renders `<Content>`. |
| `metro.config.js` | Expo Metro config with one resolver rule for `react-dom`. |
| `shims/react-dom.js` | Stub for the `react-dom` import inside the Builder SDK. |
| `app.json` | Expo config: name, slug, bundle identifier `com.tarsk.rnios`, new architecture. |
| `tsconfig.json` | TypeScript config from `expo/tsconfig.base`. |

## How content loads

`BuilderScreen.tsx` calls `fetchOneEntry` with:

- `model: 'page'`
- the public API key
- `userAttributes: { urlPath: '/' }`

The result goes to the Builder `<Content>` component. If the entry is null, the screen shows an
error state. If the request fails, the screen shows the error message.

### Configuration points

- **API key:** constant `BUILDER_API_KEY` in `BuilderScreen.tsx`.
- **Model:** constant `MODEL_NAME` in `BuilderScreen.tsx`.
- **Targeted path:** `userAttributes.urlPath`.

The key is a public content key. It is safe in the client. Do not put a private key here.

### Caching

The app does not cache content on the device yet. Each cold start makes a content request.

The Builder CDN caches responses. If you omit `cacheSeconds`, the response has
`max-age=5, stale-while-revalidate=86400`. Set `cacheSeconds` to hold an entry longer at the edge.

## Metro `react-dom` shim

The Builder SDK includes `functions/transform-block-properties.js`, which imports `findDOMNode`
from `react-dom`. That module does not exist in a React Native runtime, and React 19 fails on it
with `Cannot read property 'ReactCurrentDispatcher' of undefined`.

`metro.config.js` resolves `react-dom` to `shims/react-dom.js`, which exports a `findDOMNode` that
returns `null`. The edit-mode code path that uses it is not active on device.

Do not remove the shim while the SDK still imports `react-dom`.

## Known limitations

- Builder blocks that need a React Native implementation are skipped, with a log warning. This
  content currently logs `Custom Code` and `Form:Input`.
- Builder adds a `builder-pixel-*` block to the content. The SDK renders it as a 1x1 `Image`, so
  the app requests `https://cdn.builder.io/api/v1/pixel?apiKey=...`. `canTrack: false` does not
  stop this request. Filter the block if you do not want it.
- `VirtualizedLists should never be nested` is a warning from the SDK HTML renderer. `App.tsx`
  hides it with `LogBox.ignoreLogs`.
- The SDK lists `react-native-video` and `@react-native-async-storage/async-storage` as
  dependencies. Expo Go includes async-storage. A video block needs a development build.

## Checks

```bash
bunx tsc --noEmit
```
