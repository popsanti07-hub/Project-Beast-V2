const $ = id => document.getElementById(id);
const todayISO = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const KEY='beastModeDataV1';
const groups=[
 {id:'1',title:'1 · Morning warm-up & jogging',priority:'MANDATORY',tasks:[
  ['Warm-up & brushing','3:45 AM'],['Lemon water','Morning'],['Stretching – all 30 joints','4:00 AM'],['200 jumping jacks','5 minutes'],['Jogging','20 minutes']]},
 {id:'2',title:'2 · Upper-body workout',priority:'OPTIONAL',tasks:[
  ['Push-ups','4 × 30'],['Pull-ups','3 × 12']]},
 {id:'3',title:'3 · Core workout',priority:'OPTIONAL',tasks:[
  ['Chin-ups','3 × 12'],['Leg raises','3 × 30'],['Side raises','3 × 30']]},
 {id:'4',title:'4 · Leg workout',priority:'OPTIONAL',tasks:[
  ['Leg workouts','20 minutes']]},
 {id:'5',title:'5 · Plank & meditation',priority:'MANDATORY',tasks:[
  ['Plank','1 minute'],['Meditation','12 minutes']]}
];
const events=[
 ['sprint','100m Sprint','Acceleration, speed mechanics and short sprint practice'],
 ['long','Long jump','Approach run, take-off and landing technique'],
 ['high','High jump','Approach, take-off, clearance and safe landing'],
 ['1500','1500m Run','Pacing, aerobic endurance and interval practice']
];
let data=load();
let currentDate=todayISO();
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{days:{},records:[],settings:{weekStart:'1',examDate:''}}}catch(e){return {days:{},records:[],settings:{weekStart:'1',examDate:''}}}}
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function day(){return data.days[currentDate]||(data.days[currentDate]={tasks:{},events:{},reflection:{}})}
function checkedTask(id){return !!day().tasks[id]}
function renderGroups(){
 $('workoutGroups').innerHTML=groups.map(g=>`<div class="group"><div class="group-title"><h3>${g.title}</h3><span class="pill ${g.priority==='MANDATORY'?'green':'amber'}">${g.priority}</span></div>${g.tasks.map((t,i)=>{let id=g.id+'-'+i,done=checkedTask(id);return `<label class="task ${done?'done':''}"><input type="checkbox" data-task="${id}" ${done?'checked':''}><span class="task-main"><span class="task-title">${t[0]}</span><br><span class="task-detail">${t[1]}</span></span></label>`}).join('')}</div>`).join('');
 document.querySelectorAll('[data-task]').forEach(el=>el.addEventListener('change',e=>{day().tasks[e.target.dataset.task]=e.target.checked;save();renderDashboard();e.target.closest('.task').classList.toggle('done',e.target.checked)}));
}
function renderEvents(){
 $('petEvents').innerHTML=events.map(([id,name,desc])=>`<label class="event"><input type="checkbox" data-event="${id}" ${day().events[id]?'checked':''}><span><b>${name}</b><small>${desc}</small><em>+10 points</em></span></label>`).join('');
 document.querySelectorAll('[data-event]').forEach(el=>el.addEventListener('change',e=>{day().events[e.target.dataset.event]=e.target.checked;save();renderDashboard();renderAnalysis()}));
}
function renderDashboard(){
 const mandatory=groups.filter(g=>g.priority==='MANDATORY').flatMap(g=>g.tasks.map((_,i)=>g.id+'-'+i));
 const done=mandatory.filter(id=>checkedTask(id)).length,pct=Math.round(done/mandatory.length*100);
 $('mandatoryPct').textContent=pct+'%';$('mandatoryBar').style.width=pct+'%';
 const optional=groups.filter(g=>g.priority==='OPTIONAL').flatMap(g=>g.tasks.map((_,i)=>g.id+'-'+i)).filter(checkedTask).length;
 $('optionalDone').textContent=optional;
 const points=events.filter(([id])=>day().events[id]).length*10;
 $('petPoints').textContent=points;$('eventPoints').textContent=points+' points';
 $('missionHint').textContent=pct===100?'Both mandatory blocks completed. Great discipline.':`${mandatory.length-done} mandatory activities remaining. Optional sessions are flexible.`;
 $('todayLabel').textContent=new Date(currentDate+'T12:00:00').toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric',year:'numeric'});
 $('energy').value=day().reflection.energy||'';$('fatigue').value=day().reflection.fatigue||'';$('pain').value=day().reflection.pain||'';$('notes').value=day().reflection.notes||'';
}
function startOfWeek(date,weekStart){let d=new Date(date+'T12:00:00');let diff=(d.getDay()-Number(weekStart)+7)%7;d.setDate(d.getDate()-diff);return iso(d)}
function iso(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function calcRange(dates){
 let mandTotal=0,mandDone=0,sessions=0,points=0,perEvent={sprint:0,long:0,high:0,'1500':0};
 dates.forEach(date=>{let x=data.days[date];if(!x)return;let total=groups.filter(g=>g.priority==='MANDATORY').reduce((n,g)=>n+g.tasks.length,0);mandTotal+=total;mandDone+=groups.filter(g=>g.priority==='MANDATORY').reduce((n,g)=>n+g.tasks.filter((_,i)=>x.tasks?.[g.id+'-'+i]).length,0);events.forEach(([id])=>{if(x.events?.[id]){sessions++;points+=10;perEvent[id]++}})});
 return {pct:mandTotal?Math.round(mandDone/mandTotal*100):0,sessions,points,perEvent};
}
function renderAnalysis(){
 let now=new Date(currentDate+'T12:00:00'),ws=startOfWeek(currentDate,data.settings.weekStart||'1'),weekDates=[],monthDates=[];
 for(let i=0;i<7;i++){let d=new Date(ws+'T12:00:00');d.setDate(d.getDate()+i);weekDates.push(iso(d))}
 let y=now.getFullYear(),m=now.getMonth();for(let d=1;d<=new Date(y,m+1,0).getDate();d++)monthDates.push(iso(new Date(y,m,d,12)));
 let w=calcRange(weekDates),mo=calcRange(monthDates);
 $('weekMandatory').textContent=w.pct+'%';$('weekSessions').textContent=w.sessions;$('weekPoints').textContent=w.points;
 $('monthMandatory').textContent=mo.pct+'%';$('monthSessions').textContent=mo.sessions;$('monthPoints').textContent=mo.points;
 $('weekBars').innerHTML=events.map(([id,name])=>`<div class="bar-row"><span>${name}</span><span class="bar-bg"><i style="width:${Math.min(100,w.perEvent[id]/7*100)}%"></i></span><b>${w.perEvent[id]}</b></div>`).join('');
 let dates=Object.keys(data.days).sort().reverse().slice(0,14);
 $('historyList').innerHTML=dates.length?dates.map(d=>{let x=data.days[d],pct=calcRange([d]).pct,pts=events.filter(([id])=>x.events?.[id]).length*10;return `<div class="history-item"><b>${d}</b> · Mandatory ${pct}% · PET ${pts} pts<small>${Object.values(x.reflection||{}).filter(Boolean).length?'Reflection saved':'No reflection'}${x.reflection?.notes?' · '+escapeHTML(x.reflection.notes):''}</small></div>`}).join(''):'<div class="empty">Your daily history will appear here as you train.</div>';
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderRecords(){$('recordsList').innerHTML=data.records.length?data.records.slice().reverse().map(r=>`<div class="history-item"><b>${escapeHTML(r.event)}</b> · ${escapeHTML(r.value)}<small>${r.date}${r.notes?' · '+escapeHTML(r.notes):''}</small></div>`).join(''):'<div class="empty">No performance records yet.</div>'}
function renderAll(){renderGroups();renderEvents();renderDashboard();renderAnalysis();renderRecords()}
$('dateInput').value=currentDate;$('recordDate').value=currentDate;
$('dateInput').addEventListener('change',e=>{currentDate=e.target.value||todayISO();$('recordDate').value=currentDate;renderAll()});
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.id===b.dataset.tab));if(b.dataset.tab==='analysis')renderAnalysis();if(b.dataset.tab==='records')renderRecords()}));
$('saveReflection').addEventListener('click',()=>{day().reflection={energy:$('energy').value,fatigue:$('fatigue').value,pain:$('pain').value,notes:$('notes').value};save();$('saveStatus').textContent='Reflection saved on this device.';renderAnalysis()});
$('recordForm').addEventListener('submit',e=>{e.preventDefault();data.records.push({date:$('recordDate').value,event:$('eventType').value,value:$('recordValue').value.trim(),notes:$('recordNotes').value.trim()});save();e.target.reset();$('recordDate').value=currentDate;renderRecords();alert('Performance record saved.')});
$('examDate').value=data.settings.examDate||'';$('weekStart').value=data.settings.weekStart||'1';
$('saveSettings').addEventListener('click',()=>{data.settings={examDate:$('examDate').value,weekStart:$('weekStart').value};save();renderAnalysis();alert('Settings saved.')});
function download(name,content,type){let a=document.createElement('a'),url=URL.createObjectURL(new Blob([content],{type}));a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)}
$('exportBtn').addEventListener('click',()=>download('beast-mode-backup.json',JSON.stringify(data,null,2),'application/json'));
$('csvBtn').addEventListener('click',()=>{let rows=[['Date','Mandatory completion %','Optional tasks completed','PET points','Energy','Fatigue','Pain','Notes']];Object.keys(data.days).sort().forEach(d=>{let x=data.days[d],mand=groups.filter(g=>g.priority==='MANDATORY').flatMap(g=>g.tasks.map((_,i)=>x.tasks?.[g.id+'-'+i])).filter(Boolean).length;let total=groups.filter(g=>g.priority==='MANDATORY').reduce((n,g)=>n+g.tasks.length,0);let opt=groups.filter(g=>g.priority==='OPTIONAL').flatMap(g=>g.tasks.map((_,i)=>x.tasks?.[g.id+'-'+i])).filter(Boolean).length;let pts=events.filter(([id])=>x.events?.[id]).length*10;rows.push([d,Math.round(mand/total*100),opt,pts,x.reflection?.energy||'',x.reflection?.fatigue||'',x.reflection?.pain||'',x.reflection?.notes||''])});download('beast-mode-history.csv',rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n'),'text/csv')});
$('importFile').addEventListener('change',async e=>{let f=e.target.files[0];if(!f)return;try{let parsed=JSON.parse(await f.text());if(!parsed.days||!parsed.records)throw Error();if(confirm('Replace current app data with this backup?')){data=parsed;save();renderAll();alert('Backup imported.')}}catch(err){alert('Could not import this backup file.')}e.target.value=''});
$('resetBtn').addEventListener('click',()=>{if(confirm('Permanently delete all workout data on this device? Export a backup first if needed.')){localStorage.removeItem(KEY);data=load();renderAll()}});
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('installBtn').classList.remove('hidden')});
$('installBtn').addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('installBtn').classList.add('hidden')});
if('serviceWorker' in navigator && location.protocol!=='file:'){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
renderAll();