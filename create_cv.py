from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import os

W, H = A4
OUT = os.path.expanduser("~/Desktop/project/portfolio/Shreyas_Nandi_CV.pdf")
PHOTO = os.path.expanduser("~/Desktop/project/portfolio/photo_small.jpg")

# Colors — matching original resume style
SIDEBAR_BG = HexColor("#1a3c5e")
SIDEBAR_HEAD = white
SIDEBAR_TEXT = HexColor("#d0dce8")
SIDEBAR_DIM = HexColor("#8faabe")
ACCENT = HexColor("#1a3c5e")
MAIN_BG = white
TITLE_COLOR = HexColor("#1a3c5e")
BODY_COLOR = HexColor("#3a3a3a")
LIGHT_TEXT = HexColor("#666666")
SECTION_LINE = HexColor("#1a3c5e")
BULLET_COLOR = HexColor("#1a3c5e")
LINK_COLOR = HexColor("#2563eb")

SIDEBAR_W = 68 * mm
c = canvas.Canvas(OUT, pagesize=A4)

# ══ BACKGROUNDS ══
c.setFillColor(SIDEBAR_BG)
c.rect(0, 0, SIDEBAR_W, H, fill=1, stroke=0)
c.setFillColor(MAIN_BG)
c.rect(SIDEBAR_W, 0, W - SIDEBAR_W, H, fill=1, stroke=0)

# ══════════════════════════════════════
# SIDEBAR
# ══════════════════════════════════════
sx = 10 * mm
sw = SIDEBAR_W - 20 * mm

# ── Photo ──
photo_size = 40 * mm
photo_cx = SIDEBAR_W / 2
photo_cy = H - 38 * mm

c.setStrokeColor(white)
c.setLineWidth(2)
c.circle(photo_cx, photo_cy, photo_size / 2 + 2 * mm, fill=0, stroke=1)

c.saveState()
path = c.beginPath()
path.circle(photo_cx, photo_cy, photo_size / 2)
c.clipPath(path, stroke=0)
img = ImageReader(PHOTO)
iw, ih = img.getSize()
aspect = iw / ih
if aspect > 1:
    dh = photo_size
    dw = photo_size * aspect
    c.drawImage(PHOTO, photo_cx - dw/2, photo_cy - dh/2, dw, dh, mask='auto')
else:
    dw = photo_size
    dh = photo_size / aspect
    c.drawImage(PHOTO, photo_cx - dw/2, photo_cy - dh/2, dw, dh, mask='auto')
c.restoreState()

y = H - 64 * mm

# ── Sidebar helpers ──
def sb_section(yy, title):
    yy -= 5 * mm
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(SIDEBAR_HEAD)
    c.drawString(sx, yy, title.upper())
    c.setStrokeColor(HexColor("#3a6a8a"))
    c.setLineWidth(0.7)
    c.line(sx, yy - 2 * mm, sx + sw, yy - 2 * mm)
    return yy - 6 * mm

def sb_contact(yy, icon, text):
    c.setFont("Helvetica", 7)
    c.setFillColor(SIDEBAR_DIM)
    c.drawString(sx, yy, icon)
    c.setFillColor(SIDEBAR_TEXT)
    c.setFont("Helvetica", 7.5)
    c.drawString(sx + 5 * mm, yy, text)
    return yy - 4.5 * mm

def sb_bullet(yy, text):
    c.setFillColor(HexColor("#5a9abf"))
    c.circle(sx + 1.5 * mm, yy + 0.8 * mm, 0.8 * mm, fill=1, stroke=0)
    c.setFont("Helvetica", 7.5)
    c.setFillColor(SIDEBAR_TEXT)
    # wrap
    words = text.split()
    line = ""
    first = True
    for word in words:
        test = line + (" " if line else "") + word
        if c.stringWidth(test, "Helvetica", 7.5) > sw - 5 * mm:
            c.drawString(sx + 5 * mm, yy, line)
            yy -= 3.3 * mm
            line = word
            first = False
        else:
            line = test
    if line:
        c.drawString(sx + 5 * mm, yy, line)
        yy -= 3.8 * mm
    return yy

