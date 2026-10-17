import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
const root=process.cwd(), out=path.join(root,'editorial/ea000');
fs.mkdirSync(out,{recursive:true});
const input=JSON.parse(fs.readFileSync(path.join(out,'sources/baseline.json'),'utf8'));
const changes=[];
const pairs=[
 ['utilizadores','usuários'],['utilizador','usuário'],['Utilizador','Usuário'],['connosco','conosco'],['Convosco','Com vocês'],['facto','fato'],['factos','fatos'],['Facto','Fato'],['Poupámos','Economizamos'],['poupámos','economizamos'],['telefónica','telefônica'],['telefónico','telefônico'],
 ['governação','governança'],['Governação','Governança'],['GOVERNAÇÃO','GOVERNANÇA'],
 ['controlo','controle'],['Controlo','Controle'],['CONTROLO','CONTROLE'],
 ['equipa','equipe'],['Equipa','Equipe'],['equipas','equipes'],['Equipas','Equipes'],
 ['económico','econômico'],['económica','econômica'],['económicos','econômicos'],['económicas','econômicas'],
 ['Económico','Econômico'],['Económica','Econômica'],
 ['autónomo','autônomo'],['autónoma','autônoma'],['autónomos','autônomos'],['autónomas','autônomas'],['Autónomo','Autônomo'],
 ['académica','acadêmica'],['académico','acadêmico'],['académicas','acadêmicas'],['académicos','acadêmicos'],
 ['ficheiro','arquivo'],['ficheiros','arquivos'],['Ficheiro','Arquivo'],['Ficheiros','Arquivos'],
 ['registo','registro'],['registos','registros'],['Registo','Registro'],['Registos','Registros'],
 ['regista','registra'],['registada','registrada'],['registadas','registradas'],['registado','registrado'],['registados','registrados'],['registar','registrar'],['registam','registram'],
 ['contacto','contato'],['contactos','contatos'],['Contacto','Contato'],['Contactos','Contatos'],
 ['detetar','detectar'],['deteta','detecta'],['Deteta','Detecta'],['detetado','detectado'],['detetada','detectada'],['deteção','detecção'],['Deteção','Detecção'],
 ['rutura','ruptura'],['Rutura','Ruptura'],['ruturas','rupturas'],
 ['faturação','faturamento'],['Faturação','Faturamento'],['planeamento','planejamento'],['Planeamento','Planejamento'],
 ['planeador','planejador'],['planeadores','planejadores'],['receção','recepção'],['Receção','Recepção'],
 ['otimização','otimização'],['monitorização','monitoramento'],['Monitorização','Monitoramento'],
 ['retalho','varejo'],['Retalho','Varejo'],['stock','estoque'],['Stock','Estoque'],['stocks','estoques'],
 ['artefacto','artefato'],['artefactos','artefatos'],['aspeto','aspecto'],['aspetos','aspectos'],
 ['eletrónico','eletrônico'],['eletrónica','eletrônica'],['telemóvel','celular'],
 ['percentagem','porcentagem'],['percentagens','porcentagens'],['conversámos','conversamos'],
 ['chegámos','chegamos'],['CHEGÁMOS','CHEGAMOS'],['começámos','começamos'],['Começámos','Começamos'],
 ['ensinámos','ensinamos'],['Ensinaram','Ensinaram'],['observámos','observamos'],['Observámos','Observamos'],
 ['percebemos','percebemos'],['perguntámos','perguntamos'],['Perguntámos','Perguntamos'],
 ['ligámo-las','ligamos essas capacidades'],['Ligámo-las','Ligamos essas capacidades'],
 ['libertada','liberada'],['libertadas','liberadas'],['libertado','liberado'],['libertados','liberados'],['libertar','liberar'],
 ['poupança','economia'],['Poupança','Economia'],['poupadas','economizadas'],['poupados','economizados'],
 ['portfólio','portfólio'],['portfolio','portfólio'],['portefólio','portfólio'],
 ['humano a clicar','humano clicando'],['humano a executar','humano executando'],
 ['augmentação','ampliação de capacidade'],['Augmentação','Ampliação de capacidade'],
 ['email','e-mail'],['emails','e-mails'],['ecrã','tela'],['paragem','parada'],['paragens','paradas'],
 ['incómoda','incômoda'],['incómodo','incômodo'],['tráfego','tráfego']
];
function br(s,slug,field='markdown'){
 for(const [a,b] of pairs){if(a===b)continue;const re=new RegExp('(?<![\\p{L}\\p{N}_])'+a+'(?![\\p{L}\\p{N}_])','gu');let count=0;s=s.replace(re,()=>{count++;return b});if(count)changes.push({slug,field,kind:'pt-BR',before:a,after:b,count});}
 return s.replace(/\n{4,}/g,'\n\n\n');
}
function replace(s,a,b,reason){if(!s.markdown.includes(a))throw Error('Missing editorial target '+s.slug+': '+a.slice(0,50));s.markdown=s.markdown.replace(a,b);changes.push({slug:s.slug,kind:'editorial',before:a,after:b,reason,count:1});}
const master=input.map(s=>({...s,title:br(s.title,s.slug,'title'),part:s.part?br(s.part,s.slug,'part'):null,markdown:br(s.markdown,s.slug),revisionSha256:null}));
for(const s of master){
 if(s.markdown.includes('Fontes históricas de base para edição final'))replace(s,'Fontes históricas de base para edição final','Fontes históricas','Remover instrução interna de trabalho da edição de leitura.');
 if(s.markdown.includes('faturamento bruta'))replace(s,'faturamento bruta','faturamento bruto','Concordância nominal após adaptação para pt-BR.');
 s.markdown=s.markdown.replace(/^(#{1,3}\s+(?:\d+\. )?)responsável/gm,'$1Responsável').replace(/^(#{1,3}\s+(?:\d+\. )?)governança/gm,'$1Governança');
}
const c2=master.find(s=>s.slug==='capitulo-02');
replace(c2,'No próximo capítulo entraremos exatamente nesse problema.\n# O paradoxo do prompt.\nPorque talvez estejamos a utilizar uma inteligência nova com um modelo de gestão antigo.','Antes de entrar no paradoxo do prompt, precisamos esclarecer a linguagem com que descrevemos essa mudança. É o tema do próximo capítulo.\n\nDepois, voltaremos ao problema da delegação: talvez estejamos utilizando uma inteligência nova com um modelo de gestão antigo.','Restabelecer sequência real: capítulo 3 sobre terminologia, capítulo 4 sobre prompts.');
const c10=master.find(s=>s.slug==='capitulo-10');
if(c10.markdown.includes('Human responsáveis'))replace(c10,'Human responsáveis','Responsáveis humanos','Corrigir rótulo híbrido e definir responsabilidade em português.');
const c21=master.find(s=>s.slug==='capitulo-21');
for(const [a,b] of [['Value responsável','Responsável pelo valor'],['governança foundation','Base de governança']])if(c21.markdown.includes(a))replace(c21,a,b,'Uniformizar designação do papel e do fundamento organizacional.');
const c19=master.find(s=>s.slug==='capitulo-19');
if(c19.markdown.includes('responsável do valor'))replace(c19,'responsável do valor','Responsável pelo valor','Uniformizar terminologia do Value Owner.');
const c15=master.find(s=>s.slug==='capitulo-15');
replace(c15,'Se a clínica reduz 34 faltas para 25, por exemplo, o impacto potencial pode ser estimado.','Com 280 agendamentos e taxa de ausência de 12%, a expectativa é de 33,6 faltas, aproximadamente 34. Se, em um período comparável, as faltas caem para 25, o impacto potencial pode ser estimado.','Explicitar arredondamento e comparabilidade do exemplo; não apresentar causalidade comprovada.');
const c3=master.find(s=>s.slug==='capitulo-03');
replace(c3,'[https://nickbostrom.com/superintelligence](https://nickbostrom.com/superintelligence)','[Artigo de Nick Bostrom](https://nickbostrom.com/papers/how-long-before-superintelligence/)','Apontar para o artigo citado e dar ao link um rótulo legível.');
// A alegação específica sobre Haugeland precisa de página verificável, não só de um catálogo bibliográfico.
const start=c3.markdown.indexOf('## 3. A ideia de “Synthetic Intelligence” é muito anterior');
const end=c3.markdown.indexOf('## 4.',start);
if(start>=0&&end>start){const old=c3.markdown.slice(start,end);const revised='## 3. Artificial, sintético e o que o nome sugere\n\nA discussão sobre o nome também envolve a diferença entre algo artificial e algo sintético.\n\nUma flor artificial imita a aparência de uma flor. Um material sintético pode ser produzido por outra via e ainda apresentar propriedades relevantes para o uso pretendido.\n\nA analogia ajuda a formular uma pergunta, mas não demonstra que os sistemas atuais possuam consciência, intenção ou inteligência humana. Também não resolve as limitações técnicas que precisam ser avaliadas em cada aplicação.\n\nPara este livro, a questão útil é operacional: que capacidade o sistema oferece, em quais condições funciona e sob quais limites pode ser utilizado?\n\n***\n\n';replace(c3,old,revised,'Retirar atribuição histórica específica a Haugeland sem página primária acessível; conservar o argumento como analogia do ensaio.');}
if(c3.markdown.includes(' — referência histórica à expressão “Synthetic Intelligence”.'))replace(c3,' — referência histórica à expressão “Synthetic Intelligence”.',' — leitura de enquadramento filosófico.','Distinguir obra verificada de atribuição textual ainda não documentada.');
const author=master.find(s=>s.slug==='sobre-o-autor');
const originalBio=author.markdown;
author.markdown='**Sérgio Monteiro** atua em operações, tecnologia e transformação organizacional. Sua abordagem combina análise de processos, sistemas, dados e coordenação do trabalho.\n\nNeste livro, essa perspectiva se volta à relação entre capacidade humana e sistemas inteligentes dentro da empresa.\n\nA pergunta que orienta a obra é de gestão:\n\n> **Se sabemos organizar pessoas em torno de objetivos, responsabilidades, limites e resultados, como podemos organizar também a capacidade dos sistemas inteligentes?**\n\n**Empresa Aumentada** propõe uma resposta: desenhar organizações em que pessoas e capacidade computacional façam parte do mesmo sistema operacional, com direção e responsabilidade humanas.\n\n**Sérgio Monteiro · AtlasHub Editions**';
changes.push({slug:author.slug,kind:'bio-conservadora',before:originalBio,after:author.markdown,reason:'Conservar apenas descrição geral; participação em empresas, MG2+ e distinções aguardam documentação e validação do autor.',count:1});
const note=master[0];note.markdown+='\n\nOs valores, percentuais, personagens, empresas e resultados dos cenários didáticos são hipóteses ilustrativas. Não representam clientes identificáveis, resultados medidos nem promessas de desempenho. As propostas e matrizes do autor são instrumentos de gestão, não escalas científicas validadas.\n\nAs referências documentais foram verificadas na preparação desta edição em outubro de 2026. As traduções e paráfrases de fontes estrangeiras são editoriais, salvo indicação expressa.';
const refs=master.find(s=>s.slug==='referencias');refs.markdown=refs.markdown.replace('https://eur-lex.europa.eu/legal-content/PT/TXT/?uri=CELEX:02024R1689-20260727','https://eur-lex.europa.eu/eli/reg/2024/1689/oj/por');
for(const s of master)s.revisionSha256=crypto.createHash('sha256').update(s.markdown).digest('hex');
fs.writeFileSync(path.join(root,'content/empresa-aumentada-manuscript.json'),JSON.stringify(master,null,2)+'\n');
fs.writeFileSync(path.join(out,'changes.json'),JSON.stringify(changes,null,2)+'\n');
fs.writeFileSync(path.join(out,'master.md'),master.map(s=>'# '+(s.number?'Capítulo '+s.number+' — ':'')+s.title+'\n\n'+s.markdown).join('\n\n---\n\n')+'\n');
const index=JSON.parse(fs.readFileSync('content/empresa-aumentada-index.json','utf8'));index.parts=index.parts.map(p=>br(p,'index','part'));index.chapters=index.chapters.map(c=>({...c,title:master.find(s=>s.number===c.number).title,part:master.find(s=>s.number===c.number).part}));fs.writeFileSync('content/empresa-aumentada-index.json',JSON.stringify(index,null,2)+'\n');
const toolkit=JSON.parse(fs.readFileSync('content/empresa-aumentada-toolkit.json','utf8')).map(t=>({...t,markdown:br(t.markdown,t.slug)}));fs.writeFileSync('content/empresa-aumentada-toolkit.json',JSON.stringify(toolkit,null,2)+'\n');
for(const f of fs.readdirSync('public/diagrams'))if(f.endsWith('.svg')){let s=fs.readFileSync('public/diagrams/'+f,'utf8');fs.writeFileSync('public/diagrams/'+f,br(s,f,'svg'));}
console.log(JSON.stringify({sections:master.length,chapters:master.filter(s=>s.number).length,changes:changes.length,words:master.reduce((n,s)=>n+s.markdown.split(/\s+/).length,0)}));
