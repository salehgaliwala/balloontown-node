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
const apiKey = process.env.apiKey;
const opencageapikey = process.env.opencageapikey;
const moment = require('moment-timezone');
const shopifyStore = process.env.shopifyStore;
const shopifyToken = process.env.shopifyToken;
const themeId = '141820559633';
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const assetKey = 'assets/settings.json'; // The asset key (filename)
const reviews = 'assets/reviews.json'; // The asset key (filename)
const apiUrl = `https://${shopifyStore}/admin/api/2023-04/themes/${themeId}/assets.json`;
const reviewUrl = `https://${shopifyStore}/admin/api/2023-04/themes/${themeId}/assets.json`;
const productApiUrl = `https://${shopifyStore}/admin/api/2021-10/products/`;
const sgMail = require('@sendgrid/mail');
// Process review emails using this route and cronjob which runs daily
// Set up SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// Define a GET route to process the JSON data
app.get('/process-orders', async (req, res) => {
  try {
    // Fetch the JSON data from the remote URL    

    // Extract JSON data
    //const jsonData = response.data;
    const headers = {
           'X-Shopify-Access-Token': shopifyToken,
      };
    let email = '';  
     const response = await axios.get(
      `https://balloontown.com.au/cdn/shop/t/2/assets/reviews.json?${Date.now()}`
    ).then((data) => {
      jsonData = data.data;
    });

    // Get today's date in UTC format
    const today = new Date();
   // const emailTemplate = fs.readFileSync('emailTemplate.html', 'utf-8');
    var emailTemplate = '<!DOCTYPE html> <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"> <head> <title></title> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--> <style> * { box-sizing: border-box; } body { margin: 0; padding: 0; } a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; } #MessageViewBody a { color: inherit; text-decoration: none; } p { line-height: inherit } .desktop_hide, .desktop_hide table { mso-hide: all; display: none; max-height: 0px; overflow: hidden; } .image_block img+div { display: none; } @media (max-width:620px) { .desktop_hide table.icons-inner { display: inline-block !important; } .icons-inner { text-align: center; } .icons-inner td { margin: 0 auto; } .mobile_hide { display: none; } .row-content { width: 100% !important; } .stack .column { width: 100%; display: block; } .mobile_hide { min-height: 0; max-height: 0; max-width: 0; overflow: hidden; font-size: 0px; } .desktop_hide, .desktop_hide table { display: table !important; max-height: none !important; } .row-1 .column-1 .block-2.heading_block h2 { text-align: center !important; } .row-1 .column-1 .block-2.heading_block h2 { font-size: 21px !important; } } </style> </head> <body style="background-color: #fff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;"> <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff;"> <tbody> <tr> <td> <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tbody> <tr> <td> <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600"> <tbody> <tr> <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"> <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad" style="width:100%;"> <div class="alignment" align="center" style="line-height:10px"><img src="https://57d858b00d.imgdist.com/public/users/Integrators/BeeProAgency/837506_821530/MaryamLogo5-2_2_300x.png" style="display: block; height: auto; border: 0; max-width: 300px; width: 100%;" width="300"></div> </td> </tr> </table> <table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad"> <h2 style="margin: 0; color: #000; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 30px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">What did you think of your recent purchase?</span></h2> </td> </tr> </table> <table class="image_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad" style="width:100%;"> <div class="alignment" align="center" style="line-height:10px"><img src="https://57d858b00d.imgdist.com/public/users/Integrators/BeeProAgency/837506_821530/stars.png" style="display: block; height: auto; border: 0; max-width: 183px; width: 100%;" width="183"></div> </td> </tr> </table> <table class="paragraph_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"> <tr> <td class="pad"> <div style="color:#101112;direction:ltr;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:19.2px;"> <p style="margin: 0;">We\'d love to hear how you enjoyed these products. Please help others by leaving a quick review of your shopping experience</p> </div> </td> </tr> </table> <table class="divider_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad"> <div class="alignment" align="center"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span>&#8202;</span></td> </tr> </table> </div></td></tr></table></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> {product} <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;"> <tbody> <tr> <td> <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600"> <tbody> <tr> <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"> <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: \'Inter\', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;"> <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]--> <!--[if !vml]><!--> <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]--> <tr> <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;"><a href="http://designedwithbeefree.com/" target="_blank" style="text-decoration: none;"><img class="icon" alt="Beefree Logo" src="https://d1oco4z2z1fhwp.cloudfront.net/assets/Beefree-logo.png" height="32" width="34" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></a></td> <td style="font-family: \'Inter\', sans-serif; font-size: 15px; color: #1e0e4b; vertical-align: middle; letter-spacing: undefined; text-align: center;"></td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table><!-- End --> </body> </html>';
    var linehtml = '';
    // Iterate through JSON objects
    jsonData.forEach((obj, index) => {
      const timestamp = new Date(obj.deliveryTimestamp);
   
      // Check if the timestamp is greater than or equal to today
      if (timestamp <= today) 
      {
          console.log(obj.deliveryTimestamp); 
          products = obj.line_items;
          products.forEach(async(product,index) => {
            const productname = obj.line_items[index].name;
            const productID = obj.line_items[index].product_id;
            
            // get the product image
             await axios.get(productApiUrl+'/'+productID+'.json',{headers})
                .then(response => {
                    productImages =   response.data.product;  
                    console.log( productImages );
                  if (productImages.images && productImages .images.length > 0) {
          
                      productImages.images.forEach(image => {
                        console.log(image.src);
                        productImg = image.src;  
                      });
                      
                    }
                    else
                    {
                      productImg = '';
                    }                     
                    
                    const html = '<tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600"><tbody><tr><td class="column column-1" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"><table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"><tr><td class="pad" style="width:100%;"><div class="alignment" align="center" style="line-height:10px"><img src="'+productImg+'" style="display: block; height: auto; border: 0; max-width: 150px; width: 100%;" width="150" /></div></td></tr></table></td><td class="column column-2" width="75%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"><table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"><tr><td class="pad"><h2 style="margin: 0; color: #000; direction: ltr; font-family: Tahoma, Verdana, Segoe, sans-serif; font-size: 20px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">'+productname+'</span></h2></td></tr></table><table class="button_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"><tr><td class="pad"><div class="alignment" align="left"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://g.page/r/CW7maa3ApfR7EB0/review" style="height:29px;width:91px;v-text-anchor:middle;" arcsize="14%" stroke="false" fillcolor="#c7a3ab"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#000; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="https://g.page/r/CW7maa3ApfR7EB0/review" target="_blank" style="text-decoration:none;display:inline-block;color:#000;background-color:#c7a3ab;border-radius:4px;width:auto;border-top:0px solid transparent;font-weight:700;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 19.2px;">Write a review</span></span></a></center></v:textbox></v:roundrect></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table>';
                    linehtml = linehtml + html;
                    const replacedTemplate = emailTemplate.replace('{product}', linehtml); 
                       email = obj.customer.email;
                       console.log(email);
                    if(email) {  
                      console.log(email);               
                      const sendmail = {
                          to: email, // Replace with the recipient's email address
                          from: 'customer.service@balloontown.com.au', // Replace with your sender email address
                          subject: 'Review your purchase with Balloontown',
                          html: replacedTemplate,
                        }
                        sgMail.send(sendmail, (error, result) => {
                          if (error) {
                            console.error('Error sending email:', error);
                          } else {
                            console.log('Email sent successfully.');
                          }
                        });
                      }
                    // 
                })
                .catch(error => {
                 console.error('Error fetching product details:', error);
                });
           
          });  

        // Remove the object from the JSON array
        jsonData.splice(index, 1);
        axios({
            method: 'PUT',
            url: reviewUrl,
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": shopifyToken,
            },
            data: {
              asset: {
                key: reviews,
                value: JSON.stringify(jsonData, null, 2),
              },
            },
          })
          .then((response) => {
            console.log(`Received and saved order data`);
           
        
          })
          .catch((error) => {
            console.error('Error saving order:', error);
            res.status(500).json({ error: 'Error saving order' });
          });
      }
    });   

    // Send a response to the client
     res.status(200).json({ message: 'Data processing complete.' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//Webhook from the shopify after order is fulfilled.
// Inside the /webhook route
app.post('/webhook', async(req, res) => {
  const { body } = req;

  // Verify the webhook (You may want to implement Shopify's verification logic here)

  // Extract order data
  const orderData = body;

  // Calculate the timestamp for "now + 1 day"
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  const now = new Date();
  const oneDayLater = new Date(now.getTime() + oneDayInMilliseconds);

  // Add the timestamp to the order data
  orderData.deliveryTimestamp = oneDayLater;
   let existingOrders = [];
  // Save order data to a JSON file
  const timestamp = Date.now(); 
  //fs.writeFileSync(fileName, JSON.stringify(orderData, null, 2));
  const response = await axios.get(
      `https://balloontown.com.au/cdn/shop/t/2/assets/reviews.json?${Date.now()}`
    ).then((data) => {
          console.log(data.data);
         
          existingOrders = JSON.parse(JSON.stringify(data.data));
        //  existingOrders.push(data.data);
          existingOrders.push(orderData);
            axios({
                    method: 'PUT',
                    url: reviewUrl,
                    headers: {
                      "Content-Type": "application/json",
                      "X-Shopify-Access-Token": shopifyToken,
                    },
                    data: {
                      asset: {
                        key: reviews,
                        value: JSON.stringify(existingOrders, null, 2),
                      },
                    },
                  })
                    .then((response) => {
                      console.log(`Received and saved order data`);
                       res.status(200).send('Webhook received');
                  
                    })
                    .catch((error) => {
                      console.error('Error saving order:', error);
                      res.status(500).json({ error: 'Error saving order' });
                    });
        })
        .catch((error) => {
           console.error('Error receiving order:', error);
           res.status(500).json({ error: 'Error receiving order' });
        });
  



  //res.status(200).send('Webhook received');
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const expectedUsername = process.env.REACT_APP_USERNAME;
  const expectedPassword = process.env.REACT_APP_PASSWORD;

  if (username === expectedUsername && password === expectedPassword) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/saveSettings', (req, res) => {
  const settings = req.body;
  const assetValue = JSON.stringify(settings, null, 2)

  axios({
        method: 'PUT',
        url: apiUrl,
         headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": shopifyToken,
        },
        data: {
          asset: {
            key: assetKey,
            value: assetValue,
          },
        },
      })
        .then((response) => {
         console.log('Settings saved successfully');
         res.json({ message: 'Settings saved successfully' });
        })
        .catch((error) => {
           console.error('Error saving settings:', error);
           res.status(500).json({ error: 'Error saving settings' });
        });
      });

app.get('/getSettings', async(req, res) => {
   const response = await axios.get(
      `https://cdn.shopify.com/s/files/1/0808/2230/5045/t/2/assets/settings.json?${Date.now()}`
    ).then((data) => {
          console.log(data.data);
          const settings = data.data;
          res.json(settings);
        })
        .catch((error) => {
           console.error('Error saving settings:', error);
           res.status(500).json({ error: 'Error saving settings' });
        });
          /*  const settingsFilePath = path.join(__dirname, 'settings.json');
            fs.readFile(settingsFilePath, 'utf8', (err, data) => {
              if (err) {
                console.error('Error reading settings:', err);
                res.status(500).json({ error: 'Error fetching settings' });
              } else {
                const settings = JSON.parse(data);
                res.json(settings);
              }
            });*/
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
   //let endPostalCode = address1 +', '+address2 +', '+address3 +', '+city+', '+province+', '+country+', '+postalCode;

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
   const currentDate = moment();
   const formattedDate = currentDate.format('YYYY-MM-DD HH:mm:ss');
   const nextDay = currentDate.add(1, 'day');
   const formattedNextDay = nextDay.format('YYYY-MM-DD HH:mm:ss');
   try {

       const response = await axios.get(
          `https://cdn.shopify.com/s/files/1/0808/2230/5045/t/2/assets/settings.json?${Date.now()}`
         ).then(async (data) => {
          const jsonData = data.data;
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
                    "min_delivery_date": formattedDate,
                    "max_delivery_date": formattedNextDay
                  }
                ]
              };
              res.send(response);
        })
        
       /*fs.readFile('settings.json', 'utf8', async(err, data) => {
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

     });*/
   
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

app.get('/datepicker-options', async(req, res) => {
//  console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
       const response = await axios.get(
          `https://cdn.shopify.com/s/files/1/0708/4412/1361/t/2/assets/settings.json?${Date.now()}`
         ).then(async (data) => {
          const jsonData = data.data;
          const currentTime = moment();
          const currentTimeFormatted = currentTime.format('h:mm A'); // Format as "3:30 PM"
          const isMorning = currentTime.format('H') >= 11;
          const isAfternoon = currentTime.format('H') >= 12;
          const isOnePM = currentTime.format('H') >= 13;
          const isTwoPM = currentTime.format('H')  >= 14;
          const startDate = moment(jsonData.fromDate, 'YYYY-MM-DD');
          const endDate = moment(jsonData.toDate, 'YYYY-MM-DD');                   
          const currentDate = startDate.clone(); 
          while (currentDate <= endDate) {           
            jsonData.dateFields.push(currentDate.format('YYYY-MM-DD'));
             currentDate.add(1, 'days');
          }
           console.log(isMorning);
           console.log(currentTime.format('H'));
           console.log(jsonData.selectedPeriods['11am']);

          if(isMorning && jsonData.selectedPeriods['11am']){      
          // Add the current date to the blockedDates array if it's morning
                jsonData.dateFields.push(currentTime.format('YYYY-MM-DD'));
              //  console.log(jsonData.dateFields);
            }
          
           
          if(isAfternoon && jsonData.selectedPeriods['12pm'] ){      
               // Add the current date to the blockedDates array if it's morning
                jsonData.dateFields.push(currentTime.format('YYYY-MM-DD'));
              //  console.log(jsonData.dateFields);
          }
          if(isOnePM && jsonData.selectedPeriods['1pm'] ){      
               // Add the current date to the blockedDates array if it's morning
                jsonData.dateFields.push(currentTime.format('YYYY-MM-DD'));
                console.log(jsonData.dateFields);
          }
           if(isTwoPM && jsonData.selectedPeriods['2pm'] ){      
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

         })
  /*fs.readFile('settings.json', 'utf8', async(err, data) => {
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
      });*/
 
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
