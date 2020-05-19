TRAIN_DATA = [
    (
        'Down the RabbitHole Alice was beginning to get very tired of sitting by her sister on the bank and of having nothing to do once or twice she had peeped into the book her sister was reading but it had no pictures or conversations in it and what is the use of a book thought Alice without pictures or conversations',
        {'entities': [(9, 18, "LOC"), (20, 24, "PERSON"), (273, 278, "PERSON")]}),
    (
        'So she was considering in her own mind as well as she could for the hot day made her feel very sleepy and stupid whether the pleasure of making a daisychain would be worth the trouble of getting up and picking the daisies when suddenly a White Rabbit with pink eyes ran close by her',
        {'entities': [(238, 250, "PERSON")]}),
    (
        'There was nothing so VERY remarkable in that nor did Alice think it so VERY much out of the way to hear the Rabbit say to itself Oh dear',
        {'entities': [(53, 58, "PERSON")]}),
    (
        'when she thought it over afterwards it occurred to her that she ought to have wondered at this but at the time it all seemed quite natural but when the Rabbit actually TOOK A WATCH OUT OF ITS WAISTCOATPOCKET and looked at it and then hurried on Alice started to her feet for it flashed across her mind that she had never before seen a rabbit with either a waistcoatpocket or a watch to take out of it and burning with curiosity she ran across the field after it and fortunately was just in time to see it pop down a large rabbithole under the hedge',
        {'entities': [(148, 158, "PERSON"), (245, 250, "PERSON")]}),
    ('In another moment down went Alice after it never once considering how in the world she was to get out again',
     {'entities': [(28, 33, "PERSON")]}),
    (
        'The rabbithole went straight on like a tunnel for some way and then dipped suddenly down so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well',
        {'entities': [(106, 111, "PERSON")]}),
    (
        'She took down a jar from one of the shelves as she passed it was labelled ORANGE MARMALADE but to her great disappointment it was empty she did not like to drop the jar for fear of killing somebody so managed to put it into one of the cupboards as she fell past it',
        {'entities': [(74, 90, "PRODUCT")]}),
    ('thought Alice to herself after such a fall as this I shall think nothing of tumbling down stairs',
     {'entities': [(8, 12, "PERSON")]}),
    ('I wonder how many miles Ive fallen by this time', {'entities': [(18, 23, "QUANTITY")]}),
    ('Let me see that would be four thousand miles down I think for you see Alice had learnt several things of this sort in her lessons in the schoolroom and though this was not a VERY good opportunity for showing off her knowledge as there was no one to listen to her still it was good practice to say it over yes thats about the right distance but then I wonder what Latitude or Longitude Ive got to',
        {'entities': [(25, 38, "CARDINAL"), (39, 44, "QUANTITY"), (70, 75, "PERSON"), (363, 371, "QUANTITY"), (375, 384, "QUANTITY")]}),
    ('Alice had no idea what Latitude was or Longitude either but thought they were nice grand words to say',
     {'entities': [(0, 5, "PERSON"), (23, 31, "QUANTITY"), (39, 48, "QUANTITY")]}),
    # ('Please Maam is this New Zealand or Australia', {'entities': []}),
    # ('and she tried to curtsey as she spokefancy CURTSEYING as youre falling through the air', {'entities': []}),
    # ('There was nothing else to do so Alice soon began talking again', {'entities': []}),
    # ('Dinahll miss me very much tonight I should think', {'entities': []}),
    # ('Dinah was the cat', {'entities': []}),
    # ('Dinah my dear', {'entities': []}),
    # ('And here Alice began to get rather sleepy and went on saying to herself in a dreamy sort of way Do cats eat bats',
    #  {'entities': []}),
    # (
    #     'She felt that she was dozing off and had just begun to dream that she was walking hand in hand with Dinah and saying to her very earnestly Now Dinah tell me the truth did you ever eat a bat',
    #     {'entities': []}),
    # (
    #     'Alice was not a bit hurt and she jumped up on to her feet in a moment she looked up but it was all dark overhead before her was another long passage and the White Rabbit was still in sight hurrying down it',
    #     {'entities': []}),
    # (
    #     'There was not a moment to be lost away went Alice like the wind and was just in time to hear it say as it turned a corner Oh my ears and whiskers how late its getting',
    #     {'entities': []}),
    # (
    #     'She was close behind it when she turned the corner but the Rabbit was no longer to be seen she found herself in a long low hall which was lit up by a row of lamps hanging from the roof',
    #     {'entities': []}),
    # (
    #     'There were doors all round the hall but they were all locked and when Alice had been all the way down one side and up the other trying every door she walked sadly down the middle wondering how she was ever to get out again',
    #     {'entities': []}),
    # (
    #     'Suddenly she came upon a little threelegged table all made of solid glass there was nothing on it except a tiny golden key and Alices first thought was that it might belong to one of the doors of the hall but alas',
    #     {'entities': []}),
    # (
    #     'However on the second time round she came upon a low curtain she had not noticed before and behind it was a little door about fifteen inches high she tried the little golden key in the lock and to her great delight it fitted',
    #     {'entities': []}),
    # (
    #     'Alice opened the door and found that it led into a small passage not much larger than a rathole she knelt down and looked along the passage into the loveliest garden you ever saw',
    #     {'entities': []}),
    # (
    #     'How she longed to get out of that dark hall and wander about among those beds of bright flowers and those cool fountains but she could not even get her head through the doorway and even if my head would go through thought poor Alice it would be of very little use without my shoulders',
    #     {'entities': []}),
    # ('Oh how I wish I could shut up like a telescope', {'entities': []}),
    # (
    #     'For you see so many outoftheway things had happened lately that Alice had begun to think that very few things indeed were really impossible',
    #     {'entities': []}),
    # (
    #     'There seemed to be no use in waiting by the little door so she went back to the table half hoping she might find another key on it or at any rate a book of rules for shutting people up like telescopes this time she found a little bottle on it which certainly was not here before said Alice and round the neck of the bottle was a paper label with the words DRINK ME beautifully printed on it in large letters',
    #     {'entities': []}),
    # ('It was all very well to say Drink me but the wise little Alice was not going to do THAT in a hurry',
    #  {'entities': []}),
    # (
    #     'No Ill look first she said and see whether its marked poison or not for she had read several nice little histories about children who had got burnt and eaten up by wild beasts and other unpleasant things all because they WOULD not remember the simple rules their friends had taught them such as that a redhot poker will burn you if you hold it too long and that if you cut your finger VERY deeply with a knife it usually bleeds and she had never forgotten that if you drink much from a bottle marked poison it is almost certain to disagree with you sooner or later',
    #     {'entities': []}),
    # (
    #     'However this bottle was NOT marked poison so Alice ventured to taste it and finding it very nice it had in fact a sort of mixed flavour of cherrytart custard pineapple roast turkey toffee and hot buttered toast she very soon finished it off',
    #     {'entities': []}),
    # ('said Alice I must be shutting up like a telescope', {'entities': []}),
    # (
    #     'And so it was indeed she was now only ten inches high and her face brightened up at the thought that she was now the right size for going through the little door into that lovely garden',
    #     {'entities': []}),
    # (
    #     'First however she waited for a few minutes to see if she was going to shrink any further she felt a little nervous about this for it might end you know said Alice to herself in my going out altogether like a candle',
    #     {'entities': []}),
    # (
    #     'And she tried to fancy what the flame of a candle is like after the candle is blown out for she could not remember ever having seen such a thing',
    #     {'entities': []}),
    # (
    #     'After a while finding that nothing more happened she decided on going into the garden at once but alas for poor Alice',
    #     {'entities': []}),
    # (
    #     'when she got to the door she found she had forgotten the little golden key and when she went back to the table for it she found she could not possibly reach it she could see it quite plainly through the glass and she tried her best to climb up one of the legs of the table but it was too slippery and when she had tired herself out with trying the poor little thing sat down and cried',
    #     {'entities': []}),
    # ('said Alice to herself rather sharply I advise you to leave off this minute', {'entities': []}),
    # ('But its no use now thought poor Alice to pretend to be two people', {'entities': []}),
    # ('Why theres hardly enough of me left to make ONE respectable person', {'entities': []}),
    # (
    #     'Soon her eye fell on a little glass box that was lying under the table she opened it and found in it a very small cake on which the words EAT ME were beautifully marked in currants',
    #     {'entities': []}),
    # (
    #     'Well Ill eat it said Alice and if it makes me grow larger I can reach the key and if it makes me grow smaller I can creep under the door so either way Ill get into the garden and I dont care which happens',
    #     {'entities': []}),
    # ('She ate a little bit and said anxiously to herself Which way', {'entities': []}),
    # ('Which way', {'entities': []}),
    # (
    #     'holding her hand on the top of her head to feel which way it was growing and she was quite surprised to find that she remained the same size to be sure this generally happens when one eats cake but Alice had got so much into the way of expecting nothing but outoftheway things to happen that it seemed quite dull and stupid for life to go on in the common way',
    #     {'entities': []}),
    # ('So she set to work and very soon finished off the cake', {'entities': []})
]
