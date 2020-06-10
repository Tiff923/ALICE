from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
import networkx
import spacy
from nltk.tokenize import sent_tokenize
from nltk.stem import WordNetLemmatizer
import json

#This textSummarizer uses the text rank algorithm
def textSummarizer(text, no_of_sentences = 2):
    #Tokenize the text into sentences and lemmatize it
    text = text.replace("\n", " ")
    doc = sent_tokenize(text)
    lemmatizer = WordNetLemmatizer()
    lemmaDoc = []
    for sentence in doc:
        listOfWords = sentence.split(" ")
        newSentence = ""
        for word in listOfWords:
            lemma = lemmatizer.lemmatize(word)
            newSentence = newSentence + word + " "
        lemmaDoc.append(newSentence)
    #VectorizedText is a matrix containing the tfidf scores 
    vectorizer = TfidfVectorizer(min_df= 0, max_df=1.0)
    vectorizedText = vectorizer.fit_transform(doc)

    #Compute similarity matrix by multiplying the tfidf matrix with its transpose
    similarityMatrix = (vectorizedText * vectorizedText.T)

    #Get the graph
    graph = networkx.from_scipy_sparse_matrix(similarityMatrix)

    #Obtain the scores 
    scores = networkx.pagerank(graph)

    #Sort from highest scores to lowest
    ranking = ((score, index) for index,score in scores.items())
    rankingSorted = sorted(ranking,reverse = True)

    #Get the index of the sentences to be included in the summary
    sentenceIndexList = [rankingSorted[index][1] for index in range(0, no_of_sentences)]
    sentenceIndexList.sort()

    #Get the final summary
    summary = ""
    for index in sentenceIndexList:
        summary = summary + doc[index] + "\n\n"
    
    return summary





text1 = """The Multi-Ministry Taskforce announced on 19 May 2020 its decision to exit the Circuit Breaker and resume activities in phases from 2 June 2020. 

	The Public Service has remained operational during the Circuit Breaker period, with the majority of the public service workforce telecommuting. Essential services have also continued during the entire Circuit Breaker period. However, to achieve the objective of safe distancing, the Public Service has delivered its services using digital means as the primary mode of service delivery and scaled down or temporarily closed physical counter service centres and deferred non-urgent physical service appointments, during the Circuit Breaker period. 
	As we enter the post Circuit Breaker period, the safety and health of the public and all public officers remains our utmost priority. In tandem with the phased approach of resuming activities post Circuit Breaker at the national level, the Public Service will similarly resume the delivery of services at physical service touchpoints and facilities gradually and in phases, in order to safeguard public health and minimise the risk of community transmission of COVID-19.  
	For the immediate post Circuit Breaker period in Phase One (“Safe Re-opening”), selected government service centres (e.g service centres relating to housing and property, immigration and registration, CPF, employment and tax issues) will resume the physical delivery of services in a limited and controlled manner, such as by appointments only. The Courts will also resume hearing of cases and, where possible and appropriate, hearings will be conducted using remote communication technology.  
	However, to safeguard public health, the Public Service will continue to keep the majority of its service centres closed in Phase One, and use digital means as the primary mode of providing services. The majority of the Public Service workforce will also continue to work from home. For more information on access to services and relevant appointments, the public can check the relevant agencies’ websites.  Refer to Annex A for more details of the service centres. 
	In line with the objective of reducing social interaction, all other public sector social, sports and arts facilities will remain closed. These include libraries, Community Clubs (CC), Residents’ Committee centres, museums, art galleries/performance venues and SportSG facilities. Similarly, sport and fitness facilities, beaches, playgrounds, dog runs, barbecue pits, camping sites and event facilities at gardens, parks and open spaces will remain closed. However, the public can still apply for financial assistance at all CCs, and reset their SingPass at selected CCs. From 2 - 14 June, the public can also collect reusable masks from vending machines at the CCs. 
	To ensure a safe working environment, all government agencies will also put in place a safe management system to protect staff. This includes implementation of work from home arrangements, staggered working hours, shift or split team arrangements, safe distancing at work, regular disinfection of common touchpoints and equipment, and avoiding physical meetings and activities during and after office hours. We urge all visitors to observe Safe Management measures during their transactions, i.e. reschedule appointments if they are unwell, wear a mask at all times, and register their visits via the SafeEntry app.  
 
	The Public Service will gradually re-open more of its physical service centres and facilities in Phase Two (“Safe Transition”) and Phase Three (“Safe Nation”) in tandem with the overall pace of resumption of activities at the national level. However, even in Phase Three, we must remain vigilant and make ongoing efforts to minimise the risk of community spread of COVID-19. Hence, the Public Service will also continue to step up its efforts to promote digital literacy and to empower citizens to use digital means to access more and more public services, including promoting digital services to senior citizens.  
"""

text2 = """Countries where coronavirus infections are declining could still face an "immediate second peak" if they let up too soon on measures to halt the outbreak, the World Health Organization said on Monday (May 25).

The world is still in the middle of the first wave of the coronavirus outbreak, WHO emergencies head Dr Mike Ryan told an online briefing, noting that while cases are declining in many countries they are still increasing in Central and South America, South Asia and Africa.

Ryan said epidemics often come in waves, which means that outbreaks could come back later this year in places where the first wave has subsided. There was also a chance that infection rates could rise again more quickly if measures to halt the first wave were lifted too soon.

"When we speak about a second wave classically what we often mean is there will be a first wave of the disease by itself, and then it recurs months later. And that may be a reality for many countries in a number of months' time," Ryan said.

"But we need also to be cognizant of the fact that the disease can jump up at any time. We cannot make assumptions that just because the disease is on the way down now it is going to keep going down and we get a number of months to get ready for a second wave. We may get a second peak in this wave."

He said countries in Europe and North America should "continue to put in place the public health and social measures, the surveillance measures, the testing measures and a comprehensive strategy to ensure that we continue on a downwards trajectory and we don't have an immediate second peak."

Advertisement

Many European countries and US states have taken steps in recent weeks to lift lockdown measures that curbed the spread of the disease but caused severe harm to economies.
"""
#textSummarizer(text1, 3)

def load_json(filepath):
    with open(filepath) as f:
        data = json.load(f)
    return data


def writeToFile(filepath = "noName.txt", text = ""):
    with open(filepath, "a") as f:
        f.write(text)

def testCorpus():
    writeTo = "terrorismSummary.txt"
    f = open(writeTo,"w")
    f.close()
    data = load_json("/Users/cornelius/Documents/ISTD/ALICE Internship/Corpus/terrorism (2).json")
    counter = 0
    x = 0
    while counter < 10:
        article = data[x]["text"]
        if article == "":
            x+=1
            continue
        articleNo = x + 1
        print(articleNo)
        writeToFile(writeTo, "\n Article %d:\n\n" %articleNo)
        writeToFile(writeTo, article)
        print("\nSummary:\n")
        writeToFile(writeTo,"\nSummary:\n")
        writeToFile(writeTo, textSummarizer(article, 3))
        writeToFile(writeTo, "##################################################\n")
        print("##################################################\n")
        x+=1
        counter +=1

