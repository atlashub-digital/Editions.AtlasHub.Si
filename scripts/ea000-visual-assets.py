from ea000_visual_core import *
from PIL import Image,ImageCms
import shutil,csv,io
WORK=ROOT.parent/'ea000-final';assert sha(MASTER)=='b53ddc0beab6534530ebdd272e2f1a760a1ae7aacc482e9113d12ff394aedb3a'
raw=VE/'original-assets';raw.mkdir(exist_ok=True)
inputs={'skyline-approved':WORK/'input/extracted/p2-fzImg0.jpg','boardroom':ROOT.parent/'ea000-v3/assets/hero-v3.png','organizacao':ROOT.parent/'ea000-art-proof/assets/organizacao.png','comercio':ROOT.parent/'ea000-art-proof/assets/comercio.png'}
for name in ['logistica','farmacia','clinica','conhecimento']:
 path=raw/(name+'.png');path.write_bytes(base64.b64decode((WORK/'tmp'/f'{name}.b64').read_text()));inputs[name]=path
srgb=ImageCms.createProfile('sRGB');profile=Path('C:/Windows/System32/spool/drivers/color/UncoatedFOGRA29.icc');destprof=ImageCms.getOpenProfile(str(profile));srgbbytes=ImageCms.ImageCmsProfile(srgb).tobytes();icc=profile.read_bytes()
assets=[]
for i,(name,path) in enumerate(inputs.items()):
 im=Image.open(path).convert('RGB');im.save(IMG/(name+'.jpg'),quality=95,subsampling=0,optimize=True,icc_profile=srgbbytes)
 cm=ImageCms.profileToProfile(im,srgb,destprof,outputMode='CMYK',renderingIntent=1);cm.save(IMG/(name+'-cmyk.jpg'),quality=95,subsampling=0,icc_profile=icc)
 if path.parent!=raw:shutil.copy2(path,raw/(name+path.suffix))
 origin='User-approved integration proof; extracted original embedded background, no text' if name=='skyline-approved' else ('OpenAI ImageGen for EA-000, 2026-10-17' if name in ['logistica','farmacia','clinica','conhecimento'] else 'OpenAI ImageGen for EA-000 prior visual proof')
 desc={'skyline-approved':'Skyline urbano conectado em azul-marinho e ciano.','boardroom':'Ambiente empresarial com pessoas em colaboração e skyline.','organizacao':'Arquitetura organizacional com equipas em diferentes pisos.','comercio':'Supermercado de bairro, cenário conceptual.','logistica':'Armazém e coordenação logística, cenário conceptual.','farmacia':'Farmácia de bairro, cenário conceptual.','clinica':'Recepção de clínica, cenário conceptual.','conhecimento':'Biblioteca e espaço de investigação, cenário conceptual.'}[name]
 assets.append({'id':f'EA000-IMG-{i+1:03}','kind':'photographic-conceptual-illustration','file':f'/ea000/images/{name}.jpg','print_file':f'/ea000/images/{name}-cmyk.jpg','description':desc,'alt':desc+' Ilustração conceptual; não documenta uma empresa real identificada.','origin':origin,'rights':'Recurso fornecido/aprovado ou gerado para o projeto; não se afirma licença de stock de terceiros. Homologação final de publicação pendente.','pixels':list(im.size),'color_digital':'sRGB','color_print':destprof.profile.profile_description,'native_A4_full_width_dpi':round(im.width/(210/25.4),1),'sha256':sha(IMG/(name+'.jpg'))})
canonical=VE/'canonical-svg';canonical.mkdir(exist_ok=True)
for f in FIGURES:
 source=ROOT/'public/diagrams'/f['file'];shutil.copy2(source,canonical/f['file'])
 save_svg(figure_drawing(f),FIG/f['file'],f['title'],f['alt'])
 assets.append({'id':f'EA000-FIG-{f["number"]:03}','kind':'editable-vector-figure','file':'/ea000/figures/'+f['file'],'description':f['title'],'alt':f['alt'],'destination':f['chapter'],'number':f['number'],'caption':f['caption'],'source':f['source'],'rights':f['rights'],'resolution':'vector','canonical_sha256':sha(source),'sha256':sha(FIG/f['file']),'canonical_rows':f['rows'],'edge_count':len(f['edges']),'feedback':bool(f.get('feedbackEdge'))})
chapters={}
for s in SECTIONS:
 if not s.get('number'):continue
 n=int(s['number']);id=f'EA000-CH-{n:02}';artfile=f'/ea000/images/{CH_PHOTO[n]}.jpg' if n in CH_PHOTO else f'/ea000/art/chapter-{n:02}.svg'
 if n not in CH_PHOTO:save_svg(concept(n),ART/f'chapter-{n:02}.svg','Estudo visual — '+s['title'],'Composição gráfica conceptual para '+s['title']+'. Não é um diagrama técnico.')
 chapters[s['slug']]={'id':id,'number':s['number'],'title':s['title'],'part':s['part'],'quote':quote(s),'art':artfile,'treatment':'photographic' if n in CH_PHOTO else 'conceptual-vector','alt':'Ilustração de abertura — '+s['title']+'.'}
 assets.append({**chapters[s['slug']],'kind':'chapter-opening','destination':s['slug'],'rights':'Texto do autor; composição AtlasHub Editions; arte conforme recurso referenciado.','resolution':'vector' if n not in CH_PHOTO else 'see referenced photo'})
parts=[]
for i,p in enumerate(PARTS):
 entry={'id':f'EA000-PART-{i+1:02}','number':i+1,'title':p,'art':f'/ea000/images/{PART_PHOTO[i]}.jpg','accent':PART_ACCENT[i],'alt':'Abertura da '+p+'. Arquitetura e atividade organizacional como metáfora visual.'};parts.append(entry);assets.append({**entry,'kind':'part-opening','rights':'Composição AtlasHub Editions; recurso fotográfico conceptual identificado na biblioteca.'})
lib={'publication':'EA-000','status':'visual-integration-for-final-editorial-homologation','master_sha256':sha(MASTER),'parts':parts,'chapters':chapters,'assets':assets,'print_profile':{'name':destprof.profile.profile_description,'file_name':profile.name,'sha256':sha(profile),'approval':'Proposta técnica Uncoated FOGRA29 para avaliação; gráfica não indicou perfil/papel/encadernação definitivos.'},'resolution_policy':'Metadados DPI não são usados para alegar detalhe adicional. A resolução efetiva depende da dimensão colocada. Referência de skyline fornecida tem resolução limitada para A4; ver preflight.','production_release':False}
(VE/'asset-library.json').write_text(json.dumps(lib,ensure_ascii=False,indent=2),encoding='utf8')
(ROOT/'content/empresa-aumentada-visual.json').write_text(json.dumps({'masterSha256':sha(MASTER),'parts':parts,'chapters':chapters},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
with (VE/'asset-library.csv').open('w',newline='',encoding='utf-8-sig') as f:
 fields=['id','kind','description','file','destination','alt','rights','resolution','pixels','origin','sha256'];w=csv.DictWriter(f,fields,extrasaction='ignore');w.writeheader();w.writerows(assets)
print(json.dumps({'assets':len(assets),'chapters':len(chapters),'parts':len(parts),'figures':len(FIGURES),'master':sha(MASTER)},ensure_ascii=False))
