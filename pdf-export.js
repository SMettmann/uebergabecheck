(function(){
  const JSPDF_URL="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  let jsPdfLoadingPromise=null;

  function loadJsPdfLibrary(){
    if(window.jspdf&&window.jspdf.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
    if(jsPdfLoadingPromise) return jsPdfLoadingPromise;
    jsPdfLoadingPromise=new Promise((resolve,reject)=>{
      const existing=document.querySelector('script[data-uebergabecheck-jspdf]');
      if(existing){
        existing.addEventListener("load",()=>window.jspdf?.jsPDF?resolve(window.jspdf.jsPDF):reject(new Error("PDF_UNAVAILABLE")),{once:true});
        existing.addEventListener("error",()=>reject(new Error("PDF_UNAVAILABLE")),{once:true});
        return;
      }
      const script=document.createElement("script");
      script.src=JSPDF_URL;
      script.async=true;
      script.crossOrigin="anonymous";
      script.dataset.uebergabecheckJspdf="1";
      script.onload=()=>window.jspdf?.jsPDF?resolve(window.jspdf.jsPDF):reject(new Error("PDF_UNAVAILABLE"));
      script.onerror=()=>reject(new Error("PDF_UNAVAILABLE"));
      document.head.appendChild(script);
    });
    return jsPdfLoadingPromise;
  }

  function value(id,fallback="–"){
    const el=document.getElementById(id);
    const v=(el?.value||"").trim();
    return v||fallback;
  }

  function formatDate(raw){
    if(!raw) return "–";
    try{return new Date(raw+"T12:00:00").toLocaleDateString("de-DE");}
    catch(e){return raw;}
  }

  function dataUrlToJpeg(dataUrl,maxPx=1600,quality=.88){
    return new Promise(resolve=>{
      if(!dataUrl){resolve(null);return;}
      const img=new Image();
      img.onload=()=>{
        try{
          const naturalW=img.naturalWidth||img.width;
          const naturalH=img.naturalHeight||img.height;
          const scale=Math.min(1,maxPx/Math.max(naturalW,naturalH));
          const w=Math.max(1,Math.round(naturalW*scale));
          const h=Math.max(1,Math.round(naturalH*scale));
          const canvas=document.createElement("canvas");
          canvas.width=w;canvas.height=h;
          const ctx=canvas.getContext("2d");
          ctx.fillStyle="#ffffff";ctx.fillRect(0,0,w,h);
          ctx.drawImage(img,0,0,w,h);
          resolve({data:canvas.toDataURL("image/jpeg",quality),width:w,height:h});
        }catch(e){resolve(null);}
      };
      img.onerror=()=>resolve(null);
      img.src=dataUrl;
    });
  }

  function canvasToPng(id){
    const canvas=document.getElementById(id);
    if(!canvas) return null;
    try{return canvas.toDataURL("image/png");}catch(e){return null;}
  }

  async function createProtocolPdfBlob(){
    const protocol=document.querySelector("#summary .protocol");
    if(!protocol) throw new Error("NO_PROTOCOL");

    const jsPDF=await loadJsPdfLibrary();
    const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4",compress:true,putOnlyUsedFonts:true});

    const PAGE_W=210;
    const M=14;
    const CONTENT_W=PAGE_W-(M*2);
    const BOTTOM=278;
    const TEXT=[23,24,27];
    const MUTED=[112,114,122];
    const LIGHT=[247,247,248];
    const LINE=[229,229,231];
    let y=M;
    let pageNo=1;

    const setText=(size=10,style="normal",color=TEXT)=>{
      doc.setFont("helvetica",style);
      doc.setFontSize(size);
      doc.setTextColor(...color);
    };

    const drawFooter=()=>{
      setText(7.5,"normal",[135,135,140]);
      doc.text(`ÜbergabeCheck · Erstellt am ${new Date().toLocaleDateString("de-DE")}`,M,289);
      doc.text(`Seite ${pageNo}`,PAGE_W-M,289,{align:"right"});
    };

    const newPage=()=>{
      drawFooter();
      doc.addPage();
      pageNo++;
      y=M;
    };

    const ensure=(height)=>{
      if(y+height>BOTTOM) newPage();
    };

    const split=(text,width,size=10,style="normal")=>{
      setText(size,style);
      return doc.splitTextToSize(String(text??""),Math.max(8,width));
    };

    const textHeight=(lines,size=10,lineFactor=1.25)=>Math.max(size*.3528*lineFactor,(Array.isArray(lines)?lines.length:1)*size*.3528*lineFactor);

    const sectionTitle=(title)=>{
      ensure(13);
      if(y>M+1){
        doc.setDrawColor(...LINE);doc.setLineWidth(.25);doc.line(M,y,M+CONTENT_W,y);y+=7;
      }
      setText(14,"bold");doc.text(title,M,y+4.5);y+=11;
    };

    const roundedInfoCard=(x,top,w,label,text)=>{
      doc.setFillColor(245,245,246);doc.roundedRect(x,top,w,18,3,3,"F");
      setText(7.5,"normal",MUTED);doc.text(label.toUpperCase(),x+4,top+6);
      const lines=split(text,w-8,10,"bold").slice(0,2);
      setText(10,"bold");doc.text(lines,x+4,top+12,{lineHeightFactor:1.05});
    };

    const drawTextBox=async(text,emptyText="Keine Angaben dokumentiert.")=>{
      const allLines=split(text||emptyText,CONTENT_W-10,9.5,"normal");
      const lineH=4.6;
      let index=0;
      while(index<allLines.length){
        if(y>BOTTOM-15){newPage();continue;}
        const maxLines=Math.max(1,Math.floor((BOTTOM-y-10)/lineH));
        const lines=allLines.slice(index,index+maxLines);
        const h=8+(lines.length*lineH);
        ensure(h+2);
        doc.setFillColor(...LIGHT);doc.roundedRect(M,y,CONTENT_W,h,3,3,"F");
        setText(9.5,"normal");doc.text(lines,M+5,y+6,{lineHeightFactor:1.22});
        y+=h+4;
        index+=lines.length;
        if(index<allLines.length)newPage();
      }
    };

    const stateStyle=(state)=>{
      if(state==="damage") return {fill:[255,233,233],label:"Mangel vorhanden"};
      if(state==="wear") return {fill:[255,244,217],label:"Gebrauchsspuren"};
      return {fill:[233,245,236],label:"Ohne festgestellte Mängel"};
    };

    const drawStatePill=(state,top)=>{
      const st=stateStyle(state);
      setText(7.5,"bold");
      const w=Math.min(62,doc.getTextWidth(st.label)+7);
      doc.setFillColor(...st.fill);doc.roundedRect(M+CONTENT_W-w,top,w,7,3.5,3.5,"F");
      doc.text(st.label,M+CONTENT_W-(w/2),top+4.7,{align:"center"});
    };

    const drawPhotos=async(urls)=>{
      const valid=[];
      for(const url of (urls||[])){
        const converted=await dataUrlToJpeg(url);
        if(converted) valid.push(converted);
      }
      if(!valid.length) return;
      const gap=3;
      const cellW=(CONTENT_W-(gap*2))/3;
      const cellH=34;
      for(let i=0;i<valid.length;i+=3){
        ensure(cellH+5);
        const row=valid.slice(i,i+3);
        row.forEach((img,j)=>{
          const x=M+j*(cellW+gap);
          doc.setDrawColor(220,220,222);doc.roundedRect(x,y,cellW,cellH,2,2,"S");
          const ratio=img.width/img.height;
          let w=cellW-2,h=cellH-2;
          if(ratio>w/h){h=w/ratio;}else{w=h*ratio;}
          const ix=x+(cellW-w)/2;
          const iy=y+(cellH-h)/2;
          try{doc.addImage(img.data,"JPEG",ix,iy,w,h,undefined,"FAST");}catch(e){}
        });
        y+=cellH+4;
      }
    };

    const address=value("address","Adresse nicht angegeben");
    const dateRaw=document.getElementById("date")?.value||"";
    const tenant=value("tenant");
    const landlord=value("landlord");

    setText(7.5,"bold",MUTED);doc.text("WOHNUNGSÜBERGABE",M,y+2.5);y+=7;
    setText(24,"bold");doc.text("Übergabeprotokoll",M,y+8);y+=13;
    const addressLines=split(address,CONTENT_W,11.5,"normal");
    setText(11.5,"normal",[80,80,84]);doc.text(addressLines,M,y+2,{lineHeightFactor:1.2});
    y+=Math.max(8,textHeight(addressLines,11.5,1.2)+3);

    ensure(22);
    const metaGap=4;
    const metaW=(CONTENT_W-(metaGap*2))/3;
    roundedInfoCard(M,y,metaW,"Datum",formatDate(dateRaw));
    roundedInfoCard(M+metaW+metaGap,y,metaW,"Mieter",tenant);
    roundedInfoCard(M+(metaW+metaGap)*2,y,metaW,"Vermieter",landlord);
    y+=25;
    doc.setDrawColor(...TEXT);doc.setLineWidth(.55);doc.line(M,y,M+CONTENT_W,y);y+=8;

    sectionTitle("Übergabeübersicht");
    const photoCount=selectedRooms.reduce((n,r)=>n+((roomData[r]?.photos||[]).length),0);
    const meterCount=["electric","water","gas"].filter(id=>(document.getElementById(id)?.value||"").trim()).length;
    const overview=[
      ["Räume",String(selectedRooms.length)],
      ["Fotos",String(photoCount)],
      ["Zählerstände",String(meterCount)],
      ["Schlüssel",(document.getElementById("keys")?.value||"").trim()?"Dokumentiert":"–"]
    ];
    const ovGap=3;
    const ovW=(CONTENT_W-(ovGap*3))/4;
    overview.forEach((item,i)=>roundedInfoCard(M+i*(ovW+ovGap),y,ovW,item[0],item[1]));
    y+=24;

    sectionTitle("Zählerstände");
    const meters=[
      {name:"Strom",no:"electricNo",val:"electric",unit:"kWh",type:"electric"},
      {name:"Wasser",no:"waterNo",val:"water",unit:"m³",type:"water"},
      {name:"Gas",no:"gasNo",val:"gas",unit:"m³",type:"gas"}
    ];
    for(const meter of meters){
      ensure(17);
      setText(10.5,"bold");doc.text(meter.name,M,y+4);
      const noLines=split(`Zählernummer: ${value(meter.no)}`,CONTENT_W*.65,8,"normal").slice(0,2);
      setText(8,"normal",MUTED);doc.text(noLines,M,y+9,{lineHeightFactor:1.05});
      const meterVal=(document.getElementById(meter.val)?.value||"").trim();
      const valLines=split(meterVal?`${meterVal} ${meter.unit}`:"–",CONTENT_W*.28,10.5,"bold").slice(0,2);
      setText(10.5,"bold");doc.text(valLines,M+CONTENT_W,y+5,{align:"right",lineHeightFactor:1.05});
      y+=Math.max(13,8+(Math.max(noLines.length,valLines.length)*3));
      await drawPhotos(meterPhotos[meter.type]||[]);
      doc.setDrawColor(...LINE);doc.line(M,y,M+CONTENT_W,y);y+=5;
    }

    sectionTitle("Schlüsselübergabe");
    await drawTextBox((document.getElementById("keys")?.value||"").trim(),"Keine Angaben dokumentiert.");

    sectionTitle("Räume & Zustand");
    for(const room of selectedRooms){
      const d=roomData[room]||{state:"ok",description:"",photos:[]};
      ensure(18);
      const roomLines=split(String(room),CONTENT_W-70,12,"bold").slice(0,2);
      setText(12,"bold");doc.text(roomLines,M,y+4.5,{lineHeightFactor:1.05});
      drawStatePill(d.state,y);
      y+=Math.max(10,5+(roomLines.length*4.5));
      if((d.description||"").trim()){
        const lines=split(d.description,CONTENT_W-10,9.5,"normal");
        let idx=0;
        while(idx<lines.length){
          if(y>BOTTOM-18){newPage();continue;}
          const lineH=4.6;
          const maxLines=Math.max(1,Math.floor((BOTTOM-y-12)/lineH));
          const part=lines.slice(idx,idx+maxLines);
          const h=9+(part.length*lineH);
          ensure(h+2);
          doc.setFillColor(...LIGHT);doc.roundedRect(M,y,CONTENT_W,h,3,3,"F");
          setText(7.2,"bold",MUTED);doc.text("BESCHREIBUNG",M+5,y+5);
          setText(9.5,"normal");doc.text(part,M+5,y+10,{lineHeightFactor:1.22});
          y+=h+4;idx+=part.length;
          if(idx<lines.length)newPage();
        }
      }else if(!(d.photos||[]).length){
        setText(8.5,"normal",MUTED);doc.text("Keine zusätzlichen Angaben dokumentiert.",M,y+3.5);y+=8;
      }
      await drawPhotos(d.photos||[]);
      doc.setDrawColor(...LINE);doc.line(M,y,M+CONTENT_W,y);y+=6;
    }

    sectionTitle("Allgemeine Bemerkungen");
    await drawTextBox((document.getElementById("notes")?.value||"").trim(),"Keine weiteren Bemerkungen.");

    sectionTitle("Unterschriften");
    const sigDateRaw=document.getElementById("signatureDate")?.value||"";
    const sigDate=formatDate(sigDateRaw);
    setText(8,"normal",MUTED);doc.text(`Datum der Unterschrift: ${sigDate}`,M,y+3);y+=8;
    ensure(50);

    const sigGap=8;
    const sigW=(CONTENT_W-sigGap)/2;
    const sigTenant=canvasToPng("sigTenant");
    const sigLandlord=canvasToPng("sigLandlord");
    const sigs=[
      {x:M,title:"Mieter",place:value("tenantSignaturePlace"),img:sigTenant},
      {x:M+sigW+sigGap,title:"Vermieter",place:value("landlordSignaturePlace"),img:sigLandlord}
    ];
    for(const sig of sigs){
      setText(10.5,"bold");doc.text(sig.title,sig.x,y+4);
      doc.setDrawColor(205,205,208);doc.roundedRect(sig.x,y+8,sigW,25,2,2,"S");
      if(sig.img){try{doc.addImage(sig.img,"PNG",sig.x+2,y+10,sigW-4,21,undefined,"FAST");}catch(e){}}
      setText(8,"normal",MUTED);
      const placeLines=split(`Ort: ${sig.place}`,sigW,8,"normal").slice(0,2);
      doc.text(placeLines,sig.x,y+38,{lineHeightFactor:1.15});
      doc.text(`Datum: ${sigDate}`,sig.x,y+46);
    }

    drawFooter();
    return {blob:doc.output("blob"),filename:protocolPdfFilename()};
  }

  window.createProtocolPdfBlob=createProtocolPdfBlob;
})();

(function loadFreeVersionAds(){
  if(!document.querySelector('link[data-uebergabecheck-ads-style]')){
    const link=document.createElement("link");
    link.rel="stylesheet";
    link.href="ads.css?v=1";
    link.dataset.uebergabecheckAdsStyle="1";
    document.head.appendChild(link);
  }
  if(!document.querySelector('script[data-uebergabecheck-ads-script]')){
    const script=document.createElement("script");
    script.src="ads.js?v=1";
    script.async=false;
    script.dataset.uebergabecheckAdsScript="1";
    document.body.appendChild(script);
  }
})();
