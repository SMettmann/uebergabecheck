from pathlib import Path

p=Path('business/index.html')
s=p.read_text(encoding='utf-8')

def rep(old,new,count=1):
    global s
    if old not in s:
        raise SystemExit('Anchor not found: '+old[:180])
    s=s.replace(old,new,count)

# Styles
css_anchor='.footer{text-align:center;color:#888;font-size:12px;margin-top:32px}.footer a{color:inherit;text-decoration:underline;cursor:pointer}'
css_new=css_anchor+'.contact{margin-top:26px;background:#fff;border:1px solid #e2e3e6;border-radius:24px;padding:34px}.contact h2{font-size:28px;margin:0 0 8px}.contact>p{color:#666;line-height:1.6;margin:0 0 22px}.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.contact label{display:block;font-size:12px;font-weight:800;margin:0 0 6px}.contact input,.contact textarea{width:100%;padding:13px 14px;border:1px solid #d8d9dd;border-radius:12px;font:inherit;background:#fff}.contact textarea{min-height:140px;resize:vertical}.contact-full{grid-column:1/-1}.contact-actions{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:16px}.contact-status{font-size:13px;color:#666}.contact-status.ok{color:#18743a}.contact-status.error{color:#a11}.contact-hp{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;overflow:hidden!important}'
rep(css_anchor,css_new)
rep('@media(max-width:560px){.pricing{padding:24px 18px}', '@media(max-width:560px){.contact{padding:24px 18px}.contact-grid{grid-template-columns:1fr}.pricing{padding:24px 18px}')

# CTA goes to actual contact form
rep('<a class="btn secondary" href="mailto:info@uebergabe-check.de?subject=Interesse%20an%20%C3%9CbergabeCheck%20Business">Kontakt aufnehmen</a>', '<a class="btn secondary" href="#kontakt">Kontakt aufnehmen</a>')

# Contact section before footer
footer_anchor='''  <div class="footer">ÜbergabeCheck Business · <a href="app.html#impressum">Impressum</a> · <a href="app.html#datenschutz">Datenschutz</a> · <a href="app.html#agb">AGB</a> · <a href="app.html#avv">AVV</a> · <a href="mailto:info@uebergabe-check.de">info@uebergabe-check.de</a></div>'''
contact='''  <section class="contact" id="kontakt">
    <h2>Kontakt</h2>
    <p>Fragen zu ÜbergabeCheck Business? Schreib uns direkt über das Kontaktformular. Wir antworten an die von dir angegebene E-Mail-Adresse.</p>
    <form id="businessContactForm" onsubmit="sendBusinessContact(event)">
      <div class="contact-grid">
        <div><label for="contactName">Name *</label><input id="contactName" name="name" maxlength="120" autocomplete="name" required></div>
        <div><label for="contactCompany">Unternehmen</label><input id="contactCompany" name="company" maxlength="160" autocomplete="organization"></div>
        <div class="contact-full"><label for="contactEmail">E-Mail-Adresse *</label><input id="contactEmail" name="email" type="email" maxlength="254" autocomplete="email" required></div>
        <div class="contact-full"><label for="contactMessage">Nachricht *</label><textarea id="contactMessage" name="message" maxlength="5000" minlength="10" required></textarea></div>
        <div class="contact-hp" aria-hidden="true"><label for="contactWebsite">Website</label><input id="contactWebsite" name="website" tabindex="-1" autocomplete="off"></div>
      </div>
      <div class="contact-actions"><button class="btn primary" id="contactSubmit" type="submit">Nachricht senden →</button><span class="contact-status" id="contactStatus" aria-live="polite"></span></div>
      <p class="pricing-note" style="margin-top:12px">Mit dem Absenden werden deine Angaben ausschließlich zur Bearbeitung deiner Anfrage verarbeitet. Details findest du in der <a href="app.html#datenschutz">Datenschutzerklärung</a>.</p>
    </form>
  </section>

'''+footer_anchor
rep(footer_anchor,contact)

# Impressum: direct additional communication channel
rep('<p>E-Mail: <a href="mailto:info@uebergabe-check.de">info@uebergabe-check.de</a></p>', '<p>E-Mail: <a href="mailto:info@uebergabe-check.de">info@uebergabe-check.de</a><br>Kontaktformular: <a href="#kontakt" onclick="closeLegal(\'impressum\')">direkt online schreiben</a></p>')

# Landing privacy: add contact form disclosure before rights
privacy_anchor='<h3>8. Deine Rechte</h3>'
privacy_new='''<h3>8. Kontaktformular</h3>
    <p>Wenn du das Kontaktformular nutzt, verarbeiten wir deinen Namen, deine E-Mail-Adresse, optional dein Unternehmen und den Inhalt deiner Nachricht, um deine Anfrage zu bearbeiten und zu beantworten. Die Verarbeitung erfolgt je nach Inhalt der Anfrage zur Durchführung vorvertraglicher oder vertraglicher Maßnahmen gemäß Art. 6 Abs. 1 lit. b DSGVO oder auf Grundlage unseres berechtigten Interesses an der Bearbeitung geschäftlicher Anfragen gemäß Art. 6 Abs. 1 lit. f DSGVO. Für die technische E-Mail-Übermittlung wird der von uns eingesetzte E-Mail-Dienst genutzt. Anfragen werden nur so lange gespeichert, wie dies für Bearbeitung, Nachweis und gegebenenfalls gesetzliche Aufbewahrungspflichten erforderlich ist.</p>
    <h3>9. Deine Rechte</h3>'''
rep(privacy_anchor,privacy_new)
rep('<h3>9. Änderungen</h3>', '<h3>10. Änderungen</h3>')

# Submit logic before existing openLegal function
script_anchor='<script>\nfunction openLegal(type){'
script_new='''<script>
const CONTACT_ENDPOINT="https://fkirkglhcpltxlcsozmd.supabase.co/functions/v1/contact-message";
async function sendBusinessContact(event){
  event.preventDefault();
  const form=event.currentTarget;
  const button=document.getElementById('contactSubmit');
  const status=document.getElementById('contactStatus');
  if(button){button.disabled=true;button.textContent='Wird gesendet …';}
  if(status){status.className='contact-status';status.textContent='';}
  try{
    const fd=new FormData(form);
    const response=await fetch(CONTACT_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:fd.get('name'),company:fd.get('company'),email:fd.get('email'),message:fd.get('message'),website:fd.get('website')})});
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data?.error||'Nachricht konnte nicht gesendet werden.');
    form.reset();
    if(status){status.className='contact-status ok';status.textContent='Danke! Deine Nachricht wurde gesendet.';}
  }catch(error){
    if(status){status.className='contact-status error';status.textContent=error?.message||'Nachricht konnte gerade nicht gesendet werden.';}
  }finally{
    if(button){button.disabled=false;button.textContent='Nachricht senden →';}
  }
}
function openLegal(type){'''
rep(script_anchor,script_new)

p.write_text(s,encoding='utf-8')
