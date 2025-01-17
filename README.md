<<<<<<< HEAD
# Precipitation and Temperature Analysis for Niamey, Niger

## Description

This repository contains a JavaScript script to generate a climogram chart, combining data on precipitation and temperature for Niamey, Niger. The script uses CHIRPS data for precipitation and MODIS data for temperature, covering the years 2000 to 2023.

## Files

- `Temperature_Precipitations_Niamey_Niger.js`: The main script that generates the climogram and visualizes precipitation and temperature data.
- `README.md`: Documentation for using the script and understanding the data.

## How to Use

1. Open Google Earth Engine Code Editor (https://code.earthengine.google.com/).
2. Copy and paste the contents of `Temperature_Precipitations_Niamey_Niger.js` into a new script.
3. Run the script to visualize the temperature and precipitation data for Niamey, Niger.
4. The script will generate a climogram chart and display the annual precipitation and temperature on the map.

## Requirements

- Access to Google Earth Engine account.
- `ee` (Earth Engine) API must be installed and configured.

## Example

```javascript
var roi = ee.FeatureCollection('projects/ee-ssouley/assets/Niamey');
generateClimogram(roi, 2000, 2023);
=======
# Precipitations_Temperature_Niamey_Niger
This repository contains a JavaScript script for generating a climogram that visualizes the relationship between precipitation (CHIRPS) and temperature (MODIS) in Niamey, Niger, from 2000 to 2023. The script processes climate data using Google Earth Engine and displays annual summaries and trends.
>>>>>>> ae149b7562a3f66aeac07c506384facd1a642c38
