import re
import time
import urllib.request

BASE = "https://samiinw.github.io/sentinel/"
UA = {"User-Agent": "Mozilla/5.0"}


def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.read().decode("utf-8", "ignore")


def main():
    for attempt in range(20):
        try:
            status, html = fetch(BASE)
            print("PAGE", BASE, "->", status)
            if status == 200:
                m = re.search(r'/sentinel/_next/static/[^"\']+\.js', html)
                has_hero = "Moderation that" in html or "Sentinel" in html
                print("HAS_CONTENT", has_hero)
                if m:
                    bundle = "https://samiinw.github.io" + m.group(0)
                    bstatus, _ = fetch(bundle)
                    print("BUNDLE", bundle, "->", bstatus)
                    return
                else:
                    print("No _next bundle found yet, retrying...")
        except Exception as e:
            print("attempt", attempt, "err:", e)
        time.sleep(15)


if __name__ == "__main__":
    main()
