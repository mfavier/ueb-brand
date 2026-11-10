#!/usr/bin/env python3
"""UEB social templates. Standard library only; all layout values are in SVG pixels."""
import argparse
import base64
import hashlib
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COLORS = dict(night="#101E42", blue="#3448A1", sky="#B6DDF5", gold="#D8AF69",
              white="#FFFFFF", paper="#F5F8FC", muted="#526078", line="#DCE2EC")
NAMES = {
    "01-resultats": "Résultats du week-end",
    "02-programme": "Programme du week-end",
    "03-partenaire": "Présentation d’un partenaire",
    "04-player-of-the-week": "Player of the week",
    "05-annonce-officielle": "Annonce officielle",
    "06-communication": "Communication pratique",
    "07-score-final": "Score final",
}


def uri(path):
    path = Path(path)
    mime = {".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
            ".png": "image/png", ".ttf": "font/ttf"}[path.suffix.lower()]
    return "data:" + mime + ";base64," + base64.b64encode(path.read_bytes()).decode()


def asset(value):
    path = (ROOT / value).resolve()
    if not path.is_file():
        raise ValueError(f"Fichier absent : {value}")
    return uri(path)


def esc(value):
    return html.escape(str(value), quote=True)


class Poster:
    def __init__(self, key, data, story=False, mode="example"):
        self.key, self.d, self.story, self.mode = key, data, story, mode
        self.h = 1920 if story else 1350
        self.bg = {"01-resultats": "white", "02-programme": "sky", "03-partenaire": "white",
                   "04-player-of-the-week": "night", "05-annonce-officielle": "night",
                   "06-communication": "paper", "07-score-final": "night"}[key]
        self.dark = self.bg == "night"
        self.ink = COLORS["white" if self.dark else "night"]
        self.secondary = COLORS["sky" if self.dark else "muted"]
        self.accent = COLORS["gold" if self.dark else "blue"]
        self.parts = []
        self.field_ids = []
        self.counter = 0
        self.rect(0, 0, 1080, self.h, COLORS[self.bg])

    def text(self, value, x, y, size=36, color=None, weight=400, display=False,
             anchor="start", tracking=0, field=None, max_width=None):
        self.counter += 1
        node_id = field or f"text-{self.counter}"
        if field:
            self.field_ids.append(field)
        opts = f' id="{node_id}" x="{x}" y="{y}" font-size="{size}" font-weight="{weight}"'
        opts += f' fill="{color or self.ink}" font-family="{"Kanit" if display else "DM Sans"}"'
        opts += f' text-anchor="{anchor}" letter-spacing="{tracking}"'
        if max_width is not None:
            opts += f' data-max-width="{max_width}"'
        self.parts.append(f"<text{opts}>{esc(value)}</text>")

    def lines(self, values, x, y, size, leading=None, **kwargs):
        for index, value in enumerate(values):
            opts = dict(kwargs)
            if opts.get("field"):
                opts["field"] += f"-{index + 1}"
            self.text(value, x, y + index * (leading or size), size=size, **opts)

    def rect(self, x, y, w, h, color, opacity=1):
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{color}" opacity="{opacity}"/>')

    def rule(self, y, color=None, x1=72, x2=1008):
        self.parts.append(f'<path d="M{x1} {y}H{x2}" fill="none" stroke="{color or self.accent}" stroke-width="1.5"/>')

    def image(self, value, x, y, w, h, field="photo", contain=False):
        self.parts.append(f'<svg id="{field}" x="{x}" y="{y}" width="{w}" height="{h}" viewBox="0 0 {w} {h}" overflow="hidden"><image href="{asset(value)}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid {"meet" if contain else "slice"}"/></svg>')

    def header(self):
        top = 270 if self.story else 68
        self.image("assets/ueb-logo.svg", 72, top, 98, 110, "official-crest", True)
        self.text("Uccle Europe", 188, top + 43, 34, weight=700, display=True)
        self.text("BASKETBALL · DEPUIS 1946", 190, top + 76, 16,
                  color=self.secondary, weight=600, tracking=2.2)
        self.text(self.key[:2], 1008, top + 44, 30, weight=700, display=True, anchor="end", color=self.accent)
        self.text("LE JEU. LE LIEN. L’AVENIR.", 1008, top + 76, 14,
                  color=self.secondary, weight=600, tracking=1.4, anchor="end")
        self.rule(top + 142)

    @property
    def offset(self):
        return 202 if self.story else 0

    def title(self, lines, meta, size=100):
        y = 322 + self.offset
        self.lines(lines, 72, y, size, size * .98, display=True, weight=800,
                   tracking=-2, field="headline", max_width=936)
        baseline = y + (len(lines) - 1) * size * .98
        self.text(meta, 74, baseline + 63, 32, color=self.accent, weight=600,
                  tracking=1.0, field="edition", max_width=932)

    def footer(self):
        y = 1472 if self.story else 1234
        self.rule(y - 32)
        self.text("UCCLE · BRUXELLES", 72, y, 23, weight=600, tracking=2, color=self.secondary)
        self.text("uebasket.be", 1008, y, 25, anchor="end", weight=600)
        label = "EXEMPLE FICTIF · ÉTUDE GRAPHIQUE" if self.mode == "example" else "MODÈLE À REMPLIR"
        if self.mode == "production":
            label = self.d.get("footer", "")
        if label:
            self.text(label, 72, y + 42, 17, color=self.secondary, tracking=1.4)

    def results(self):
        self.title(["LE WEEK-END.", "EN CHIFFRES."], self.d["edition"], 97)
        start = 574 + self.offset
        for i, row in enumerate(self.d["matches"]):
            y = start + i * 145
            self.text(row["category"], 74, y, 32, color=COLORS["blue"], weight=700,
                      tracking=1.2, field=f"match-{i}-category", max_width=620)
            self.text(row["home"], 74, y + 44, 39, weight=700, display=True,
                      field=f"match-{i}-home", max_width=610)
            self.text(row["away"], 74, y + 82, 32, color=COLORS["muted"],
                      field=f"match-{i}-away", max_width=610)
            self.text(row["score"], 1008, y + 57, 75, weight=700, display=True,
                      color=COLORS["blue"], anchor="end", tracking=-1.5,
                      field=f"match-{i}-score", max_width=285)
            if i < len(self.d["matches"]) - 1:
                self.rule(y + 111, COLORS["line"])

    def schedule(self):
        self.title(["LE WEEK-END.", "AU PROGRAMME."], self.d["edition"], 91)
        start = 567 + self.offset
        for i, row in enumerate(self.d["matches"]):
            y = start + i * 146
            self.text(row["day"], 72, y, 32, color=COLORS["blue"], weight=700,
                      field=f"match-{i}-day", max_width=120)
            self.text(row["category"], 72, y + 46, 34, weight=700, display=True,
                      field=f"match-{i}-category", max_width=130)
            self.text(row["opponent"], 249, y + 1, 40, weight=700, display=True,
                      field=f"match-{i}-opponent", max_width=530)
            self.text(row["venue"], 250, y + 46, 32,
                      field=f"match-{i}-venue", max_width=530)
            self.text(row["side"], 250, y + 85, 32, color=COLORS["blue"], weight=600,
                      tracking=.9, field=f"match-{i}-side", max_width=500)
            self.text(row["time"], 1008, y + 34, 49, weight=700, display=True,
                      anchor="end", field=f"match-{i}-time", max_width=205)
            if i < len(self.d["matches"]) - 1:
                self.rule(y + 112, COLORS["night"])

    def partner(self):
        self.title(["À NOS", "CÔTÉS."], "PARTENAIRE DU CLUB", 108)
        off = self.offset
        self.rule(538 + off, COLORS["line"])
        if self.d.get("logo"):
            self.image(self.d["logo"], 116, 590 + off, 848, 220, "partner-logo", True)
        else:
            self.lines(self.d["name"], 72, 665 + off, 100, 94, weight=700, display=True,
                       tracking=-1.5, field="partner-name", max_width=936)
        self.rule(838 + off, COLORS["line"])
        self.lines(self.d["contribution"], 72, 927 + off, 40, 52,
                   field="contribution", max_width=936)
        self.text(self.d["season"], 72, 1108 + off, 32, color=COLORS["blue"],
                  weight=600, field="season", max_width=936)

    def player(self):
        self.title(["PLAYER OF", "THE WEEK."], self.d["edition"], 105)
        off = self.offset
        self.text(self.d["category"], 74, 595 + off, 32, color=COLORS["sky"],
                  weight=600, tracking=1.5, field="category", max_width=936)
        if self.d.get("portrait"):
            self.image(self.d["portrait"], 640, 640 + off, 368, 365, "player-photo")
            name_width = 530
        else:
            self.text(self.d["number"], 1008, 916 + off, 348, color=COLORS["gold"],
                      weight=800, display=True, anchor="end", tracking=-10,
                      field="jersey-number", max_width=385)
            name_width = 530
        self.lines(self.d["name"], 72, 736 + off, 112, 108, weight=800, display=True,
                   tracking=-2.2, field="player-name", max_width=name_width)
        self.rule(1014 + off, COLORS["sky"])
        for i, stat in enumerate(self.d["stats"]):
            x = 72 + i * 324
            self.text(stat["value"], x, 1112 + off, 76, weight=700, display=True,
                      field=f"stat-{i}-value", max_width=285)
            self.text(stat["label"], x + 2, 1154 + off, 32, color=COLORS["sky"],
                      weight=600, tracking=1.2, field=f"stat-{i}-label", max_width=285)

    def official(self):
        self.title(["ANNONCE", "OFFICIELLE."], self.d["edition"], 104)
        off = self.offset
        self.lines(self.d["subject"], 72, 667 + off, 78, 80, display=True, weight=700,
                   color=COLORS["sky"], tracking=-1.1, field="subject", max_width=936)
        self.lines(self.d["body"], 72, 915 + off, 36, 54,
                   field="body", max_width=936)
        self.text(self.d["signature"], 72, 1138 + off, 32, color=COLORS["sky"],
                  weight=500, field="signature", max_width=936)

    def communication(self):
        self.title(["BON À", "SAVOIR."], self.d["edition"], 108)
        off = self.offset
        self.lines(self.d["subject"], 72, 659 + off, 74, 77, display=True, weight=700,
                   color=COLORS["blue"], tracking=-1, field="subject", max_width=936)
        self.rect(72, 820 + off, 936, 104, COLORS["blue"])
        self.text(self.d["when"], 106, 886 + off, 36, color=COLORS["white"],
                  weight=700, field="effective-date", max_width=866)
        self.lines(self.d["details"], 72, 997 + off, 38, 52,
                   field="details", max_width=936)
        self.text(self.d["note"], 72, 1148 + off, 28, color=COLORS["muted"],
                  field="note", max_width=936)

    def final_score(self):
        off = self.offset
        self.title(["SCORE FINAL."], self.d["edition"], 103)
        self.lines(self.d["home"], 72, 554 + off, 44, 54, display=True, weight=700,
                   field="home-name", max_width=400)
        self.lines(self.d["away"], 1008, 554 + off, 44, 54, display=True, weight=700,
                   anchor="end", field="away-name", max_width=400)
        self.text(self.d["homeScore"], 72, 851 + off, 238, display=True, weight=800,
                  tracking=-6, field="home-score", max_width=405)
        self.text("—", 540, 799 + off, 98, color=COLORS["gold"], display=True,
                  anchor="middle", weight=700, max_width=120)
        self.text(self.d["awayScore"], 1008, 851 + off, 238, display=True, weight=800,
                  tracking=-6, anchor="end", field="away-score", max_width=405)
        if self.d.get("photo"):
            self.image(self.d["photo"], 72, 907 + off, 936, 238, "match-photo")
            self.text(self.d.get("photoCaption", ""), 72, 1180 + off, 32,
                      color=COLORS["sky"], tracking=.5, field="photo-caption", max_width=936)
        else:
            self.rule(946 + off, COLORS["sky"])
            self.lines(self.d["closing"], 72, 1030 + off, 44, 52, display=True,
                       weight=600, color=COLORS["sky"], field="closing", max_width=936)

    def render(self):
        self.header()
        {"01-resultats": self.results, "02-programme": self.schedule,
         "03-partenaire": self.partner, "04-player-of-the-week": self.player,
         "05-annonce-officielle": self.official, "06-communication": self.communication,
         "07-score-final": self.final_score}[self.key]()
        self.footer()
        fonts = "".join(
            f"@font-face{{font-family:'{family}';font-style:normal;font-weight:{weight};src:url('{uri(ROOT / 'assets/fonts' / filename)}') format('truetype');}}"
            for family, weight, filename in [
                ("Kanit", "700", "Kanit-Bold.ttf"),
                ("Kanit", "800", "Kanit-ExtraBold.ttf"),
                ("DM Sans", "100 1000", "DM-Sans-Variable.ttf")])
        metadata = esc(json.dumps({"template": self.key, "mode": self.mode, "format": f"1080x{self.h}",
                                  "editableFields": self.field_ids}, ensure_ascii=False))
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="{self.h}" viewBox="0 0 1080 {self.h}" role="img" aria-labelledby="title desc">'
                f'<title id="title">UEB — {esc(NAMES[self.key])}</title>'
                f'<desc id="desc">{esc(self.d.get("alt", NAMES[self.key]))}</desc>'
                f'<metadata>{metadata}</metadata><defs><style>{fonts}text{{font-optical-sizing:auto;}}</style></defs>'
                + "\n".join(self.parts) + "</svg>\n")


