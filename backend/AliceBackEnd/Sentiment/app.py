from pattern.en import sentiment, mood, modality
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin


app = Flask(__name__)
cors = CORS(app)


@app.route('/')
def run():
    return 'Sentiment running'


@app.route("/sentiment", methods=["GET", "POST"])
def sentimentAPI():
    data = request.get_json()
    text = data["text"]
    sentiment = getSentiment(text)
    returnJson = {"sentiment": sentiment}
    return returnJson


def analyze_sentiment_pattern_lexicon(text, threshold=0.1):
    #print("\nUsing Pattern: \n")
    # Get sentiment score
    analysis = sentiment(text)
    sentiment_score = round(analysis[0], 2)
    sentiment_subjectivity = round(analysis[1], 2)
    sentimentJson = {"sentiment": "none", "positivity": 0, "negativity": 0}
    subjectivityJson = {"sentiment": "none", "subjectivity": 0}
    # Get final Sentiment
    if sentiment_score > threshold:
        final_sentiment = "Positive"
        sentimentJson["positivity"] = sentiment_score*100
        sentimentJson["sentiment"] = final_sentiment
    else:
        final_sentiment = "Negative"
        sentimentJson["negativity"] = sentiment_score*100
        sentimentJson["sentiment"] = final_sentiment
    if sentiment_subjectivity > 0.5:
        final_subjectivity = "Subjective"
        subjectivityJson["sentiment"] = final_subjectivity
        subjectivityJson["subjectivity"] = round(-(sentiment_subjectivity - 0.5) * 100, 3)
    else:
        final_subjectivity = "Objective"
        subjectivityJson["sentiment"] = final_subjectivity
        subjectivityJson['subjectivity'] = round(((1-sentiment_subjectivity) - 0.5) * 100, 3)
    returnList = [sentimentJson, subjectivityJson]
    return returnList



text = """
A student in Pennsylvania is under investigation after he called the police on Wednesday to report that he had forced open a window and climbed into a classroom at his school, all while he was asleep. Even though the student had reported himself to the authorities, the school, Wendover Middle School in Hempfield Township, was closed on Wednesday and swept for weapons, underscoring the seriousness with which potential threats to schools have been treated since the shooting at a high school last week in Parkland, Fla. The student moved a screen out of the way before climbing through the window, the authorities said. The police did not name the sleepwalker, and the break-in remained under investigation. In a radio interview on Thursday, the boy’s father, speaking anonymously, said that his son had walked the four and half miles to the school, sleeping the whole time. “And he’s scared of the dark,” the father said. “He won’t even go outside my house at night.” The sleepwalker, who had a backpack with him, was found in the classroom at about 2:30 a.m. Trooper Steve Limani of the Pennsylvania State Police said it would be a mischaracterization to say that he was “apprehended.” Mr. Limani seemed unsure of how to describe the event. He said that the student had not been arrested and that he had a history of sleepwalking. The family had guns at the house, but none of the weapons were missing, the police said. A different student at the school, about 45 minutes southeast of Pittsburgh, was arrested several days earlier after threatening a classmate of his and “possibly other students,” Mr. Limani said. “I’m sure we’re not the only police department going through this,” Mr. Limani said, adding that he believed that children making verbal threats were inspired by Nikolas Cruz, the teenager who confessed to killing 17 people in Parkland. Evidence from around the country bears Mr. Limani’s observation out, as aftershocks have continued to affect schools in the week since the attack. At least two dozen students have been arrested after making threats toward schools or classmates. Some of those arrested have been charged, like a student in Hot Springs, Ark., who was charged with making terroristic threats in the first degree. But there have also been a fair share of false alarms. Armstrong Middle School in Starkville, Miss., was moved to clarify that it was not on lockdown on Feb. 15, the day after the Parkland shooting. “All students and staff are safe and secure,” the district told a local reporter, MaryCarroll Sullivan. The district clarified that a post an adult had made on social media had “created a frenzy of misinformation that is fueling untruths.” Dr. Mary Ellen O’Toole, a former F.B.I. profiler, said that copycat incidents have followed school shootings since before the 1999 Columbine massacre in Colorado, in which 12 students and one teacher were killed. “Every time we had one of these events, we had these threats,” she said, attributing it to the Werther effect, a phenomenon in which news of a suicide can influence those at risk of self-harm to kill themselves. Dr. O’Toole said that teams dedicated to assessing threats from students had become commonplace at universities and in school districts nationwide, and that it could be difficult to ascertain the seriousness of any given threat until it was thoroughly investigated. “There’s no magical formula to say, well, this one is serious and this one isn’t,” she said. “It’s like opening a book to page 50. You don’t know what’s on pages one through 49, or 51 to 100. Behavior could be innocuous or terribly threatening.”
"""


def getSentiment(text):
    sentimentJson = analyze_sentiment_pattern_lexicon(text, 0)
    return sentimentJson


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5050)
