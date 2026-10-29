'use strict';
const STUDIO = {name:'Shercoon Studio',shortName:'SHERCOON',email:'mygpt.chating@gmail.com',linkedIn:'https://www.linkedin.com/in/kurbanov-sherzod-808705245/'};
const projects = {
  'malenia': {title:'Malenia',collection:'Maidens of Ring',slug:'maidens-of-ring',description:'A sweeping blade and flowing cloak, shown in the original unpainted sculpt renders.',images:[['malenia','Unpainted front'],['malenia-back','Unpainted rear'],['malenia-detail','Sculpt detail']]},
  'alyss': {title:'Alyss Carroll',collection:'Cursed Tales',slug:'cursed-tales',description:'Twin blades, flowing fabric and a sculpted Wonderland base. Explore the colour render and unpainted sculpt from both sides.',images:[['alyss-colour','Colour render'],['alyss','Unpainted front'],['alyss-back','Unpainted rear']]},
  'imhotep': {title:'Imhotep Monster',collection:'Obsidian Ankh',slug:'obsidian-ankh',description:'A multi-armed Egyptian creature with an ornate headdress and a monumental base.',images:[['imhotep','Full character'],['imhotep-detail','Sculpt detail']]},
  'briar': {title:'Briar Vess',collection:'Cursed Tales II',slug:'cursed-tales-2',description:'A red-hooded warrior. Braided hair, an oversized axe and an intricately sculpted bust.',images:[['briar','Full character'],['briar-detail','Portrait detail'],['briar-clay','Untextured bust'],['diorama','Shared diorama']]},
  'beast': {title:'The Beast',collection:'Cursed Tales II',slug:'cursed-tales-2',description:'Creature anatomy, heavy armour and a silhouette built around the pose.',images:[['beast','Front view'],['beast-side','Side view']]},
  'wolfsbane': {title:'Wolfsbane',collection:'Cursed Tales II',slug:'cursed-tales-2',description:'A woodsman from a darker fairy tale. Costume, character and sculpted surface detail.',images:[['wolfsbane','Colour render'],['wolfsbane-clay','Untextured sculpt']]},
  'wynne': {title:'Wynne Madigan',collection:'Cursed Tales II',slug:'cursed-tales-2',description:'An expressive face, an impossible hat and a base with a story of its own.',images:[['wynne-detail','Portrait detail'],['wynne','Full character']]},
  'marisha': {title:'Marisha Vael',collection:'Cursed Tales',slug:'cursed-tales',description:'A mermaid reimagined through flowing shapes, layered scales and a dramatic colour palette.',images:[['marisha','Front view'],['marisha-back','Rear view']]},
  'white-hare': {title:'The White Hare',collection:'Cursed Tales',slug:'cursed-tales',description:'A masked rabbit warrior with an ornate costume and a distinctive heart-shaped weapon.',images:[['white-hare','Colour render'],['white-hare-clay','Untextured sculpt']]},
  'rosalind': {title:'Rosalind Vance',collection:'Cursed Tales II',slug:'cursed-tales-2',description:'The Bloodhood: a hooded warrior with layered armour, a flowing cloak and two axes.',images:[['rosalind','Untextured sculpt'],['rosalind-colour','Colour render']]}
};
const $ = (selector,scope=document)=>scope.querySelector(selector);
const $$ = (selector,scope=document)=>[...scope.querySelectorAll(selector)];
const projectDialog=$('#project-dialog'),briefDialog=$('#brief-dialog');
let currentProject=null,imageIndex=0,lastProjectTrigger=null,lastBriefTrigger=null;
function syncScroll(){document.body.classList.toggle('modal-open',projectDialog.open||briefDialog.open);}
function renderImage(){
  const p=projects[currentProject],entry=p.images[imageIndex],img=$('#project-image');
  img.src=`assets/${entry[0]}-1400.${entry[2]||'webp'}`;
  img.alt=`${p.title} — ${entry[1].toLowerCase()}, digital sculpt render`;
  $('#image-status').textContent=`${String(imageIndex+1).padStart(2,'0')} / ${String(p.images.length).padStart(2,'0')} — ${entry[1]}`;
  $$('.thumbnail').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===imageIndex)));
}
function openProject(key,trigger){
  const p=projects[key];if(!p)return;
  currentProject=key;imageIndex=0;if(trigger)lastProjectTrigger=trigger;
  $('#project-title').textContent=p.title;$('#project-collection').textContent=p.collection;
  $('#project-description').textContent=p.description;
  $('#project-campaign').href=`https://www.kickstarter.com/projects/elysianstudio/${p.slug}`;
  const thumbs=$('#project-thumbnails');thumbs.replaceChildren();
  p.images.forEach(([id,label,ext='webp'],index)=>{const b=document.createElement('button');b.type='button';b.className='thumbnail';b.setAttribute('aria-label',label);b.setAttribute('aria-pressed',String(index===0));const img=document.createElement('img');img.src=`assets/${id}-640.${ext}`;img.alt='';b.append(img);b.addEventListener('click',()=>{imageIndex=index;renderImage();});thumbs.append(b);});
  renderImage();if(!projectDialog.open)projectDialog.showModal();syncScroll();
}
function clearProjectHash(){if(location.hash.startsWith('#project/'))history.replaceState(null,'',location.pathname+location.search+'#work');}
function closeProject(){if(projectDialog.open)projectDialog.close();clearProjectHash();syncScroll();if(lastProjectTrigger?.isConnected)lastProjectTrigger.focus({preventScroll:true});}
$$('[data-project]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();history.pushState(null,'',`#project/${a.dataset.project}`);openProject(a.dataset.project,a);}));
window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#project/'))openProject(location.hash.slice(9));else if(projectDialog.open)projectDialog.close();});
projectDialog.addEventListener('close',syncScroll);
projectDialog.addEventListener('cancel',e=>{e.preventDefault();closeProject();});
$('[data-close-project]').addEventListener('click',closeProject);
$('.viewer-prev').addEventListener('click',()=>{imageIndex=(imageIndex-1+projects[currentProject].images.length)%projects[currentProject].images.length;renderImage();});
$('.viewer-next').addEventListener('click',()=>{imageIndex=(imageIndex+1)%projects[currentProject].images.length;renderImage();});
projectDialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();imageIndex=(imageIndex+(e.key==='ArrowRight'?1:-1)+projects[currentProject].images.length)%projects[currentProject].images.length;renderImage();}});
projectDialog.addEventListener('click',e=>{if(e.target===projectDialog){const r=projectDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeProject();}});
function openBrief(trigger){lastBriefTrigger=trigger;if(projectDialog.open)closeProject();$('#brief-status').textContent='';$('#brief-fallback').hidden=true;briefDialog.showModal();syncScroll();}
function closeBrief(){briefDialog.close();syncScroll();if(lastBriefTrigger?.isConnected&&!lastBriefTrigger.closest('dialog:not([open])'))lastBriefTrigger.focus({preventScroll:true});}
$$('[data-open-brief]').forEach(button=>button.addEventListener('click',()=>openBrief(button)));
$('[data-enquire-project]').addEventListener('click',()=>{const name=projects[currentProject].title;const idea=$('#project-idea');if(!idea.value)idea.value=`I'm interested in a project with a similar feel to ${name}. `;openBrief($('[data-open-brief]'));});
$('[data-close-brief]').addEventListener('click',closeBrief);
briefDialog.addEventListener('close',syncScroll);
briefDialog.addEventListener('cancel',e=>{e.preventDefault();closeBrief();});
$('#brief-form').addEventListener('submit',async e=>{
  e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;
  const values=new FormData(form);
  const text=`Hello ${STUDIO.name},\n\nI'd like to discuss a sculpting project.\n\nProject: ${values.get('type')}\nIdea: ${String(values.get('idea')).trim()}\nScale / size: ${String(values.get('scale')).trim()||'To discuss'}\nTiming: ${String(values.get('timing')).trim()||'To discuss'}\n`;
  if(STUDIO.email){window.location.href=`mailto:${STUDIO.email}?subject=${encodeURIComponent('Sculpting project enquiry')}&body=${encodeURIComponent(text)}`;$('#brief-status').textContent='Your email app will open with the brief. Review it there before sending.';return;}
  try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(text);$('#brief-status').textContent='Brief copied. Paste it into your conversation with the studio.';}catch{const output=$('#brief-output');output.value=text;$('#brief-fallback').hidden=false;output.focus();output.select();$('#brief-status').textContent='Select and copy your brief below.';}
});
$$('[data-brand]').forEach(el=>el.textContent=STUDIO.name);$$('[data-brand-short]').forEach(el=>el.textContent=STUDIO.shortName);
if(STUDIO.email){$('#brief-help').textContent='Prepare an email to the studio. Nothing is sent from this form.';$('#brief-submit').firstChild.textContent='Open email with brief ';const link=$('#direct-contact');link.hidden=false;link.href=`mailto:${STUDIO.email}`;link.textContent=STUDIO.email;}
if(STUDIO.linkedIn&&!STUDIO.email){const link=$('#direct-contact');link.hidden=false;link.href=STUDIO.linkedIn;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Connect on LinkedIn ↗';}
if(location.hash.startsWith('#project/'))openProject(location.hash.slice(9));

// A single readable strip, with touch, mouse drag, arrows and keyboard access.
const castViewport=$('.cast-viewport');
if(castViewport){
  const cards=$$('.cast-card'),prev=$('[data-cast-prev]'),next=$('[data-cast-next]');
  function updateCast(){
    const max=castViewport.scrollWidth-castViewport.clientWidth;
    prev.disabled=castViewport.scrollLeft<2;next.disabled=castViewport.scrollLeft>=max-2;
    const left=castViewport.getBoundingClientRect().left;
    const first=cards.findIndex(c=>c.getBoundingClientRect().right>left+55);
    $('.cast-position').textContent=`${String(Math.max(0,first)+1).padStart(2,'0')} / ${cards.length}`;
  }
  function moveBy(direction){castViewport.scrollBy({left:direction*(cards[0].getBoundingClientRect().width+24),behavior:'instant'});}
  prev.addEventListener('click',()=>moveBy(-1));next.addEventListener('click',()=>moveBy(1));
  $$('[data-cast-jump]').forEach(button=>button.addEventListener('click',()=>{
    const card=$(`.cast-card[data-collection="${button.dataset.castJump}"]`);
    castViewport.scrollTo({left:card.offsetLeft-parseFloat(getComputedStyle($('.cast-track')).paddingLeft),behavior:'instant'});
    updateCast();
  }));
  castViewport.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();moveBy(event.key==='ArrowRight'?1:-1);}
    if(event.key==='Home'||event.key==='End'){event.preventDefault();castViewport.scrollTo({left:event.key==='Home'?0:castViewport.scrollWidth,behavior:'instant'});}
  });
  let drag=null;
  castViewport.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'||event.button!==0)return;drag={x:event.clientX,left:castViewport.scrollLeft};castViewport.setPointerCapture(event.pointerId);castViewport.classList.add('dragging');});
  castViewport.addEventListener('pointermove',event=>{if(drag)castViewport.scrollLeft=drag.left+drag.x-event.clientX;});
  const endDrag=()=>{drag=null;castViewport.classList.remove('dragging');};
  castViewport.addEventListener('pointerup',endDrag);castViewport.addEventListener('pointercancel',endDrag);castViewport.addEventListener('lostpointercapture',endDrag);
  castViewport.addEventListener('scroll',updateCast,{passive:true});new ResizeObserver(updateCast).observe(castViewport);updateCast();
}

