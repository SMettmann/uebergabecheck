from pathlib import Path

path=Path('business/index.html')
html=path.read_text(encoding='utf-8')

replacements=[
    ('<div class="trial">14 Tage kostenlos testen · keine automatische Umwandlung</div>', '<div class="trial">14 Tage kostenlos testen · Inhaber + bis zu 10 Mitarbeiter inklusive · keine automatische Umwandlung</div>'),
    ('<div class="pricing-note">Danach nur bei aktiver Buchung 29,99 € / Monat<br>jederzeit zum Ende des Abrechnungszeitraums kündbar</div>', '<div class="pricing-note">Danach nur bei aktiver Buchung 29,99 € / Monat<br>Inhaber + bis zu 10 Mitarbeiter inklusive · jederzeit zum Ende des Abrechnungszeitraums kündbar</div>'),
    ('<li>Eigener Firmenbriefkopf</li>\n      <li>Gespeicherte vergangene Übergaben</li>', '<li>Eigener Firmenbriefkopf</li>\n      <li>Teamverwaltung mit Inhaber-, Admin- &amp; Mitarbeiterrollen</li>\n      <li>Bis zu 10 Mitarbeiter zusätzlich zum Inhaber</li>\n      <li>Gespeicherte vergangene Übergaben</li>'),
]

for old,new in replacements:
    if old not in html:
        raise SystemExit(f'Pattern missing: {old[:80]}')
    html=html.replace(old,new,1)

path.write_text(html,encoding='utf-8')
print('Updated public Business team pricing')
