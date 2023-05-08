import csv

with open('server/MomosCastleFullMenu.csv', 'r') as f:
    reader = csv.reader(f)
    # your_list = list(reader)
    for row in reader:
        if row[0] == 'Name':
            continue
        print(row)