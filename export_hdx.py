from hdx.hdx_configuration import Configuration
from hdx.data.dataset import Dataset
from hdx.data.resource import Resource
import urllib
from datetime import datetime

urlBase="http://uganda-omk.hotosm.org/fp/assets/exports/"

datasets=[
          {"name":"Villages","slug":"villages"},
          {"name":"Cash Based Intervation Points","slug":"cash-based-intervation-points"},       
          {"name":"Water & Sanitation Combined","slug":"water-and-sanitation"},
          {"name":"Education Facilities","slug":"education-facilities"},
          {"name":"Water Facilities","slug":"water-facilities"},
          {"name":"Sanitation Facilities","slug":"sanitation-facilities"},
          {"name":"Other Important Facilities","slug":"other-important-facilities"},
          {"name":"Health Facilities","slug":"health-facilities"},
          ]
MARKDOWN = """
    These datasets contains The data from surveys and mapping in northern Uganda performed by HOTOSM and partners.
    """
def sendHDX():
    Configuration.create(hdx_site='prod', user_agent='HOT-Uganda')
    for d in datasets:
        print(d)
        url = urlBase+d["name"]+".zip"
        title="HOTOSM Uganda %s (Raw GIS Survey)"%d["name"]
        dataset = Dataset({
                'name': d["slug"],
                'title': title,
                "license_id": 'hdx-odc-odbl',
                "subnational": 1 ,
                "notes": MARKDOWN,
                "caveats": "",
                "package_creator": "mosesmugisha",
                "private": False,
                "dataset_source":"GIS survey"  
        })
        dataset['groups'] = []
        dataset['methodology_other'] = 'Volunteered geographic information'
        dataset['methodology'] = 'Other'
        dataset.set_maintainer('6a0688ce-8521-46e2-8edd-8e26c0851ebd')
        dataset.set_organization('225b9f7d-e7cb-4156-96a6-44c9c58d31e3')
        dataset.add_country_location("ug")
        dataset.set_expected_update_frequency('Every month')
        dataset.set_dataset_year_range(2017,2018)
        tags = ['hotuganda', 'ussd','openstreetmap','uganda']
        dataset['subnational']=True
        dataset.add_tags(tags)
        

        resource_data = {
                    'name': d["slug"],
                    'description': ' ',
                    'format': 'csv',
                    'url': url
                }
        print(dataset)
        resource = Resource(resource_data)
        dataset.add_update_resource(resource)
        dataset.set_dataset_date_from_datetime(datetime.now())
        dataset.create_in_hdx(allow_no_resources=True)
        #dataset.create_in_hdx()

if __name__ == "__main__":
    sendHDX()
