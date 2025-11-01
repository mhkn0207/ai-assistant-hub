# 🌐 Share Your App Without Deploying

## Option 1: Use ngrok (Best for sharing online) ⭐

ngrok creates a public URL that tunnels to your localhost.

### Steps:
1. **Download ngrok**: https://ngrok.com/download
2. **Run your app**:
   ```bash
   npm run dev
   ```
3. **In a new terminal, run ngrok**:
   ```bash
   ngrok http 5173
   ```
4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)
5. **Share this URL with friends!** They can access your app online.

**Note**: Free ngrok URLs expire after 2 hours. For permanent links, deploy to Firebase.

---

## Option 2: Same WiFi Network (Local Network)

If you and your friends are on the same WiFi:

1. **Run your app**:
   ```bash
   npm run dev
   ```
2. **Find your computer's IP address**:
   - Windows: Open PowerShell and run:
     ```powershell
     ipconfig
     ```
   - Look for "IPv4 Address" (e.g., `192.168.1.5`)
3. **Share this URL**:
   ```
   http://YOUR_IP_ADDRESS:5173
   ```
   Example: `http://192.168.1.5:5173`

**Note**: Only works on the same WiFi network.

---

## Option 3: Use Vite's Network Mode

1. **Run with network access**:
   ```bash
   npm run dev -- --host
   ```
2. **Vite will show**:
   ```
   Local:   http://localhost:5173/
   Network: http://192.168.1.5:5173/
   ```
3. **Share the Network URL** with friends on the same WiFi.

---

## Quick Setup for ngrok:

1. Sign up for free at https://ngrok.com
2. Download and extract ngrok.exe
3. Add ngrok to your PATH, or run it from its folder
4. Start your app: `npm run dev`
5. Run: `ngrok http 5173`
6. Copy the HTTPS URL and share it!

---

## ⚠️ Important Notes:

- **Localhost URLs** (`http://localhost:5173`) won't work for friends
- **ngrok URLs** work anywhere but expire after 2 hours (free tier)
- **Local network IPs** only work on same WiFi
- **Best long-term solution**: Deploy to Firebase (free and permanent)

