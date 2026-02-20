# Banking Reference PWA - Setup Guide

## What's Included

This is now a Progressive Web App (PWA) that can be installed on your father's phone like a native app.

### Files Structure
```
dad-banking/
├── index_simple.html          # Main home page
├── manifest.json              # PWA configuration
├── service-worker.js          # Enables offline functionality
├── icon-192.png              # App icon (small)
├── icon-512.png              # App icon (large)
├── generate-icons.html       # Icon generator (optional)
├── sbi/
│   ├── sbi_login_simplified.html
│   └── sbi_pension_check.html
└── icici/
    ├── icici_login.html
    ├── icici_account.html
    └── icici_statement.html
```

## Setup Instructions

### 1. Start the Server on Your Mac

Open Terminal and run:
```bash
cd ~/Documents/dad-banking
python3 -m http.server 8000
```

Keep this Terminal window open while you want the app to be accessible.

### 2. Find Your Mac's IP Address

- Go to System Settings → Network
- Note your IP address (e.g., `192.168.1.15`)

### 3. Install on His Phone

**On iPhone/iPad (Safari):**
1. Open Safari and go to: `http://YOUR_MAC_IP:8000/index_simple.html`
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Name it "My Banking" or whatever you prefer
5. Tap "Add"

**On Android (Chrome):**
1. Open Chrome and go to: `http://YOUR_MAC_IP:8000/index_simple.html`
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home Screen"
4. Follow the prompts

### 4. Using the App

Once installed, the app will:
- ✅ Have its own icon on the home screen
- ✅ Open in full-screen mode (no browser UI)
- ✅ Work offline after first load (pages are cached)
- ✅ Feel like a native banking app

## PWA Benefits

1. **Offline Access**: Once loaded, pages work without internet
2. **App-Like Feel**: Opens without browser chrome
3. **Quick Access**: Tap the icon, goes straight to banking
4. **Updates Automatically**: When you change files on Mac, they'll update on next online visit

## Troubleshooting

**"Install app" doesn't appear:**
- Make sure you're using HTTPS or localhost (http://192.168.x.x works)
- Try refreshing the page
- Check that manifest.json is accessible

**Pages not loading offline:**
- Service worker needs one online visit to cache pages
- Visit all pages once while connected to cache them

**Changes not appearing:**
- Clear browser cache on phone
- Or update CACHE_NAME in service-worker.js (change 'v1' to 'v2')

## Updating Content

When you update any HTML files:
1. Edit the file on your Mac
2. On his phone, pull down to refresh the page while online
3. The service worker will download the new version

## Security Note

This PWA runs on your local network only. It's not accessible from outside your home Wi-Fi, which keeps the data private and secure.
