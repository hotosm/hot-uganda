import psycopg2
from io import StringIO
import csv
import requests
from os import environ


urls = environ["urls"]
offset = None

conn = psycopg2.connect("dbname='{}' user='{}' host='127.0.0.1' password='{}' port='{}'".format(
    environ["database"], environ["dbUser"], environ["dbPassword"], environ["dbPort"]))
cursor = conn.cursor()
cursor.execute("select last_offset from updates order by created desc limit 1")
res = cursor.fetchone()
if res:
    (start,) = res
else:
    start = 1
cursor.close()


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

        return ret
    except:
        return None


def toWKT(string):
    if(string.strip() in ['n/a', '']):
        return None
    try:
        lines = string.split(";")
        spt = [*map(lambda x: x.strip().split(" "), lines)]
        pt = arrayToRing(list(spt))
        if len(lines) == 1:
            return 'POINT'+pt
        else:
            return 'LINESTRING'+pt
    except Exception as e:
        print(e)
        return None


def toMultiWTKT(arr):
    #import pdb;pdb.set_trace()
    parts = []
    for string in arr:
        if string == "n/a":
            continue
        lines = string.split(";")
        spt = [*map(lambda x: x.strip().split(" "), lines)]
        pt = arrayToRing(list(spt))
        if pt:
            parts.append(pt)
        if(len(parts) > 0):
            return 'MULTILINESTRING ('+', '.join(parts)+')'
        else:
            return None


def escape(_string):
    return _string.replace("'", "''")


