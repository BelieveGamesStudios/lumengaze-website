# Admin Dashboard - Blog Screenshots Quick Reference

## Quick Start

### Access the Screenshots Manager
1. Go to **Admin Panel** → **Blog Posts**
2. Find your blog post
3. Click the **Screenshots** button

### Add a Screenshot
1. In the "Add New Screenshot" section:
   - **Screenshot URL:** Paste the public URL from Supabase Storage
   - **Alt Text (Optional):** Describe what's in the screenshot
2. Click **Add Screenshot**
3. The screenshot appears immediately in the list below

### Edit a Screenshot
1. Find the screenshot in the list
2. Click **Edit**
3. Modify the URL or alt text
4. Click **Save Changes**

### Remove a Screenshot
1. Find the screenshot in the list
2. Click **Remove**
3. Confirm the deletion

### Reorder Screenshots
1. Find the screenshot you want to move
2. Click **↑ Move Up** or **Move Down ↓**
3. The order updates instantly

## Image Upload Process

### Step 1: Upload Image to Supabase Storage
```
Supabase Dashboard 
  → Storage 
  → blog-screenshots (bucket)
  → Upload File
  → Select image
```

### Step 2: Get Public URL
```
Click the uploaded image 
  → Copy Public URL
  → Paste in admin form
```

### Step 3: Add Alt Text (Optional but Recommended)
```
"Dashboard showing analytics overview"
"Settings panel with configuration options"
```

## Features Included

✅ **Visual Preview** - See thumbnail of each screenshot  
✅ **Edit Inline** - Modify URL and alt text directly  
✅ **Reorder** - Move screenshots up/down with one click  
✅ **Delete** - Remove unwanted screenshots  
✅ **Counter** - Shows total screenshots (e.g., "3 of 5")  
✅ **Responsive** - Works on mobile and desktop  
✅ **Error Handling** - Graceful fallback if image fails to load  

## Recommended Image Specs

| Property | Recommendation |
|----------|-----------------|
| **Format** | PNG (UI), JPG (photos) |
| **Size** | Max 2MB per image |
| **Resolution** | 1920x1080 or larger |
| **Color** | RGB or sRGB |
| **Compression** | Optimized for web |

## Troubleshooting

### "Failed to add screenshot"
- Check that the URL is correct
- Verify the image file exists in Supabase Storage
- Ensure the storage bucket is **public** (not private)
- Clear browser cache and try again

### Screenshot doesn't display
- Check browser DevTools Network tab
- Look for 403 (permission) or 404 (not found) errors
- Verify the bucket is public in Supabase Storage settings

### Can't see the Screenshots button
- Make sure you're logged in to the admin panel
- Check that the blog post exists in the database
- Refresh the page and try again

## Tips & Tricks

- **Batch Upload:** Upload multiple images to Supabase Storage at once, then add them one by one in the admin panel
- **Naming Convention:** Use consistent naming like `feature-name-1.png`, `feature-name-2.png` for easy management
- **Test First:** Upload and verify in Supabase Storage before adding to blog post
- **Alt Text Matters:** Good alt text improves accessibility and SEO
- **Reorder Anytime:** You can always rearrange screenshots even after publishing

## What Happens When You Add/Edit Screenshots?

1. **Add Screenshot:**
   - URL is added to the blog post's `screenshots` array
   - Appears immediately on the blog detail page
   - Shows in the gallery to readers

2. **Edit Screenshot:**
   - Updates the URL and/or alt text
   - Changes reflect instantly on the public page
   - Thumbnail preview updates

3. **Remove Screenshot:**
   - Deleted from the `screenshots` array
   - No longer visible on the public page
   - Can't be recovered (unless you have a backup)

4. **Reorder Screenshots:**
   - Changes the position in the array
   - Gallery order updates on public page
   - First screenshot shows as primary in gallery

## Admin Panel Location

```
Your Site URL/admin/blog
  ↓ Find your post
  ↓ Click "Screenshots" button
  ↓ Manage screenshots here
```

Example: `http://localhost:3000/admin/blog`

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## Need Help?

Check the full guide: `BLOG_SCREENSHOTS_GUIDE.md`

For more information about:
- Database schema: See "Database Schema" section
- Storage setup: See "Image Storage Recommendations" section
- Troubleshooting: See "Troubleshooting" section
