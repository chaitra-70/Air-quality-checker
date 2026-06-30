import { useState } from "react";

function AirQuality(){
  const[city,setCity]=useState("");
  const[airdata,setAirData]=useState({});
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState("");
  const getAirQuality = async ()=>{
    console.log("button clicked");

    if (city===""){
         setError("please enter the city");
         return;
    }
    setLoading(true);
    setError("");
    try{
       const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    const data = await response.json();

        if(!data.results){
            setError("city not found");
            setLoading(false);
            return;
        }
        const latitude = data.results[0].latitude;
        const longitude = data.results[0].longitude;

        const airResponse = await fetch( 
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide`
        );
        const airResult = await airResponse.json();
        setAirData(airResult);
        setLoading(false);

        console.log(airResult);

    }catch(error){
        setError("something went wrong!!");
        setLoading(false);
    }
    
  }
  let status = "";
    let color = "";

if (airdata.current) {
  const aqi = airdata.current.us_aqi;

  if (aqi <= 50) {
    status = "🟢 Good";
    color = "green";
  } else if (aqi <= 100) {
    status = "🟡 Moderate";
    color = "orange";
  } else if (aqi <= 150) {
    status = "🟠 Unhealthy";
    color = "red";
  } else {
    status = "🔴 Very Unhealthy";
    color = "darkred";
  }
};
 const clearData = () =>{
    setCity("");
    setAirData("");
    setError("");
    setLoading(false);
  }
  return (
  <div className="container">

    <h1 className="title">Air Quality Checker</h1>

    <p className="subtitle">
      Check real-time air quality of any city
    </p>

    <input
      className="city-input"
      type="text"
      value={city}
      placeholder="Enter City"
      onChange={(e) => setCity(e.target.value)}
    />
     <div className="button-group">
    <button className="search-btn" onClick={getAirQuality}>
      Check Air Quality
    </button>
   
    <button className="search-btn" onClick={clearData}>
      clear
    </button>
    </div>

    {loading && <h3 className="loading">Loading...</h3>}

    {error && <h3 className="error">{error}</h3>}

    {Object.keys(airdata).length > 0 && (
      <div className="report">

        <h2 className="report-title">Air Quality Report</h2>

        <div className="aqi-box">
          <h1 className="aqi-value">
            {airdata.current.us_aqi}
          </h1>

          <h2
            className="status"
            style={{ color: color }}
          >
            {status}
          </h2>
        </div>

        <div className="cards">

          <div className="card">
            <h3>AQI</h3>
            <p>{airdata.current.us_aqi}</p>
          </div>

          <div className="card">
            <h3>PM2.5</h3>
            <p>{airdata.current.pm2_5} μg/m³</p>
          </div>

          <div className="card">
            <h3>PM10</h3>
            <p>{airdata.current.pm10} μg/m³</p>
          </div>

          <div className="card">
            <h3>Carbon Monoxide</h3>
            <p>{airdata.current.carbon_monoxide} μg/m³</p>
          </div>

          <div className="card">
            <h3>Nitrogen Dioxide</h3>
            <p>{airdata.current.nitrogen_dioxide} μg/m³</p>
          </div>

          <div className="card">
            <h3>Ozone</h3>
            <p>{airdata.current.ozone} μg/m³</p>
          </div>

          <div className="card">
            <h3>Sulphur Dioxide</h3>
            <p>{airdata.current.sulphur_dioxide} μg/m³</p>
          </div>

        </div>

      </div>
    )}

  </div>
);

}
export default AirQuality;