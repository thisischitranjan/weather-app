console.log("weather app");
let apiKey = "7bda37099ba87608f6021aa4240e084f";
let url;
let cityInput = "Delhi";
let unit;
let speed_unit;
let lat;
let lon;
let glcn = false; //to check  device location is feched
let places = document.querySelectorAll(".place");
let input = document.querySelector("input");
let lcn = document.querySelector("#location");
let cf = document.querySelector("#cf");
let body = document.querySelector("body");


// window.onload = () => {
  input.value = "";
  unit = "metric";
  speed_unit = "meter/sec";
  requesturl(cityInput);
  tempload()
//}

//  convert unit and call function -------------------------------------------------------------
cf.addEventListener("click", (event) => {
  // console.log(cf.innerHTML)
  console.log(event);
  if (event.target.innerHTML == "°C") {
    console.log("event");
    cf.innerHTML = "&#176F";
    console.log(cf.innerHTML);
    unit = "imperial";
    speed_unit = "miles/hr";
  } else {
    cf.innerHTML = "&#176C";
    unit = "metric";
    speed_unit = "meter/sec";
  }

  if (input.value != "") {
    requesturl(input.value);
  } else {
    if (cityInput && glcn == false) {
      requesturl(cityInput);
    } else {
      getLocation();
    }
  }
});

//using device location ------(method 1)-------------
lcn.addEventListener("click", (event) => {
  getLocation();
  glcn = true;
  // clear----------
  cityInput = "Delhi";
  input.value = "";
  // event.stopImmediatePropagation()
});
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
//to request url-----------------------------------------------------------------------------------------
function requesturl(cityInput) {
  url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=${unit}&appid=${apiKey}`;
  console.log(url);
  fetchData();
}

// show location ------------------------------------------------------------------------------------------------
function showPosition(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;

  // console.log(url);
  fetchData();
}

// for places--search ---(method 2)----------------------------------------------------------------------------------------------------
places.forEach((place) => {
  place.addEventListener("click", (event) => {
    cityInput = event.target.innerHTML;
    console.log(cityInput);
    requesturl(cityInput);
    // clear inputvalue -----
    input.value = "";
    glcn = false;
  });
});

// console.log(cityInput)
// for input search (method 3)-----------------------------------------------------------------------------------------
function search() {
  // console.log(input.value)
  if (input.value == "") {
    alert("please enter a city name");
    console.log(cityInput);
  } else {
    cityInput = input.value;
    console.log(cityInput);
    requesturl(cityInput);
    // clear part ---------------------
    setTimeout(() => {
      input.value = "";
      cityInput = "delhi";
    }, 6000);
    glcn = false; //needed immidietly
    //---------------------------
  }
}

//data fetching-----------------------------------------------------------------------------------------------------
function fetchData() {
  // alert("Fetching weather details...");
  document.querySelector("#info").innerHTML= "Fetching Data..."
  fetch(url)
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      //time
      setdatetime(data);

      // console.log(data);
      hourForecast(data);
      dayForecast(data);
      console.log(data);
      document.querySelector(
        "#city"
      ).innerHTML = `${data.name}, ${data.sys.country}`;
      document.querySelector("#wtype").innerHTML = `${data.weather[0].main}`;
      document.querySelector("#mainimg").src =
        "http://api.openweathermap.org/img/w/" + data.weather[0].icon + ".png";
      // src= "http://openweathermap.org/img/wn/"+ data.weather[0].icon+"@2x.png"
      document.querySelector("figcaption").innerHTML =
        data.weather[0].description;
      document.querySelector("#temp").innerHTML =
        Math.floor(data.main.temp) + "&#176";

      //side data
      document.querySelector("#realfeel").innerHTML =
        "Real feel: " + Math.floor(data.main.feels_like) + "&#176";
      document.querySelector("#humidity").innerHTML =
        "Humidity: " + Math.floor(data.main.humidity) + "%";
      document.querySelector("#wind").innerHTML = `Wind: ${Math.ceil(
        data.wind.speed
      )} ${speed_unit}`;
      //lower data
      document.querySelector("#high").innerHTML =
        "High: " + Math.ceil(data.main.temp_max) + "&#176";
      document.querySelector("#low").innerHTML =
        "Low: " + Math.floor(data.main.temp_min) + "&#176";

      // console.log(data.name,data.sys.country);
      setTimeout(() => {
        document.querySelector("#info").innerHTML= "chitranjanhembrom"
      }, 700);
      
    })
    .catch((error) => {
      document.querySelector("#info").innerHTML="Error occured:" + error;
      setTimeout(() => {
        document.querySelector("#info").innerHTML= "chitranjanhembrom"
      }, 700);
    });
   
}

// hourForecast------------------------------------------------------------------------------------------------
function hourForecast(data) {
  let shi = document.querySelectorAll(".shi");
  shi = Array.from(shi);
  let htemp = document.querySelectorAll(".htemp");
  htemp = Array.from(htemp);

  var hurlcast = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=${unit}&exclude=current,minutely,alerts,daily&appid=${apiKey}`;

  // var urlcast =  `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`

  fetch(hurlcast)
    .then((res) => {
      return res.json();
    })
    .then((forecast) => {
      console.log(forecast);

      // ht in time function

      shi.forEach((current, i) => {
        shi[i].src =
          "http://openweathermap.org/img/w/" +
          forecast.hourly[i].weather[0].icon +
          ".png";
      });

      htemp.forEach((current, i) => {
        htemp[i].innerHTML = Math.floor(forecast.hourly[i].temp) + "&#176";
      });
    });
}

