# Google Analytics 4 Setup Guide for Arbor

This guide walks you through setting up Google Analytics 4 (GA4) for arborapps.co so you can track visitor behavior, traffic sources, and conversions.

---

## Step 1: Create a Google Analytics Account (If You Don't Have One)

1. Go to [analytics.google.com](https://analytics.google.com)
2. Click **"Start measuring"** or **"Sign in"** if you have a Google account
3. You'll need a Google account (personal or Google Workspace)

---

## Step 2: Create a GA4 Property

1. In Google Analytics, click the **gear icon** (Settings) in the bottom left
2. Under "Account," click **"Create Account"** (or skip if you already have an account)
3. Fill in:
   - **Account name:** "Arbor" (or your company name)
   - Keep other defaults
   - Click **"Create"**

4. Now create a **Property**:
   - Click **"Create Property"**
   - **Property name:** "Arbor Apps" or "arborapps.co"
   - **Reporting timezone:** Your timezone (e.g., UTC-8 for PST)
   - **Currency:** USD (or your preferred currency)
   - Click **"Create"**

5. Select your **Business Type:**
   - Choose what fits best (Technology, Software, etc.)
   - Select your business goals
   - Click **"Create"** (this creates the GA4 property)

---

## Step 3: Get Your Measurement ID

1. After creating the property, you'll see the **"Streaming settings"** page
2. Look for **"Measurement ID"** — it looks like: `G-XXXXXXXXXX`
3. **Copy this ID** — you'll need it in the next step
4. Keep this ID secret (don't commit to GitHub)

**Important:** Save this ID in a secure place (like your `.env.local` file)

---

## Step 4: Add Measurement ID to Your Environment

1. Open your `.env.local` file in the root of your project
2. Add this line:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
   (Replace `G-XXXXXXXXXX` with your actual Measurement ID)

3. Save the file

**Note:** The `NEXT_PUBLIC_` prefix means this will be accessible in the browser (which is required for GA to work). It's safe because GA IDs are public anyway.

---

## Step 5: Verify GA4 is Working

1. After deploying your changes (next section), wait 5-10 minutes
2. Go back to Google Analytics
3. On the left, click **"Real-time"**
4. Visit your website (arborapps.co) in a new tab
5. You should see yourself as an active user in real-time

If you see activity, GA4 is working! ✅

---

## Step 6: Deploy Code Changes

The code has already been prepared for you. Once you merge/deploy the changes, GA4 will automatically start tracking.

**The code will:**
- Track all page views automatically
- Track waitlist form submissions
- Track which app pages people visit
- Track traffic sources (Google, direct, referral, etc.)

No additional setup needed on your end after deployment!

---

## Understanding Your GA4 Data

### Key Metrics to Monitor

**1. Users & Sessions**
- **Users:** Unique people visiting your site
- **Sessions:** Groups of interactions within a 30-minute window
- **Goal:** Track if SEO improvements bring more users

**2. Traffic Sources**
- **Organic Search:** Users from Google (most important for SEO)
- **Direct:** Users typing URL or clicking bookmarks
- **Referral:** Users from other websites
- **Watch for:** Organic search growing as SEO improves

**3. Landing Pages**
- Which pages do users land on first?
- Which app pages get the most traffic?
- Example: Is /aegle getting more traffic than /salus?

**4. Engagement**
- **Pages per session:** How many pages does average user visit?
- **Time on page:** How long do people spend on each app?
- **Bounce rate:** What % leave without visiting another page?

**5. Conversions (Waitlist Signups)**
- Tracks every "Join Waitlist" submission
- Shows which app pages drive the most signups
- Shows conversion rate by traffic source

---

## Where to Find Data in GA4

### Real-Time (Check if it's working)
1. Left menu → **"Real-time"**
2. Shows live traffic right now
3. Use this to verify GA4 is connected

### Overview Dashboard
1. Left menu → **"Home"**
2. High-level summary of your traffic
3. Shows users, sessions, engagement metrics

### Pages & Screens
1. Left menu → **"Pages and screens"**
2. See which pages get the most traffic
3. Track /aegle, /salus, /thrive traffic separately
4. Example: "66% of users visit /aegle first"

### Traffic Sources
1. Left menu → **"Traffic sources"**
2. See where your users come from (Google, direct, etc.)
3. Most important: Watch organic search grow as SEO improves

### Conversions
1. Left menu → **"Conversions"** (may be under a different name initially)
2. See waitlist signup events
3. Shows conversion rate and which pages convert best

---

## Tips for Using GA4

### 1. Check Monthly
- Set a calendar reminder to review GA4 monthly
- Compare month-to-month growth
- Look for trends

### 2. Track These Specific Things
- Organic traffic growth (your main metric for SEO success)
- Which app pages are most popular
- Conversion rate on waitlist (signups / visitors)
- Average pages per session (engagement)

### 3. Segments to Create
Once you're comfortable, create segments to answer:
- "What do users who sign up for the waitlist do before converting?"
- "Do organic search users have different behavior than direct users?"
- "Which traffic source has the highest engagement?"

### 4. Set Up Goals/Conversions (Optional)
The code already tracks waitlist signups, but you can add more:
- "Clicked the Aegle CTA"
- "Spent 3+ minutes on /aegle"
- "Visited 2+ app pages"

---

## Troubleshooting

**GA4 shows no traffic after 1 hour:**
1. Check that `NEXT_PUBLIC_GA_ID` is in `.env.local`
2. Check that your site is deployed
3. Hard-refresh your website (Cmd+Shift+R or Ctrl+Shift+R)
4. Check browser console for errors (F12 → Console tab)
5. Wait up to 24 hours for first reports (real-time data is immediate)

**Can't find Measurement ID:**
1. Go to [analytics.google.com](https://analytics.google.com)
2. Bottom left → Settings (gear icon)
3. Left menu → **"Data streams"**
4. Click your website
5. Look for **"Measurement ID"** at the top

**Not seeing waitlist conversions:**
1. Make sure you've actually submitted the waitlist form
2. Give it 5 minutes to appear in GA4
3. Check in Real-time view first (not regular reports)

---

## Next Steps

1. ✅ Create GA4 property (this guide)
2. ✅ Get Measurement ID
3. ✅ Add to `.env.local`
4. ⏳ Deploy code changes
5. ⏳ Wait 5 minutes
6. ⏳ Check Real-time view to verify it's working
7. ⏳ Monitor monthly traffic growth

---

## FAQ

**Q: Is my Measurement ID secret?**
A: No, it's public. Anyone can see it in your HTML. It's designed this way. Keep it safe from typos, but it's not like a password.

**Q: Does GA4 slow down my site?**
A: No, it's tiny (~20KB) and loads asynchronously. Your site speed is unaffected.

**Q: When will I see organic search traffic?**
A: Give it 2-4 weeks after deployment. You need Google to:
1. Crawl your pages (a few days)
2. Re-index with new metadata (a few days)
3. Start ranking for keywords (1-3 weeks)
4. Users click through to you (ongoing)

**Q: Can I see individual user details?**
A: GA4 respects privacy by default. You see aggregated data (trends) not individual user data.

**Q: Should I use GA4 or Google Search Console?**
A: Both! GSC shows keyword rankings, GA4 shows what users do on your site. They're complementary.

