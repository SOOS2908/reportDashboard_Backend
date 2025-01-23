// dbConnect.js
const sql = require("mssql");
var config = {
    "user": "kapil_iex",
    "password": "Jack@002",
    "server": "192.168.181.176",
    "database": "IEXPIPODataCenter",
    "options": {"encrypt": false}
}
async function dbConnect(){
    sql.connect(config, err => {
        if (err) {throw err;}
        console.log("Connection Successful!");
    });
}
module.exports = dbConnect;
