// Function to Generate Climogram Chart and Layers for a Region of Interest (ROI)
function generateClimogram(roi, startYear, endYear) {
    // Outline
    var empty = ee.Image().byte();
    var outline = empty.paint({
    featureCollection: roi,
    color: 2,
    width: 2
    });
    
    Map.centerObject(roi);
   
    // Date range
    var interval = ee.List.sequence(startYear, endYear);
    var startDate = ee.Date.fromYMD(startYear, 1, 1);
    var endDate = ee.Date.fromYMD(endYear, 12, 31);
   
    // Precipitation Collection (CHIRPS)
    var chirps = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY")
    .select('precipitation')
    .filterDate(startDate, endDate)
    .filterBounds(roi);
   
    // Annual CHIRPS Summation
    var annualChirps = ee.ImageCollection.fromImages(
    interval.map(function (year) {
    var annual = chirps.filter(ee.Filter.calendarRange(year, year, 'year'))
    .sum()
    .clip(roi)
    .rename('Precipitation by CHIRPS');
    return annual
    .set('year', year)
    .set('system:time_start', ee.Date.fromYMD(year, 1, 1));
    })
    );
    
    print('CHIRPS Collection Size:', annualChirps.size());
   
    // Temperature Collection (MODIS)
    var modis = ee.ImageCollection("MODIS/061/MOD11A1")
    .select('LST_Day_1km')
    .filterDate(startDate, endDate)
    .filterBounds(roi);
   
    // Annual MODIS Temperature Averaging
    var annualModis = ee.ImageCollection.fromImages(
    interval.map(function (year) {
    var annual = modis.filter(ee.Filter.calendarRange(year, year, 'year'))
    .mean()
    .multiply(0.02)
    .subtract(273.15) // Convert to Celsius
    .clip(roi)
    .rename('Temperature by MOD11A1');
    return annual
    .set('year', year)
    .set('system:time_start', ee.Date.fromYMD(year, 1, 1));
    })
    );
   
    print('MODIS Collection Size:', annualModis.size());
    
    // Join Collections by Year
    var innerJoin = ee.Join.inner();
    var filterTimeEq = ee.Filter.equals({
    leftField: 'year',
    rightField: 'year'
    });
    var joinedCollection = innerJoin.apply(annualChirps, annualModis, filterTimeEq);
    var combinedCollection = ee.ImageCollection(joinedCollection.map(function(feature) {
    return ee.Image.cat(feature.get('primary'), feature.get('secondary'));
    }));
   
    print('Joined Bands:', combinedCollection);
   
    // Visualization Parameters
    Map.addLayer(annualModis, {
    palette: ['purple', 'cyan', 'blue', 'green', 'yellow', 'orange', 'red', 'black'],
    min: 3.88,
    max: 30.25
    }, 'Temperature (MODIS)', false);
   
    Map.addLayer(annualChirps, {
    palette: ['cyan', 'navy', 'turquoise', 'aqua', 'midnightblue', 'skyblue', 'royalblue', 'aquamarine'],
    min: 146.1,
    max: 693.13
    }, 'Precipitation (CHIRPS)', false);
   
    Map.addLayer(outline, {}, 'Region Outline', true);
    
    
    
    
    // Generate Climogram Chart
    var chart = ui.Chart.image.series(combinedCollection.select(['Precipitation by CHIRPS', 'Temperature by MOD11A1']),
    roi, ee.Reducer.mean(), 2500, 'year')
    .setChartType('ComboChart')
    .setSeriesNames(['Precipitation by CHIRPS', 'Temperature by MOD11A1'])
    .setOptions({
    title: 'Climogram: Precipitation (mm/year) and Temperature (°C)',
    seriesType: "bars",
    series: {
    0: { targetAxisIndex: 0, color: 'CadetBlue' },
    1: { targetAxisIndex: 1, type: 'line', color: 'red' }
    },
    vAxes: {
    0: { title: 'Precipitation (mm/year)' },
    1: { title: 'Temperature (°C)' }
    },
    hAxes: {
    0: { title: 'Year', format: '####' } // Removes comma in the year
    },
    lineWidth: 1,
    pointSize: 0,
    bar: { groupWidth: '80%' }
    });
   
    print(chart);
   }
   
   // Example of usage
   var roi = ee.FeatureCollection('projects/ee-ssouley/assets/Niamey');
   generateClimogram(roi, 2000, 2023);
   