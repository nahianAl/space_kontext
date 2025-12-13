# AI Image Editing Setup Guide

## Environment Variables

Add the following environment variable to your deployment platform:

```
KIE_AI_API_KEY=ec2efd46a6cff257cdefb53ce5384dc5
```

### Where to Add:

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Build & Deploy → Environment
- **Render**: Dashboard → Environment → Environment Variables
- **Local Development**: Already set in `.env` file

## How It Works

### Image-to-Image Editing Flow:

1. **User uploads an architectural image** (render, photo, sketch, etc.)
2. **Image is automatically uploaded to R2/S3** to get a public URL
3. **User enters a transformation prompt** (e.g., "Add sunset lighting with warm tones")
4. **AI edits the image** using Gemini 2.5 Flash (Nano Banana Edit)
5. **Result is displayed** in the gallery and can be saved to project files

### Supported Transformations:

- **Lighting changes**: "Transform to sunset lighting", "Add dramatic shadows"
- **Style conversion**: "Convert to watercolor sketch", "Make photorealistic"
- **Material updates**: "Add glass and steel materials", "Change to concrete facade"
- **Atmosphere**: "Add fog and moody atmosphere", "Make bright and sunny"
- **Details**: "Add vegetation and landscaping", "Include people for scale"

### Technical Details:

- **Model**: `google/nano-banana-edit`
- **Max Images**: Up to 10 images per request
- **Max File Size**: 10MB per image
- **Supported Formats**: JPEG, PNG, WebP
- **Output Formats**: PNG, JPEG
- **Aspect Ratios**: 1:1, 16:9, 9:16, 4:3, 3:4, 21:9, auto

## Features

✅ **Image Upload**: Drag-and-drop with preview
✅ **Smart Prompting**: Context-aware prompt suggestions
✅ **Real-time Status**: Live progress tracking with upload/processing states
✅ **Storage Integration**: Auto-save to R2/S3 storage
✅ **Gallery**: View, download, and save all edited images
✅ **Job Queue**: Track multiple concurrent edits

## Usage Tips

### For Best Results:

1. **Be specific in prompts**:
   - ❌ "Make it better"
   - ✅ "Add sunset lighting with golden hour atmosphere, enhance materials to look more photorealistic"

2. **Upload high-quality images**:
   - Use clear, well-lit architectural renders or photos
   - Avoid heavily compressed or low-resolution images

3. **Experiment with different prompts**:
   - Try variations to find the perfect style
   - Combine multiple transformations in one prompt

### Example Prompts:

- "Transform this building to have sunset lighting with warm orange and pink tones in the sky"
- "Add photorealistic materials and realistic shadows, make the glass more reflective"
- "Convert this render into a hand-drawn watercolor architectural sketch with soft colors"
- "Add landscaping with trees and greenery around the building, include people for scale"
- "Change time to night scene with interior lights glowing through windows"

## Troubleshooting

### "KIE_AI_API_KEY not configured"
- Make sure the environment variable is set in your deployment platform
- Restart your deployment after adding the variable

### Upload fails
- Check file size (max 10MB)
- Ensure file is JPEG, PNG, or WebP format
- Verify R2/S3 storage credentials are configured

### Generation takes too long
- Complex transformations may take 30-60 seconds
- The status will automatically update when complete
- You can queue multiple jobs simultaneously

## API Costs

Monitor your KIE.AI usage at: https://kie.ai/api-key

Each image edit counts as one API call to the Nano Banana Edit model.
# Environment variable setup required
