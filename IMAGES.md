# Image Requirements for ReadySold Website

## Overview
This website is currently using placeholder images from Unsplash. To launch the site professionally, you'll need to replace these with your own high-quality car photography.

---

## Required Images

### 1. Hero Section Background
**Location:** `index.html:52` - `.hero` section
**Current:** `https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8`
**Requirements:**
- Professional car photograph
- Clean background (driveway, street, or showroom setting)
- Landscape orientation
- Recommended size: 1920x1080px minimum
- High resolution for retina displays
- Well-lit with natural lighting preferred
- Car should be clean and polished
- Front 3/4 angle works best

**How to replace:**
1. Save your image as `hero-background.jpg` in the `images/` folder
2. Update line in `css/styles.css` around line 252:
   ```css
   background-image: url('../images/hero-background.jpg');
   ```

---

### 2. Image Break 1
**Location:** `css/styles.css:685` - `.image-break-1`
**Current:** `https://images.unsplash.com/photo-1503376780353-7e6692767b70`
**Requirements:**
- Different car from hero (variety is important)
- Dramatic angle or detail shot
- Landscape orientation
- Recommended size: 1920x800px minimum
- Can be slightly darker/moodier than hero
- Side profile or rear 3/4 angle

**How to replace:**
1. Save your image as `image-break-1.jpg` in the `images/` folder
2. Update in `css/styles.css`:
   ```css
   .image-break-1 {
       background-image: url('../images/image-break-1.jpg');
   }
   ```

---

### 3. Image Break 2
**Location:** `css/styles.css:689` - `.image-break-2`
**Current:** `https://images.unsplash.com/photo-1552519507-da3b142c6e3d`
**Requirements:**
- Third unique car photograph
- Different angle/style from previous two
- Interior shot could work well here
- Landscape orientation
- Recommended size: 1920x800px minimum
- Should complement the overall gallery feel

**How to replace:**
1. Save your image as `image-break-2.jpg` in the `images/` folder
2. Update in `css/styles.css`:
   ```css
   .image-break-2 {
       background-image: url('../images/image-break-2.jpg');
   }
   ```

---

## Photography Tips

### Lighting
- Natural daylight is best (golden hour for premium feel)
- Avoid harsh overhead sun (creates hard shadows)
- Overcast days provide even, professional lighting
- If using artificial lighting, ensure it's balanced

### Angles
**Essential shots to have:**
1. Front 3/4 view (shows front and side)
2. Rear 3/4 view (shows rear and side)
3. Side profile (full length of car)
4. Interior dashboard/seats
5. Detail shots (wheels, badges, features)

### Settings
- **Background:** Clean, uncluttered (plain wall, empty street, driveway)
- **Car condition:** Freshly cleaned, polished, wheels detailed
- **Environment:** Remove distractions (bins, other cars, clutter)
- **Composition:** Rule of thirds, car positioned attractively

### Camera Settings (if using DSLR/Mirrorless)
- Low ISO (100-400) for clean images
- Aperture f/5.6 to f/8 for sharp detail throughout
- Shoot in RAW for maximum editing flexibility
- Use a tripod for consistency

### Mobile Photography Tips
If using a smartphone:
- Clean the lens thoroughly
- Use HDR mode for balanced exposure
- Tap to focus on the car
- Use portrait mode sparingly (can look artificial)
- Take multiple shots from each angle
- Edit brightness/contrast but don't over-process

---

## Image Optimization

Before uploading images to your website:

### 1. Resize Images
```bash
# Using ImageMagick (recommended)
convert hero-background.jpg -resize 1920x1080^ -quality 85 hero-background.jpg

# Or use online tools like TinyPNG, Squoosh.app
```

### 2. Optimize File Size
- Target: 200-500KB per image
- Format: JPG for photos (best compression)
- Quality: 80-85% (sweet spot for web)

### 3. Tools for Optimization
- **Online:** [TinyPNG](https://tinypng.com), [Squoosh](https://squoosh.app)
- **Desktop:** Adobe Photoshop, GIMP
- **Command line:** ImageMagick, jpegoptim

---

## Optional: Adding a Logo

Currently, the logo is text-based ("ReadySold"). To add a logo image:

1. Save your logo as `logo.png` or `logo.svg` in `images/` folder
2. Update the header in `index.html` around line 32:
   ```html
   <div class="logo">
       <img src="images/logo.svg" alt="ReadySold Logo" height="40">
   </div>
   ```

3. Add CSS styling in `css/styles.css`:
   ```css
   .logo img {
       height: 40px;
       width: auto;
   }
   ```

**Logo specifications:**
- Transparent background (PNG or SVG)
- Horizontal orientation preferred
- Height: 40-50px
- Width: proportional (typically 120-200px)
- Should work on both light and dark backgrounds

---

## Before/After Example Photos (Optional Enhancement)

For an "About" or "Our Process" page, consider showing:
- Bad phone photo vs your professional photo
- Typical amateur listing vs ReadySold listing
- Creates powerful visual contrast

---

## Stock Photography Alternatives (Temporary)

Until you have professional photos, current Unsplash placeholders work but consider:
- [Pexels Cars](https://www.pexels.com/search/cars/)
- [Unsplash Cars](https://unsplash.com/s/photos/car)
- [Pixabay Automotive](https://pixabay.com/images/search/car/)

**Important:** Check licensing for commercial use.

---

## Image Checklist

Before going live:
- [ ] Hero background image replaced
- [ ] Image break 1 replaced
- [ ] Image break 2 replaced
- [ ] All images optimized (under 500KB each)
- [ ] Images tested on mobile/tablet/desktop
- [ ] Images load quickly (under 3 seconds)
- [ ] Fallback colors set in CSS (in case image fails)
- [ ] Logo added (if applicable)

---

## Need Professional Photography?

If you need professional car photography:
1. Hire a local automotive photographer
2. Use a service like Snappr or Shoott
3. Ask clients if you can photograph their cars professionally
4. Invest in basic photography equipment (iPhone 14+ is sufficient)

Budget: £200-500 for professional shoot (worth it for credibility)

---

## Questions?

For technical help with images:
- Test images in browser developer tools
- Check file paths are correct (relative paths)
- Verify images are in correct format (JPG/PNG)
- Ensure images have read permissions

---

**Remember:** High-quality images are essential for an automotive website. Users judge car selling services by visual quality. Invest time in getting this right.
