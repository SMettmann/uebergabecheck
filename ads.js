(function(){
  const ADS_CONFIG={
    enabled:false,
    client:"",
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
        <p>Für Vermieter, Hausverwaltungen und Unternehmen entwickeln wir eine erweiterte Version von ÜbergabeCheck.</p>
      </div>
      <a href="mailto:info@uebergabe-check.de?subject=Interesse%20an%20%C3%9CbergabeCheck%20Business">Mehr erfahren →</a>`;
    return promo;
  }

  function mountAds(){
    loadAdSense();

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
