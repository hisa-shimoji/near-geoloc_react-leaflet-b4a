import React, { useState, useEffect } from "react";
import axios from "axios";
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
                f.lat,
                f.lng,
              ]}
            >
              <rleaflet.Popup>{f.name}</rleaflet.Popup>
              <rleaflet.Tooltip
                direction="top"
                offset={[0, -20]}
                opacity={1}
                permanent
              >
                {f.name}
              </rleaflet.Tooltip>
            </rleaflet.Marker>
          );
        })}
      </>
    );
  }

  useEffect(() => {
    // console.log("p_q");
    axios
      .post("/.netlify/functions/parse_geo", {
        lat: position.lat,
        lng: position.lng,
        points_num: 2,
      })
      .then((results) => {
        setFacilities(results.data);
      });
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
