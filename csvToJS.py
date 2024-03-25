import csv
import json

def csv_to_js(csv_file_path, js_file_path):
    js_data = []
    with open(csv_file_path, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            js_data.append(row)

    with open(js_file_path, 'w') as js_file:
        js_file.write('export default ')
        json.dump(js_data, js_file, indent=4)
        js_file.write(';')

csv_to_js('regions.csv', 'api/boot/regions.ts')
csv_to_js('languages.csv', 'api/boot/languages.ts')
