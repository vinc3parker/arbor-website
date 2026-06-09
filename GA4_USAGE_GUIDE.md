# Google Analytics 4 Usage Guide for Arbor

Once GA4 is set up and collecting data, here's how to use it to understand your website performance and measure SEO success.

---

## What's Being Tracked Automatically

### Page Views
- Every time someone visits any page on your site
- Automatically tracked for all pages

### Events (Custom)
- **Waitlist signup:** When someone joins the early access list
- Shows conversion rate and which pages convert best

### User Properties
- What device they use (mobile, desktop, tablet)
- What browser (Chrome, Safari, Firefox, etc.)
- What country/city they're from
- What language they use

---

## Key Metrics to Watch Monthly

### 1. **Organic Traffic Growth** (Most Important for SEO)
**Why:** This shows if your SEO improvements are working

**Where to find it:**
1. Left menu → **"Traffic sources"**
2. Look at the "Source" column
3. Find rows that say "google" — that's organic search

**What to track:**
- Users from "google / organic" last month: X
- Users from "google / organic" this month: Y
- Growth rate: (Y - X) / X × 100%

**Example:** 
- March: 0 users from Google
- April: 47 users from Google
- Success! 

**Target:** 50-100% month-over-month growth for the first few months, then plateau

---

### 2. **Sessions & Users**
**Why:** Understand your traffic volume

**Where to find it:**
1. Home screen (dashboard)
2. Look at **"Users"** and **"Sessions"** cards at the top

**Key difference:**
- **Users:** Unique people (count each person once)
- **Sessions:** Conversations (one person can have multiple sessions)
- If average sessions per user = 1.5, people visit 1.5 times on average

**Target:** Sessions per user > 1.2 means people are engaged

---

### 3. **Waitlist Conversion Rate**
**Why:** Shows how many visitors become interested (join waitlist)

**Where to find it:**
1. Left menu → **"Conversions"**
2. Find the "join_waitlist" event
3. Note: May need to create as "conversion" manually (see setup instructions)

**Calculation:**
- Waitlist signups: 23
- Total users: 200
- Conversion rate: 23/200 = 11.5%

**Target:** 3-5% is decent, 5-10% is good, 10%+ is excellent

---

### 4. **Top Pages (by Traffic)**
**Why:** See which app pages attract the most visitors

**Where to find it:**
1. Left menu → **"Pages and screens"**
2. Sort by users (highest first)

**What you'll see:**
- / (homepage) — likely highest
- /aegle — should grow with SEO
- /salus — check if growing
- Other app pages

