const AAUA_CENTER=[7.4787,5.7482];
const map=L.map("map").setView(AAUA_CENTER,16);

const street=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
  maxZoom:20, attribution:"&copy; OpenStreetMap contributors"
}).addTo(map);

const satellite=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{
  maxZoom:20, attribution:"Tiles &copy; Esri"
});

const cats=["All","Faculties","Lecture Halls","Administration","Student Services","Hostels","Health","Food","Sports"];
let active="All",selected=null,buildingMode=true,satelliteMode=false;
const markerMap=new Map(), buildingLayers=[];
const chips=document.getElementById("chips"),results=document.getElementById("results"),search=document.getElementById("search");

function icon(x){
  return L.divIcon({
    className:"",
    html:`<div style="width:24px;height:24px;border-radius:50%;background:${x.verification==="approximate"?"#dd6b20":"#2f855a"};border:3px solid #fff;box-shadow:0 2px 8px #0004"></div>`,
    iconSize:[24,24],iconAnchor:[12,12]
  })
}

/* Visual building language is based on the user's supplied AAUA drone video:
   cream/yellow walls, red/brown pitched roofs, long academic blocks,
   multi-wing administrative buildings and open landscaped spaces.
   These are illustrative footprints, not surveyed building boundaries. */
const BUILDINGS=[
  {id:"senateModel",name:"Senate Building",lat:7.479234,lng:5.748411,shape:"senate",w:.00028,h:.00022,rot:0},
  {id:"scienceModel",name:"Faculty of Science",lat:7.4785,lng:5.7475,shape:"academic",w:.00022,h:.00010,rot:0},
  {id:"educationModel",name:"Faculty of Education",lat:7.4777,lng:5.7470,shape:"academic",w:.00025,h:.00010,rot:0},
  {id:"artsModel",name:"Faculty of Arts",lat:7.4781,lng:5.7490,shape:"academic",w:.00023,h:.00011,rot:0},
  {id:"admsModel",name:"Administration & Management Sciences",lat:7.4772,lng:5.7484,shape:"academic",w:.00027,h:.00011,rot:0},
  {id:"alliedModel",name:"Allied Health Sciences",lat:7.4765,lng:5.7492,shape:"academic",w:.00022,h:.00010,rot:0},
  {id:"lawModel",name:"Faculty of Law",lat:7.4768,lng:5.7500,shape:"academic",w:.00020,h:.00010,rot:0},
  {id:"agriModel",name:"Faculty of Agriculture",lat:7.4758,lng:5.7468,shape:"academic",w:.00026,h:.00010,rot:0},
  {id:"edmModel",name:"Environmental Design & Management",lat:7.4762,lng:5.7475,shape:"academic",w:.00025,h:.00010,rot:0},
  {id:"etfModel",name:"ETF 750 Lecture Theatre",lat:7.4770,lng:5.7467,shape:"lecture",w:.00022,h:.00013,rot:0},
  {id:"awoModel",name:"AWO Hall",lat:7.4790,lng:5.7462,shape:"hall",w:.00022,h:.00015,rot:0},
  {id:"healthModel",name:"University Health Centre",lat:7.4759,lng:5.7480,shape:"clinic",w:.00018,h:.00008,rot:0},
  {id:"ictacModel",name:"ICTAC",lat:7.4802,lng:5.7477,shape:"academic",w:.00020,h:.00009,rot:0},
  {id:"pioneerModel",name:"Pioneer Hostel",lat:7.4810,lng:5.7460,shape:"hostel",w:.00028,h:.00010,rot:0},
  {id:"zenithModel",name:"Zenith Hostel",lat:7.4800,lng:5.7500,shape:"hostel",w:.00028,h:.00010,rot:0}
];

function footprint(b){
  const a=b.w/2,c=b.h/2;
  if(b.shape==="senate") return [
    [b.lat-c,b.lng-a],[b.lat-c,b.lng-a*.35],[b.lat-c*.15,b.lng-a*.35],
    [b.lat-c*.15,b.lng+a*.45],[b.lat+c,b.lng+a*.45],[b.lat+c,b.lng-a],
    [b.lat+c*.15,b.lng-a],[b.lat+c*.15,b.lng-a*.35],[b.lat-c,b.lng-a*.35]
  ];
  if(b.shape==="hall") return [[b.lat-c,b.lng-a],[b.lat-c,b.lng+a],[b.lat+c,b.lng+a*.72],[b.lat+c,b.lng-a*.72]];
  if(b.shape==="lecture") return [[b.lat-c,b.lng-a],[b.lat-c*.7,b.lng+a],[b.lat+c,b.lng+a*.75],[b.lat+c,b.lng-a*.75]];
  return [[b.lat-c,b.lng-a],[b.lat-c,b.lng+a],[b.lat+c,b.lng+a],[b.lat+c,b.lng-a]];
}

function roofPoints(base,dx,dy){
  return base.map(p=>[p[0]+dy,p[1]+dx]);
}

