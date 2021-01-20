
const Parse = require("parse/node");
Parse.initialize(process.env.B4A_APP_ID, process.env.B4A_JS_KEY);
Parse.serverURL = process.env.B4A_SERVER_URL;

exports.handler = async (event, context) => {
  if(!event.body){
    return {
      statusCode: 400
    };
  };

  const {
    lat = 35.68083532000018,
    lng = 139.76939931301777,
    points_num = 1,
  } = JSON.parse(event.body);

  const GeoClass = Parse.Object.extend("test");
  const query = new Parse.Query(GeoClass);
  const myloc = new Parse.GeoPoint(lat, lng);

  let qret = await query
    .near("location", myloc)
    .limit(points_num)
    .find()
    .then(
      (result) => {
        let res = result.map(r => {
          let ret = {
            id: r.id,
            lat: r.attributes.location._latitude,
            lng: r.attributes.location._longitude,
            name: r.attributes.Name
          }
          return ret;
        })
        return res;

      },
      (error) => {
        console.error(error);
        return "";
      }
    );

  return {
    statusCode: 200,
    body: JSON.stringify(qret)
  };
};
