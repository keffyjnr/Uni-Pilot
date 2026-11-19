/* Uni Pilot shared navigation and theme controller */
(function(){
  const links=[["Home","index.html"],["Resources","resources.html"],["Student Guide","guide.html"],["Updates","updates.html"],["Opportunities","opportunities.html"],["Student Tools","tools.html"],["About","about.html"]];
  function init(){
    document.documentElement.classList.add("site-nav-fix");
    let header=document.querySelector("header.header");
    if(!header || !header.querySelector("#menuBtn")){
      if(header) header.remove();
      header=document.createElement("header");header.className="header";
      header.innerHTML='<nav class="navbar"><a class="brand" href="index.html"><span class="brand-icon">🎓</span><span>Uni Pilot</span></a><div class="desktop-nav"></div><div class="nav-actions"><button class="icon-btn" id="siteSearchBtn" type="button" aria-label="Search" onclick="location.href=\'search.html\'">🔍</button><button class="site-theme-btn" type="button" data-open-site-theme>◐ Theme</button><button class="menu-btn" id="menuBtn" type="button" aria-label="Open menu" aria-expanded="false">☰</button></div></nav><div class="mobile-menu" id="navLinks"></div><div class="menu-overlay" id="menuOverlay"></div>';
      document.body.insertBefore(header,document.body.firstChild);
    }
    let desktop=header.querySelector(".desktop-nav");
    if(!desktop){desktop=document.createElement("div");desktop.className="desktop-nav";header.querySelector(".navbar").insertBefore(desktop,header.querySelector(".nav-actions"));}
    if(!desktop.children.length) links.filter(x=>x[0]!=="Opportunities").forEach(([label,url])=>{const a=document.createElement("a");a.href=url;a.textContent=label;if(location.pathname.endsWith("/"+url))a.classList.add("active");desktop.appendChild(a)});
    let menu=header.querySelector("#navLinks")||document.querySelector("#navLinks");
    if(!menu){menu=document.createElement("div");menu.id="navLinks";menu.className="mobile-menu";header.appendChild(menu);}
    if(!menu.children.length) links.forEach(([label,url])=>{const a=document.createElement("a");a.href=url;a.textContent=label;menu.appendChild(a)});
    let overlay=header.querySelector("#menuOverlay")||document.querySelector("#menuOverlay");
    if(!overlay){overlay=document.createElement("div");overlay.id="menuOverlay";overlay.className="menu-overlay";header.appendChild(overlay);}
    let btn=header.querySelector("#menuBtn")||document.querySelector("#menuBtn");
    if(btn&&!btn.dataset.siteBound){btn.dataset.siteBound="1";btn.addEventListener("click",()=>{const open=!menu.classList.contains("is-open");menu.classList.toggle("is-open",open);menu.style.right=open?"14px":"";menu.style.left="auto";menu.style.transform="none";menu.style.visibility="visible";menu.style.opacity=open?"1":"";overlay.classList.toggle("is-open",open);btn.setAttribute("aria-expanded",String(open));btn.setAttribute("aria-label",open?"Close menu":"Open menu");btn.textContent=open?"×":"☰";});}
    if(!overlay.dataset.siteBound){overlay.dataset.siteBound="1";overlay.addEventListener("click",()=>{menu.classList.remove("is-open");menu.style.right="";menu.style.transform="";menu.style.opacity="";overlay.classList.remove("is-open");if(btn){btn.setAttribute("aria-expanded","false");btn.setAttribute("aria-label","Open menu");btn.textContent="☰";}});}
    // Put a working theme control on both desktop and mobile.
    let themeBtn=header.querySelector("[data-open-site-theme]");
    if(!themeBtn){themeBtn=document.createElement("button");themeBtn.type="button";themeBtn.className="site-theme-btn";themeBtn.dataset.openSiteTheme="";themeBtn.textContent="◐ Theme";header.querySelector(".nav-actions")?.appendChild(themeBtn);}
    let modal=document.getElementById("siteThemeModal");
    if(!modal){modal=document.createElement("div");modal.id="siteThemeModal";modal.className="site-theme-backdrop";modal.innerHTML='<section class="site-theme-dialog" role="dialog" aria-modal="true" aria-labelledby="siteThemeTitle"><button class="site-theme-close" type="button" aria-label="Close theme settings">×</button><h2 id="siteThemeTitle">Choose your theme</h2><p>Your theme is saved on this device.</p><button class="site-theme-choice" data-choice="light" role="radio" aria-checked="false">☀️ &nbsp; Light</button><button class="site-theme-choice" data-choice="dark" role="radio" aria-checked="false">🌙 &nbsp; Dark</button><button class="site-theme-choice" data-choice="system" role="radio" aria-checked="false">◐ &nbsp; System Default</button></section>';document.body.appendChild(modal);}
    function applyTheme(choice){if(!["light","dark","system"].includes(choice))choice="system";try{localStorage.setItem("uniPilotTheme",choice)}catch(e){}const dark=choice==="dark"||(choice==="system"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=dark?"dark":"light";document.documentElement.dataset.themeChoice=choice;modal.querySelectorAll("[data-choice]").forEach(b=>b.setAttribute("aria-checked",String(b.dataset.choice===choice)));modal.querySelectorAll("[data-choice]").forEach(b=>b.style.fontWeight=b.dataset.choice===choice?"900":"700");}
    function openTheme(){modal.classList.add("is-open");menu.classList.remove("is-open");menu.style.right="";menu.style.transform="";menu.style.opacity="";overlay.classList.remove("is-open");}
    document.querySelectorAll("[data-open-site-theme]").forEach(b=>{if(!b.dataset.siteThemeBound){b.dataset.siteThemeBound="1";b.addEventListener("click",openTheme);}});\n    if(!document.getElementById("themeModal")) document.querySelectorAll("#themeMenuTrigger").forEach(b=>{if(!b.dataset.siteThemeBound){b.dataset.siteThemeBound="1";b.addEventListener("click",openTheme);}});
    modal.querySelector(".site-theme-close").onclick=()=>modal.classList.remove("is-open");
    modal.onclick=e=>{if(e.target===modal)modal.classList.remove("is-open")};
    modal.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>{applyTheme(b.dataset.choice);modal.classList.remove("is-open")});
    // Existing homepage theme buttons continue to work alongside this shared control.
    const saved=(()=>{try{return localStorage.getItem("uniPilotTheme")||"system"}catch(e){return "system"}})();applyTheme(saved);
    const mobileTheme=menu.querySelector("#themeMenuTrigger");
    if(!mobileTheme){const b=document.createElement("button");b.type="button";b.textContent="◐ Theme settings";b.addEventListener("click",openTheme);menu.appendChild(b);}

    // Draggable Uni Pilot AI shortcut, shared across pages using this script.
    if (!document.getElementById("uniPilotAIFloat")) {
      const floatStyle = document.createElement("style");
      floatStyle.textContent = `
        #uniPilotAIFloat{position:fixed;right:22px;bottom:24px;z-index:9998;width:62px;height:62px;border:0;border-radius:50%;display:flex;align-items:center;justify-content:center;gap:0;background:linear-gradient(145deg,#0b5d3b,#063b26);color:#fff;box-shadow:0 8px 24px rgba(6,59,38,.32);font:800 23px Manrope,sans-serif;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;transition:box-shadow .2s ease,transform .2s ease}
        #uniPilotAIFloat::after{content:"AI";position:absolute;right:-2px;bottom:-2px;min-width:22px;height:22px;padding:0 4px;border:2px solid #fff;border-radius:12px;background:#f5c518;color:#173b2b;font:800 10px/18px Manrope,sans-serif;text-align:center}
        #uniPilotAIFloat:active{cursor:grabbing;transform:scale(.96)}
        @media(prefers-reduced-motion:no-preference){#uniPilotAIFloat{animation:upAiFloat 3.6s ease-in-out infinite}@keyframes upAiFloat{0%,100%{translate:0 0}50%{translate:0 -7px}}}
        html[data-theme="dark"] #uniPilotAIFloat::after{border-color:#0d1720}
      `;
      document.head.appendChild(floatStyle);
      const aiFloat = document.createElement("button");
      aiFloat.id = "uniPilotAIFloat";
      aiFloat.type = "button";
      aiFloat.setAttribute("aria-label","Open Uni Pilot AI");
      aiFloat.setAttribute("title","Chat with Uni Pilot AI — drag to move");
      aiFloat.textContent = "🎓";
      document.body.appendChild(aiFloat);

      let moved = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;
      try {
        const savedPos = JSON.parse(localStorage.getItem("uniPilotAIButtonPosition") || "null");
        if (savedPos && Number.isFinite(savedPos.left) && Number.isFinite(savedPos.top)) {
          aiFloat.style.left = Math.max(8,Math.min(innerWidth-70,savedPos.left)) + "px";
          aiFloat.style.top = Math.max(8,Math.min(innerHeight-70,savedPos.top)) + "px";
          aiFloat.style.right = "auto"; aiFloat.style.bottom = "auto";
        }
      } catch(e) {}
      aiFloat.addEventListener("pointerdown", e => {
        moved = false; startX=e.clientX; startY=e.clientY;
        const rect=aiFloat.getBoundingClientRect(); startLeft=rect.left; startTop=rect.top;
        aiFloat.setPointerCapture(e.pointerId);
      });
      aiFloat.addEventListener("pointermove", e => {
        if (!aiFloat.hasPointerCapture(e.pointerId)) return;
        const dx=e.clientX-startX, dy=e.clientY-startY;
        if (Math.abs(dx)+Math.abs(dy)>7) moved=true;
        if (!moved) return;
        const left=Math.max(8,Math.min(innerWidth-aiFloat.offsetWidth-8,startLeft+dx));
        const top=Math.max(8,Math.min(innerHeight-aiFloat.offsetHeight-8,startTop+dy));
        aiFloat.style.left=left+"px"; aiFloat.style.top=top+"px";
        aiFloat.style.right="auto"; aiFloat.style.bottom="auto";
      });
      aiFloat.addEventListener("pointerup", () => {
        if (moved) {
          const rect=aiFloat.getBoundingClientRect();
          try { localStorage.setItem("uniPilotAIButtonPosition",JSON.stringify({left:rect.left,top:rect.top})); } catch(e) {}
        }
      });
      aiFloat.addEventListener("click", () => {
        if (moved) { moved=false; return; }
        location.href = "ai.html";
      });
      window.addEventListener("resize", () => {
        const rect=aiFloat.getBoundingClientRect();
        const left=Math.max(8,Math.min(innerWidth-aiFloat.offsetWidth-8,rect.left));
        const top=Math.max(8,Math.min(innerHeight-aiFloat.offsetHeight-8,rect.top));
        aiFloat.style.left=left+"px"; aiFloat.style.top=top+"px";
        aiFloat.style.right="auto"; aiFloat.style.bottom="auto";
      });
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();