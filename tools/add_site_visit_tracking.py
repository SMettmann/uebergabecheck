from pathlib import Path

ADS = Path("ads.js")
INDEX = Path("index.html")
MARKER = "UEBERGABECHECK_VISITOR_TRACKING_V1"

ads = ADS.read_text(encoding="utf-8")
if MARKER not in ads:
    tracking = r'''/* UEBERGABECHECK_VISITOR_TRACKING_V1 */
(function(){
  const SUPABASE_URL="https://fkirkglhcpltxlcsozmd.supabase.co";
  const SUPABASE_KEY="sb_publishable_lNeX7Hrtp9-FFl3NVb_Gaw_O-21yXWr";
  const VISIT_FLAG="uebergabecheck_site_visit_recorded_v1";

  function recordSiteVisit(){
    try{if(sessionStorage.getItem(VISIT_FLAG)==="1")return;}catch(e){}
    const path=((location.pathname||"/").slice(0,200)||"/");
    fetch(`${SUPABASE_URL}/rest/v1/site_visit_events`,{
      method:"POST",
      headers:{
        apikey:SUPABASE_KEY,
        Authorization:`Bearer ${SUPABASE_KEY}`,
        "Content-Type":"application/json",
        Prefer:"return=minimal"
      },
      body:JSON.stringify({source:"website",path}),
      keepalive:true
    }).then(response=>{
      if(response.ok){
        try{sessionStorage.setItem(VISIT_FLAG,"1");}catch(e){}
      }
    }).catch(()=>{});
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",recordSiteVisit,{once:true});
  else recordSiteVisit();
})();

'''
    ads = tracking + ads
    ADS.write_text(ads, encoding="utf-8")

index = INDEX.read_text(encoding="utf-8")
privacy_note = '<p><strong>Interne Besuchszählung:</strong> Zusätzlich zählt ÜbergabeCheck anonyme Website-Besuche über die technische Infrastruktur von Supabase. Dabei werden keine Inhalte des Übergabeprotokolls, Namen, Adressen, Fotos oder Unterschriften gespeichert. Zur Vermeidung mehrfacher Zählungen beim Neuladen wird für die Dauer der Browser-Sitzung lediglich ein technischer Session-Marker im Browser gesetzt. In der Besuchsstatistik werden nur Zeitpunkt und aufgerufener Pfad gespeichert.</p>'
if "Interne Besuchszählung:" not in index:
    needle = '<h3>5. Hosting durch GitHub Pages</h3>'
    if needle not in index:
        raise SystemExit("Privacy insertion point not found")
    index = index.replace(needle, privacy_note + needle, 1)

# Cache-Busting für die aktuellen Business-Styles und -Skripte.
index = index.replace('ads.css?v=3', 'ads.css?v=10')
index = index.replace('ads.js?v=3', 'ads.js?v=10')
index = index.replace('ads.js?v=4', 'ads.js?v=10')
INDEX.write_text(index, encoding="utf-8")