// day forecast -------------------------------------------------------------------------------------------
function dayForecast(data) {
  let sdi = document.querySelectorAll(".sdi");
  sdi = Array.from(sdi);
  let dtemp = document.querySelectorAll(".dtemp");
  dtemp = Array.from(dtemp);

  var durlcast = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=${unit}&exclude=current,minutely,alerts,hourly&appid=${apiKey}`;

  // var urlcast = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`

  fetch(durlcast)
    .then((res) => {
      return res.json();
    })
    .then((forecast) => {
      // console.log(forecast.city);

      console.log(forecast);

      // dd in time function

      sdi.forEach((current, i) => {
        sdi[i].src =
          "http://openweathermap.org/img/w/" +
          forecast.daily[i].weather[0].icon +
          ".png";
      });

      dtemp.forEach((current, i) => {
        dtemp[i].innerHTML =
          Math.floor(forecast.daily[i].temp.max) +
          "&#176" +
          " / " +
          Math.floor(forecast.daily[i].temp.min) +
          "&#176";
      });
    });
}

// set date and time ---------------------------------------------------------------------------------
const duplicate = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thrusday",
  "Friday",
  "Saturday",
];
const days = [...duplicate, ...duplicate];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

var month, day, year, hrs, mins, ampm, date, secs;

//  current datetime=data.timezone_offset

function setdatetime(data) {
  let b = new Date();
  console.log(b.getTimezoneOffset());
  let utc = b.getTime() + b.getTimezoneOffset() * 60000;
  console.log(utc);
  let dtt = new Date(utc + 1000 * data.timezone);
  console.log(data.sys);
  console.log(dtt.toString());

  month = dtt.getMonth();
  console.log(month);
  date = dtt.getDate();
  day = dtt.getDay();
  year = dtt.getFullYear();
  hrs = dtt.getHours();
  mins = dtt.getMinutes();
  ampm = "AM";

  if (hrs > 11) {
    ampm = "PM";
    if (hrs > 12) {
      hrs -= 12;
    }
  }
  if (mins < 10) {
    mins = "0" + mins;
  }

 document.querySelector(
    "#fulldate"
  ).innerHTML = `${days[day]}, ${date} ${months[month]} ${year}`;
  
  document.querySelector(
    "#time"
  ).innerHTML = `Local time: ${hrs}:${mins} ${ampm}`;

  // time and day
  let dd = document.querySelectorAll(".dd");
  dd = Array.from(dd);
  let ht = document.querySelectorAll(".ht");
  ht = Array.from(ht);

  dd.forEach((current, i) => {
    dd[i].innerHTML = ` ${days[day + i + 1]}`;
  });

  ht.forEach((current, i) => {
    ht[i].innerHTML = `${hrs + i + 1}:00 ${ampm}`;
  });

  //sunrise
  var srise = new Date(
    data.sys.sunrise * 1000 +
      b.getTimezoneOffset() * 60000 +
      data.timezone * 1000
  );

  rise_hrs = srise.getHours();
  console.log(rise_hrs);
  rise_mins = srise.getMinutes();
  console.log(typeof rise_mins);
  rise_ampm = "AM";

  if (rise_hrs > 11) {
    rise_ampm = "PM";
    if (rise_hrs > 12) {
      rise_hrs -= 12;
    }
  }
  if (rise_mins < 10) {
    rise_mins = "0" + rise_mins;
    console.log("done");
  }

  document.querySelector(
    "#rise"
  ).innerHTML = ` Rise: ${rise_hrs}:${rise_mins} ${rise_ampm}`;

  //sunset
  var sset = new Date(
    data.sys.sunset * 1000 +
      b.getTimezoneOffset() * 60000 +
      data.timezone * 1000
  );
  console.log(sset);
  set_hrs = sset.getHours();
  set_mins = sset.getMinutes();
  set_ampm = "AM";

  if (set_hrs > 11) {
    set_ampm = "PM";
    if (set_hrs > 12) {
      set_hrs -= 12;
    }
  }
  if (set_mins < 10) {
    set_mins = "0" + set_mins;
  }

  document.querySelector(
    "#set"
  ).innerHTML = ` Set: ${set_hrs}:${set_mins} ${set_ampm}`;

  // background image---------------------
  if (((rise_hrs <= hrs)&&(ampm==rise_ampm))||((hrs < set_hrs)&&(ampm==set_ampm))) {
    body.classList.remove("night");
    body.classList.add("day");
  } else {
    body.classList.remove("day");
    body.classList.add("night");
  }
}


function tempload() {
  let animation = document.querySelector("#animation");
  animation.innerHTML = `<i class="fa fa-thermometer-4
  red-color"></i>`;

  setTimeout(() => {
    animation.innerHTML = `<i class="fa fa-thermometer-1
  red-color"></i>`;
  }, 1000);

  setTimeout(() => {
    animation.innerHTML = `<i class="fa fa-thermometer-2
  red-color"></i>`;
  }, 2000);
  setTimeout(() => {
    animation.innerHTML = `<i class="fa fa-thermometer-3
  red-color"></i>`;
  }, 3000);
  setTimeout(() => {
    animation.innerHTML = `<i class="fa fa-thermometer-4
  red-color"></i>`;
  }, 4000);

  setInterval(() => {
    tempload();
  }, 5000);
}