**Good sign:** /aegle and /salus get ~30-40% of traffic each (since they're live)

**Red flag:** Uneven distribution might mean one app isn't resonating

---

### 5. **Traffic Sources Breakdown**
**Why:** Understand where your traffic comes from

**Where to find it:**
1. Home screen (dashboard)
2. Look at "Sessions by default channel group"

**Common sources:**
- **Organic Search** (google / organic) — SEO traffic ✨
- **Direct** (direct) — People typing URL or bookmarks
- **Referral** — Links from other websites
- **Social** — Facebook, Twitter, etc.
- **Email** — If you send email campaigns

**Your focus:** Watch Organic Search grow as SEO improves

---

## Monthly SEO Check-In Template

Use this every month to track progress:

```
📊 APRIL 2026 ANALYTICS SUMMARY

Traffic:
- Total users: ___
- Total sessions: ___
- Avg. session duration: ___ minutes
- Bounce rate: ___% (lower is better, <50% is good)

Organic Search (Google):
- Users from organic search: ___
- Growth vs last month: ___% (↑ means working!)
- Top keywords: (this shows in Google Search Console)

Conversions:
- Waitlist signups this month: ___
- Conversion rate: ___%
- Best converting page: ___

Top Pages:
1. ___ (___ users)
2. ___ (___ users)
3. ___ (___ users)

Key Observations:
- Noticed: ...
- Concern: ...
- Success: ...
```

---

## Finding Specific Information

### Question: "Which pages do people visit before signing up?"
**Answer:** 
1. Create a segment for users who converted
2. Left menu → **"Segments"** → **"Create new segment"**
3. Add condition: "join_waitlist" event occurred
4. Apply segment
5. Go to **"Pages and screens"** with this segment active
6. See which pages these users visited

### Question: "Are mobile or desktop users more engaged?"
**Answer:**
1. Left menu → **"Device"**
2. Compare metrics across Device Category (Mobile, Desktop, Tablet)
3. See if one performs better

### Question: "Where are my users coming from geographically?"
**Answer:**
1. Left menu → **"Geography"**
2. See users by country, state, city
3. Can help with marketing decisions

### Question: "What's my bounce rate?"
**Answer:**
1. Left menu → **"Pages and screens"**
2. Look for "Bounce rate" column
3. Pages with <40% bounce rate are engaging
4. Pages with >60% bounce rate might need improvement

---

## Understanding SEO Progress Over Time

### Week 1-2: Nothing to Worry About
- GA4 needs time to collect data
- Real-time view will show you're getting traffic
- Reports take 24-48 hours to populate
- **OK:** 0 organic search users

### Week 3-4: First Signs
- Should see some organic search traffic
- Might be very small (1-5 users/day)
- **OK:** 10-30 organic users for the month

### Month 2-3: Growth Phase
- Organic search should be growing 50-100% weekly
- More app pages ranking for keywords
- More waitlist signups from organic
- **Target:** 50-100 organic users/month

### Month 4+: Establishment
- Consistent organic traffic from multiple keywords
- 100-300+ organic users per month
- Stable conversion rate
- Multiple app pages ranking

---

## Troubleshooting & Weird Data

### "Why is my bounce rate so high (80%+)?"
**Possible causes:**
- Homepage is unclear (people land then leave)
- App pages have thin content (which we fixed)
- Irrelevant traffic (wrong keywords ranking)
- **What to do:** Check what keywords are bringing traffic (Google Search Console) and see if they're relevant

### "Why do I see more sessions than users?"
**This is normal!** 
- Users: 100
- Sessions: 150
- This means average user has 1.5 sessions
- This is healthy engagement

### "Why does one page show 10 users but no session duration?"
**GA4 quirk:** Some pages are counted but might not track duration correctly. Not a problem.

### "My data suddenly jumped 200%"
**Check:**
1. Did you send email to your list?
2. Did someone popular share your link?
3. Is there a bot spamming traffic? (unlikely with GA4 filtering)

---

## Setting Up Conversion Goals (Optional Advanced)

By default, we track "join_waitlist" as an event. To make it official:

1. Left menu → **"Conversions"** (or **"Events"**)
2. Click **"Create new conversion"** (or "Mark as conversion")
3. Select **"join_waitlist"**
4. Click **"Save"**

Now it appears in "Conversions" section and affects reports.

---

## Comparing This Month vs Last Month

GA4 makes this easy:

1. Go to any report (like **"Pages and screens"**)
2. Top right → **"Date range"**
3. Click the comparison button (usually a calendar icon)
4. Select previous month
5. Now you see side-by-side comparison with % change

**Example:**
- This month: 47 users
- Last month: 23 users
- Change: +104%

---

## Recommended Views to Check Monthly

1. **Home** (dashboard) — Quick health check
2. **Traffic sources** — Is organic growing?
3. **Pages and screens** — Which pages perform best
4. **Events** — How many waitlist signups
5. **Real-time** — Check it's working (especially right after deployment)

---

## Connecting GA4 with Google Search Console

GA4 and Google Search Console are complementary:

- **GA4:** Shows what people do on your site
- **GSC:** Shows your rankings and search clicks

**To link them:**
1. Go to Google Search Console
2. Go to your property (arborapps.co)
3. Settings → Search Console property
4. Connect your GA4 property
5. Now you can see which keywords bring traffic in GA4

This is the most powerful combination for SEO tracking.

---

## Key Takeaway

Once monthly, spend 15 minutes checking:
1. Organic search users (is it growing?)
2. Waitlist conversions (are they signing up?)
3. Top pages (is traffic distributed reasonably?)

Everything else is bonus analysis.

**The main metric:** Organic search users growing month-over-month = SEO is working! 📈

