"""
publish_article.py
------------------
Researches current news and publishes a Hebrew AI-automation/agents article
to noamvardi.ai.
Requires: pip install google-genai requests

Environment variables:
  GEMINI_API_KEY         — Google Gemini API key
  AUTOMATION_SECRET      — x-automation-secret for the site API
  ARTICLE_TYPE           — "daily" (short news brief) or "weekly" (trend column)
"""

from google import genai
from google.genai import types
import requests
import json
import os
import sys
import re
import time
from datetime import datetime, timezone, timedelta

# ── Config ──────────────────────────────────────────────────────────────────
GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]
AUTOMATION_SECRET = os.environ["AUTOMATION_SECRET"]
ARTICLE_TYPE = os.environ.get("ARTICLE_TYPE", "daily")
API_URL = "https://noamvardi-site.vercel.app/api/automation/articles"

COVER_IMAGES = [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",  # ai chip
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80",  # robot hand
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",  # robot face
    "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&q=80",  # humanoid
    "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&q=80",     # code blue
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",  # circuit board
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",     # team laptops
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80",  # office work
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
DAILY_PROMPT = f"""You are a senior Hebrew tech journalist covering AI agents and business automation.
Today is {hebrew_day_label()}.

Search the web for today's AI news and write a sharp daily brief in HEBREW (600-800 words) for Israeli business owners.

FIND AND REPORT:
- The most important AI/agents announcement of the day (new model, agent product, automation tool)
- What it actually enables a business to automate — concrete use cases
- One real company example of AI automation in action, if available
- What an Israeli SMB owner should do about it this week

WRITING RULES:
- Real facts from your searches only — name companies, products, dates
- Explain the practical "so what" for a business, not just the announcement
- Paragraph style, no bullet points, no emojis
- Hebrew only throughout

SECTIONS (use ## for headers):
## מה קרה היום
## מה זה אומר לעסק שלך
## דוגמה מהשטח
## צעד אחד לעשות השבוע

OUTPUT FORMAT — your ENTIRE response must be exactly this JSON and nothing else:
{{
  "title": "עדכון AI לעסקים — {hebrew_day_label()}",
  "excerpt": "שני משפטים הלוכדים את החדשות החשובות של היום",
  "body": "הכתבה המלאה כאן"
}}
Do NOT add markdown fences, preamble, or explanation. Start with {{ end with }}."""

WEEKLY_PROMPT = f"""You are a senior Hebrew analyst covering AI agents, automation, and the future of work.
Today is {hebrew_day_label()}.

Search the web for this week's developments in AI agents and business automation, and write a comprehensive weekly column in HEBREW (900-1200 words) aimed at Israeli business owners and managers.

FIND AND REPORT:
- The 2-3 biggest AI-agent / automation stories of the week (new agent products, model releases, enterprise adoption news) — with company names, product names and dates
- Concrete numbers where available: adoption stats, funding, time/cost savings reported
- At least one real-world case of a business automating support, scheduling, sales follow-up or back-office work
- A practical takeaway: what kind of task is now automatable that wasn't a year ago
- A short look ahead: what to watch next week

WRITING RULES:
- Real facts from your searches only — never invent numbers or products
- Translate every story into business impact: hours saved, leads answered, processes replaced
- Name companies, CEOs and products when relevant
- Hebrew only. Professional, energetic magazine style — make the reader feel what is possible.

SECTIONS (use ## for headers):
## הסיפור הגדול של השבוע
## סוכנים בשטח — מי כבר עובד עם זה
## הכלים החדשים
## מה זה אומר לעסק שלך
## מבט קדימה

OUTPUT FORMAT — your ENTIRE response must be exactly this JSON and nothing else:
{{
  "title": "כותרת עברית מסקרנת שמגדירה את השבוע בעולם הסוכנים",
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
    client = genai.Client(api_key=GEMINI_API_KEY)
    prompt = DAILY_PROMPT if ARTICLE_TYPE == "daily" else WEEKLY_PROMPT

    print(f"[{ARTICLE_TYPE.upper()}] Researching and writing article...")

    full_text = ""
    for attempt in range(1, 5):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())],
                    max_output_tokens=8192,
                    temperature=0.3,
                ),
            )
            full_text = (response.text or "").strip()
            break
        except Exception as e:
            print(f"Attempt {attempt} failed: {e}")
            if attempt < 4:
                wait = 30 * attempt
                print(f"Retrying in {wait}s...")
                time.sleep(wait)
            else:
                print("ERROR: All attempts failed.")
                sys.exit(1)

    if not full_text:
        print("ERROR: Empty response from Gemini.")
        sys.exit(1)

    article_json = clean_and_parse_json(full_text)

    if not article_json:
        print("ERROR: Could not parse JSON from model response.")
        print("Raw response (first 4000 chars):", full_text[:4000])
        sys.exit(1)

    payload = {
        "title": article_json["title"],
        "category": "ai_tech",
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
