from pathlib import Path

p=Path('business/index.html')
s=p.read_text(encoding='utf-8')

def rep(old,new,count=1):
    global s
    if old not in s:
        raise SystemExit('Anchor not found: '+old[:240])
    s=s.replace(old,new,count)

rep(
'<div class="pill">FÜR VERMIETER, HAUSVERWALTUNGEN & UNTERNEHMEN</div>',
'<div class="pill">AUSSCHLIESSLICH FÜR UNTERNEHMER · § 14 BGB</div>'
)
rep(
'<p class="lead">Objekte, Wohnungen, Übergaben und Mängel zentral verwalten. ÜbergabeCheck Business verbindet die digitale Dokumentation mit einer übersichtlichen Verwaltungsoberfläche.</p>',
'<p class="lead">Objekte, Wohnungen, Übergaben und Mängel zentral verwalten. ÜbergabeCheck Business verbindet die digitale Dokumentation mit einer übersichtlichen Verwaltungsoberfläche und richtet sich ausschließlich an Unternehmer im Sinne des § 14 BGB.</p>'
)
rep(
'<div class="trial">14 Tage kostenlos testen</div>',
'<div class="trial">14 Tage kostenlos testen · keine automatische Umwandlung</div>'
)
rep(
'<div class="pricing-note">Danach 29,99 € monatlich<br>jederzeit kündbar</div>',
'<div class="pricing-note">Danach nur bei aktiver Buchung 29,99 € / Monat<br>jederzeit zum Ende des Abrechnungszeitraums kündbar</div>'
)
rep(
'<div class="footer">ÜbergabeCheck Business · <a onclick="openLegal(\'impressum\')">Impressum</a> · <a onclick="openLegal(\'datenschutz\')">Datenschutz</a> · <a href="mailto:info@uebergabe-check.de">info@uebergabe-check.de</a></div>',
'<div class="footer">ÜbergabeCheck Business · <a href="app.html#impressum">Impressum</a> · <a href="app.html#datenschutz">Datenschutz</a> · <a href="app.html#agb">AGB</a> · <a href="app.html#avv">AVV</a> · <a href="mailto:info@uebergabe-check.de">info@uebergabe-check.de</a></div>'
)

# The local landing privacy text remains as fallback if directly invoked, but make clear the canonical Business privacy notice is in the app.
rep(
'<div class="legal-head"><h2 id="datenschutzTitle">Datenschutzerklärung</h2><button class="legal-close" type="button" onclick="closeLegal(\'datenschutz\')">Schließen</button></div>\n    <p><strong>Stand: August 2026</strong></p>',
'<div class="legal-head"><h2 id="datenschutzTitle">Datenschutzerklärung – Business-Startseite</h2><button class="legal-close" type="button" onclick="closeLegal(\'datenschutz\')">Schließen</button></div>\n    <p><strong>Stand: 27. August 2026</strong></p>\n    <p>Für Registrierung, Business-Anwendung, Vertragsabwicklung, Stripe, Supabase und weitere dort eingesetzte Dienste gilt die ausführliche <a href="app.html#datenschutz">Datenschutzerklärung von ÜbergabeCheck Business</a>.</p>'
)

p.write_text(s,encoding='utf-8')
