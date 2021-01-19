import Parse from "parse";

Parse.initialize(process.env.B4A_APP_ID, process.env.B4A_JS_KEY);
Parse.serverURL = process.env.B4A_SERVER_URL;

export default Parse;