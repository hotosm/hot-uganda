
import os
import requests
import csv
import zipfile

url="https://kobocat.unhcr.org/api/v1/data"
headers={'Authorization': os.environ["token"]}

excluded_forms = [
    "a6uGDjRSQLkLUufuuBY5fP",
    "a76trKXiQBhKhpc7VUKbDw",
    "aGTtGJk9YteFABxqDGXJ42",
    "aLgyGdmZEoPJSrJo6QJcn6"
]

replace_keys = {
    "_geolocation":"geopoint"
}

dirs=["Cash Based Intervation Points","Villages","Water & Sanitation Combined","Education Facilities","Water Facilities","Sanitation Facilities","Other Important Facilities","Health Facilities"]

def grouped_forms(name):
    if "wash" in name.lower():
        return "Water & Sanitation Combined"
    elif "uganda" in name.lower():
        return "Villages"
    elif "education" in name.lower():
        return "Education Facilities"
    elif "health" in name.lower():
        return "Health Facilities"
    elif "other" in name.lower():
        return "Other Important Facilities"
    elif "sanitation" in name.lower():
        return "Sanitation Facilities"
    elif "water" in name.lower():
        return "Water Facilities"
    elif "cbi" in name.lower():
        return "Cash Based Intervation Points"

folders =[
"Cash Based Intervation Points",
"Water Facilities",
"Sanitation Facilities",
"Other Important Facilities",
"Health Facilities",
"Education Facilities",
"Water & Sanitation Combined",
"Villages"
]
private_keys = [
"simserial",
"deviceid",
"surveyor_name",
"surveyor_name_other",
"phonenumber",
"contact_phone",
"name_representative",
"contact_phone_number",
"subscriberid"]

to_replace={"_geolocation":"geolocation"}



def cleanKeys(data):
    keys =  list(data.keys())
    for k in keys:

        if "/" in k:
            key = k.rsplit("/")[1]
            data[key] = data[k]
            del data[k]

        if k in private_keys:
            del data[k]
        if k in to_replace.keys():
            data["lon"] = data[k][0]
            data["lat"] = data[k][1]
            del data[k]

        if(k.startswith("_")):
            try:
                del data[k]
            except:
                pass
    return data
        

def createDir(directory):

    if not os.path.exists(directory):
        os.makedirs(directory)

def writeCSV(name,folder,data,headers):
    createDir(folder)  
    path = os.path.join(folder,'%s.csv'%name)
    with open(path, 'w') as csvfile:
        fieldnames = data[0].keys()
        #import pdb;pdb.set_trace()
        print(headers)
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        writer.writeheader()
        for point in data:
            print(point)
            writer.writerow(point)
       

def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file))

def createZips(folder_names):
    for folder in folder_names:
        zipf = zipfile.ZipFile('exports/%s.zip'%folder, 'w', zipfile.ZIP_DEFLATED)
        zipdir(folder, zipf)
        zipf.close()



def getForms():
    r=requests.get("https://kobocat.unhcr.org/api/v1/data", headers={"Authorization":os.environ["token"]})
    return r.json()

def getFormData(url):
    r=requests.get(url, headers={"Authorization":"Token 492c552a20b14319074964052a8572cd67e31205"})
    return r.json()



if __name__ == "__main__":
    data = {}
    forms = getForms()
    forms_by_id={}
    print(forms)
    for a in forms:
        forms_by_id[a["id_string"]]=a
    for form in forms:
        if not form["id_string"] in excluded_forms and "education" in form["description"].lower():
            formData = getFormData(form["url"])
            if not formData:
                continue
            
            form_name = forms_by_id[formData[0]["_xform_id_string"]]["title"]
            folder_name = grouped_forms(form_name)
            if folder_name == "Education Facilities":
                print(folder_name)
                folder = createDir(folder_name)
                clean=[]
                all_keys=[]


                for point in formData:
                    cl=cleanKeys(point)
                    if cl:
                        clean.append(cl)
                        #import pdb;pdb.set_trace()
                        all_keys=all_keys+list(cl.keys())
                if clean:
                    print(clean)
                    writeCSV(form_name,folder_name,clean,list(set(all_keys)))

    #createZips(folders)
