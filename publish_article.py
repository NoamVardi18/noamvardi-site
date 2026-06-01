"""
publish_article.py
------------------
Researches current news and publishes a Hebrew market article to noamvardi.ai.
Requires: pip install anthropic requests

Environment variables:
  ANTHROPIC_API_KEY      — your Anthropic API key
  AUTOMATION_SECRET      — x-automation-secret for the site API
  ARTICLE_TYPE           — "daily" or "weekly" (default: "daily")
"""

import anthropic
import requests
import json
import os
import sys
from datetime import datetime, timezone, timedelta

# ── Config ──────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"]
AUTOMATION_SECRET = os.environ["AUTOMATION_SECRET"]
ARTICLE_TYPE = os.environ.get("ARTICLE_TYPE", "daily")
API_URL = "https://noamvardi-site.vercel.app/api/automation/articles"

COVER_IMAGES = [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=80",
    "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&q=80",
    "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=1200&q=80",
    "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=1200&q=80",
    "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1200&q=80",
    "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=1200&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=80",
]

# ── Helpers ──────────────────────────────────────────────────────────────────
def get_cover_image():
    day = datetime.now().day
    idx = (day % 8) - 1
    if idx < 0:
        idx = 7
    return COVER_IMAGES[idx]


def hebrew_day_label():
    """Returns e.g. 'יום שני 2 יוני 2026'"""
    israel_tz = timezone(timedelta(hours=3))
    now = datetime.now(israel_tz)
    days_he = ["יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "יום שבת", "יום ראשון"]
    months_he = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני",
                 "יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"]
    day_name = days_he[now.weekday()]
    return f"{day_name} {now.day} {months_he[now.month - 1]} {now.year}"


# ── Prompts ──────────────────────────────────────────────────────────────────
DAILY_PROMPT = f"""You are a senior Hebrew financial journalist at a major Israeli newspaper.
Today is {hebrew_day_label()}.

TASK: Write a thorough, substantive daily market brief in HEBREW (600-800 words).

RESEARCH STEPS — do all 4 searches, then read the actual article content from the results:
1. Search "market update {datetime.now().strftime('%B %d %Y')} site:reuters.com OR site:bloomberg.com OR site:cnbc.com" — read the full articles, extract real numbers and quotes.
2. Search "bitcoin ethereum price {datetime.now().strftime('%B %d %Y')}" — get exact prices and % moves.
3. Search "Israel economy stocks {datetime.now().strftime('%B %d %Y')}" — TA-35 moves, shekel rate.
4. Search "AI artificial intelligence news {datetime.now().strftime('%B %d %Y')}" — any market-moving announcements.

WRITING RULES:
- Use REAL numbers from the articles you read — exact index levels, % changes, prices.
- Quote analysts or executives by name if you found quotes in the articles.
- Minimum 600 words. If there is little news, add context and analysis.
- Paragraph style — no bullet lists, no emojis.
- Hebrew only (section headers in Hebrew too).

SECTIONS:
## פתיחת השווקים
פוצ'רס, ביצועי אסיה/אירופה, מגמת ת"א — עם מספרים ספציפיים.

## קריפטו
BTC ו-ETH — מחיר מדויק ושינוי 24 שעות. מה מניע את השוק.

## הסיפור הגדול של היום
החדשה הכלכלית/גיאופוליטית/טכנולוגית החשובה ביותר — ניתוח מעמיק עם רקע.

## נקודות נוספות לעקוב
2-3 חדשות נוספות עם הסבר קצר לכל אחת.

## לוח האירועים
נתוני מאקרו, דוחות חברות, ישיבות פד שצפויים היום.

After writing, output ONLY a valid JSON object:
{{
  "title": "עדכון שווקים — {hebrew_day_label()}",
  "excerpt": "<two sentences capturing today's dominant theme>",
  "body": "<full article, 600-800 words>"
}}"""

