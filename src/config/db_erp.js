const sql = require('mssql')


var  host ='10.15.64.2',
    user = 'ticket',
    password ='kjrv$100',
    database = 'ISdbV2'


const host = process.env.ERP_DB_HOST === undefined ? '10.15.64.2':process.env.ERP_DB_HOST;
const user = process.env.ERP_DB_USER === undefined ? 'ticket':process.env.ERP_DB_USER;
const password = process.env.ERP_DB_PASSWORD === undefined ? 'kjrv$100' : process.env.ERP_DB_PASSWORD;
const database = process.env.ERP_DATABASE === undefined ? 'ISdbV2':process.env.ERP_DATABASE;



/* db connection */
async function connectDb() {
    console.log("Trying to connect to ERP DB");
    try {
        await sql.connect('Server='+host+',1433;Database='+database+';User Id='+user+';Password='+password+';Encrypt=false')
        console.log('-----------', "ERP DB Connected to: ", database, '-----------');
    } catch (error) {
        console.log('Error in ERP DB connection:', error);
        connectDb();
    }
        
    setInterval(function () {
       sql.query('SELECT 1');
    }, 600000);
    
}


connectDb();






module.exports = sql;
