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
DAILY_PROMPT = f"""You are a professional Hebrew financial journalist writing for noamvardi.ai.
Today is {hebrew_day_label()}.

Your task: research today's market news and write a 300-450 word daily morning brief in HEBREW.

Research these topics using the web_search tool:
1. "stock market today {datetime.now().strftime('%B %d %Y')}" — pre-market, futures, overnight moves
2. "BTC ETH crypto price today" — current prices and 24h change
3. "economic news today {datetime.now().strftime('%B %d %Y')}" — earnings, Fed, macro
4. "חדשות כלכליות היום" — Israeli economic news
5. "AI tech news today {datetime.now().strftime('%B %d %Y')}" — major AI announcements

Write the article in HEBREW with these sections:
## פתיחת השווקים
מה צפוי היום בוול סטריט ות"א — פוצ'רס ומגמה כללית.

## קריפטו
BTC ו-ETH — מחיר נוכחי ושינוי 24 שעות.

## נקודות מפתח
2-3 חדשות כלכליות או טכנולוגיות חשובות להיום.

## מה לעקוב
אירועים מתוכננים היום: נתוני מאקרו, דוחות, ישיבות פד.

Rules:
- Hebrew only, professional and direct
- Accurate numbers only — if uncertain, describe trend without number
- No emojis, no bullet lists
- Paragraphs separated by blank lines

After writing, output ONLY a JSON object (no markdown, no extra text):
{{
  "title": "עדכון שווקים — {hebrew_day_label()}",
  "excerpt": "<one sentence summary>",
  "body": "<full article>"
}}
"""

WEEKLY_PROMPT = f"""You are a professional Hebrew financial journalist with 20 years of experience in AI and investments, writing for noamvardi.ai.
Today is {hebrew_day_label()} — summarize the past week's events.

Research these topics using the web_search tool:
1. "weekly stock market recap {datetime.now().strftime('%B %Y')}" — S&P500, Nasdaq, Dow
2. "AI news this week {datetime.now().strftime('%B %Y')}" — tools, funding, model releases
3. "geopolitical tensions markets this week" — wars, conflicts, market impact
4. "crypto market weekly BTC ETH {datetime.now().strftime('%B %Y')}"
5. "ביצועי שוק ישראל שבוע ת״א 35"
6. "earnings reports this week {datetime.now().strftime('%B %Y')}"

Write a 600-900 word article in HEBREW with these sections:
## תמונת מצב — השוק האמריקאי
ביצועי S&P500, Nasdaq, Dow השבוע. מה הניע, מה הפתיע.

## שוק ההון הישראלי
ביצועי ת"א 35 ות"א 125. אירועים מקומיים שהשפיעו.

## קריפטו
BTC ו-ETH השבוע — עליות, ירידות, נרטיב השוק.

## בינה מלאכותית — החדשות שמשנות את המשחק
כלים חדשים, עסקאות, מודלים, הודעות שהשפיעו על מניות AI.

## גיאופוליטיקה והשווקים
מלחמות ומתחים שהשפיעו על שווקים גלובליים. אם אין אירועים משמעותיים, השמט סעיף זה.

## מבט לשבוע הבא
3-4 אירועים שכדאי לעקוב: דוחות, פד, מאקרו, גיאופוליטיקה.

Rules:
- Hebrew only, natural expert voice
- No emojis, no bullet lists
- Paragraphs separated by blank lines

After writing, output ONLY a JSON object (no markdown, no extra text):
{{
  "title": "<compelling Hebrew headline reflecting the week's dominant theme>",
  "excerpt": "<1-2 sentence summary of the week>",
  "body": "<full article>"
}}
"""

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    prompt = DAILY_PROMPT if ARTICLE_TYPE == "daily" else WEEKLY_PROMPT

    print(f"[{ARTICLE_TYPE.upper()}] Researching and writing article...")

    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=4096,
        tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": 8}],
        messages=[{"role": "user", "content": prompt}],
    )

    # Extract the final text block
    article_json = None
    for block in reversed(response.content):
        if block.type == "text":
            try:
                # Strip possible markdown fences
                text = block.text.strip()
                if text.startswith("```"):
                    text = text.split("```")[1]
                    if text.startswith("json"):
                        text = text[4:]
                article_json = json.loads(text.strip())
                break
            except json.JSONDecodeError:
                continue

    if not article_json:
        print("ERROR: Could not parse JSON from model response.")
        print("Raw response:", response.content)
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
