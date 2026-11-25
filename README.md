# Project Beast Mode – PET Tracker PWA

A free, static Progressive Web App for Android-friendly workout tracking.

## Included
- Priority 1 and 5 mandatory daily checklist
- Priority 2, 3 and 4 optional workout blocks
- Priority 6: optional PET event practice (100m sprint, long jump, high jump, 1500m), 10 points each
- Daily reflection, weekly/monthly summaries
- PET performance record book
- Local browser storage, JSON backup/restore and CSV export
- Offline cache after first successful load

## Important data note
Workout data is stored locally in the browser on the device. It is not synced to an account or cloud. Export a JSON backup regularly. Do not clear browser storage unless you have a backup.

## Run locally
A PWA service worker requires HTTPS or localhost. For a quick local preview, open `index.html` in a browser; checklist and local storage work, but install/offline service worker features require hosting over HTTPS.

## Free Android installation using GitHub Pages
1. Create or sign in to a GitHub account.
2. Create a new public repository, for example `project-beast-mode`.
3. Upload all files from this folder to the repository root (not the ZIP itself).
4. In repository **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for GitHub Pages to publish the site. Open the published `https://...github.io/.../` address in Chrome on Android.
6. In Chrome, open the menu (⋮) and choose **Install app** or **Add to Home screen**.
7. Launch Project Beast Mode from your home screen.

## Personal data and privacy
This is a client-side app. It does not send your workout entries to a server. Anyone with access to the same unlocked browser profile may be able to access local app data.
