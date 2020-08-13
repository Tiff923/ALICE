from bs4 import BeautifulSoup
from requests import get



category1 = "singaporetoday2"
category2 = "observations"
category3 = "relak"
category4 = "politics"
category5 = "career-2"
category6 = "yourletters"
category7 = "business-2"
category8 = "everything-else"

categoryList = [category1, category2, category3, category4, category5, category6 ,category7, category8]

for category in categoryList:
    fileName = category + '.txt'
    path = f"urls/{fileName}"
    with open(path, 'r') as f:
        allURL = f.readlines()
        for url in allURL:
            try:
                response = get(url)
                soup = BeautifulSoup(response.text, 'html.parser')
                main_container = soup.find('main').find('article')
                title = main_container.find('h1').text
                title = title.replace("/", "-")
                texts = main_container.find_all('p')
                print(title + '\n')
                with open(f"./ExtractedText/{category}/{title}.txt", "w") as doc:
                    doc.write(title + "\n\n")
                    for item in texts:
                        text = item.get_text()
                        doc.write(text + '\n')
            except Exception as err:
                with open("ExtractText Error.txt", 'a') as errorDoc:
                    errorDoc.write(f"Error in {url}: {err} + \n")
        
            
