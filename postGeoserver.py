from flask import Flask, request #import main Flask class and request object
import json
import psycopg2
from os import environ
app = Flask(__name__) #create the Flask app


def arrayToRing(arr):
    #import pdb;pdb.set_trace()
    try:
        parts = []
        ret = ''
        for item in arr:
            t = item[0:2]
            t.reverse()
            parts.append(' '.join(map(str, t)))

        ret += '(' + (', ').join(parts) + ')'

        return 'LINESTRING'+ret
    except:
        return None

@app.route('/submissions', methods=['POST'])
def query_example():
	if request.method == 'POST':
		conn = psycopg2.connect("dbname='{}' user='{}' host='127.0.0.1' password='{}' port='{}'".format(
    	environ["database"], environ["dbUser"], environ["dbPassword"], environ["dbPort"]))
		
		for row in request.json["features"]:
			id = int(row.get("properties",{}).get("id"))
			if id:
				cursor = conn.cursor()
				boundary = arrayToRing(row["geometry"]["coordinates"])
				sql="update boundaries set (plot_boundary,clean) = (ST_SetSRID(ST_GeomFromText('{}'),4326),1) where id={}".format(boundary,id)
				cursor.execute(sql)
				conn.commit()
				cursor.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000) #ru