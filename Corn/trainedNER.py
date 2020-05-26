from __future__ import unicode_literals, print_function

import plac
import random
from pathlib import Path
import spacy
from spacy.util import minibatch, compounding


# training data
TRAIN_DATA = [
    ("Who is Shaka Khan?", {"entities": [(7, 17, "PERSON")]}),
    ("I like London and Berlin.", {"entities": [(7, 13, "LOC"), (18, 24, "LOC"), (0,1, "Author")]}),
    ("I have a team of researchers.", {"entities": [(0,1, "Author"), (17,28, "Occupation")]}),
    ("The covid-19 virus is contagious!", {"entities": [(4,12, "Virus")]}),
    ("Covid-19 virus scares me!", {"entities": [(0,8, "Virus"), (22,24, "Author")]}),
    ("My travel history during the coronavirus outbreak",{"entities": [(0,2, "Author"), (29,40, "Virus")]}),
    ("The new coronavirus is called Covid-19.", {"entities": [(8,19, "Virus"), (30,38, "Virus")]}),
    ("I need to train more of the Covid-19 data!", {"entities": [(28,36, "Virus")]}),
    ("A collection of useful sources, posters and videos on COVID-19.", {"entities": [(54,62, "Virus")]}),
    ("Help stop the spread of COVID-19 through community-driven contact tracing.", {"entities": [(24,32, "Virus")]}),
    ("What is the 2019 novel coronavirus?", {"entities": [(23, 34, "Virus")]}),
    ("The coronavirus originated from Wuhan.", {"entities": [(4,15,"Virus"), (32,37, "LOC") ]}),
    ("Agency is not a virus, covid-19 is a virus", {"entities": [(0,6,"ORG") , (23,31, "Virus")]})
]


@plac.annotations(
    model=("Model name. Defaults to blank 'en' model.", "option", "m", str),
    output_dir=("Optional output directory", "option", "o", Path),
    n_iter=("Number of training iterations", "option", "n", int),
)
def main(model=None, output_dir=None, n_iter=100):
    #Loads the model
    if model is not None:
        nlp = spacy.load(model)
        print("Loaded model '%s'" %model)
    else:
        #Creates blank model if model is not specified in args
        nlp = spacy.blank("en")
        print("Created a blank english model")

    #Create the pipeline for NER if it does not exist
    if "ner" not in nlp.pipe_names:
        ner = nlp.create_pipe("ner")
        nlp.add_pipe(ner, last=True)
    else:
        #Else get the pipe for NER
        ner = nlp.get_pipe("ner")

    # _ is a throwaway variable for the text, annotations is the dictionary
    for _, annotations in TRAIN_DATA:
        for entity in annotations.get("entities"):
            #Add any new labels
            ner.add_label(entity[2])

    #We take out other pipes that is not NER as we do not want to train those
    other_pipes = []
    for pipe in nlp.pipe_names:
        if pipe != 'ner':
            other_pipes.append(pipe)

    #Disable the other pipes for the training
    with nlp.disable_pipes(*other_pipes):
        if model is None:
            nlp.begin_training()
        #Train the model
        for iteration in range(n_iter):
            random.shuffle(TRAIN_DATA)
            losses = {}
            batches = minibatch(TRAIN_DATA, size=compounding(4.0, 32.0, 1.001))
            for batch in batches:
                texts, annotations = zip(*batch)
                nlp.update(texts, annotations, drop= 0.5, losses = losses)
            print("Losses", losses)

    if output_dir is not None:
        output_dir = Path(output_dir)
        if not output_dir.exists():
            output_dir.mkdir()
        nlp.to_disk(output_dir)
        print("Saved model to", output_dir)

        print("Loading from", output_dir)
        nlp2 = spacy.load(output_dir)
        for text, _ in TRAIN_DATA:
            doc = nlp2(text)
            print("Entities", [(ent,text, ent.label_) for ent in doc.ents])
            print("Tokens", [(t.text, t.ent_type, t.ent_iob) for t in doc])


            
def test(text, input_dir):
    nlp = spacy.load(input_dir)
    doc = nlp(text)
    print("Entities", [(ent, ent.label_) for ent in doc.ents])
    print("Tokens", [(t.text, t.ent_type, t.ent_iob) for t in doc])


    
main("en_core_web_sm", "/Users/cornelius/Documents/ISTD/ALICE Internship/Trained Model")
text = "Researchers in Singapore have joined hands with their overseas counterparts in the race to discover vaccines or treatments for Covid-19. The Agency for Science, Technology and Research has partnered with Japanese pharmaceutical company Chugai Pharmabody Research to develop an antibody that targets specific areas of the coronavirus, preventing it from infecting cells.Duke-NUS Medical School, together with United States medicine company Arcturus Therapeutics, is working on a vaccine that gets the human body to produce part of the virus in order to fight it"
print("\n Conducting Test \n")
test(text, "/Users/cornelius/Documents/ISTD/ALICE Internship/Trained Model")