WEEKLY_PROMPT = f"""You are a senior Hebrew financial analyst writing the weekly column for noamvardi.ai.
Today is {hebrew_day_label()}.

TASK: Write a comprehensive weekly market review in HEBREW (900-1200 words).

RESEARCH STEPS — search, then read the actual full articles:
1. Search "weekly market recap {datetime.now().strftime('%B %Y')} site:reuters.com OR site:bloomberg.com" — read articles, get exact weekly % changes.
2. Search "S&P 500 Nasdaq weekly performance {datetime.now().strftime('%B %d %Y')}" — exact numbers.
3. Search "bitcoin weekly performance {datetime.now().strftime('%B %Y')}" — crypto week in review.
4. Search "AI news week {datetime.now().strftime('%B %Y')} funding models announcements" — biggest AI stories.

WRITING RULES:
- REAL numbers only — exact index levels, weekly % changes, market caps.
- Name-drop companies, CEOs, analysts when relevant.
- Minimum 900 words. Analyze WHY things moved, not just WHAT moved.
- Hebrew only. Professional newspaper style.

SECTIONS:
## תמונת המצב — השוק האמריקאי
S&P500, Nasdaq, Dow — ביצועים שבועיים עם מספרים. הסבר למה.

## שוק ההון הישראלי
ת"א 35, שקל/דולר, אירועים מקומיים שהשפיעו.

## קריפטו
BTC ו-ETH — ביצועים שבועיים, נרטיב השוק, נפח מסחר.

## בינה מלאכותית
החדשות הגדולות של השבוע — עסקאות, מודלים, חברות. למה זה חשוב לשוק.

## גיאופוליטיקה
השפעת אירועים גלובליים על שווקים. השמט אם שקט.

## מבט לשבוע הבא
דוחות, פד, נתוני מאקרו — מה להכין.

After writing, output ONLY a valid JSON object:
{{
  "title": "<compelling Hebrew headline — the week's defining theme>",
  "excerpt": "<2-3 sentences capturing the week>",
  "body": "<full article, 900-1200 words>"
}}"""

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    prompt = DAILY_PROMPT if ARTICLE_TYPE == "daily" else WEEKLY_PROMPT

    print(f"[{ARTICLE_TYPE.upper()}] Researching and writing article...")

    max_searches = 4 if ARTICLE_TYPE == "daily" else 5

    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=2048,
        tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": max_searches}],
        messages=[{
            "role": "user",
            "content": [{
                "type": "text",
                "text": prompt,
                "cache_control": {"type": "ephemeral"},
            }],
        }],
    )

    # Extract the final text block
    article_json = None
    full_text = ""
    for block in reversed(response.content):
        if block.type == "text" and block.text.strip():
            full_text = block.text.strip()
            break

    if full_text:
        # Try multiple extraction strategies
        import re
        candidates = []

        # 1. Direct parse
        candidates.append(full_text)

        # 2. Strip ```json ... ``` fences
        fence = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", full_text, re.DOTALL)
        if fence:
            candidates.append(fence.group(1))

        # 3. Find first { ... } JSON blob
        brace = re.search(r"(\{[\s\S]*\})", full_text)
        if brace:
            candidates.append(brace.group(1))

        for candidate in candidates:
            try:
                article_json = json.loads(candidate.strip())
                break
            except json.JSONDecodeError:
                continue

    if not article_json:
        print("ERROR: Could not parse JSON from model response.")
        print("Raw response:", full_text[:2000])
        sys.exit(1)

    payload = {
        "title": article_json["title"],
        "category": "finance",
        "excerpt": article_json["excerpt"],
        "body": article_json["body"],
        "cover_image": get_cover_image(),
        "status": "published",
    }

    print(f"Publishing: {payload['title']}")

    resp = requests.post(
        API_URL,
        headers={
            "Content-Type": "application/json",
            "x-automation-secret": AUTOMATION_SECRET,
        },
        json=payload,
        timeout=30,
    )

    if resp.status_code in (200, 201):
        print(f"SUCCESS! Article published. Status: {resp.status_code}")
    else:
        print(f"ERROR: {resp.status_code} — {resp.text}")
        sys.exit(1)


if __name__ == "__main__":
    main()