# ── Contact ──
y = sb_contact(y, "+49", "+49 176 59292830")
y = sb_contact(y, "@", "shreyasnandi04@gmail.com")
y = sb_contact(y, "Q", "Munich, Germany")
y = sb_contact(y, "in", "LinkedIn: Shreyas Nandi")
y -= 1 * mm

# ── Skills ──
y = sb_section(y, "Skills")

c.setFont("Helvetica-Bold", 7.5)
c.setFillColor(SIDEBAR_HEAD)
c.drawString(sx, y, "TECHNICAL SKILLS")
y -= 4.5 * mm

tech_skills = ["Python", "Java", "C", "C++", "HTML, CSS, JavaScript", "SQL"]
for s in tech_skills:
    c.setFont("Helvetica", 7.5)
    c.setFillColor(SIDEBAR_TEXT)
    c.drawString(sx + 2 * mm, y, s)
    y -= 3.5 * mm


y -= 1 * mm

# ── Education ──
y = sb_section(y, "Education")

c.setFont("Helvetica-Bold", 7.5)
c.setFillColor(SIDEBAR_HEAD)
c.drawString(sx, y, "M.SC. BIG DATA & BUSINESS")
y -= 3.5 * mm
c.drawString(sx, y, "ANALYTICS")
y -= 3.5 * mm
c.setFont("Helvetica", 7)
c.setFillColor(SIDEBAR_DIM)
c.drawString(sx, y, "FOM Hochschule, Munchen")
y -= 3.2 * mm
c.drawString(sx, y, "Sep 2025 - Present")
y -= 5.5 * mm

c.setFont("Helvetica-Bold", 7.5)
c.setFillColor(SIDEBAR_HEAD)
c.drawString(sx, y, "B.SC. INFORMATION TECHNOLOGY")
y -= 3.5 * mm
c.setFont("Helvetica", 7)
c.setFillColor(SIDEBAR_DIM)
c.drawString(sx, y, "SIES College, Mumbai")
y -= 3.2 * mm
c.drawString(sx, y, "Sep 2022 - Mar 2025")
y -= 5.5 * mm

# ── Language ──
y = sb_section(y, "Language")
langs = [("English", "C1 (Fluent)"), ("German", "A1 (Learning)"), ("Hindi", "Native")]
for lang, level in langs:
    c.setFont("Helvetica-Bold", 7.5)
    c.setFillColor(SIDEBAR_TEXT)
    c.drawString(sx, y, lang)
    c.setFont("Helvetica", 7)
    c.setFillColor(SIDEBAR_DIM)
    c.drawString(sx + 16 * mm, y, level)
    y -= 4 * mm

# ══════════════════════════════════════
# MAIN CONTENT
# ══════════════════════════════════════
mx = SIDEBAR_W + 12 * mm
mw = W - mx - 12 * mm
my = H - 18 * mm

# ── Name ──
c.setFont("Helvetica-Bold", 26)
c.setFillColor(TITLE_COLOR)
c.drawString(mx, my, "SHREYAS")
my -= 9 * mm
c.drawString(mx, my, "NANDI")
my -= 8 * mm

# Title
c.setFont("Helvetica", 8.5)
c.setFillColor(LIGHT_TEXT)
c.drawString(mx, my, "Full-Stack Developer | Software Developer")
my -= 5 * mm

# Divider
c.setStrokeColor(SECTION_LINE)
c.setLineWidth(1)
c.line(mx, my, mx + mw, my)
my -= 5 * mm

# Profile
c.setFont("Helvetica", 7.5)
c.setFillColor(BODY_COLOR)
profile = "IT student with practical experience in web development. I have built and deployed a multi-service web platform called CrownDesk that runs 4 applications under one domain. Comfortable working with Python backends, JavaScript frontends, databases, and API integrations. Looking for a junior developer or working student position where I can grow and contribute."
words = profile.split()
line = ""
for word in words:
    test = line + (" " if line else "") + word
    if c.stringWidth(test, "Helvetica", 7.5) > mw:
        c.drawString(mx, my, line)
        my -= 3.3 * mm
        line = word
    else:
        line = test
if line:
    c.drawString(mx, my, line)
    my -= 3.3 * mm
my -= 4 * mm

