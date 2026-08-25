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
    const link=document.createElement("a");
    link.className="uc-business-entry no-print";
    link.href="/business/";
    link.textContent="Für Unternehmen →";
    return link;
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

  function mountAds(){
    updatePrivacyForCurrentHostingAndAds();
    loadAdSense();

    const landingInner=document.querySelector(".landing-inner");
    const landingLogo=document.querySelector(".landing-logo");
    if(landingInner&&landingLogo&&!document.querySelector(".uc-business-entry")){
      landingLogo.insertAdjacentElement("afterend",createBusinessEntry());
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
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",mountAds,{once:true});
  else mountAds();

  window.UebergabeCheckAds={
    config:ADS_CONFIG,
    mount:mountAds
  };
})();