function addBuilding(b){
  const base=footprint(b);
  const shadow=L.polygon(roofPoints(base,.000018,-.000018),{
    stroke:false,fill:true,fillOpacity:.18,fillColor:"#1f2937",interactive:false
  }).addTo(map);
  const wall=L.polygon(base,{
    color:"#8b6f47",weight:1,fillColor:"#d7bd8a",fillOpacity:.96
  }).addTo(map);
  const roof=L.polygon(roofPoints(base,.000008,.000008),{
    color:"#6f4a32",weight:1,fillColor:"#9a6040",fillOpacity:.92
  }).addTo(map);
  const label=L.marker([b.lat,b.lng],{
    interactive:false,icon:L.divIcon({className:"",html:`<span class="building-label">${b.name}</span>`,iconSize:[0,0],iconAnchor:[0,0]})
  }).addTo(map);
  [shadow,wall,roof,label].forEach(x=>buildingLayers.push(x));
  wall.bindTooltip(b.name,{permanent:false});
}

BUILDINGS.forEach(addBuilding);

function iconFor(x){return icon(x)}
AAUA_LOCATIONS.forEach(x=>{
  const m=L.marker([x.lat,x.lng],{icon:iconFor(x)}).addTo(map);
  m.bindTooltip(x.name,{direction:"top"});
  m.on("click",()=>select(x));
  markerMap.set(x.id,m);
});

function drawCats(){
  chips.innerHTML="";
  cats.forEach(c=>{
    const b=document.createElement("button");
    b.className="chip "+(c===active?"active":"");
    b.textContent=c;
    b.onclick=()=>{active=c;drawCats();draw()};
    chips.appendChild(b);
  });
}
function matches(x,q){
  return !q||[x.name,x.category,x.description,...(x.aliases||[]),...(x.departments||[])].join(" ").toLowerCase().includes(q);
}
function draw(){
  const q=search.value.toLowerCase().trim();
  const list=AAUA_LOCATIONS.filter(x=>(active==="All"||x.category===active)&&matches(x,q));
  document.getElementById("status").textContent=`${list.length} location${list.length===1?"":"s"} found`;
  results.innerHTML="";
  list.forEach(x=>{
    const e=document.createElement("div");
    e.className="result";
    e.innerHTML=`<div class="title">${x.name}</div><div class="meta">${x.category} · ${x.verification==="approximate"?"Approximate location":"Reference location"}</div><div class="desc">${x.description}</div>`;
    e.onclick=()=>select(x);
    results.appendChild(e);
  });
}
function select(x){
  selected=x;
  map.flyTo([x.lat,x.lng],17,{duration:.6});
  markerMap.get(x.id)?.openPopup();
  document.getElementById("detailCat").textContent=x.category.toUpperCase();
  document.getElementById("detailName").textContent=x.name;
  document.getElementById("detailDesc").textContent=x.description;
  document.getElementById("detailDepartments").textContent=x.departments?.length?"Departments: "+x.departments.join(", "):"";
  document.getElementById("detailVerify").textContent=x.verification==="approximate"?"⚠ Approximate point — verify before relying on it for navigation.":"✓ Based on an AAUA official/reference source.";
  document.getElementById("detail").hidden=false;
}
function openMaps(){
  if(!selected)return;
  window.open("https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(selected.mapsQuery),"_blank");
}
function toggleBuildings(){
  buildingMode=!buildingMode;
  buildingLayers.forEach(l=>buildingMode?map.addLayer(l):map.removeLayer(l));
  document.getElementById("buildingsBtn").classList.toggle("active",buildingMode);
}
function toggleSatellite(){
  satelliteMode=!satelliteMode;
  if(satelliteMode){map.removeLayer(street);satellite.addTo(map)}
  else {map.removeLayer(satellite);street.addTo(map)}
  document.getElementById("satelliteBtn").classList.toggle("active",satelliteMode);
}

document.getElementById("buildingsBtn").onclick=toggleBuildings;
document.getElementById("satelliteBtn").onclick=toggleSatellite;
document.getElementById("maps").onclick=openMaps;
document.getElementById("navigate").onclick=openMaps;
document.getElementById("detailClose").onclick=()=>document.getElementById("detail").hidden=true;
document.getElementById("clear").onclick=()=>{search.value="";draw();search.focus()};
search.oninput=draw;
document.querySelectorAll(".quick button").forEach(b=>b.onclick=()=>{search.value=b.dataset.q;draw()});
document.getElementById("resetBtn").onclick=()=>map.flyTo(AAUA_CENTER,16,{duration:.6});
document.getElementById("locateBtn").onclick=()=>navigator.geolocation?.getCurrentPosition(p=>{
  map.flyTo([p.coords.latitude,p.coords.longitude],18);
  L.circleMarker([p.coords.latitude,p.coords.longitude],{radius:8}).addTo(map).bindPopup("You are here").openPopup()
},()=>alert("Could not get your location. Check browser location permission."));
document.getElementById("openPanel").onclick=()=>document.getElementById("panel").classList.remove("closed");
document.getElementById("closePanel").onclick=()=>document.getElementById("panel").classList.add("closed");
drawCats();draw();
