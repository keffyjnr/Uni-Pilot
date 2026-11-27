/* Uni Pilot shared navigation and theme controller */
(function(){
  const links=[["Home","index.html"],["Resources","resources.html"],["Student Guide","guide.html"],["Updates","updates.html"],["Opportunities","opportunities.html"],["Student Tools","tools.html"],["About","about.html"]];
  function init(){
    // The full AI page is embedded in the mini-chat iframe; do not inject a second nav or floating launcher there.
    if(new URLSearchParams(location.search).get("mini")==="1" || location.pathname.split("/").pop()==="study-hub.html") return;
    document.documentElement.classList.add("site-nav-fix");
    const isHomePage=(location.pathname.split("/").pop()||"index.html")==="index.html";
    const preservedAccount=isHomePage?document.querySelector(".account-wrapper"):null;
    if(preservedAccount) preservedAccount.remove();
    document.querySelectorAll("header.header").forEach(node=>node.remove());
    document.querySelectorAll("#navLinks,#menuOverlay").forEach(node=>node.remove());
    const pageName=(()=>{const p=location.pathname.split("/").pop()||"index.html";const names={"index.html":"Home","study-hub.html":"Study Hub","resources.html":"Resources","guide.html":"Student Guide","updates.html":"Campus Updates","opportunities.html":"Opportunities","tools.html":"Student Tools","about.html":"About","faculty-guide.html":"Faculty Guide","auth.html":"Account","ai.html":"Uni Pilot AI","search.html":"Search"};return names[p]||document.title.split(/[|—-]/)[0].trim()||"Student Guide";})();
    const header=document.createElement("div");
    header.className="up-study-header";
    header.innerHTML='<aside class="mobile-menu up-study-drawer" id="navLinks" aria-label="Uni Pilot navigation"><a class="up-study-drawer-brand" href="index.html"><span class="up-study-brand-mark">🎓</span><span><strong>UNI PILOT</strong><small>YOUR STUDENT GUIDE</small></span></a><p class="up-study-side-label">MAIN MENU</p><nav class="up-study-side-nav"><a href="index.html" class="up-study-nav-link"><span>▦</span> Home</a><a href="study-hub.html" class="up-study-nav-link"><span>🎓</span> Study Hub</a><a href="tools.html" class="up-study-nav-link"><span>⚙</span> Student Tools</a><a href="faculty-guide.html" class="up-study-nav-link"><span>⌂</span> Faculty Guide</a><a href="resources.html" class="up-study-nav-link"><span>▤</span> Resources</a><a href="updates.html" class="up-study-nav-link"><span>◷</span> Campus Updates</a><a href="opportunities.html" class="up-study-nav-link"><span>✦</span> Opportunities</a><a href="about.html" class="up-study-nav-link"><span>ⓘ</span> About</a><button class="theme-menu-trigger up-study-theme-link" id="themeMenuTrigger" type="button" aria-haspopup="dialog"><span aria-hidden="true">◐</span> Theme <span class="theme-current-label" id="themeCurrentLabel">System Default</span></button><a href="auth.html" id="mobileAuthBtn" class="up-study-nav-link up-study-login"><span>↗</span> Login / Sign Up</a></nav><div class="up-study-drawer-bottom"><div class="up-study-help-card"><b>✦ Your student companion</b><p>Your campus. Your resources. Your guide.</p></div><a class="up-study-back-link" href="index.html">← Back to Uni Pilot</a></div></aside><div class="menu-overlay" id="menuOverlay"></div><nav class="navbar up-study-navbar"><button class="menu-btn up-study-menu-btn" id="menuBtn" aria-label="Open navigation menu" aria-expanded="false" type="button">☰</button><div class="up-study-crumb"><a href="index.html">Uni Pilot</a><span>/</span><strong></strong></div><span class="up-study-campus">● AAUA STUDENT SPACE</span><div class="account-wrapper up-study-account"><a href="auth.html" class="auth-btn up-study-avatar" id="authBtn" aria-label="Account">K</a><div class="account-dropdown up-study-profile-pop" id="accountDropdown"><button class="up-study-profile-close" id="profilePopupClose" type="button" aria-label="Close account menu">×</button><div class="up-study-profile-head"><div class="up-study-profile-avatar" id="profilePopupInitial">K</div><div class="up-study-profile-name" id="profilePopupName">Student</div><div class="up-study-profile-email" id="profilePopupEmail"></div></div><button class="up-study-edit-profile" type="button" disabled aria-disabled="true">Edit profile <span>Coming soon</span></button><div class="up-study-profile-divider"></div><button class="logout-btn up-study-signout" id="logoutBtn" type="button">Sign out</button></div></div></nav>'; 
    document.body.insertBefore(header,document.body.firstChild);
    header.querySelector(".up-study-crumb strong").textContent=pageName;
    if(preservedAccount) header.querySelector(".account-wrapper").replaceWith(preservedAccount);
    if(!preservedAccount){
      const account=header.querySelector(".up-study-account");
      const avatar=header.querySelector("#authBtn");
      const dropdown=header.querySelector("#accountDropdown");
      const close=header.querySelector("#profilePopupClose");
      const logout=header.querySelector("#logoutBtn");
      const mobileAuth=header.querySelector("#mobileAuthBtn");
      let user=null;
      try{
        if(localStorage.getItem("uniPilotLoggedIn")==="true"){
          user=JSON.parse(localStorage.getItem("uniPilotCurrentUser")||"null");
        }
      }catch(e){user=null;}
      if(user&&user.name&&avatar&&dropdown){
        const initial=String(user.name).trim().charAt(0).toUpperCase()||"K";
        avatar.textContent=initial;avatar.href="#";avatar.title=user.name;avatar.setAttribute("aria-expanded","false");
        header.querySelector("#profilePopupInitial").textContent=initial;
        header.querySelector("#profilePopupName").textContent=user.name;
        header.querySelector("#profilePopupEmail").textContent=user.email||"";
        const closeProfile=()=>{dropdown.classList.remove("active");avatar.setAttribute("aria-expanded","false");};
        avatar.addEventListener("click",event=>{event.preventDefault();const opened=dropdown.classList.toggle("active");avatar.setAttribute("aria-expanded",String(opened));});
        if(close)close.addEventListener("click",closeProfile);
        document.addEventListener("click",event=>{
          if(dropdown.classList.contains("active")&&!account.contains(event.target)){
            event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();closeProfile();
          }
        },true);
        document.addEventListener("keydown",event=>{if(event.key==="Escape")closeProfile();});
        const signOut=()=>{try{localStorage.removeItem("uniPilotLoggedIn");localStorage.removeItem("uniPilotCurrentUser");}catch(e){}location.replace("auth.html");};
        if(logout)logout.addEventListener("click",signOut);
        if(mobileAuth){mobileAuth.textContent="↩ Log out";mobileAuth.addEventListener("click",event=>{event.preventDefault();signOut();});}
      }else{
        if(dropdown)dropdown.remove();
        if(avatar){avatar.href="auth.html";avatar.setAttribute("aria-label","Login / Sign up");}
      }
    }
    const activeFile=location.pathname.split("/").pop()||"index.html";
    header.querySelectorAll(".up-study-nav-link[href]").forEach(a=>{if(a.getAttribute("href")===activeFile)a.classList.add("active");});
    let menu=header.querySelector("#navLinks"),overlay=header.querySelector("#menuOverlay"),btn=header.querySelector("#menuBtn");
    // Preserve department page breadcrumbs inside the shared Study Hub-style drawer.
    const pageBreadcrumb=document.querySelector("[data-menu-breadcrumb]");
    if(pageBreadcrumb && !menu.querySelector(".menu-breadcrumb-group")){
      const group=document.createElement("div");
      group.className="menu-breadcrumb-group";
      const heading=document.createElement("div");
      heading.className="menu-breadcrumb-heading";
      heading.textContent="PAGE NAVIGATION";
      group.appendChild(heading);
      pageBreadcrumb.querySelectorAll("a").forEach(source=>{
        const link=document.createElement("a");
        link.href=source.href;
        link.textContent=source.textContent.trim();
        link.className="menu-breadcrumb-link";
        group.appendChild(link);
      });
      const current=pageBreadcrumb.lastElementChild;
      if(current && current.tagName!=="A" && current.textContent.trim()){
        const link=document.createElement("a");
        link.href=location.pathname.split("/").pop() || location.href;
        link.textContent=current.textContent.trim();
        link.className="menu-breadcrumb-link current";
        group.appendChild(link);
      }
      menu.appendChild(group);
      pageBreadcrumb.remove();
    }

    let savedScrollY=0,bodyPosition="",bodyTop="",bodyWidth="",bodyOverflow="",htmlOverflow="";
    function closeMenu(){
      const wasOpen=menu.classList.contains("active")||overlay.classList.contains("active");
      menu.classList.remove("active","is-open");overlay.classList.remove("active","is-open");
      document.removeEventListener("touchmove",blockBackgroundTouch,{capture:true});
      document.removeEventListener("wheel",blockBackgroundWheel,{capture:true});
      if(wasOpen){
        document.body.style.position=bodyPosition;document.body.style.top=bodyTop;document.body.style.width=bodyWidth;document.body.style.overflow=bodyOverflow;document.documentElement.style.overflow=htmlOverflow;
        window.scrollTo(0,savedScrollY);
      }
      if(btn){btn.setAttribute("aria-expanded","false");btn.setAttribute("aria-label","Open menu");btn.textContent="☰";}
    }
    function blockBackgroundTouch(event){if(!menu.contains(event.target)){event.preventDefault();}}
    function blockBackgroundWheel(event){if(!menu.contains(event.target)){event.preventDefault();}}
    function openMenu(){
      savedScrollY=window.scrollY;bodyPosition=document.body.style.position;bodyTop=document.body.style.top;bodyWidth=document.body.style.width;bodyOverflow=document.body.style.overflow;htmlOverflow=document.documentElement.style.overflow;
      document.body.style.position="fixed";document.body.style.top="-"+savedScrollY+"px";document.body.style.width="100%";document.body.style.overflow="hidden";document.documentElement.style.overflow="hidden";
      menu.classList.add("active","is-open");overlay.classList.add("active","is-open");
      document.addEventListener("touchmove",blockBackgroundTouch,{passive:false,capture:true});document.addEventListener("wheel",blockBackgroundWheel,{passive:false,capture:true});
      if(btn){btn.setAttribute("aria-expanded","true");btn.setAttribute("aria-label","Close menu");btn.textContent="×";}
    }
    if(btn&&!btn.dataset.siteBound){btn.dataset.siteBound="1";btn.addEventListener("click",()=>{const open=!menu.classList.contains("active");if(open){openMenu();}else closeMenu();});}
    if(!overlay.dataset.siteBound){overlay.dataset.siteBound="1";overlay.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();closeMenu();});}
    if(!menu.dataset.siteLinksBound){menu.dataset.siteLinksBound="1";menu.addEventListener("click",event=>{const link=event.target.closest("a[href]");if(link)closeMenu();});}
    window.addEventListener("pageshow",closeMenu);
    window.addEventListener("popstate",closeMenu);
    // Put a working theme control on both desktop and mobile.
    let themeBtn=header.querySelector("[data-open-site-theme]");
    if(!themeBtn){themeBtn=document.createElement("button");themeBtn.type="button";themeBtn.className="site-theme-btn";themeBtn.dataset.openSiteTheme="";themeBtn.textContent="◐ Theme";header.querySelector(".nav-actions")?.appendChild(themeBtn);}
    let modal=document.getElementById("siteThemeModal");
    if(!modal){modal=document.createElement("div");modal.id="siteThemeModal";modal.className="site-theme-backdrop";modal.innerHTML='<section class="site-theme-dialog" role="dialog" aria-modal="true" aria-labelledby="siteThemeTitle"><button class="site-theme-close" type="button" aria-label="Close theme settings">×</button><h2 id="siteThemeTitle">Choose your theme</h2><p>Your theme is saved on this device.</p><button class="site-theme-choice" data-choice="light" role="radio" aria-checked="false">☀️ &nbsp; Light</button><button class="site-theme-choice" data-choice="dark" role="radio" aria-checked="false">🌙 &nbsp; Dark</button><button class="site-theme-choice" data-choice="system" role="radio" aria-checked="false">◐ &nbsp; System Default</button></section>';document.body.appendChild(modal);}
    function applyTheme(choice){if(!["light","dark","system"].includes(choice))choice="system";try{localStorage.setItem("uniPilotTheme",choice)}catch(e){}const dark=choice==="dark"||(choice==="system"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=dark?"dark":"light";document.documentElement.dataset.themeChoice=choice;modal.querySelectorAll("[data-choice]").forEach(b=>b.setAttribute("aria-checked",String(b.dataset.choice===choice)));modal.querySelectorAll("[data-choice]").forEach(b=>b.style.fontWeight=b.dataset.choice===choice?"900":"700");}
    function openTheme(){modal.classList.add("is-open");closeMenu();}
    document.querySelectorAll("[data-open-site-theme]").forEach(b=>{if(!b.dataset.siteThemeBound){b.dataset.siteThemeBound="1";b.addEventListener("click",openTheme);}});
    document.querySelectorAll("#themeMenuTrigger").forEach(b=>{if(!b.dataset.siteThemeBound){b.dataset.siteThemeBound="1";b.addEventListener("click",openTheme);}});
    modal.querySelector(".site-theme-close").onclick=()=>modal.classList.remove("is-open");
    modal.onclick=e=>{if(e.target===modal)modal.classList.remove("is-open")};
    modal.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>{applyTheme(b.dataset.choice);modal.classList.remove("is-open")});
    // Existing homepage theme buttons continue to work alongside this shared control.
    const saved=(()=>{try{return localStorage.getItem("uniPilotTheme")||"system"}catch(e){return "system"}})();applyTheme(saved);
    const mobileTheme=menu.querySelector("#themeMenuTrigger");
    if(!mobileTheme){const b=document.createElement("button");b.type="button";b.textContent="◐ Theme settings";b.addEventListener("click",openTheme);menu.appendChild(b);}

    // PWA setup: installable website with standalone app window.
    if(!document.querySelector('link[rel="manifest"]')){
      const manifestLink=document.createElement("link");
      manifestLink.rel="manifest";
      manifestLink.href="manifest.webmanifest";
      document.head.appendChild(manifestLink);
    }
    if("serviceWorker" in navigator && location.protocol==="https:"){
      navigator.serviceWorker.register("sw.js").catch(()=>{});
    }
    let installPromptEvent=null;
    window.addEventListener("beforeinstallprompt",event=>{
      event.preventDefault();
      installPromptEvent=event;
      installButton.style.display="block";
      installButton.textContent="📲 Install Uni Pilot";
    });
    window.addEventListener("appinstalled",()=>{
      installPromptEvent=null;
      installButton.style.display="none";
    });
    const installButton=document.createElement("button");
    installButton.type="button";
    installButton.textContent="📲 Install Uni Pilot";
    installButton.style.cssText="display:none;width:100%;text-align:left;padding:12px 14px;margin-top:6px;border:1px solid rgba(11,93,59,.18);border-radius:12px;background:rgba(11,93,59,.08);color:inherit;font:700 14px Manrope,Arial,sans-serif;cursor:pointer";
    installButton.addEventListener("click",async()=>{
      if(!installPromptEvent){
        alert("To install Uni Pilot, open Chrome's menu (⋮) and choose 'Install app' or 'Add to Home screen'.");
        return;
      }
      installPromptEvent.prompt();
      await installPromptEvent.userChoice;
      installPromptEvent=null;
      installButton.style.display="none";
    });
    menu.appendChild(installButton);

    // Compact AI popup: same AI page/API and same-origin saved chat history.
    function openAIPopup(){
      let layer=document.getElementById("uniPilotAIPopup");
      if(!layer){
        layer=document.createElement("div");
        layer.id="uniPilotAIPopup";
        layer.innerHTML='<section class="up-ai-window" role="dialog" aria-modal="true" aria-label="Uni Pilot AI mini chat"><div class="up-ai-top"><strong>✦ Uni Pilot AI</strong><div class="up-ai-actions"><button type="button" data-up-ai-expand>Expand chat ↗</button><button type="button" data-up-ai-close aria-label="Close AI chat">×</button></div></div><iframe title="Uni Pilot AI chat" src="ai.html?mini=1"></iframe></section>';
        const style=document.createElement("style");
        style.textContent=`
          #uniPilotAIPopup{position:fixed;inset:0;z-index:5000;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(3,12,8,.42);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px)}
          #uniPilotAIPopup .up-ai-window{width:min(580px,calc(100vw - 28px));height:min(680px,70vh);min-height:420px;display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.55);border-radius:22px;background:#fff;box-shadow:0 24px 80px rgba(0,0,0,.32)}
          #uniPilotAIPopup .up-ai-top{height:54px;flex:0 0 54px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 13px 0 17px;background:#0b5d3b;color:#fff;font:800 13px Manrope,Arial,sans-serif}
          #uniPilotAIPopup .up-ai-actions{display:flex;align-items:center;gap:7px}
          #uniPilotAIPopup .up-ai-actions button{border:1px solid rgba(255,255,255,.35);border-radius:10px;padding:8px 10px;background:rgba(255,255,255,.12);color:#fff;font:800 11px Manrope,Arial,sans-serif;cursor:pointer}
          #uniPilotAIPopup .up-ai-actions [data-up-ai-close]{width:32px;height:32px;padding:0;font-size:21px}
          #uniPilotAIPopup iframe{display:block;flex:1;width:100%;min-height:0;border:0;background:#fff}
          @media(max-width:600px){#uniPilotAIPopup{padding:10px}#uniPilotAIPopup .up-ai-window{width:100%;height:68vh;min-height:390px;border-radius:19px}#uniPilotAIPopup .up-ai-top{height:50px;flex-basis:50px;padding:0 10px 0 13px}}
          @media(prefers-reduced-motion:no-preference){#uniPilotAIPopup .up-ai-window{animation:upAIPopupIn .2s ease-out}@keyframes upAIPopupIn{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}}
          html[data-theme="dark"] #uniPilotAIPopup .up-ai-window{border-color:#263b49;background:#0d1720}
        `;
        document.head.appendChild(style);
        document.body.appendChild(layer);
        layer.querySelector("[data-up-ai-close]").addEventListener("click",()=>{layer.remove();const f=document.getElementById("uniPilotAIFloat");if(f)f.style.visibility="visible"});
        layer.querySelector("[data-up-ai-expand]").addEventListener("click",()=>{location.href="ai.html"});
        layer.addEventListener("click",e=>{if(e.target===layer){layer.remove();const f=document.getElementById("uniPilotAIFloat");if(f)f.style.visibility="visible"}});
        document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.getElementById("uniPilotAIPopup")){document.getElementById("uniPilotAIPopup").remove();const f=document.getElementById("uniPilotAIFloat");if(f)f.style.visibility="visible"}});
      }
      const float=document.getElementById("uniPilotAIFloat");
      if(float)float.style.visibility="hidden";
    }

    // Draggable Uni Pilot AI shortcut, shared across pages using this script.
    if (!document.getElementById("uniPilotAIFloat")) {
      const floatStyle = document.createElement("style");
      floatStyle.textContent = `
        #uniPilotAIFloat{position:fixed;right:22px;bottom:24px;z-index:1050;width:66px;height:66px;border:0;border-radius:50%;display:flex;align-items:center;justify-content:center;gap:0;background:linear-gradient(145deg,#0b5d3b,#063b26);color:#fff;box-shadow:0 8px 24px rgba(6,59,38,.32);font:900 29px Manrope,sans-serif;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;transition:box-shadow .2s ease,transform .2s ease}
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
      aiFloat.textContent = "✦";
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
        openAIPopup();
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