"""
publish_article.py
------------------
Researches current news and publishes a Hebrew market article to noamvardi.ai.
Requires: pip install openai requests

Environment variables:
  GEMINI_API_KEY         — DeepSeek API key (stored under this name in secrets)
  AUTOMATION_SECRET      — x-automation-secret for the site API
  ARTICLE_TYPE           — "daily" or "weekly" (default: "daily")
"""

from openai import OpenAI
import requests
import json
import os
import sys
import re
from datetime import datetime, timezone, timedelta

# ── Config ──────────────────────────────────────────────────────────────────
AI_API_KEY = os.environ["GEMINI_API_KEY"]  # DeepSeek key stored here
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


def get_cover_image():
    idx = (datetime.now().day % 8) - 1
    return COVER_IMAGES[idx if idx >= 0 else 7]


def hebrew_day_label():
    israel_tz = timezone(timedelta(hours=3))
    now = datetime.now(israel_tz)
    days_he = ["יום שני", "יום שלישי", "יום רביעי", "יום חמישי",
               "יום שישי", "יום שבת", "יום ראשון"]
    months_he = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
                 "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"]
    return f"{days_he[now.weekday()]} {now.day} {months_he[now.month - 1]} {now.year}"


# ── Prompts ──────────────────────────────────────────────────────────────────
DAILY_PROMPT = f"""You are a senior Hebrew financial journalist.
Today is {hebrew_day_label()}.

Write a thorough daily market brief in HEBREW (600-800 words) based on the most recent market data you know.

COVER:
- S&P 500, Nasdaq, Dow Jones — recent levels and % changes
- Bitcoin and Ethereum — recent prices and % changes
- Tel Aviv TA-35 index and shekel/dollar rate
- The biggest recent market-moving story with deep context on WHY it happened

WRITING RULES:
- Use the most recent data you have; be specific with numbers
- Explain WHY things moved — causes, not just effects
- Paragraph style, no bullet points, no emojis
- Hebrew only throughout

SECTIONS (use ## for headers):
## פתיחת השווקים
## קריפטו
## הסיפור הגדול של היום
## נקודות נוספות לעקוב
## לוח האירועים

OUTPUT FORMAT — your ENTIRE response must be exactly this JSON and nothing else:
{{
  "title": "עדכון שווקים — {hebrew_day_label()}",
  "excerpt": "שתי משפטים הלוכדות את הנושא המרכזי של היום",
  "body": "הכתבה המלאה כאן"
}}
Do NOT add markdown fences, preamble, or explanation. Start with {{ end with }}."""

WEEKLY_PROMPT = f"""You are a senior Hebrew financial analyst.
Today is {hebrew_day_label()}.

Write a comprehensive weekly market review in HEBREW (900-1200 words) based on the most recent market data you know.

COVER:
- S&P 500, Nasdaq, Dow — recent weekly % changes and closing levels
- Tel Aviv TA-35 weekly performance and shekel/dollar move
- Bitcoin and Ethereum weekly performance and the narrative behind the move
- The 2-3 biggest AI/tech stories and their market impact
- Key geopolitical events that affected markets

WRITING RULES:
- Use the most recent data you have; be specific with numbers
- Deep analysis of WHY things moved, not just what moved
- Name CEOs, analysts, companies when relevant
- Hebrew only. Professional newspaper style.

SECTIONS (use ## for headers):
## תמונת המצב — השוק האמריקאי
## שוק ההון הישראלי
## קריפטו
## בינה מלאכותית
## גיאופוליטיקה
## מבט לשבוע הבא

OUTPUT FORMAT — your ENTIRE response must be exactly this JSON and nothing else:
{{
  "title": "כותרת עברית שמגדירה את השבוע",
  "excerpt": "2-3 משפטים המסכמים את השבוע",
  "body": "הכתבה המלאה כאן"
}}
Do NOT add markdown fences, preamble, or explanation. Start with {{ end with }}."""


# ── Parsing ──────────────────────────────────────────────────────────────────
def clean_and_parse_json(text):
    def fix_escapes(s):
        s = re.sub(r"\\'", "'", s)                    # \' → ' (invalid in JSON)
        s = re.sub(r'\\([^"\\/bfnrtu])', r'\1', s)    # other invalid \X → X
        return s

    def strip_citations(s):
        s = re.sub(r'<[a-z][^>]*>.*?</[a-z]+>', '', s, flags=re.DOTALL | re.IGNORECASE)
        s = re.sub(r'\[\d+\]', '', s)
        return s.strip()

    candidates = [text]

    fence = re.search(r"```(?:json)?\s*(\{[\s\S]*\})\s*```", text)
    if fence:
        candidates.append(fence.group(1))

    brace = re.search(r"(\{[\s\S]*\})", text)
    if brace:
        candidates.append(brace.group(1))

    for candidate in candidates:
        for attempt in [candidate, fix_escapes(candidate)]:
            try:
                obj = json.loads(attempt.strip())
                obj["body"] = strip_citations(obj.get("body", ""))
                obj["excerpt"] = strip_citations(obj.get("excerpt", ""))
                return obj
            except json.JSONDecodeError:
                continue
    return None


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    client = OpenAI(api_key=AI_API_KEY, base_url="https://api.deepseek.com")
    prompt = DAILY_PROMPT if ARTICLE_TYPE == "daily" else WEEKLY_PROMPT

    print(f"[{ARTICLE_TYPE.upper()}] Writing article...")

    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=8192,
        temperature=0.3,
    )

    full_text = (response.choices[0].message.content or "").strip()

    if not full_text:
        print("ERROR: Empty response from DeepSeek.")
        sys.exit(1)

    article_json = clean_and_parse_json(full_text)

    if not article_json:
        print("ERROR: Could not parse JSON from DeepSeek response.")
        print("Raw response (first 4000 chars):", full_text[:4000])
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
