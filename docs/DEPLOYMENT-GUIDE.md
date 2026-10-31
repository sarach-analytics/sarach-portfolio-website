# 🚀 Deployment Guide - SQL Course

## Recommended: Netlify + Custom Domain

### Why Netlify?
- ✅ Free tier is generous (100GB bandwidth/month)
- ✅ Automatic SSL/HTTPS
- ✅ Built-in form handling for newsletter
- ✅ Custom domain support
- ✅ No credit card required
- ✅ Your course content stays private

---

## Step 1: Deploy to Netlify (2 minutes)

### Option A: Drag & Drop (Easiest)

1. Go to https://app.netlify.com/
2. Sign up (free account)
3. Click "Add new site" → "Deploy manually"
4. **Drag the entire `course-player` folder** into the upload area
5. Done! You'll get a URL like `random-name-12345.netlify.app`

### Option B: Git Integration (Recommended for updates)

1. Create a GitHub repository (can be **private**)
2. Push your code:
   ```bash
   cd d:\Users\sarach_sr\workspace\course-player
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sql-course.git
   git push -u origin main
   ```
3. In Netlify:
   - Click "Add new site" → "Import from Git"
   - Connect GitHub
   - Select your repository
   - Build settings: Leave empty (static site)
   - Click "Deploy site"

---

## Step 2: Connect Your Custom Domain (5 minutes)

### If you already have a domain:

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain (e.g., `sqlcourse.sarachsriklab.com` or `sarachsriklab.com`)
4. Netlify will show you DNS records to add
5. Go to your domain registrar (Namecheap, GoDaddy, etc.)
6. Add the DNS records Netlify provides
7. Wait 5-30 minutes for DNS propagation
8. Netlify will automatically enable HTTPS (free SSL)

### If you need to buy a domain:

**Recommended registrars:**
- **Cloudflare** ($9-12/year) - Cheapest, best DNS
- **Namecheap** ($10-15/year) - Easy to use
- **Google Domains** ($12/year) - Simple interface

**Good domain ideas:**
- `sarachsriklab.com`
- `sqlcourse.co`
- `learnsqlwith[yourname].com`

---

## Step 3: Enable Netlify Forms (Newsletter)

Your newsletter form is already set up! To collect emails in Netlify:

1. In lesson 26 form, add `data-netlify="true"`:
   ```html
   <form id="newsletter-form" data-netlify="true">
   ```

2. Add a hidden field for the form name:
   ```html
   <input type="hidden" name="form-name" value="newsletter" />
   ```

3. Netlify will automatically:
   - Collect form submissions
   - Send you email notifications
   - Store submissions in dashboard
   - Export to CSV

**To view newsletter subscribers:**
- Go to Netlify dashboard → Your site → "Forms"
- See all email submissions
- Export to CSV

**Free tier:** 100 form submissions/month

---

## Alternative: Vercel (Same process as Netlify)

1. Go to https://vercel.com/
2. Sign up (free)
3. Click "Add New Project"
4. Connect GitHub or drag & drop folder
5. Add custom domain in project settings

---

## Not Recommended: GitHub Pages

### ❌ Why NOT to use GitHub Pages:

1. **Your course content becomes PUBLIC**
   - Repository must be public for free GitHub Pages
   - Anyone can view your HTML and copy lessons
   - People can fork your entire course

2. **No built-in form handling**
   - Need external service for newsletter

3. **Less professional**
   - URL is `username.github.io/repo-name`
   - Harder to remember and share

**Only use GitHub Pages if:**
- You want your course to be open source
- You don't care if people copy your content
- Budget is absolutely $0 (can't afford $10/year domain)

---

## Cost Summary

### Setup Costs:
- **Netlify/Vercel**: $0/month (free forever for your traffic)
- **Domain**: $10-15/year (optional but recommended)
- **SSL Certificate**: $0 (automatic with Netlify/Vercel)

### Total First Year: $10-15
### Every Year After: $10-15

### If You Grow Big (10,000+ users/month):
- Upgrade to Netlify Pro: $19/month
- Or use Cloudflare (unlimited bandwidth): $20/month

---

## 📊 Bandwidth Calculator

**Average page load**: ~2MB (HTML + CSS + JS + images)
**100GB bandwidth** = ~50,000 page loads/month

**Realistic usage:**
- **100 active users/month**: ~5GB (well within free tier)
- **1,000 active users/month**: ~50GB (still free)
- **5,000 active users/month**: Need paid plan (~$20/month)

---

## ✅ Checklist Before Going Live

- [ ] Test all 26 lessons load correctly
- [ ] Test language toggle (EN/TH)
- [ ] Test "Mark as Complete" functionality
- [ ] Test newsletter form in lesson 26
- [ ] Test on mobile device
- [ ] Check lesson navigation (Prev/Next buttons)
- [ ] Verify progress bar updates
- [ ] Test all links work
- [ ] Add Google Analytics (optional)
- [ ] Add favicon (optional)
- [ ] Test in different browsers (Chrome, Firefox, Safari)

---

## 🎯 My Recommendation

**Best setup for you:**

```
1. Deploy to Netlify (FREE)
2. Buy domain: sarachsriklab.com ($12/year)
3. Connect domain to Netlify
4. Enable Netlify Forms for newsletter
5. Add Google Analytics (optional)

Total cost: $12/year
```

**Benefits:**
- Professional URL (yourname.com/courses/sql)
- Private source code
- Built-in newsletter collection
- Free SSL/HTTPS
- No usage limits for your traffic level
- Easy to update (just drag & drop new files)

---

## 📧 Newsletter Options

### Option 1: Netlify Forms (Recommended for start)
- FREE: 100 submissions/month
- Stored in Netlify dashboard
- Email notifications
- Export to CSV

### Option 2: Formspree
- FREE: 50 submissions/month
- Email notifications
- Spam protection
- https://formspree.io/

### Option 3: EmailJS
- FREE: 200 emails/month
- Send emails directly from browser
- No backend needed
- https://www.emailjs.com/

### Option 4: Google Forms
- Unlimited free
- Stores in Google Sheets
- Easy to embed

---

## 🚨 Important Notes

1. **Keep localStorage approach**: Your current progress tracking using localStorage is perfect for this use case. No database needed.

2. **No backend required**: Everything runs client-side. No server costs.

3. **Privacy compliant**: No cookies, no tracking, no user accounts = no GDPR/privacy concerns.

4. **Easy updates**: Just edit HTML and re-deploy (drag & drop or git push).

---

## Need Help?

If you want help deploying, I can:
1. Guide you through Netlify setup step-by-step
2. Help configure your custom domain DNS
3. Set up Google Analytics
4. Integrate Netlify Forms for newsletter

Just let me know! 🚀