def validate(key, d):
    if key not in NAMES:
        raise ValueError(f"Template inconnu : {key}")
    if key in ("01-resultats", "02-programme"):
        if not 1 <= len(d["matches"]) <= 4:
            raise ValueError("Prévoir de 1 à 4 matchs par visuel ; créer une seconde diapositive au-delà.")
    for name in ("name", "subject"):
        if name in d and len(d[name]) > 2:
            raise ValueError(f"{name} : deux lignes maximum, utiliser la légende pour le reste.")
    if key == "04-player-of-the-week" and len(d["stats"]) != 3:
        raise ValueError("Prévoir exactement trois repères pour le joueur.")
    if key == "05-annonce-officielle" and len(d["body"]) > 3:
        raise ValueError("Trois lignes de corps maximum ; joindre un texte séparé pour le communiqué complet.")
    if key == "06-communication" and len(d["details"]) > 2:
        raise ValueError("Deux lignes de détails maximum.")
    if key == "07-score-final":
        for side in ("home", "away"):
            if not 1 <= len(d[side]) <= 2:
                raise ValueError("Un nom d’équipe occupe une à deux lignes.")
        for score in ("homeScore", "awayScore"):
            val = str(d[score])
            if not (val.isdigit() and 0 <= int(val) <= 999) and val != "—":
                raise ValueError("Score : entier de 0 à 999, ou tiret pour le modèle vierge.")


