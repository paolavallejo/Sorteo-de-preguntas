const API_URL="https://script.google.com/macros/s/AKfycbzed59puhdjCq6XtprrQK9ZqwSLjcc9z212ec9S8ZqIymOICKmmrdsIBwjNoIDCnJvHvw/exec";
let banco=[];
let asignadas=[];
window.onload=async()=>{
  const response = await fetch(
  `${API_URL}?action=questions`,
  {
    method: "GET",
    mode: "cors"
  }
);
                        banco=await r.json();};function rnd(a){return a[Math.floor(Math.random()*a.length)]}function assignQuestions(){const n=document.getElementById("studentName").value.trim();if(!n)return alert("Ingrese nombre");const count=Math.floor(Math.random()*3)+1;document.getElementById('drawResult').innerText=`Cantidad sorteada: ${count}`;document.getElementById('drawBtn').disabled=true;const e=banco.filter(x=>x.tipo==='Explicacion');const m=banco.filter(x=>x.tipo==='Modificacion');const a=banco.filter(x=>x.tipo==='Adicion');asignadas=[];if(count===1)asignadas=[rnd(banco)];if(count===2)asignadas=[rnd(e),Math.random()<0.5?rnd(m):rnd(a)];if(count===3)asignadas=[rnd(e),rnd(m),rnd(a)];render();}function render(){const c=document.getElementById('questionsContainer');c.innerHTML='';asignadas.forEach((p,i)=>{let h=`<div class="card"><h3>Pregunta ${i+1}</h3><p>${p.pregunta}</p>`;if(p.tipo==='Explicacion'){h+=`<textarea id="r_${i}"></textarea>`;}else{h+=`<input type="file" accept="image/*" id="f_${i}" onchange="preview(this,${i})"><img id="img_${i}" class="preview">`;}h+='</div>';c.innerHTML+=h;});document.getElementById('saveBtn').style.display='block';}function preview(inp,i){const f=inp.files[0];if(f)document.getElementById(`img_${i}`).src=URL.createObjectURL(f);}const toBase64=f=>new Promise(r=>{const rd=new FileReader();rd.onload=()=>r(rd.result);rd.readAsDataURL(f);});async function saveAnswers(){const estudiante=document.getElementById('studentName').value;const respuestas=[];for(let i=0;i<asignadas.length;i++){let p=asignadas[i];if(p.tipo==='Explicacion'){respuestas.push({tipo:p.tipo,pregunta:p.pregunta,respuestaTexto:document.getElementById(`r_${i}`).value,imagen:''});}else{let f=document.getElementById(`f_${i}`).files[0];respuestas.push({tipo:p.tipo,pregunta:p.pregunta,respuestaTexto:'',imagen:f?await toBase64(f):''});}}await fetch(`${API_URL}?action=save`,{method:'POST',body:JSON.stringify({estudiante,respuestas})});alert('Guardado');document.getElementById('saveBtn').disabled=true;}
