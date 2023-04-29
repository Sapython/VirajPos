import csv
with open('data/internationalData.csv', 'r') as f:
    reader = csv.reader(f)
    # print(reader)
    for row in reader:
        print(row)
        break