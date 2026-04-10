# To-Do List — Ionic App

A cross-platform mobile to-do list application built with **Ionic 8** and **Angular**, featuring local persistence, category management, Firebase Remote Config feature flags, and Cordova builds for Android and iOS.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Ionic 8 + Angular 19 |
| Language | TypeScript 5 |
| Persistence | `@ionic/storage-angular` (IndexedDB / SQLite via Cordova) |
| Cloud | Firebase Remote Config |
| Mobile | Cordova (Android + iOS) |
| Styles | SCSS + Ionic Design System |

---

## Features

- ✅ Add, complete and delete tasks
- 🏷️ Assign tasks to color-coded categories
- 🔍 Filter tasks by category
- 📂 Full category CRUD management
- 🔄 Firebase Remote Config feature flags (toggle features without app update)
- 🌙 Automatic dark mode support
- 📊 Task statistics (pending / completed / total)
- 💾 Persistent offline storage

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Ionic CLI: `npm install -g @ionic/cli`
- Cordova: `npm install -g cordova`

### Install Dependencies

```bash
cd to-do-list
npm install
```

### Run in Browser

```bash
ionic serve
```

App opens at `http://localhost:8100`.

---

## Mobile Build

### Setup Cordova Platforms

```bash
ionic integrations enable cordova
ionic cordova platform add android
ionic cordova platform add ios   # macOS only
```

### Android

```bash
# Debug build
ionic cordova build android --debug

# Run on connected device
ionic cordova run android --device

# Release APK
ionic cordova build android --release --prod
```

APK output: `platforms/android/app/build/outputs/apk/release/`

### iOS (macOS only)

```bash
# Debug build
ionic cordova build ios --debug

# Run on connected device
ionic cordova run ios --device

# Release IPA (requires Apple Developer account)
ionic cordova build ios --release --prod
```

Open `platforms/ios/App.xcworkspace` in Xcode for signing and distribution.

---

## Project Structure

```
src/
├── app/
│   ├── models/          # Task and Category interfaces
│   ├── services/        # StorageService, TaskService, FirebaseRemoteConfigService
│   ├── tab1/            # Tasks page (list, add, filter)
│   ├── tab2/            # Categories page (CRUD + color assignments)
│   └── tabs/            # Tab bar navigation
├── theme/               # Global color palette & dark mode variables
└── environments/        # Firebase config per environment
```

---

## Firebase Remote Config

Feature flags are controlled remotely without a new app release.

| Flag | Type | Description |
|---|---|---|
| `enable_dark_mode_toggle` | boolean | Show/hide dark mode toggle button |
| `show_task_statistics` | boolean | Show/hide the stats bar in tasks view |
| `show_category_colors` | boolean | Enable/disable color indicators on categories |
| `max_tasks_per_category` | number | Maximum tasks allowed per category |

To test a flag change:
1. Open Firebase Console → Remote Config
2. Change a flag value and publish
3. Pull to refresh inside the app — the feature activates/deactivates immediately

---

## Technical Q&A

### Q1: What were the main challenges implementing the new features?

The main challenge was keeping the local persistence layer (Ionic Storage / IndexedDB) synchronized with the asynchronous Firebase Remote Config initialization — especially on slower mobile devices where Firebase can take a few seconds to resolve. To handle this, Storage is initialized first during `AppComponent.ngOnInit`, and Remote Config loads in parallel without blocking the UI. Sensible default values are defined locally so the app is fully functional even without connectivity.

### Q2: What performance optimization techniques did you apply?

- **`trackBy` in `*ngFor`**: Prevents Angular from destroying and re-creating DOM nodes when the task list updates — critical for large lists.
- **`ChangeDetectionStrategy.OnPush`**: Applied to task card sub-components to minimize the change detection tree traversal, reducing CPU and memory usage.
- **Lazy Loading via `loadChildren`**: Each tab module is loaded only when the user navigates to it, reducing the initial bundle parsed at startup.
- **`takeUntil` + `Subject`**: All RxJS subscriptions are automatically cleaned up on component destroy, preventing memory leaks on navigation.
- **`BehaviorSubject` reactive state**: Components never poll for data — they react to stream emissions, eliminating redundant reads from storage.

### Q3: How did you ensure code quality and maintainability?

- Strict separation of concerns: data logic lives entirely in injectable Services; Pages/Components only handle presentation and user interaction.
- All public APIs are typed with TypeScript interfaces (`Task`, `Category`) — no `any` leakage.
- Services are stateless from the consumer's view — they expose Observables, not mutable arrays.
- Consistent ESLint configuration enforced via `npm run lint`.

---

## Delivery Checklist

- [x] Public Git repository with commit history
- [x] Cordova build configuration for Android and iOS
- [x] Firebase Remote Config integration
- [x] Performance optimizations (trackBy, OnPush, Lazy Loading, takeUntil)
- [x] Detailed README
- [ ] Screenshot / video recordings (added during feature branch)
- [ ] APK download link
- [ ] IPA download link
