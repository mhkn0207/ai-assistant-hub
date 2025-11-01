# 🔍 Debugging Gemini API Issues

## Step 1: Check Browser Console

1. **Open Browser DevTools** (Press `F12`)
2. **Go to Console tab**
3. **Try making a request** (e.g., Spotify AI)
4. **Look for these messages:**
   - "Making API call to:"
   - "API Key present:"
   - "Response status:"
   - "Full API Error Response:"

## Step 2: Common Issues & Fixes

### Issue: "404 - Model not found"
**Possible causes:**
- API key doesn't have access to `gemini-pro` model
- Model name is incorrect
- API endpoint format is wrong

**Solutions:**
1. Verify your API key at: https://makersuite.google.com/app/apikey
2. Make sure "Generative Language API" is enabled
3. Try creating a new API key

### Issue: "401/403 - Authentication Error"
**Possible causes:**
- Invalid API key
- API key has restrictions
- API key not loaded from .env

**Solutions:**
1. Check `.env` file has correct key
2. Restart dev server after updating `.env`
3. Verify API key is correct (no extra spaces/quotes)

### Issue: "429 - Rate Limit"
**Solution:**
- Wait a few seconds and try again
- Free tier has rate limits

### Issue: API Key Not Loading
**Solution:**
1. Make sure `.env` is in project root (same folder as `package.json`)
2. Restart dev server: `npm run dev`
3. Check console for "API Key present: Yes"

## Step 3: Test API Key Directly

You can test if your API key works by running this in browser console:

```javascript
const apiKey = "YOUR_API_KEY_HERE";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [{ parts: [{ text: "Say hello" }] }],
  }),
})
  .then(res => res.json())
  .then(data => console.log("Success:", data))
  .catch(err => console.error("Error:", err));
```

Replace `YOUR_API_KEY_HERE` with your actual key from `.env`.

## Step 4: Verify API Key Format

In your `.env` file, make sure:
```
VITE_GEMINI_API_KEY=AIzaSyD15HebAZrsb00NOe_qhJrBIf-Vj29DXyw
```

✅ **Correct:**
- No quotes
- No spaces around `=`
- Key starts with `AIza`

❌ **Wrong:**
- `VITE_GEMINI_API_KEY="AIza..."` (has quotes)
- `VITE_GEMINI_API_KEY = AIza...` (has spaces)

## Step 5: Check What Models Are Available

If you have access, you can check available models:

```javascript
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY`)
  .then(res => res.json())
  .then(data => console.log("Available models:", data));
```

This will show which models your API key can access.

---

**Share the console output with me** so I can help debug further!

