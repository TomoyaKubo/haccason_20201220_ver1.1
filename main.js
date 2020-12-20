//import CCS811 from "./node_modules/@chirimen-raspi/chirimen-driver-i2c-ccs811/CCS811.js";

import CCS811 from "https://cdn.jsdelivr.net/npm/@chirimen/ccs811@1.0.0/ccs811.js";

main();

async function main() {
  try {
    var i2cAccess = await navigator.requestI2CAccess();
    var port = i2cAccess.ports.get(1);
    var ccs = new CCS811(port);
    await ccs.init();
    var sht = new SHT30(port);
    await sht.init();

    while (1) {
      var data = await ccs.readData();
      document.getElementById("CO2").innerHTML = data.CO2 + "ppm";
      document.getElementById("TVOC").innerHTML = data.TVOC + "ppb";

      var area = 1;
      var postData = "area=" + area+"&" + "co2=" + data.CO2;

      var data = await sht.readData();
      document.getElementById("temperature").innerHTML =
        data.temperature.toFixed(2) + "℃";
      document.getElementById("humidity").innerHTML =
        data.humidity.toFixed(2) + "%";
      await sleep(1500);

      postData += "&humidity=" + data.humidity;
      $.post(
        "https://ob9fyj94i8.execute-api.us-east-2.amazonaws.com/default/popo",
        postData
      ).done(function (data) {
        console.log(data);
      });
    }
  } catch (error) {
    console.error("error", error);
  }
}
