from textblob import TextBlob

text = '''
 Researchers in Singapore have joined hands with their overseas counterparts in the race to discover vaccines or treatments for Covid-19.The Agency for Science, Technology and Research has partnered with Japanese pharmaceutical company Chugai Pharmabody Research to develop an antibody that targets specific areas of the coronavirus, preventing it from infecting cells.Duke-NUS Medical School, together with United States medicine company Arcturus Therapeutics, is working on a vaccine that gets the human body to produce part of the virus in order to fight it
'''

blob = TextBlob(text)
print(blob.sentiment)