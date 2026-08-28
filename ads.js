(function(){
  const ADS_CONFIG={
    enabled:false,
    client:"ca-pub-3457702577665056",
    landingSlot:"",
    resultSlot:""
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

  function createBusinessPromo(){
    const promo=document.createElement("aside");
    promo.className="uc-business-promo no-print";
    promo.innerHTML=`
      <div class="uc-business-promo-copy">
        <span class="uc-business-promo-kicker">ÜbergabeCheck Business</span>
        <strong>Übergaben regelmäßig durchführen?</strong>
        <p>Objekte, Wohnungen, Übergaben und Mängel zentral verwalten – für Vermieter, Hausverwaltungen und Unternehmen.</p>
      </div>
      <a href="/business/">Business ansehen →</a>`;
    return promo;
  }

  function createBusinessEntry(){
    const entry=document.createElement("aside");
    entry.className="uc-business-entry no-print";
    entry.innerHTML=`
      <div class="uc-business-entry-copy">
        <span class="uc-business-entry-badge">BUSINESS</span>
        <strong>ÜbergabeCheck für Unternehmen</strong>
        <p>Mehrere Objekte, Wohnungen, Übergaben und Mängel zentral verwalten – mit der Business-Version von ÜbergabeCheck.</p>
      </div>
      <a href="/business/">Zur Business-Version →</a>`;
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
      const adsHeading=document.createElement("h3");
      adsHeading.textContent="6. Google AdSense und Consent Management";
      const adsParagraph=document.createElement("p");
      adsParagraph.innerHTML="Die kostenlose Version von ÜbergabeCheck ist technisch für die spätere Einbindung von <strong>Google AdSense</strong> vorbereitet. Anzeigen sind derzeit noch nicht aktiviert. Nach einer Freigabe und Aktivierung können durch Google – abhängig von deiner Einwilligung und den gewählten Einstellungen – unter anderem Geräte- und Browserinformationen, IP-Adresse sowie Werbe- und Consent-Informationen verarbeitet werden. Für Nutzer im Europäischen Wirtschaftsraum, im Vereinigten Königreich und in der Schweiz wird eine von Google zertifizierte Consent-Management-Plattform (CMP) eingesetzt. Dort kann die Einwilligung erteilt, abgelehnt oder über die Optionen verwaltet werden.";
      legalHeading.before(adsHeading,adsParagraph);
      legalHeading.textContent="7. Rechtsgrundlage";
    }

    const rightsHeading=headings.find(h=>h.textContent.trim()==="7. Deine Rechte");
    if(rightsHeading) rightsHeading.textContent="8. Deine Rechte";
    const changesHeading=headings.find(h=>h.textContent.trim()==="8. Änderungen");
    if(changesHeading) changesHeading.textContent="9. Änderungen";

    const notice=overlay.querySelector("p.notice");
    if(notice){
      notice.textContent="Hinweis: Diese Datenschutzerklärung beschreibt den aktuellen technischen Stand der Anwendung. Bei Aktivierung von Google AdSense, Änderungen am Hosting, Analytics oder weiteren Diensten wird sie entsprechend angepasst. Sie ersetzt keine individuelle rechtliche Prüfung.";
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
      if(features&&!document.querySelector('[data-ad-position="landing"]')){
        features.insertAdjacentElement("afterend",createAdZone(ADS_CONFIG.landingSlot,"landing"));
      }

      const step5=document.getElementById("step5");
      const actions=step5?.querySelector(".actions.no-print");
      if(actions&&!document.querySelector('[data-ad-position="result"]')){
        const resultAd=createAdZone(ADS_CONFIG.resultSlot,"result");
        actions.insertAdjacentElement("afterend",resultAd);
        resultAd.insertAdjacentElement("afterend",createBusinessPromo());
      }
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
    mount:mountExtras,
    installHomeButtons:installPrivateHomeButtons
  };
})();
