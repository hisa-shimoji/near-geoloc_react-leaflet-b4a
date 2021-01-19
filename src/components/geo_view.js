import React, { useState, useEffect } from "react";
// import Parse from "parse";
import Parse from "../utils/parse_db";
import "leaflet/dist/leaflet.css";

const Leaflet = typeof window !== `undefined` ? require("leaflet") : null;
const rleaflet =
  typeof window !== `undefined` ? require("react-leaflet") : null;

const pin_icon =
  typeof window !== `undefined`
    ? new Leaflet.Icon({
        iconUrl: require("../images/mappin.png"),
        iconSize: new Leaflet.Point(40, 40),
        iconAnchor: [25, 50],
      })
    : null;
const f_icon =
  typeof window !== `undefined`
    ? new Leaflet.Icon({
        iconUrl: require("../images/station.png"),
        iconSize: new Leaflet.Point(40, 40),
      })
    : null;

// Parse.initialize(process.env.B4A_APP_ID, process.env.B4A_JS_KEY);
// Parse.serverURL = "https://parseapi.back4app.com/";

const GeoView = (props) => {
  const [position, setPosition] = useState({
    lat: 35.68083532000018,
    lng: 139.76939931301777,
  });
  const [facilities, setFacilities] = useState([]);

  function LocationMarker() {
    rleaflet.useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });

    return (
      <>
        <rleaflet.Marker icon={pin_icon} position={position}></rleaflet.Marker>
        {facilities.map((f) => {
          return (
            <rleaflet.Marker
              key={f.id}
              icon={f_icon}
              position={[
                f.attributes.location._latitude,
                f.attributes.location._longitude,
              ]}
            >
              <rleaflet.Popup>{f.attributes.Name}</rleaflet.Popup>
              <rleaflet.Tooltip
                direction="top"
                offset={[0, -20]}
                opacity={1}
                permanent
              >
                {f.attributes.Name}
              </rleaflet.Tooltip>
            </rleaflet.Marker>
          );
        })}
      </>
    );
  }

  useEffect(() => {
    // Parse.initialize(process.env.B4A_APP_ID, process.env.B4A_JS_KEY);
    // Parse.serverURL = "https://parseapi.back4app.com/";
    console.log("p_init " + process.env.B4A_SERVER_URL)
  }, []);

  useEffect(() => {
    console.log("p_q")
    const geoQ_curr_pos = () => {
      // const testp = Parse
      const GeoClass = Parse.Object.extend("test");
      const query = new Parse.Query(GeoClass);
      const myloc = new Parse.GeoPoint(position.lat, position.lng);

      query
        .near("location", myloc)
        .limit(2)
        .find()
        .then(
          (result) => {
            setFacilities(result);
          },
          (error) => {
            console.error(error);
          }
        );
    };
    geoQ_curr_pos();
  }, [position]);

  return (
    <>
      {typeof window !== "undefined" ? (
        <rleaflet.MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "80vh" }}
        >
          <rleaflet.TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </rleaflet.MapContainer>
      ) : null}
    </>
  );
};

export default GeoView;