for url in urls:
    r = requests.get(url, headers={
                     "Authorization": "Token "+environ["koboToken"]})
    reader = csv.DictReader(StringIO(r.text), delimiter=",")
    for index, row in enumerate(reader, start=start):
        date = row["start"].split("T")[0]
        contested = row.get("hh_present/contested", "")
        contested_with = row.get("hh_present/contested_with", "")
        contested_phone = row.get("hh_present/contested_phone", "")
        ext_plot_claim = row.get("hh_present/ext_plot_claim", "")
        ext_plot_reference = row.get("hh_present/ext_plot_reference", "")

        if not row.get("surveyor_name"):
            surveyor_name = row["surveyor_name_other"]
        else:
            surveyor_name = row["surveyor_name"]
        household_location = toWKT(row["household_location"])
        if not household_location:
            household_location = 'POINT EMPTY'

        contested_plot_boundary = toMultiWTKT([row.get("household_plot[1]/contested_plot_boundaries", "n/a"), row.get('household_plot[5]/contested_plot_boundaries', "n/a"), row.get(
            'household_plot[2]/contested_plot_boundaries', "n/a"), row.get('household_plot[3]/contested_plot_boundaries', "n/a")])
        if not contested_plot_boundary:
            contested_plot_boundary = "MULTILINESTRING EMPTY"

        plot_boundary = toWKT(row.get("household_plot[1]/plot_boundaries", "")) or toWKT(
            row.get("hh_present/household_plot", "n/a"))

        if not plot_boundary:
            plot_boundary = "LINESTRING EMPTY"

        empty_household = row.get("empty_household", "no")

        plot_ownerother = row.get("hh_present/plot_ownerother", "")

        plotboundary_responsible = row.get("plotboundary_responsible", "")

        hh_sanitation = row.get("hh_sanitation", "") or row.get(
            "hh_present/hh_sanitation", "")

        chemical = row.get("hh_present/toilets_disposal/chemical",
                           "") or row.get("hh_present/toilets_disposal_c/chemical", "")

        flush = row.get("hh_present/toilets_disposal/flush",
                        "") or row.get("hh_present/toilets_disposal_c/flush", "")
        pitlatrine = row.get("hh_present/toilets_disposal/pitlatrine",
                             "") or row.get("hh_present/toilets_disposal_c/pitlatrine", "")
        bucket = row.get("hh_present/toilets_disposal/bucket",
                         "") or row.get("hh_present/toilets_disposal_c/bucket", "")

        empty_householdname = row.get("empty_householdname", "")

        if not plot_boundary:
            plot_boundary = 'LINESTRING EMPTY'

        toilet_location = row.get("communal_sanitation/plot_toilet_location", "") or row.get(
            "hh_present/communal_sanitation/plot_toilet_location", "")

        toilet_location = toWKT(toilet_location)
        if not toilet_location:
            toilet_location = 'POINT EMPTY'

        wastepit_location = toWKT(row.get("plot_wastepit_location", "")) or toWKT(
            row.get("hh_present/plot_wastepit_location", ""))

        if not wastepit_location:
            wastepit_location = 'POINT EMPTY'

        addr_block = row.get("settlement_area/addr_block",
                             "") or row.get("hh_present/settlement_area/addr_block", "")

        addr_local_name = row.get("settlement_area/addr_local_hh_name", "")

        household_head = row.get("household_head_name", "") or row.get(
            "hh_present/household_head_name", "")

        family_name = row.get("family_name", "") or row.get(
            "hh_present/family_name", "")

        no_in_household = row.get("household_population", "") or row.get(
            "hh_present/household_population", "")

        ref_card_number = row.get("ref_card_number", "") or row.get(
            "hh_present/ref_card_number", "")

        mobile = row.get("mobile", "") or row.get("hh_present/mobile", "")

        country = row.get("country", "") or row.get("country_other", "") or row.get(
            "hh_present/country", "") or row.get("hh_present/country_other", "")
        has_toilet = row.get("plot_toilet", "") or row.get(
            "hh_present/plot_toilet", "")

        has_disposal = row.get("toilets_disposal", "")
        cookstove_present = row.get("cookstove_present", "") or row.get(
            "hh_present/cookstove_present", "")
        cookstove_installer = row.get("cookstove_installer", "") or row.get(
            "hh_present/cookstove_installer", "")
        date_cookstove_installed = row.get("date_installed", "") or row.get(
            "hh_present/date_installed", "")
        own_plot = row.get("own_plot", "") or row.get(
            "hh_present/own_plot", "")

        plot_description = row.get("plot_description", "") or row.get(
            "hh_present/plot_description", "") or row.get("hh_present/plot_description_other", "")

        addr_zone = row.get("settlement_area/addr_zone", "") or row.get("hh_present/settlement_area/village_other", "") or row.get(
            "hh_present/settlement_area/addr_rs_village", "") or row.get("hh_present/settlement_area/addr_zone", "") or row.get("hh_present/settlement_area/village_rs_nozone", "")

        addr_village = row.get("settlement_area/addr_rs_village", "") or row.get(
            "hh_present/settlement_area/addr_rs_villagenozone", "")

        empty_household = row.get("empty_household", "")

        phonenumber = row["phonenumber"]
        submissions_sql = """insert into submissions(
            sub_date,
        empty_householdname,
        empty_household,
        surveyor_name,
        phonenumber,
        household_location,
        contested_plot_boundary,
        plot_boundary,
        wastepit_location,
        toilet_location,
        addr_village,
        addr_zone,
        addr_block,
        ext_plot_claim,
        ext_plot_reference,
        plot_ownerother,
        plotboundary_responsible,
        hh_sanitation,
        chemical,
        flush,
        pitlatrine,
        bucket,
        addr_local_name,
        household_head,
        family_name,
        no_in_household,
        ref_card_number,
        mobile,
        country,
        has_toilet,
        has_disposal, 
        cookstove_present,
        cookstove_installer,
        date_cookstove_installed,
        own_plot,
        plot_description
        ) values 
        ('{}',
        '{}',
        '{}',
        '{}',
        '{}',
        ST_SetSRID(ST_GeomFromText('{}'),4326),
        ST_SetSRID(ST_GeomFromText('{}'),4326),
        ST_SetSRID(ST_GeomFromText('{}'),4326),
        ST_SetSRID(ST_GeomFromText('{}'),4326),
        ST_SetSRID(ST_GeomFromText('{}'),4326),
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}',
        '{}'
        
        )""".format(
            date,
            escape(empty_householdname),
            empty_household,
            escape(surveyor_name),
            phonenumber,
            household_location,
            contested_plot_boundary,
            plot_boundary,
            wastepit_location,
            toilet_location,
            addr_village,
            addr_zone,
            addr_block,
            ext_plot_claim,
            escape(ext_plot_reference),
            escape(plot_ownerother),
            escape(plotboundary_responsible),
            hh_sanitation,
            chemical,
            flush,
            pitlatrine,
            bucket,
            escape(addr_local_name),
            escape(household_head),
            escape(family_name),
            no_in_household,
            escape(ref_card_number),
            escape(mobile),
            escape(country),
            has_toilet,
            escape(has_disposal),
            escape(cookstove_present),
            escape(cookstove_installer),
            escape(date_cookstove_installed),
            escape(own_plot),
            escape(plot_description),
        )

        try:
            cursor = conn.cursor()
            cursor.execute(submissions_sql)
            # print(submissions_sql)
            conn.commit()
            cursor.close()
            cursor = conn.cursor()
            submissions_sql=submissions_sql.replace("submissions","boundaries")
            print(submissions_sql)
            cursor.execute(submissions_sql)
            # print(submissions_sql)
            conn.commit()
            cursor.close()
            offset = index
        except Exception as e:
            print(str(e))
            curs = conn.cursor()
            curs.execute("ROLLBACK")
            conn.commit()
            #import pdb;pdb.set_trace()
            #print(submissions_sql)

if offset:
    cursor = conn.cursor()
    update_sql = "insert into updates(last_offset) values({})".format(offset)
    cursor.execute(update_sql)
    conn.commit()
    cursor.close()
conn.close()
