/* UEBERGABECHECK_VISITOR_TRACKING_V1 */
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

(function(){
  const SUPABASE_URL="https://fkirkglhcpltxlcsozmd.supabase.co";
  const SUPABASE_KEY="sb_publishable_lNeX7Hrtp9-FFl3NVb_Gaw_O-21yXWr";
  const COMPLETION_FLAG="uebergabecheck_private_completion_recorded_v2";
  let recording=false;

  function resetPrivateCompletion(){
    try{sessionStorage.removeItem(COMPLETION_FLAG);}catch(e){}
    recording=false;
  }

  function alreadyRecorded(){
    try{return sessionStorage.getItem(COMPLETION_FLAG)==="1";}catch(e){return false;}
  }

  function markRecorded(){
    try{sessionStorage.setItem(COMPLETION_FLAG,"1");}catch(e){}
  }

  function recordPrivateCompletion(){
    if(recording||alreadyRecorded())return;
    recording=true;
    fetch(`${SUPABASE_URL}/rest/v1/private_completion_events`,{
      method:"POST",
      headers:{
        apikey:SUPABASE_KEY,
        Authorization:`Bearer ${SUPABASE_KEY}`,
        "Content-Type":"application/json",
        Prefer:"return=minimal"
      },
      body:JSON.stringify({source:"private"}),
      keepalive:true
    }).then(response=>{
      if(response.ok)markRecorded();
      recording=false;
    }).catch(()=>{recording=false;});
  }

  function installPrivateCompletionTracking(){
    if(typeof window.showSummary==="function"&&!window.showSummary.__ucPrivateTracked){
      const originalShowSummary=window.showSummary;
      const wrappedShowSummary=function(...args){
        const result=originalShowSummary.apply(this,args);
        recordPrivateCompletion();
        return result;
      };
      wrappedShowSummary.__ucPrivateTracked=true;
      window.showSummary=wrappedShowSummary;
    }

    if(typeof window.newTransfer==="function"&&!window.newTransfer.__ucPrivateTracked){
      const originalNewTransfer=window.newTransfer;
      const wrappedNewTransfer=function(...args){resetPrivateCompletion();return originalNewTransfer.apply(this,args);};
      wrappedNewTransfer.__ucPrivateTracked=true;
      window.newTransfer=wrappedNewTransfer;
    }

    const startButton=document.querySelector(".landing-button");
    if(startButton&&!startButton.dataset.privateCompletionReset){
      startButton.addEventListener("click",resetPrivateCompletion);
      startButton.dataset.privateCompletionReset="1";
    }
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",installPrivateCompletionTracking,{once:true});
  else installPrivateCompletionTracking();
  window.addEventListener("load",installPrivateCompletionTracking,{once:true});
})();

(function(){
  const ADS_CONFIG={
    enabled:false,
    client:"ca-pub-3457702577665056",
    landingSlot:"",
    resultSlot:""
  };

  const CHECK24_CONFIG={
    clickUrl:"https://www.awin1.com/cread.php?s=2126222&v=9364&q=332953&r=3068167",
    imageUrl:"https://www.awin1.com/cshow.php?s=2126222&v=9364&q=332953&r=3068167",
    alt:"Stromanbieter über CHECK24 vergleichen"
  };

  let adsenseLoaded=false;

  function loadAdSense(){
    if(!ADS_CONFIG.enabled||!ADS_CONFIG.client||adsenseLoaded) return;
    if(document.querySelector('script[data-uebergabecheck-adsense]')){adsenseLoaded=true;return;}
    const script=document.createElement("script");
    script.async=true;
    script.crossOrigin="anonymous";
    script.src=`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADS_CONFIG.client)}`;
    script.dataset.uebergabecheckAdsense="1";
    document.head.appendChild(script);
    adsenseLoaded=true;
  }

  function createAdZone(slot,name){
    const zone=document.createElement("div");
    zone.className="uc-ad-zone no-print";
    zone.dataset.adPosition=name;

    const label=document.createElement("span");
    label.className="uc-ad-label";
    label.textContent="Werbung";

    const holder=document.createElement("div");
    holder.className="uc-ad-slot";

    if(ADS_CONFIG.enabled&&ADS_CONFIG.client&&slot){
      const ins=document.createElement("ins");
      ins.className="adsbygoogle";
      ins.style.display="block";
      ins.dataset.adClient=ADS_CONFIG.client;
      ins.dataset.adSlot=slot;
      ins.dataset.adFormat="auto";
      ins.dataset.fullWidthResponsive="true";
      holder.appendChild(ins);
      zone.append(label,holder);
      setTimeout(()=>{
        try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){console.warn("AdSense konnte nicht geladen werden",e);}
      },0);
      return zone;
    }

    zone.hidden=true;
    zone.append(label,holder);
    return zone;
  }

  function createCheck24Promo(position="result"){
    const zone=document.createElement("aside");
    zone.className="uc-ad-zone no-print";
    zone.dataset.partner="check24";
    zone.dataset.partnerPosition=position;

    const label=document.createElement("span");
    label.className="uc-ad-label";
    label.textContent="Werbung · Partnerlink";

    const holder=document.createElement("div");
    holder.className="uc-ad-slot";
    holder.style.minHeight="0";
    holder.style.background="transparent";

    const link=document.createElement("a");
    link.href=CHECK24_CONFIG.clickUrl;
    link.target="_blank";
    link.rel="sponsored noopener noreferrer";
    link.setAttribute("aria-label",CHECK24_CONFIG.alt);
    link.style.display="inline-block";
    link.style.maxWidth="100%";
    link.addEventListener("click",()=>{
      try{if(window.umami)window.umami.track(position==="landing"?"CHECK24 Startseite geklickt":"CHECK24 Strom geklickt");}catch(e){}
    });

    const image=document.createElement("img");
    image.src=CHECK24_CONFIG.imageUrl;
    image.alt=CHECK24_CONFIG.alt;
    image.loading="lazy";
    image.decoding="async";
    image.style.display="block";
    image.style.maxWidth="100%";
    image.style.height="auto";
    image.style.border="0";

    link.appendChild(image);
    holder.appendChild(link);
    zone.append(label,holder);
    return zone;
  }

  function createBusinessPromo(){
    const promo=document.createElement("aside");
    promo.className="uc-business-promo no-print";
    promo.innerHTML=`
      <div class="uc-business-promo-copy">
        <span class="uc-business-promo-kicker">Gerade eine Übergabe abgeschlossen?</span>
        <strong>Machst du das regelmäßig? Dann musst du beim nächsten Mal nicht wieder von vorn anfangen.</strong>
        <p>Mit ÜbergabeCheck Business bleiben Objekte, Wohnungen, Übergaben, Fotos und Mängel gespeichert und jederzeit wieder verfügbar.</p>
        <ul class="uc-business-promo-benefits">
          <li>Wohnungen einmal anlegen</li>
          <li>Vergangene Übergaben wieder öffnen</li>
          <li>Mängel &amp; Fotos dauerhaft wiederfinden</li>
          <li>Gemeinsam im Team arbeiten</li>
        </ul>
        <span class="uc-business-promo-trial">14 Tage kostenlos testen · keine automatische Verlängerung</span>
      </div>
      <a href="/business/">Business 14 Tage gratis testen →</a>`;
    const link=promo.querySelector("a");
    if(link) link.addEventListener("click",()=>{
      try{if(window.umami)window.umami.track("Business nach Übergabe geklickt");}catch(e){}
    });
    return promo;
  }

  function createBusinessEntry(){
    const entry=document.createElement("aside");
    entry.className="uc-business-entry no-print";
    entry.innerHTML=`
      <div class="uc-business-entry-copy">
        <span class="uc-business-entry-badge">BUSINESS · 14 TAGE GRATIS</span>
        <strong>Machst du Wohnungsübergaben regelmäßig?</strong>
        <p>Dann ist Business für dich: Wohnungen und Objekte einmal anlegen, Übergaben dauerhaft speichern, später wieder öffnen und gemeinsam im Team verwalten.</p>
        <div class="uc-business-entry-compare">
          <div><b>KOSTENLOS</b><span>Für eine einzelne Wohnungsübergabe.</span></div>
          <div><b>BUSINESS</b><span>Speichern · Historie · Objektverwaltung · Team.</span></div>
        </div>
        <span class="uc-business-entry-trial">✓ 14 Tage kostenlos · keine automatische Verlängerung</span>
      </div>
      <a href="/business/">14 Tage gratis testen →</a>`;
    const link=entry.querySelector("a");
    if(link) link.addEventListener("click",()=>{
      try{if(window.umami)window.umami.track("Business Startseite geklickt");}catch(e){}
    });
    return entry;
  }

  function updatePrivacyForCurrentHostingAndAds(){
    const overlay=document.getElementById("datenschutzOverlay");
    if(!overlay||overlay.dataset.stratoAdsPrivacyUpdated==="1") return;

    const headings=[...overlay.querySelectorAll("h3")];
    const hostingHeading=headings.find(h=>h.textContent.trim()==="5. Hosting durch GitHub Pages");
    if(hostingHeading){
      hostingHeading.textContent="5. Hosting durch STRATO";
      const paragraph=hostingHeading.nextElementSibling;
      if(paragraph&&paragraph.tagName==="P"){
        paragraph.innerHTML="Diese Website wird über <strong>STRATO</strong> bereitgestellt. Beim Aufruf der Website können technisch notwendige Verbindungsdaten wie insbesondere IP-Adresse, Zeitpunkt des Zugriffs, aufgerufene Ressource sowie Browser- und Geräteinformationen durch den Hostinganbieter verarbeitet werden. Dies dient der sicheren und zuverlässigen Bereitstellung der Website.";
      }
    }

    const legalHeading=headings.find(h=>h.textContent.trim()==="6. Rechtsgrundlage");
    if(legalHeading){
      const affiliateHeading=document.createElement("h3");
      affiliateHeading.textContent="6. Partnerwerbung über Awin / CHECK24";
      const affiliateParagraph=document.createElement("p");
      affiliateParagraph.innerHTML="Auf der Startseite und am Ende des erstellten Übergabeprotokolls zeigen wir ein als Werbung gekennzeichnetes <strong>CHECK24-Partnerangebot</strong> über das Affiliate-Netzwerk <strong>Awin</strong>. Das Werbemittel wird von awin1.com geladen. Dabei können technisch notwendige Verbindungsdaten wie insbesondere IP-Adresse, Zeitpunkt des Abrufs sowie Browser- und Geräteinformationen an Awin übermittelt werden. Bei einem Klick erfolgt die Weiterleitung über Awin zu CHECK24. Kommt anschließend ein vergüteter Abschluss zustande, kann dieser über das Affiliate-Tracking ÜbergabeCheck zugeordnet werden; wir können hierfür eine Provision erhalten.";

      const adsHeading=document.createElement("h3");
      adsHeading.textContent="7. Google AdSense und Consent Management";
      const adsParagraph=document.createElement("p");
      adsParagraph.innerHTML="Die kostenlose Version von ÜbergabeCheck ist technisch für die spätere Einbindung von <strong>Google AdSense</strong> vorbereitet. Google-AdSense-Anzeigen sind derzeit nicht aktiviert. Nach einer späteren Aktivierung können durch Google – abhängig von deiner Einwilligung und den gewählten Einstellungen – unter anderem Geräte- und Browserinformationen, IP-Adresse sowie Werbe- und Consent-Informationen verarbeitet werden. Für Nutzer im Europäischen Wirtschaftsraum, im Vereinigten Königreich und in der Schweiz wird bei einer Aktivierung eine von Google zertifizierte Consent-Management-Plattform (CMP) eingesetzt.";

      legalHeading.before(affiliateHeading,affiliateParagraph,adsHeading,adsParagraph);
      legalHeading.textContent="8. Rechtsgrundlage";
    }

    const rightsHeading=headings.find(h=>h.textContent.trim()==="7. Deine Rechte");
    if(rightsHeading) rightsHeading.textContent="9. Deine Rechte";
    const changesHeading=headings.find(h=>h.textContent.trim()==="8. Änderungen");
    if(changesHeading) changesHeading.textContent="10. Änderungen";

    const notice=overlay.querySelector("p.notice");
    if(notice){
      notice.textContent="Hinweis: Diese Datenschutzerklärung beschreibt den aktuellen technischen Stand der Anwendung einschließlich der CHECK24-Partnerwerbung über Awin. Google AdSense ist technisch vorbereitet, derzeit aber nicht aktiviert. Bei Änderungen am Hosting, Analytics oder weiteren Diensten wird die Datenschutzerklärung entsprechend angepasst. Sie ersetzt keine individuelle rechtliche Prüfung.";
    }

    overlay.dataset.stratoAdsPrivacyUpdated="1";
  }

  function returnPrivateAppToHome(){
    const landing=document.getElementById("landing");
    const app=document.getElementById("appContent");
    if(!landing||!app) return;

    document.querySelectorAll('[id^="step"]').forEach(step=>step.classList.add("hidden"));
    app.classList.add("hidden");
    app.style.display="none";
    landing.classList.remove("hidden");
    landing.style.display="";
    document.documentElement.scrollTop=0;
    document.body.scrollTop=0;
    window.scrollTo(0,0);
  }

  function makeHomeButton(){
    const button=document.createElement("button");
    button.type="button";
    button.className="secondary no-print private-home-button";
    button.textContent="\u2190 Zur\u00fcck zur Startseite";
    button.dataset.privateHomeButton="1";
    button.addEventListener("click",returnPrivateAppToHome);
    return button;
  }

  function installPrivateHomeButtons(){
    [1,2,3,4,5].forEach(stepNo=>{
      const step=document.getElementById(`step${stepNo}`);
      const actions=step?.querySelector(".actions");
      if(!step||!actions) return;

      if(stepNo===1){
        const oldNewTransfer=[...actions.querySelectorAll("button")].find(btn=>btn.getAttribute("onclick")==="newTransfer()");
        if(oldNewTransfer){
          const home=makeHomeButton();
          oldNewTransfer.replaceWith(home);
        }else if(!actions.querySelector('[data-private-home-button="1"]')){
          actions.insertBefore(makeHomeButton(),actions.firstChild);
        }
        return;
      }

      if(actions.querySelector('[data-private-home-button="1"]')) return;

      const existingBack=[...actions.children].find(el=>el.tagName==="BUTTON"&&el.textContent.trim()==="Zurück");
      const leftGroup=document.createElement("div");
      leftGroup.className="private-nav-left no-print";
      leftGroup.style.display="flex";
      leftGroup.style.gap="10px";
      leftGroup.style.flexWrap="wrap";
      leftGroup.style.alignItems="center";

      if(existingBack){
        actions.insertBefore(leftGroup,existingBack);
        leftGroup.appendChild(existingBack);
      }else{
        actions.insertBefore(leftGroup,actions.firstChild);
      }
      leftGroup.appendChild(makeHomeButton());
    });
  }

  function mountCheck24Result(){
    const step5=document.getElementById("step5");
    if(!step5||step5.classList.contains("hidden")) return;

    const actions=step5.querySelector(".actions.no-print");
    if(!actions) return;

    let business=document.querySelector(".uc-business-promo");
    if(!business){
      business=createBusinessPromo();
      actions.insertAdjacentElement("afterend",business);
    }

    let partner=document.querySelector('[data-partner="check24"][data-partner-position="result"]');
    if(!partner){
      partner=createCheck24Promo("result");
      business.insertAdjacentElement("afterend",partner);
    }
  }

  function observeResultStep(){
    const step5=document.getElementById("step5");
    if(!step5) return;

    if(step5.dataset.check24Observer!=="1"){
      const observer=new MutationObserver(mountCheck24Result);
      observer.observe(step5,{attributes:true,attributeFilter:["class"]});
      step5.dataset.check24Observer="1";
    }
    mountCheck24Result();
  }

  function mountExtras(){
    try{installPrivateHomeButtons();}catch(e){console.error("Home-Buttons konnten nicht eingebaut werden",e);}

    try{updatePrivacyForCurrentHostingAndAds();}catch(e){console.warn("Datenschutz-Anpassung fehlgeschlagen",e);}
    try{loadAdSense();}catch(e){console.warn("AdSense-Initialisierung fehlgeschlagen",e);}

    try{
      const landingButton=document.querySelector(".landing-button");
      if(landingButton&&!document.querySelector(".uc-business-entry")){
        landingButton.insertAdjacentElement("afterend",createBusinessEntry());
      }

      const features=document.querySelector(".landing-features");
      if(features&&!document.querySelector('[data-partner="check24"][data-partner-position="landing"]')){
        features.insertAdjacentElement("afterend",createCheck24Promo("landing"));
      }
      if(features&&!document.querySelector('[data-ad-position="landing"]')){
        features.insertAdjacentElement("afterend",createAdZone(ADS_CONFIG.landingSlot,"landing"));
      }

      const oldResultAd=document.querySelector('[data-ad-position="result"]');
      if(oldResultAd) oldResultAd.remove();
      observeResultStep();
    }catch(e){console.warn("Zusatzinhalte konnten nicht vollständig eingebaut werden",e);}
  }

  function mountReliably(){
    mountExtras();
    setTimeout(mountExtras,50);
    setTimeout(mountExtras,500);
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",mountReliably,{once:true});
  }else{
    mountReliably();
  }
  window.addEventListener("load",mountExtras,{once:true});

  window.UebergabeCheckAds={
    config:ADS_CONFIG,
    check24:CHECK24_CONFIG,
    mount:mountExtras,
    installHomeButtons:installPrivateHomeButtons,
    mountCheck24Result
  };
})();