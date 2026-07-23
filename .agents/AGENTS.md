# Project Rules

- After any file edits or npm installs, always delete the `.next` folder and restart the dev server before considering a task complete (do not just rely on `npm run build`). This prevents stale webpack cache errors in the browser.
- Before reporting a task as complete, you must always run `npm run build` and confirm zero errors. Additionally, you must restart the dev server and verify no runtime errors appear in the browser, not just relying on the production build succeeding.
- Keep the current color theme and design system exactly as-is unless explicitly asked to change colors — do not introduce new colors, gradients, or backgrounds as a side effect of unrelated feature or bug fix requests.
- For any user-facing label showing a database enum value (like age brackets or categories), always map it to a friendly display name — never show raw database values like "kids_9_12" in the UI.
