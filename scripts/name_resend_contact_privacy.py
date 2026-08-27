from pathlib import Path
p=Path('business/index.html')
s=p.read_text(encoding='utf-8')
old='Für die technische E-Mail-Übermittlung wird der von uns eingesetzte E-Mail-Dienst genutzt.'
new='Für die technische Übermittlung der Kontaktanfrage nutzen wir <strong>Resend (Plus Five Five, Inc., USA)</strong>. Für Übermittlungen in die USA stützt Resend seine Datenschutzunterlagen unter anderem auf das EU-U.S. Data Privacy Framework und Standardvertragsklauseln.'
if old not in s: raise SystemExit('privacy anchor not found')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
