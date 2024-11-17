import csv
import time
import json
from fuzzywuzzy import fuzz, process
allIngredients = []
matches = {}
startTime = time.perf_counter()
with open('data/dataset/ingredients38-17-Sat-04-23.csv', 'r') as f:
    reader = csv.reader(f)
    for row in reader:
        allIngredients.append(row[0])
print("Time to read: ", time.perf_counter() - startTime)
for ingredient in allIngredients:
    # process.extractOne("chicken", choices)
    found = process.extract(ingredient, allIngredients)
    sourceIngredient = []
    scores: list = []
    for match in found:
        sourceIngredient.append(match[0])
        scores.append(match[1])
    matches[ingredient] = {
        "match": found[0],
        "score": scores,
        "source": sourceIngredient
    }


print("Time to clean: ", time.perf_counter() - startTime)
with open('data/dataset/filteredIngredients.csv', 'w') as f:
    writer = csv.writer(f)
    for ingredient in allIngredients:
        writer.writerow([ingredient])
with open('data/dataset/ingredientMatches.json', 'w') as f:
    json.dump(matches, f)

print("Results: ",len(allIngredients))