# ── Main section helper ──
def main_section(yy, title):
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(TITLE_COLOR)
    c.drawString(mx, yy, title.upper())
    c.setStrokeColor(SECTION_LINE)
    c.setLineWidth(1)
    c.line(mx, yy - 2.5 * mm, mx + mw, yy - 2.5 * mm)
    return yy - 7 * mm

def main_bullet(yy, text):
    c.setFillColor(BULLET_COLOR)
    c.circle(mx + 2 * mm, yy + 0.8 * mm, 0.7 * mm, fill=1, stroke=0)
    c.setFont("Helvetica", 7.5)
    c.setFillColor(BODY_COLOR)
    words = text.split()
    line = ""
    first = True
    for word in words:
        test = line + (" " if line else "") + word
        if c.stringWidth(test, "Helvetica", 7.5) > mw - 6 * mm:
            c.drawString(mx + 5 * mm, yy, line)
            yy -= 3.3 * mm
            line = word
            first = False
        else:
            line = test
    if line:
        c.drawString(mx + 5 * mm, yy, line)
        yy -= 3.5 * mm
    return yy

# ── Experience ──
my = main_section(my, "Experience")

c.setFont("Helvetica-Bold", 9)
c.setFillColor(TITLE_COLOR)
c.drawString(mx, my, "WEB DEVELOPMENT INTERN")
my -= 4 * mm
c.setFont("Helvetica", 7.5)
c.setFillColor(LIGHT_TEXT)
c.drawString(mx, my, "Skolar")
c.setFont("Helvetica", 7)
period = "Nov 2023 - Feb 2024"
c.drawString(mx + mw - c.stringWidth(period, "Helvetica", 7), my, period)
my -= 5 * mm

my = main_bullet(my, "Went through a hands-on full-stack web development program, working on both frontend and backend sides")
my = main_bullet(my, "Built responsive web pages and connected them to databases using SQL for storing and retrieving data")
my = main_bullet(my, "Wrote CRUD logic for managing users, posts, and other dynamic content in the applications")
my = main_bullet(my, "Worked in a small team, followed coding standards, used version control, and helped debug issues")
my = main_bullet(my, "Picked up HTML, CSS, JavaScript, and basic backend development during the internship")
my -= 3 * mm

# ── Projects ──
my = main_section(my, "Projects")

# CrownDesk overview
c.setFont("Helvetica-Bold", 9)
c.setFillColor(TITLE_COLOR)
c.drawString(mx, my, "CROWNDESK — FULL-STACK ECOSYSTEM")
c.setFont("Helvetica", 7)
c.setFillColor(LINK_COLOR)
c.drawString(mx + mw - c.stringWidth("crowndeskhub.com", "Helvetica", 7), my, "crowndeskhub.com")
my -= 4 * mm
c.setFont("Helvetica-Oblique", 7)
c.setFillColor(LIGHT_TEXT)
c.drawString(mx, my, "Solo Developer  |  Live in Production  |  2024 - Present")
my -= 4.5 * mm
my = main_bullet(my, "Built 4 web apps from scratch and connected them under one domain using a Flask reverse proxy — the whole thing runs as one Docker container on Render")
my = main_bullet(my, "Set up Google login across all apps so users only need one account, added JWT tokens for sessions and made sure everything follows GDPR rules")
my = main_bullet(my, "Created an admin panel that controls all 4 apps from one place, with health checks and user management")
my -= 2.5 * mm

# JobDesk
c.setFont("Helvetica-Bold", 8.5)
c.setFillColor(TITLE_COLOR)
c.drawString(mx + 3 * mm, my, "JobDesk — Career Intelligence Platform")
c.setFont("Helvetica", 6.5)
c.setFillColor(LIGHT_TEXT)
c.drawString(mx + mw - c.stringWidth("Python Flask | Groq | Claude AI | SQLite", "Helvetica", 6.5), my, "Python Flask | Groq | Claude AI | SQLite")
my -= 4.5 * mm
my = main_bullet(my, "Made a job tracking app for international students in Germany — you can log applications, upload documents, and track where you applied")
my = main_bullet(my, "Added AI features using Claude and Groq APIs that help generate resumes and cover letters based on your profile and the job description")
my = main_bullet(my, "Built a dashboard with Chart.js showing 16 stats like response rate, top portals, and a career score out of 100")
my = main_bullet(my, "The tracker supports 25+ fields per application, CSV export, and gives personalised tips based on your data")
my -= 2.5 * mm

