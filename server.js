require('dotenv').config()
process.env.TZ = 'Australia/Sydney';
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require("cors");
const app = express();
const port = 3001;
const  apiKey = process.env.apiKey;
const opencageapikey = process.env.opencageapikey;
const moment = require('moment-timezone');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/saveSettings', (req, res) => {
  const settings = req.body;

  const settingsFilePath = path.join(__dirname, 'settings.json');
  fs.writeFile(settingsFilePath, JSON.stringify(settings, null, 2), (err) => {
    if (err) {
      console.error('Error saving settings:', err);
      res.status(500).json({ error: 'Error saving settings' });
    } else {
      console.log('Settings saved successfully');
      res.json({ message: 'Settings saved successfully' });
    }
  });
});

app.get('/getSettings', (req, res) => {
  const settingsFilePath = path.join(__dirname, 'settings.json');
  fs.readFile(settingsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading settings:', err);
      res.status(500).json({ error: 'Error fetching settings' });
    } else {
      const settings = JSON.parse(data);
      res.json(settings);
    }
  });
});

// This is callback URL
app.post('/calculate_shipping', async function(req, res){
   
   //let items = req.body.rate.items;
   //let endPostalCode =  req.body.rate.origin.postal_code;
   let city = req.body.rate.destination.city;
   let postalCode = req.body.rate.destination.postal_code;
   let address1 = req.body.rate.destination.address1;
   let address2 = req.body.rate.destination.address2;
   let address3 = req.body.rate.destination.address3;
   let province = req.body.rate.destination.province;
   let country = req.body.rate.destination.country;
   //let endPostalCode = '4140 Commonwealth St,New South Wales,Sydney, Australia';
 //  let endPostalCode = address1 +', '+address2 +', '+address3 +', '+city+', '+province+', '+country+', '+postalCode;

   let endPostalCode ='';
   if(address1) { endPostalCode = endPostalCode + address1 + ',';}
   if(address2) { endPostalCode = endPostalCode + address2 + ',';}
   if(address3) { endPostalCode = endPostalCode + address3 + ',';}
   if(city) { endPostalCode = endPostalCode + city + ',';}
   if(province) { endPostalCode = endPostalCode + province + ',';}
   if(country) { endPostalCode = endPostalCode + country + ',';}
   if(postalCode) { endPostalCode = endPostalCode + postalCode;}
   // Get the origin address form json.
   // let startPostalCode = '404 b/1 Nagurra Place, Rozelle New South Wales 2039, Australia';
   console.log(endPostalCode)
   let startPostalCode = '';
   // Implement OPEN CAGE API
   let shipping_cost = 0;
   let distance = 0;
   try {

   
    
    fs.readFile('settings.json', 'utf8', async(err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }
       const jsonData = JSON.parse(data);
       startPostalCode = jsonData.storeAddress;
       distance = await getRouteDistance(startPostalCode, endPostalCode);
      
       const shippingData = jsonData.shippingData;
       for (const item of shippingData) {
          const distanceFrom = item.distanceFrom;
          const distanceTo = item.distanceTo;
        
          if( distanceFrom  <= distance && distanceTo >= distance)
          {
              shipping_cost = item.shippingRate;
              console.log(`Shipping Rate: $${shipping_cost}`);
          }

          console.log(`Distance From: ${distanceFrom}`);
          console.log(`Distance To: ${distanceTo}`);
        
          console.log("---------------------");
        }

        console.log(`Driving distance between ${startPostalCode} and ${endPostalCode}: ${distance} km`);
        let response = {
                        "rates": [
                          {
                            "service_name": "Balloon Town Shipping",
                            "service_code": "standard",
                            "total_price": shipping_cost * 100,
                            "description": "Delivery",
                            "currency": "AUD",
                            "min_delivery_date": "2023-12-30 14:48:45 -0400",
                            "max_delivery_date": "2024-01-06 14:48:45 -0400"
                          }
                        ]
                      };
                      res.send(response);

     });
   
        // Construct response
  
  // Send response
  
  
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
   

});



async function getRouteDistance(startPostalCode, endPostalCode) {
  try {
    const startCoordinates = await getCoordinatesForPostalCode(startPostalCode);
    const endCoordinates = await getCoordinatesForPostalCode(endPostalCode);
    console.log(startCoordinates);
    console.log(endCoordinates);
    //   console.log('https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoordinates.lng},${startCoordinates.lat}&end=${endCoordinates.lng},${endCoordinates.lat}')  ;
    const response = await axios.get(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoordinates.lng},${startCoordinates.lat}&end=${endCoordinates.lng},${endCoordinates.lat}`
    );
    console.log(response.data.features[0].properties.summary.distance);
    const route = response.data.features[0].properties.summary.distance;
    const distance = route / 1000; // Convert meters to kilometers
    console.log(distance);
   return distance;
  } catch (error) {
    throw new Error('Error fetching route data from OpenRouteService API: ' + error.message);
  }
}

async function getCoordinatesForPostalCode(postalCode) {
  try {
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${postalCode}&key=${opencageapikey}`);
    const result = response.data.results[0];
    
    if (result && result.geometry) {
      const { lat, lng } = result.geometry;
      return { lat, lng };
    } else {
      throw new Error('Could not retrieve coordinates for the given postal code.');
    }
  } catch (error) {
    throw new Error('Error fetching data from OpenCage API: ' + error.message);
  }
}

app.get('/datepicker-options', (req, res) => {
  console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
  fs.readFile('settings.json', 'utf8', async(err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }
          const currentTime = moment();
        const currentTimeFormatted = currentTime.format('h:mm A'); // Format as "3:30 PM"
        const isMorning = currentTime.format('A') === 'AM';
        const isAfternoon = currentTime.format('A') === 'PM';
     
        
         const jsonData = JSON.parse(data);
             if(isMorning && jsonData.selectedPeriods['am']){      
          // Add the current date to the blockedDates array if it's morning
                jsonData.dateFields.push(currentTime.format('YYYY-MM-DD'));
                console.log(jsonData.dateFields);
            }
            console.log(isAfternoon);
            console.log(jsonData.selectedPeriods['pm']);
             if(isAfternoon && jsonData.selectedPeriods['pm'] ){      
               // Add the current date to the blockedDates array if it's morning
                jsonData.dateFields.push(currentTime.format('YYYY-MM-DD'));
                console.log(jsonData.dateFields);
            }
          const dayNameToNumber = {
              "sunday": 0,
              "monday": 1,
              "tuesday": 2,
              "wednesday": 3,
              "thursday": 4,
              "friday": 5,
              "saturday": 6
            };  
          let blockedWeekdays = [];
          let selectedDays = jsonData.selectedDays
          for (const day in selectedDays) {
              if (selectedDays[day] === true) {
                blockedWeekdays.push(dayNameToNumber[day]);
              } 
            }  
          const datepickerOptions = {
          dateFormat: 'yy-mm-dd',
          minDate: 0,
          maxDate: '+30d', // Allow selecting dates up to 30 days from today
          blockedWeekdays: blockedWeekdays,
          blockedDates: jsonData.dateFields, 
          // Add other options as needed
        };
        res.json(datepickerOptions);
      });
 
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
