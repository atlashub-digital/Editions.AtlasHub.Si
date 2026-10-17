import copy,html
from lxml import html as LH,etree

def split_figure_paragraphs(root):
    """Preserve text around inline figures when converting paragraphs to blocks."""
    for p in list(root.xpath('.//p[img]')):
        parent=p.getparent();index=parent.index(p);pieces=[];buf=html.escape(p.text or '')
        for child in p:
            if child.tag=='img':
                if buf.strip():pieces.append(LH.fragment_fromstring('<p>'+buf+'</p>'))
                imagep=etree.Element('p');im=copy.deepcopy(child);im.tail=None;imagep.append(im);pieces.append(imagep);buf=html.escape(child.tail or '')
            else:buf+=etree.tostring(child,encoding='unicode',method='xml')
        if buf.strip():pieces.append(LH.fragment_fromstring('<p>'+buf+'</p>'))
        parent.remove(p)
        for i,item in enumerate(pieces):parent.insert(index+i,item)
    return root
