import nltk
import copy

nercolors = {'PERSON': '#FF5962',
             'NORP': '#30BCED',
             'FAC': '#30BCED',
             'ORG': '#30BCED',
             'GPE': '#C200FB',
             'LOC': '#C200FB',
             'PRODUCT': '#0DAB76',
             'EVENT': '#0DAB76',
             'WORK_OF_ART': '#FC7A1E',
             'LAW': '#FC7A1E',
             'LANGUAGE': '#FC7A1E',
             'DATE': '#FFBC0A',
             'TIME': '#FFBC0A',
             'PERCENT': '#FC7A1E',
             'MONEY': '#FC7A1E',
             'QUANTITY': '#FC7A1E',
             'ORDINAL': '#FC7A1E',
             'CARDINAL': '#FC7A1E'}


def relationToNetwork(relationData):
    links = []

    # Links
    nodes_temp = {}
    for i in range(len(relationData)):
        temp = {}
        el = relationData[i]
        temp['source'] = str(el['e1'])
        temp['target'] = str(el['e2'])
        temp['relation'] = str(el['relation'])

        node_t = str(el['e2'])
        node_t_label = str(el['e2_label'])
        node_s = str(el['e1'])
        node_s_label = str(el['e1_label'])

        if node_t in nodes_temp:
            nodes_temp[node_t]['val'] += 2
            nodes_temp[node_t]['neighbors'].add(node_s)
        else:
            nodes_temp[node_t] = {
                'id': node_t,
                'name': node_t,
                'val': 2,
                'color': nercolors[node_t_label],
                'neighbors': set([node_s])
            }

        if node_s in nodes_temp:
            nodes_temp[node_s]['val'] += 2
            nodes_temp[node_s]['neighbors'].add(node_t)
        else:
            nodes_temp[node_s] = {
                'id': node_s,
                'name': node_s,
                'val': 2,
                'color': nercolors[node_s_label],
                'neighbors': set([node_t])
            }
        links.append(temp)
    # Nodes
    nodes = list(nodes_temp.values())
    for n in nodes:
        n['neighbors'] = list(n['neighbors'])
    return {
        'nodes': nodes,
        'links': links
    }


def overviewRelationToNetwork(relationData, nerData):
    links = []

    # Links
    nodes_temp = {}
    for i in range(len(relationData)):
        temp = {}
        el = relationData[i]
        temp['source'] = el['e1']+'_'+el['e1_label']
        temp['target'] = el['e2']+'_'+el['e2_label']
        temp['relation'] = el['relation']

        node_t_name = el['e2']
        node_t_label = el['e2_label']
        node_s_name = el['e1']
        node_s_label = el['e1_label']
        node_t = temp['target']
        node_s = temp['source']

        if node_t in nodes_temp:
            nodes_temp[node_t]['val'] += 2
            nodes_temp[node_t]['neighbors'].add(node_s)
        else:
            nodes_temp[node_t] = {
                'id': node_t,
                'name': node_t_name,
                'val': 2,
                'color': nercolors[node_t_label],
                'neighbors': set([node_s])
            }

        if node_s in nodes_temp:
            nodes_temp[node_s]['val'] += 2
            nodes_temp[node_s]['neighbors'].add(node_t)
        else:
            nodes_temp[node_s] = {
                'id': node_s,
                'name': node_s_name,
                'val': 2,
                'color': nercolors[node_s_label],
                'neighbors': set([node_t])
            }
        links.append(temp)

    # Nodes
    nodes = list(nodes_temp.values())
    for n in nodes:
        n['neighbors'] = list(n['neighbors'])
    for key in list(nerData.keys()):
        if key not in nodes_temp:
            entity = nerData[key]
            nodes.append({
                'id': key,
                'name': entity['label'],
                'val': entity['value'],
                'color': nercolors[entity['type']],
                'neighbors': []
            })
    return {
        'nodes': nodes,
        'links': links
    }


def nerToSentiment(ner):
    prevLen = 0
    res = {}
    nerData = copy.deepcopy(ner)
    allEnts, text = nerData['ents'], nerData['text']
    lst_sentences = nltk.sent_tokenize(text)

    while allEnts:
        for sentence in lst_sentences:
            length = len(sentence)
            try:
                while allEnts and length + prevLen > allEnts[0]['start']:
                    ent = allEnts.pop(0)
                    entity, start, end = ent['text'], ent['start'] - prevLen, ent['end'] - prevLen
                    if entity in res:
                        res[entity].append(
                            {
                                'left': sentence[:start],
                                'aspect': sentence[start:end],
                                'right': sentence[end:]
                            })
                    else:
                        res[entity] = [
                            {
                                'left': sentence[:start],
                                'aspect': sentence[start:end],
                                'right': sentence[end:]
                            }
                        ]
                prevLen += length + 1
            except:
                continue
    return res