# Nexora
c.setFont("Helvetica-Bold", 8.5)
c.setFillColor(TITLE_COLOR)
c.drawString(mx + 3 * mm, my, "Nexora — Student Community Platform")
c.setFont("Helvetica", 6.5)
c.setFillColor(LIGHT_TEXT)
c.drawString(mx + mw - c.stringWidth("Python Flask | Google & GitHub OAuth", "Helvetica", 6.5), my, "Python Flask | Google & GitHub OAuth")
my -= 4.5 * mm
my = main_bullet(my, "Developed a full-featured social networking platform connecting international students across German cities with community discovery, event creation, and meetup coordination")
my = main_bullet(my, "Built real-time direct messaging system, interactive geolocation-based map, Instagram-style stories and posts with likes, comments, and media uploads")
my = main_bullet(my, "Integrated an AI life coach powered by Claude and Groq that answers visa questions, helps with culture shock, academic stress, and everyday student challenges in Germany")
my = main_bullet(my, "Implemented Google and GitHub OAuth login, email OTP verification, referral programme with ambassador tiers, and a dedicated admin panel for content moderation")
my -= 2.5 * mm

# MediNest
c.setFont("Helvetica-Bold", 8.5)
c.setFillColor(TITLE_COLOR)
c.drawString(mx + 3 * mm, my, "MediNest — AI Medical Platform (15+ Modules)")
c.setFont("Helvetica", 6.5)
c.setFillColor(LIGHT_TEXT)
c.drawString(mx + mw - c.stringWidth("Next.js | FastAPI | Claude AI | JWT", "Helvetica", 6.5), my, "Next.js | FastAPI | Claude AI | JWT")
my -= 4.5 * mm
my = main_bullet(my, "Built the most complex product in the ecosystem — a 15+ module AI medical learning platform with Crown Intelligence (Claude AI assistant), clinical case simulator with scoring, and AI differential diagnosis engine")
my = main_bullet(my, "Developed cross-country drug interaction checker, symptom-to-condition lookup with triage scoring, and a medical translator supporting 30+ languages with ICD-11 code mapping")
my = main_bullet(my, "Engineered real-time health tracking using browser-native phone sensors — heart rate measurement via camera photoplethysmography (PPG) and step counting via device accelerometer")
my = main_bullet(my, "Designed a dual-mode UI system: Clinical Mode (day) for precision medicine with dark premium design, and Remedy Mode (night) for holistic wellness with home remedies and herb encyclopedia")
my = main_bullet(my, "Implemented medication reminders, mental health mood tracker, FitLife fitness hub, verified provider directory with booking, monthly health reports, and a fully custom theme engine with 12 unlockable themes")
my -= 3 * mm

# Architecture
c.setStrokeColor(HexColor("#dddddd"))
c.setLineWidth(0.5)
c.line(mx, my, mx + mw, my)
my -= 4 * mm
c.setFont("Helvetica-Bold", 7)
c.setFillColor(TITLE_COLOR)
c.drawString(mx, my, "ARCHITECTURE:")
c.setFont("Helvetica", 7)
c.setFillColor(BODY_COLOR)
c.drawString(mx + 22 * mm, my, "Docker  |  7 processes  |  Reverse proxy  |  OAuth  |  GDPR  |  Render")
my -= 5 * mm

# Links
c.setFont("Helvetica-Bold", 7)
c.setFillColor(TITLE_COLOR)
c.drawString(mx, my, "LINKS:")
my -= 4 * mm
links = [
    ("Live:", "crowndeskhub.com"),
    ("Portfolio:", "crowndesk01-cmyk.github.io/portfolio"),
    ("GitHub:", "github.com/crowndesk01-cmyk"),
]
for label, url in links:
    c.setFont("Helvetica-Bold", 6.5)
    c.setFillColor(BODY_COLOR)
    c.drawString(mx + 2 * mm, my, label)
    lw = c.stringWidth(label, "Helvetica-Bold", 6.5)
    c.setFont("Helvetica", 6.5)
    c.setFillColor(LINK_COLOR)
    c.drawString(mx + 2 * mm + lw + 1.5 * mm, my, url)
    my -= 3.5 * mm

c.save()
print(f"CV saved: {OUT}")
