import mysql from 'mysql';
import dbConfig from '../../config/mysql';
import dataTables from '../mysql_options/createTable';


const mysqlCon = dbConfig['dev'];
const { createFlights, getFlight, createUsers, paymentDetails, ticketDetails } = dataTables;
const con = mysql.createConnection(mysqlCon);

con.connect(() => {
    console.log('Database is connected');
    con.query(createFlights);
    con.query(getFlight);
    con.query(createUsers);
    con.query(paymentDetails);
    con.query(ticketDetails);
})


export default { con }