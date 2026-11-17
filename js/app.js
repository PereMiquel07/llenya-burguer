// Lògica: rutes, vistes, carrusel, menú i reserva
var oi=0;
var $=function(s){return document.querySelector(s)};
var eur=function(n){return n.toFixed(2).replace('.',',')+' €'};
var find=function(id){return D.filter(function(x){return x.id===id})[0]};

function card(x,i,s){
  return '<a class="card" href="#plat-'+x.id+'">'+(x.b?'<span class="badge">★ Best seller</span>':'')+
  '<div class="pic'+(i%2?' alt':'')+'" aria-hidden="true">'+x.e+'</div><div class="t"><b>'+x.n+'</b>'+
  (s?'':'<span class="price">'+eur(x.p)+'</span>')+'</div></a>';
}
function offerHTML(){
  var o=O[oi];
  return '<button class="arrow" onclick="slide(-1)" aria-label="Oferta anterior">←</button>'+
  '<div class="mid"><div class="big" aria-hidden="true">'+o.e+'</div><h3>'+o.t+'</h3><p>'+o.x+'</p><a class="btn" href="'+o.to+'">'+o.cta+'</a></div>'+
  '<button class="arrow" onclick="slide(1)" aria-label="Oferta següent">→</button>';
}
var last=Date.now();
function slide(d){
  last=Date.now();
  oi=(oi+d+O.length)%O.length;
  $('#offer').innerHTML=offerHTML();
  $('#dots').innerHTML=O.map(function(_,i){return '<i class="'+(i===oi?'on':'')+'"></i>'}).join('');
}
function cats(){
  return '<div class="grid cg">'+Object.keys(C).map(function(k,i){
    return '<a class="card" href="#cat-'+k+'"><div class="pic'+(i%2?'':' alt')+'" aria-hidden="true">'+C[k].e+'</div><div class="t"><b>'+C[k].n+'</b></div></a>';
  }).join('')+'</div>';
}
function home(){
  return '<h1>Brasa, pa de brioix i bona companyia</h1>'+
  '<div class="offer" id="offer">'+offerHTML()+'</div><div class="dots" id="dots">'+
  O.map(function(_,i){return '<i class="'+(i===oi?'on':'')+'"></i>'}).join('')+'</div>'+
  '<h2>Carta</h2>'+cats();
}
function carta(){return '<h1>Carta</h1>'+cats()}
function cat(k){
  if(!C[k])return carta();
  var items=D.filter(function(x){return x.c===k}).sort(function(a,b){return (b.b||0)-(a.b||0)});
  return '<div class="tabs">'+Object.keys(C).map(function(j){
    return '<a href="#cat-'+j+'" class="'+(j===k?'on':'')+'"'+(j===k?' aria-current="page"':'')+'>'+C[j].n+'</a>';
  }).join('')+'</div><h1>'+C[k].n+'</h1><div class="grid">'+items.map(function(x,i){return card(x,i)}).join('')+'</div>';
}
function plat(id){
  var x=find(id);if(!x)return carta();
  var s=D.filter(function(y){return y.c===x.c}),ix=s.indexOf(x),rec=[1,2,3].map(function(j){return s[(ix+j)%s.length]});
  return '<div class="dish"><a class="back" href="#cat-'+x.c+'">← '+C[x.c].n+'</a>'+
  '<div class="hero" aria-hidden="true">'+x.e+'</div><h1>'+x.n+'</h1><span class="price">'+eur(x.p)+'</span>'+
  (x.b?' <span class="badge" style="position:static">★ Best seller</span>':'')+'<p>'+x.d+'</p></div>'+
  '<h2>Et pot interessar també</h2><div class="trio">'+rec.map(function(y,i){return card(y,i+1,1)}).join('')+'</div>';
}
function reserva(){
  var t=new Date().toISOString().slice(0,10);
  var h=['13:00','13:30','14:00','14:30','15:00','20:00','20:30','21:00','21:30','22:00'];
  return '<h1>Fes la teva reserva</h1><form class="form" id="rf" novalidate>'+
  '<label>Nom<input id="rn" autocomplete="name" placeholder="El teu nom"></label>'+
  '<label>Data<input id="rd" type="date" min="'+t+'" value="'+t+'"></label>'+
  '<div class="row"><label>Persones<select id="rp">'+[1,2,3,4,5,6,7,8].map(function(n){return '<option value="'+n+'"'+(n===2?' selected':'')+'>'+n+'</option>'}).join('')+'</select></label>'+
  '<label>Hora<select id="rh">'+h.map(function(x){return '<option>'+x+'</option>'}).join('')+'</select></label></div>'+
  '<p class="err" id="re" role="alert"></p><button class="btn" type="submit">Reservar</button></form>';
}
function bindForm(){
  var f=$('#rf');if(!f)return;
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var n=$('#rn').value.trim(),d=$('#rd').value;
    if(!n){$('#re').textContent='Escriu el teu nom per continuar.';$('#rn').focus();return}
    if(!d){$('#re').textContent='Tria una data per a la reserva.';return}
    var p=$('#rp').value,hh=$('#rh').value,dt=d.split('-').reverse().join('/');
    $('#app').innerHTML='<div class="ok"><div class="big" aria-hidden="true">✅</div><h1>Reserva feta!</h1>'+
    '<p>Gràcies, <b></b>. Et esperem el <b>'+dt+'</b> a les <b>'+hh+'</b> per a <b>'+p+(p==='1'?' persona':' persones')+'</b>.</p>'+
    '<p style="font-size:14px;opacity:.75">Aquesta és una demostració: no es desa cap dada.</p>'+
    '<a class="btn" href="#home">Torna a l’inici</a></div>';
    $('#app .ok b').textContent=n;
  });
}
var NAV=[['home','Inici'],['carta','Carta'],['cat-entrants','Entrants'],['reserva','Reservar']];
function route(){
  var h=(location.hash||'#home').slice(1),m=h.split('-'),k=m[0],r=m.slice(1).join('-'),v;
  if(k==='cat')v=cat(r);else if(k==='plat')v=plat(r);else if(h==='carta')v=carta();else if(h==='reserva')v=reserva();else v=home();
  $('#app').innerHTML=v;bindForm();
  $('#mnav').innerHTML=NAV.map(function(a){return '<a href="#'+a[0]+'"'+(a[0]===h?' class="on"':'')+'>'+a[1]+'</a>'}).join('');
  var cur=h;if(k==='plat'&&find(r))cur='cat-'+find(r).c;
  $('#dnav').innerHTML=[['home','Inici'],['carta','Carta']].concat(Object.keys(C).map(function(c){return ['cat-'+c,C[c].n]})).map(function(a){return '<a href="#'+a[0]+'"'+(a[0]===cur?' class="on" aria-current="page"':'')+'>'+a[1]+'</a>'}).join('');
  setMenu(false);window.scrollTo(0,0);
}
function setMenu(o){
  $('#menu').classList.toggle('open',o);
  $('#open').setAttribute('aria-expanded',o);
  document.body.style.overflow=o?'hidden':'';
  if(o)$('#close').focus();
}
$('#open').onclick=function(){setMenu(true)};
$('#close').onclick=function(){setMenu(false)};
$('#menu').addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
window.addEventListener('hashchange',route);
route();
setInterval(function(){var o=$('#offer');if(!o||document.hidden||Date.now()-last<4500)return;if(o.matches(':hover')||o.contains(document.activeElement))return;slide(1)},1000);
