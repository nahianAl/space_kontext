# MCP Servers Setup Guide for Cursor

This guide explains how to complete the setup for the 4 MCP servers added to your `.mcp.json` configuration.

## ✅ What's Already Configured

All 4 MCP servers have been added to your `.mcp.json`:
- ✅ **Vercel MCP** - Remote HTTP server
- ✅ **Render MCP** - Remote HTTP server (needs API key)
- ✅ **GitHub MCP** - Remote HTTP server
- ✅ **Context7 MCP** - Remote HTTP server (needs API key)

## 🔑 Required API Keys

You need to add API keys for 2 servers:

### 1. Render API Key

1. Go to [Render Dashboard](https://dashboard.render.com/settings#api-keys)
2. Navigate to **Account Settings** → **API Keys**
3. Click **Create API Key**
4. Copy the API key
5. Replace `YOUR_RENDER_API_KEY` in `.mcp.json` with your actual key

**Note**: Render API keys are broadly scoped and grant access to all workspaces and services your account can access. Be careful with this key.

### 2. Context7 API Key (Optional but Recommended)

1. Go to [Context7 Dashboard](https://context7.com/dashboard)
2. Create an account if you don't have one
3. Get your API key from the dashboard
4. Replace `YOUR_CONTEXT7_API_KEY` in `.mcp.json` with your actual key

**Note**: Context7 works without an API key but has rate limits. An API key provides higher rate limits and access to private repositories.

## 🔐 OAuth Authentication (Vercel & GitHub)

Vercel and GitHub MCP servers use OAuth authentication. When you first use these servers in Cursor:

1. **Cursor will prompt you** to authorize access
2. Click the authorization prompt
3. You'll be redirected to Vercel/GitHub to sign in
4. Grant permissions to Cursor
5. You'll be redirected back to Cursor

**No API keys needed** - OAuth handles authentication automatically.

## 📝 Update Your .mcp.json

After getting your API keys, update `.mcp.json`:

```json
{
  "mcpServers": {
    "render": {
      "type": "http",
      "url": "https://mcp.render.com/mcp",
      "headers": {
        "Authorization": "Bearer rnd_xxxxxxxxxxxxx"  // ← Replace with your Render API key
      }
    },
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "your_context7_key_here"  // ← Replace with your Context7 API key
      }
    }
  }
}
```

## 🚀 Next Steps

1. **Update API keys** in `.mcp.json` (Render and Context7)
2. **Restart Cursor** completely (Cmd+Q on Mac, then reopen)
3. **Test the connections**:
   - Try asking Cursor: "List my Vercel projects" (will prompt for OAuth)
   - Try asking: "List my Render services" (uses API key)
   - Try asking: "Show me Next.js documentation" (uses Context7)
   - Try asking: "List my GitHub repositories" (will prompt for OAuth)

## 🧪 Testing Each Server

### Test Vercel MCP
```
Ask Cursor: "Use Vercel MCP to list my projects"
```
- First time: Will prompt for OAuth authorization
- After auth: Should list your Vercel projects

### Test Render MCP
```
Ask Cursor: "Use Render MCP to list my services"
```
- Should work immediately if API key is correct
- If error: Check API key in `.mcp.json`

### Test GitHub MCP
```
Ask Cursor: "Use GitHub MCP to list my repositories"
```
- First time: Will prompt for OAuth authorization
- After auth: Should list your GitHub repos

### Test Context7 MCP
```
Ask Cursor: "Get Next.js documentation using Context7"
```
- Should work immediately (even without API key, but with rate limits)
- With API key: Higher rate limits and private repo access

## 🔍 Troubleshooting

### Server Not Connecting

1. **Check `.mcp.json` syntax**: Ensure valid JSON (no trailing commas)
2. **Verify API keys**: Make sure keys are correct and not expired
3. **Restart Cursor**: MCP config loads on startup
4. **Check Cursor MCP logs**: 
   - Settings → MCP → View logs
   - Look for connection errors

### OAuth Not Working

1. **Check browser**: OAuth opens in your default browser
2. **Check popup blockers**: Disable if OAuth window doesn't open
3. **Try again**: Sometimes OAuth needs a second attempt

### API Key Errors

1. **Render**: Verify key at [Render Dashboard](https://dashboard.render.com/settings#api-keys)
2. **Context7**: Verify key at [Context7 Dashboard](https://context7.com/dashboard)
3. **Check headers**: Ensure `Authorization: Bearer` format for Render
4. **Check header name**: Context7 uses `CONTEXT7_API_KEY` (not `Authorization`)

## 📚 Available Tools

### Vercel MCP
- Search Vercel documentation
- Manage projects and deployments
- Analyze deployment logs
- [Full tools reference](https://vercel.com/docs/mcp/vercel-mcp)

### Render MCP
- Create and manage services
- Query databases
- Analyze metrics and logs
- [Full tools reference](https://render.com/docs/mcp-server)

### GitHub MCP
- Repository management
- Issue and PR automation
- CI/CD workflow intelligence
- Code analysis
- [Full tools reference](https://github.com/github/github-mcp-server)

### Context7 MCP
- Get up-to-date library documentation
- Resolve library IDs
- Fetch version-specific docs
- [Full tools reference](https://github.com/upstash/context7)

## 🔒 Security Notes

- ✅ `.mcp.json` is already in `.gitignore` (API keys won't be committed)
- ⚠️ **Never commit** `.mcp.json` with real API keys
- ⚠️ **Rotate keys** if they're accidentally exposed
- ⚠️ **Render API keys** have broad access - keep them secure

## ✨ Pro Tips

1. **Project-specific URLs**: For Vercel, you can use project-specific MCP URLs for better context
2. **Context7 auto-invoke**: Add a rule to automatically use Context7 for code questions
3. **GitHub toolsets**: Configure GitHub MCP to only enable toolsets you need
4. **Rate limits**: Context7 has rate limits without an API key - get one for production use

---

**You're all set!** After updating the API keys and restarting Cursor, all 4 MCP servers will be ready to use. 🚀






