#include "DHT.h"
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
 
// Uncomment whatever type you're using!
//#define DHTTYPE DHT11   // DHT 11
#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
//#define DHTTYPE DHT21   // DHT 21 (AM2301)
 
// Connect pin 1 (on the left) of the sensor to +5V
// NOTE: If using a board with 3.3V logic like an Arduino Due connect pin 1
// to 3.3V instead of 5V!
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 4 (on the right) of the sensor to GROUND
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor
 
const int DHTPin = 0;     // what digital pin we're connected to
 
DHT dht(DHTPin, DHTTYPE);
 
void setup() {
   pinMode(LED_BUILTIN, OUTPUT);

   Serial.begin(115200);
   Serial.println("Wifi-Temp|Humidity");

   WiFi.begin("Depto E", "XXXX");   //WiFi connection

   while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.println("Waiting for connection");
   }

   dht.begin();
}
 
void loop() {
 
   // Reading temperature or humidity takes about 250 milliseconds!
   float h = dht.readHumidity();
   float t = dht.readTemperature();
 
   if (isnan(h) || isnan(t)) {
      Serial.println("Failed to read from DHT sensor!");
      return;
   }
 
   Serial.print("Humidity: ");
   Serial.print(h);
   Serial.print(" %\t");
   Serial.print("Temperature: ");
   Serial.print(t);
   Serial.println(" *C ");

   String data = "temperature=" + String(t) +"&humidity=" + String(h);

   if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
 
     HTTPClient http;    //Declare object of class HTTPClient
   
     http.begin("http://temp-hum-sensor.herokuapp.com/");      //Specify request destination
     http.addHeader("Content-Type", "application/x-www-form-urlencoded");  //Specify content-type header
   
     int httpCode = http.POST(data);   //Send the request
     String payload = http.getString();                  //Get the response payload
   
     Serial.println(httpCode);   //Print HTTP return code
     Serial.println(payload);    //Print request response payload
 
   http.end();  //Close connection
 
   }else{
   
      Serial.println("Error in WiFi connection");   
   
   }
   
    delay(300000);  //Send a request every 5 minutes.
   

   
}
