# 🔧 Gemini API Troubleshooting Guide

## Error: "Error generating music recommendations. Please check your API key and try again."

### Quick Fixes:

#### 1. **Restart the Dev Server**
   - The `.env` file is only loaded when the server starts
   - **Stop** the server (Ctrl+C)
   - **Start** it again: `npm run dev`
   - Environment variables are refreshed on restart

#### 2. **Verify API Key in .env**
   - Open `.env` file in your project root
   - Make sure it has:
     ```
     VITE_GEMINI_API_KEY=AIzaSyD15HebAZrsb00NOe_qhJrBIf-Vj29DXyw
     ```
   - **NO quotes** around the value
   - **NO spaces** around the `=` sign

#### 3. **Check API Key Validity**
   - Go to: https://makersuite.google.com/app/apikey
   - Verify your API key is active
   - Try creating a new key if needed

#### 4. **Check Browser Console**
   - Open DevTools (F12)
   - Go to **Console** tab
   - Look for detailed error messages
   - Share the error if you see one

#### 5. **API Endpoint Update**
   - The code now uses `gemini-1.5-flash` (newer model)
   - If issues persist, we can try `gemini-pro` or `gemini-1.5-pro`

### Common Issues:

#### Issue: API Key Not Loading
**Solution:**
- Make sure `.env` file is in the **project root** (same folder as `package.json`)
- Restart the dev server after changing `.env`

#### Issue: API Key Invalid/Expired
**Solution:**
- Create a new API key at https://makersuite.google.com/app/apikey
- Update `.env` file
- Restart server

#### Issue: CORS Errors
**Solution:**
- Gemini API should work from browser
- Check if your API key has proper permissions

#### Issue: Rate Limiting
**Solution:**
- Free tier has rate limits
- Wait a few seconds between requests
- Check your quota at Google AI Studio

### Testing the API Key:

You can test if your API key works by checking the browser console:

1. Open DevTools (F12)
2. Go to **Console** tab
3. Try making a request
4. Look for error messages with details

### What the Updated Code Does:

✅ Better error messages showing actual API errors  
✅ Checks if API key is missing before making requests  
✅ Uses newer Gemini 1.5 Flash model  
✅ Shows detailed error messages in the UI

### Still Having Issues?

1. **Check browser console** for specific error
2. **Verify API key** is correct in `.env`
3. **Restart dev server** after any `.env` changes
4. **Try creating a new API key** at Google AI Studio

---

**Note:** After updating `.env`, you MUST restart the dev server for changes to take effect!

