import csv
import os
import json
import re
import xlsxwriter
import datetime
# read from data/Cleaned_Indian_Food_Dataset.csv
import nltk
# convert this kind of "1 tablespoon Red Chilli powder,3 tablespoon Gram flour (besan),2 teaspoons Cumin seeds (Jeera),1 tablespoon Coriander Powder (Dhania),2 teaspoons Turmeric powder (Haldi),Salt - to taste,1 tablespoon Amchur (Dry Mango Powder),6 Karela (Bitter Gourd/ Pavakkai) - deseeded,Sunflower Oil - as required,1 Onion - thinly sliced", to ingredient list with name and quantity
def get_ingredients(ingredients):
    # split ingredients by comma
    ingredients = ingredients.split(',')
    # get name and quantity of each ingredient
    ingredients = list(map(lambda x: x.split(' '), ingredients))
    # remove empty strings
    ingredients = list(map(lambda x: list(filter(lambda y: y != '', x)), ingredients))
    # get name and quantity of each ingredient
    ingredients = list(map(lambda x: {'name': ' '.join(x[1:]), 'quantity': x[0]}, ingredients))
    return ingredients

# strip function
def strip(s):
    return s.strip()

def getBs(row,ingredient):
    for i in row[1].split(','):
        if ingredient.lower() in i.lower().replace('/',' ').replace('-',' ').replace(' or ',' '):
            return i

with open('data/Cleaned_Indian_Food_Dataset.csv', 'r') as f:
    reader = csv.reader(f)
    # print(reader[0])
    # headers are ['TranslatedRecipeName', 'TranslatedIngredients', 'TotalTimeInMins', 'Cuisine', 'TranslatedInstructions', 'URL', 'Cleaned-Ingredients', 'image-url', 'Ingredient-count']
    # generate list of products with ingredients and their quantity
    # products = []
    # count = 0
    # for row in reader:
    #     if count == 0:
    #         count+=1
    #         continue
    #     count+=1
    #     # print(row)
    #     product = {}
    #     product['name'] = row[0]
    #     product['ingredients'] = get_ingredients(row[1])
    #     product['quantity'] = row[2]
    #     product['cuisine'] = row[3]
    #     product['instructions'] = list(map(strip, row[4].split(',')))
    #     product['url'] = row[5]
    #     product['cleaned-ingredients'] = row[6]
    #     product['image-url'] = row[7]
    #     product['ingredient-count'] = row[8]
    #     products.append(product)
        
    #     # if count >3:
    #     #     break
    # print(count)
    # # print(products)
    # # write to data/products.json
    # with open('data/products.json', 'w') as f:
    #     json.dump(products, f)
    # # group products by cuisine
    # cuisines = {}
    # for product in products:
    #     cuisine = product['cuisine']
    #     if cuisine not in cuisines:
    #         cuisines[cuisine] = []
    #     cuisines[cuisine].append(product)
    # # write to data/cuisines.json
    # with open('data/cuisines.json', 'w') as f:
    #     json.dump(cuisines, f)
    
    # create a csv of this format 
    # dish name
    # ingredient name
    # thats it
    workbook = xlsxwriter.Workbook('demo.xlsx')
    # worksheet = workbook.add_worksheet()
    filename = 'data/dataset/ingredients'+datetime.datetime.now().strftime('%S-%H-%a-%m-%y')+'.csv'
    with open(filename, 'w+') as f:
        writer = csv.writer(f)
        # writer.writerow(['Dish Name','Ingredient Name','Actual Ing','Quantity','Price','Amount'])
        writer.writerow(['Ingredient Name','Quantity','Price','Amount'])
        cleanedIng = []
        for row in reader:
            # print(row)
            # writer.writerow([row[0]])
            mainItems = []
            items = row[6].split(',')
            # split by double spaces by looping in items
            for l in items:
                for k in l.split('  '):
                    mainItems.append(k)
            if(type(mainItems) == list):
                for ingredient in mainItems:
                    # print(ingredient)
                    ingredient = re.sub(r'\(.*\)', '', ingredient)
                    ingredient = ingredient.strip()
                    # append with no duplicates
                    found = False
                    # print(row[6])
                    for i in cleanedIng:
                        if ingredient.lower() in i.lower():
                            found = True
                            break
                    if not found:
                        cleanedIng.append(ingredient)
                        writer.writerow([ingredient,0,0,0])
            # input()
            # print(cleanedIng)
            # input()
                    # try:
                    #     if cleanedIng.index(ingredient.lower()) == -1:
                    #         cleanedIng.append(ingredient)
                    #         # writer.writerow([row[0],ingredient,getBs(row,ingredient)])
                    #         writer.writerow([ingredient,0,0,0])
                    # except:
                    #     cleanedIng.append(ingredient)
                    #     # writer.writerow([row[0],ingredient,getBs(row,ingredient)])
                    #     writer.writerow([ingredient,0,0,0])
                    #     pass
        print(len(cleanedIng),filename)



# from faker import Faker
# from flask import Flask
# from firebase_admin import auth, credentials, initialize_app, firestore
# app = Flask(__name__)
# cred = credentials.Certificate("keys/fbms-shreeva-demo-firebase-adminsdk-8nk63-d87e2235eb.json")
# initialize_app(cred)
# fake = Faker()

# @app.route("/")
# def hello_world():
#     return "<p>Hello, World!</p>"

# if __name__ == "__main__":
#     app.run()

