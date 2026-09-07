from PIL import Image, ImageDraw
import random, math

INK = (6, 5, 7)
WHITE = (255, 255, 255)
YELLOW = (255, 212, 71)
ORANGE = (255, 83, 31)
PINK = (230, 55, 159)
VIOLET = (119, 71, 255)

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def radial_blob(draw, cx, cy, r, color, size, alpha=1.0):
    steps = 40
    for i in range(steps, 0, -1):
        t = i / steps
        rr = int(r * t)
        c = lerp(color, INK, 1 - t * alpha) if alpha < 1 else lerp(INK, color, t)
        bbox = [cx - rr, cy - rr, cx + rr, cy + rr]
        draw.ellipse(bbox, fill=c)

def make_gradient_bg(w, h, blobs, seed=0):
    random.seed(seed)
    img = Image.new("RGB", (w, h), INK)
    # build via numpy-free per-blob radial overlay using multiple ellipses with blending
    base = Image.new("RGB", (w, h), INK)
    for (cx, cy, r, color) in blobs:
        overlay = Image.new("RGB", (w, h), INK)
        od = ImageDraw.Draw(overlay)
        steps = 60
        for i in range(steps, 0, -1):
            t = i / steps
            rr = max(1, int(r * t))
            c = lerp(INK, color, (1 - t) ** 1.6)
            od.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=c)
        base = Image.blend(base, overlay, 0.55)
    return base

def add_grain(img, amount=6, seed=1):
    random.seed(seed)
    px = img.load()
    w, h = img.size
    for _ in range(int(w * h * 0.04)):
        x = random.randrange(w)
        y = random.randrange(h)
        n = random.randint(-amount, amount)
        r, g, b = px[x, y]
        px[x, y] = (max(0, min(255, r + n)), max(0, min(255, g + n)), max(0, min(255, b + n)))
    return img

def save(img, path, quality=82):
    img.save(path, quality=quality)
    print("wrote", path, img.size)

# --- hero portrait: abstract silhouette-ish blob portrait placeholder ---
w, h = 1536, 1536
img = make_gradient_bg(w, h, [
    (int(w*0.62), int(h*0.32), int(w*0.55), ORANGE),
    (int(w*0.78), int(h*0.68), int(w*0.5), PINK),
    (int(w*0.35), int(h*0.75), int(w*0.45), VIOLET),
], seed=10)
draw = ImageDraw.Draw(img, "RGBA")
# simple abstract head/shoulders silhouette so it reads as a "portrait" placeholder
cx, cy = int(w*0.5), int(h*0.42)
draw.ellipse([cx-260, cy-320, cx+260, cy+140], fill=(20,18,22,235))
draw.ellipse([cx-420, cy+40, cx+420, cy+760], fill=(20,18,22,235))
img = add_grain(img, amount=5, seed=11)
save(img, "amar-portrait.jpg")

# --- service art backgrounds ---
specs = {
    "service-foundation.webp": [(300, 300, 600, VIOLET), (900, 700, 500, ORANGE)],
    "service-campaign.webp": [(200, 700, 550, ORANGE), (800, 200, 600, PINK)],
    "service-brand-launch.webp": [(700, 200, 650, PINK), (200, 800, 500, YELLOW)],
    "service-partner.webp": [(800, 800, 600, VIOLET), (200, 200, 500, ORANGE)],
}
sw, sh = 1200, 1200
for name, blobs in specs.items():
    img = make_gradient_bg(sw, sh, blobs, seed=hash(name) % 1000)
    img = add_grain(img, amount=5, seed=hash(name) % 1000 + 1)
    save(img, name)

# --- instagram post backgrounds ---
ig_specs = {
    "instagram-01.webp": [(150, 150, 500, ORANGE), (700, 750, 550, VIOLET)],
    "instagram-02.webp": [(700, 150, 550, PINK), (150, 750, 500, YELLOW)],
    "instagram-03.webp": [(400, 400, 600, VIOLET), (750, 850, 450, ORANGE)],
}
iw, ih = 812, 1020
for name, blobs in ig_specs.items():
    img = make_gradient_bg(iw, ih, blobs, seed=hash(name) % 1000)
    img = add_grain(img, amount=5, seed=hash(name) % 1000 + 1)
    save(img, name)

print("done")