def single(key, data, dest, mode):
    validate(key, data)
    dest.mkdir(parents=True, exist_ok=True)
    for story in (False, True):
        suffix = "story" if story else "feed"
        (dest / f"{key}-{suffix}.svg").write_text(Poster(key, data, story, mode).render())


def boards():
    cards = "".join(f'<figure><img src="../examples/{key}-feed.png" alt="{esc(name)}"><figcaption><b>{key[:2]}</b> {esc(name)}</figcaption></figure>' for key, name in NAMES.items())
    header = "UEB / SYSTÈME SOCIAL 01"
    style = """@font-face{font-family:DM;src:url('../assets/fonts/DM-Sans-Variable.ttf')}@font-face{font-family:Kanit;src:url('../assets/fonts/Kanit-ExtraBold.ttf')}*{box-sizing:border-box}body{margin:0;background:#e9edf3;color:#101e42;font:16px/1.5 DM,sans-serif}main{max-width:1760px;margin:auto;padding:72px 48px}header{display:flex;justify-content:space-between;align-items:end;margin-bottom:36px;border-bottom:1px solid #b5becc;padding-bottom:24px}h1{font:800 42px/1.05 Kanit;margin:0 0 14px;letter-spacing:-1px}p{margin:0;color:#526078;font-size:15px}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:30px 22px}figure{margin:0}figure img{display:block;width:100%;height:auto;box-shadow:0 9px 22px #101e4210}figcaption{font-size:14px;padding-top:12px}figcaption b{color:#3448a1;margin-right:8px}.manifesto{background:#101e42;color:white;padding:32px;display:flex;flex-direction:column;justify-content:space-between;aspect-ratio:4/5}.manifesto h2{font:800 41px/1.06 Kanit;letter-spacing:-.5px;margin:0}.manifesto p{color:#b6ddf5;font-size:15px}.manifesto .gold{color:#d8af69}.links{margin-top:38px;display:flex;gap:24px;flex-wrap:wrap}a{color:#3448a1;text-underline-offset:4px}@media(max-width:900px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}main{padding:32px 20px}header{display:block}.manifesto h2{font-size:32px}}@media(max-width:480px){.grid{grid-template-columns:1fr}h1{font-size:32px}}"""
    manifesto = '<div class="manifesto"><p>UNE MÊME FAMILLE.<br>SEPT RENDEZ-VOUS.</p><h2>DU JEU.<br>DU LIEN.<br><span class="gold">DE LA TENUE.</span></h2><p>Grille stable. Typographie forte.<br>Couleur mesurée. Place au club.</p><p>Proposition à revoir · v01<br>Les exemples sont fictifs.</p></div>'
    page = f'<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>UEB — Planche de direction sociale</title><style>{style}</style><main><header><div><h1>{header}</h1><p>Uccle Europe Basketball · Proposition de templates · Novembre 2026</p></div><p>Identité publique 2026<br>Exemples fictifs, hors diffusion</p></header><section class="grid">{cards}{manifesto}</section><nav class="links"><a href="../README.md">Mode d’emploi</a><a href="../BRIEF-CHATGPT.md">Brief ChatGPT</a><a href="../examples/07-score-final-story.png">Exemple story</a><a href="../assets/ueb-logo.svg">Blason officiel</a></nav></main></html>'
    (ROOT / "previews/index.html").write_text(page)
    (ROOT / "previews/stories.html").write_text(page.replace("-feed.png", "-story.png").replace("aspect-ratio:4/5", "aspect-ratio:9/16").replace("UEB / SYSTÈME SOCIAL 01", "UEB / DÉCLINAISONS STORY"))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, help="JSON complet d’un post de production")
    parser.add_argument("--out", type=Path, default=ROOT / "production")
    args = parser.parse_args()
    if args.data:
        d = json.loads(args.data.read_text())
        if d.get("demo", True):
            raise ValueError("Pour un post réel, renseigner demo=false après vérification des données.")
        def placeholders(v):
            if isinstance(v, str):
                return "[" in v or "À CONFIRMER" in v
            if isinstance(v, dict):
                return any(placeholders(x) for x in v.values())
            if isinstance(v, list):
                return any(placeholders(x) for x in v)
            return False
        if placeholders(d):
            raise ValueError("Des champs à compléter subsistent dans les données.")
        single(d["template"], d, args.out, "production")
        print(f"Deux SVG de production écrits dans {args.out}")
        return
    for key in NAMES:
        single(key, json.loads((ROOT / f"data/{key}-example.json").read_text()), ROOT / "examples", "example")
        single(key, json.loads((ROOT / f"data/{key}-template.json").read_text()), ROOT / "templates", "template")
    boards()
    files = sorted([*ROOT.glob("examples/*.svg"), *ROOT.glob("templates/*.svg")])
    manifest = {"version": "0.1", "status": "Proposition graphique à revoir", "count": len(files),
                "palette": COLORS, "files": [{"file": str(p.relative_to(ROOT)), "sha256": hashlib.sha256(p.read_bytes()).hexdigest()} for p in files]}
    (ROOT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(f"{len(files)} SVG générés : sept modèles et sept exemples, en feed et story.")


if __name__ == "__main__":
    main()
