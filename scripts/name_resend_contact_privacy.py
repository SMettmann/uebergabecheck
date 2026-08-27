from pathlib import Path
p=Path('business/index.html')
s=p.read_text(encoding='utf-8')
old='Die technische E-Mail-Übermittlung erfolgt über den hierfür eingesetzten E-Mail-Dienst.'
new='Für die technische Übermittlung der Kontaktanfrage nutzen wir <strong>Resend (Plus Five Five, Inc., USA)</strong>. Für Übermittlungen in die USA stützt Resend seine Datenschutzunterlagen unter anderem auf das EU-U.S. Data Privacy Framework und Standardvertragsklauseln.'
if old not in s: raise SystemExit('privacy anchor not found')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
