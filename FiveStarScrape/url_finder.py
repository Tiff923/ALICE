from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import sys


driver = webdriver.Firefox(executable_path =r'/Users/cornelius/Documents/ISTD/Elements of Software Construction 50.003/geckodriver')

url = "http://www.fivestarsandamoon.com/category/"



category1 = "singaporetoday"
category2 = "observations"
category3 = "relak"
category4 = "politics"
category5 = "career-2"
category6 = "yourletters"
category7 = "business-2"
category8 = "everything-else"

categoryList = [category1, category2, category3, category4, category5, category6 ,category7, category8]

for category in categoryList:
    with open(f"./urls/{category}.txt", "w") as f:
        end = False
        for i in range(1, sys.maxsize):
            if end == False:
                try:
                    newUrl = url + category + "/page/" + str(i)
                    driver.get(newUrl)
                    primary_element = driver.find_element_by_id("block-wrap-0")
                    articles = primary_element.find_elements_by_tag_name('article')
                    for article in articles:
                        link = article.find_element_by_class_name("title").find_element_by_tag_name('a').get_attribute('href')
                        print(link)
                        f.write(link + "\n")
                except Exception as err:
                    with open(f"./urls/errors.txt", "a") as errorFile:
                        errorFile.write(f"Error at {newUrl}: {err}")
                    end = True
            else:
                print("ending")
                break
                
