# Clean Form CSVs

This script is meant to aid in the cleaning and merging of data from ODK-Form CSVs. 

clean_form_csvs.py handles one argument (after [file]) at a time, with an option to add -n/--name for a custom output name of a given file.

## Dependencies

* python2.7
* pandas

#### Instructions for installing python: 

* https://www.python.org/downloads/release/python-2714/
* https://www.howtogeek.com/197947/how-to-install-python-on-windows/
* https://askubuntu.com/questions/458061/how-do-i-install-python-through-the-terminal

#### Instructions for installing pip:

* https://pip.pypa.io/en/stable/installing/

#### Instructions for installing pandas:

* https://pandas.pydata.org/pandas-docs/stable/install.html#installing-from-pypi

## Steps

#### Making the script executable:

You can make the script name executable by running ```chmod +x clean_form_csvs.py``` and executing it using ```./clean_form_csvs.py```

#### Running the script with chmod:

```python clean_form_csvs.py <some argument>``` to call the script into action.

#### Directions

Start by prepping each CSV, with the ```-p``` command, this properly formats the CSV for use in excel or elsewhere.

In order for each CSV to be opened in QGIS, use the ```-f``` or ```-bf``` (for batch fix lat/lon), in order to fix the latitude and longitude columns to regular standards.

For more help, run ```python clean_form_csvs.py --help```