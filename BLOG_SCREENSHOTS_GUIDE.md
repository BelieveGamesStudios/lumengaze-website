# Blog Screenshots Feature Guide

## Overview
You can now add screenshots to blog posts. Screenshots appear in an interactive gallery on the blog post detail page.

## Database Schema

### Migration Applied
A new `screenshots` column has been added to the `blog_posts` table:
- **Column**: `screenshots`
- **Type**: JSONB (JSON array)
- **Default**: Empty array `[]`
- **Migration Script**: `scripts/006_add_screenshots_to_blog.sql`

To apply the migration in Supabase:
1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `scripts/006_add_screenshots_to_blog.sql`
5. Click **Run**

## Adding Screenshots to a Blog Post

### Via Supabase Dashboard (Easiest for Manual Edits)
### Via Admin Dashboard (Recommended - Visual Interface)

1. Go to **Admin → Blog Posts**
2. Find the blog post you want to add screenshots to
3. Click the **Screenshots** button (blue button next to Edit and Delete)
4. On the screenshots management page:
   - **Add New Screenshot** section at the top:
     - Paste your screenshot URL in the "Screenshot URL" field
     - Optionally add alt text for accessibility (e.g., "Dashboard overview")
     - Click "Add Screenshot"
   - **Manage Existing Screenshots**:
     - View thumbnail preview of each screenshot
     - Click **Edit** to modify the URL or alt text
     - Click **Remove** to delete a screenshot
     - Use **Move Up** / **Move Down** to reorder screenshots
     - See the counter showing total screenshots (e.g., "3 of 5")

**Note:** The admin interface requires you to upload images to Supabase Storage first and paste the public URL. Follow the **"How to add screenshots"** section at the bottom of the page for detailed steps.

### Via Supabase Dashboard (Manual JSON Edit)
1. Go to your Supabase project
2. Navigate to the **blog_posts** table
3. Find the blog post you want to edit
4. Click on the row to expand it
5. In the `screenshots` field, enter a JSON array of URLs:

**Format Option 1 (Simple):**
```json
[
  "https://example.com/screenshot1.png",
  "https://example.com/screenshot2.png",
  "https://example.com/screenshot3.png"
]
```

**Format Option 2 (With Alt Text):**
```json
[
  {
    "url": "https://example.com/screenshot1.png",
    "alt": "Main dashboard view"
  },
  {
    "url": "https://example.com/screenshot2.png",
    "alt": "Settings panel"
  }
]
```

6. Click **Save** or press Enter

### Via API/Code
When inserting or updating a blog post programmatically:

```typescript
const supabase = createClient()

const { data, error } = await supabase
  .from("blog_posts")
  .update({
    screenshots: [
      "https://example.com/screenshot1.png",
      "https://example.com/screenshot2.png"
    ]
  })
  .eq("id", postId)
  .select()
```

## Screenshots Display on Blog Pages

### Detail Page (`app/blog/[slug]/page.tsx`)
- Shows a full-width main image of the current screenshot
- Displays thumbnail grid below (2-4 columns depending on screen size)
- Active thumbnail is highlighted with a blue border
- Navigation buttons to move between screenshots
- Counter showing current position (e.g., "2 / 5")
- Only visible if at least one screenshot exists

### Features
- **Click thumbnails**: Instantly jump to that screenshot
- **Previous/Next buttons**: Navigate sequentially
- **Responsive**: Grid adapts to screen size (2 cols on mobile, up to 4 on desktop)
- **Keyboard-friendly**: Buttons have proper contrast and focus states

## Image Storage Recommendations

### Using Supabase Storage
For best results, upload your screenshots to Supabase Storage:

1. Go to **Storage** tab in Supabase Dashboard
2. Create a bucket (e.g., `blog-screenshots`)
3. Upload your images
4. Get the public URL:
   - Click the image in Storage
   - Copy the **Public URL**
5. Paste the URL into the screenshots field in the database

Example public URL:
```
https://[project-id].supabase.co/storage/v1/object/public/blog-screenshots/post-name/screenshot1.png
```

#### Detailed Storage Bucket Setup (Step-by-Step)

1. Go to your **Supabase Project Dashboard**
2. Click on **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Name it `blog-screenshots` (or your preferred name)
5. **IMPORTANT:** Make sure to uncheck "Private bucket" so it's public
6. Click **Create bucket**
7. Upload images:
  - Click the bucket name to open it
  - Click **Upload file** or drag & drop images
  - Select your screenshot images (.png, .jpg, .webp recommended)
8. Get the public URL:
  - Click on any image in the bucket
  - Copy the **Public URL** from the details panel
9. Paste the URL into the admin dashboard when adding screenshots

#### Storage Best Practices
- **Naming:** Use descriptive filenames (e.g., `dashboard-main.png`, `settings-panel.png`)
- **File size:** Keep under 2MB per image (optimize before uploading)
- **Format:** PNG for UI screenshots, JPG for photos
- **Dimensions:** 1920x1080 or larger recommended
- **Organization:** Create subfolders for different projects if needed

### Using External CDN
You can also use images from other sources (Cloudinary, AWS S3, etc.):
- Ensure the URL is publicly accessible (no authentication required)
- Use HTTPS URLs only

## Example Blog Post with Screenshots

Here's a complete example of what a blog post JSON with screenshots looks like:

```json
{
  "id": "uuid-here",
  "title": "Building Your First AR App",
  "slug": "building-first-ar-app",
  "content": "...",
  "excerpt": "A guide to getting started with AR development",
  "image_url": "https://example.com/hero.png",
  "screenshots": [
    "https://example.com/ar-app-1.png",
    "https://example.com/ar-app-2.png",
    "https://example.com/ar-app-3.png"
  ],
  "published": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

## Component Implementation Details

### Updated `BlogPost` Interface
The `screenshots` field is optional and accepts:
- Array of strings (URLs): `string[]`
- Array of objects with alt text: `{ url: string; alt?: string }[]`

### Helper Functions Added
- `getScreenshotUrl()`: Extracts URL from either format
- `getScreenshotAlt()`: Gets alt text or generates default description
- `currentScreenshotIndex`: State for tracking active screenshot

### Styling
- Uses existing design system (glass effect, primary color)
- Responsive grid with Tailwind classes
- Smooth transitions on button hover
- Proper focus states for accessibility

## Troubleshooting

### Screenshots not showing
1. Verify the JSON in the `screenshots` field is valid
2. Check that URLs are publicly accessible (no 403/404 errors)
3. Use the browser DevTools Network tab to confirm URLs load
4. Ensure the blog post is marked as `published = true`

### JSON formatting errors
- Use a JSON validator tool to check syntax
- Ensure URLs are wrapped in quotes
- Don't forget commas between array elements

### Images load slowly
- Optimize image size (recommended: max 2MB per image)
- Consider using a CDN like Cloudinary for better performance
- Use modern formats like WebP with PNG fallback

## Future Enhancements
Potential additions you could make:
- Lazy loading for thumbnail images
- Lightbox/modal for full-size screenshots
- Drag-and-drop reordering in admin dashboard
- Auto-upload screenshots via admin UI
- Screenshot compression on upload
