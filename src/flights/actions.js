import database from '../database/mysql';
import queries from '../mysql_options/queries';
import blueBird from 'bluebird';
import bcrypt from 'bcrypt';
import { resolve } from 'dns';


const { con } = database;
const { listFlights, postFlight, flightDetail, updateDetails, updateFlight, getFlight, getDetails, removeFlights } = queries;





function listAllFlights() {
    return new Promise((resolve,reject) => {
        con.query(listFlights, (err, results) => {
            if(err) {
                reject(err)
            }
            resolve(results)
        });
    })
}

async function list (req, res, next) {
    const flights: Array = await listAllFlights();
    res.status(200).send({success: true, message:'List of all flights', body: flights});
    await next;
}

function getSingleFlight(id) {
    return new Promise((resolve,reject) => {
        con.query(getFlight, [Number(id)], (err,results) => {
            if(err) {
                reject(err)
            }
            resolve(results)
        });
    });
}
function getFlightDetails(id) {
    return new Promise((resolve,reject) => {
        con.query(getDetails, [Number(id)], (err,results) => {
            if(err) {
                reject(err)
            }
            resolve(results)
        })
    })
}

async function get(req,res,next) {
    const { id } : { id: string } = req.params
    const getSingle: Object = await getSingleFlight(id);
    const getDetail: Object = await getFlightDetails(id);
    const getObject = [getSingle, getDetail]
    res.status(200).send({success: true, message:`Flight Details`, body: getObject});
    await next;
}



function createFlight(fromLocation, toLocation,totalSeats, depTime, arrTime) {
    return new Promise((resolve, reject) => {
        con.query(postFlight,[fromLocation, toLocation,totalSeats,depTime,arrTime] , (err, results) => {
              if(err) {
                  reject(err)
              }
              resolve(results)
        });
    })
}
function createFlightDetails(flightId,flightDate,price,totalSeats) {
    return new Promise((resolve,reject) => {
        con.query(flightDetail, [flightId,flightDate,price,totalSeats], (err,results) => {
            if(err) {
                reject(err)
            }
            resolve(results)
        })
    })
}

async function create(req,res, next) {
    
    const { 
        fromLocation,
        toLocation,
        totalSeats,
        depTime,
        arrTime,
        flightId,
        flightDate,
        price
    } : {
        fromLocation: string,
        toLocation: string,
        totalSeats: number,
        depTime: string,
        arrTime: string ,
        flightDate: string,
        price: number
    } = req.body;
     const listAll = await listAllFlights();
     const checkId = listAll.map(({id}) => (id))
     console.log(checkId); 
     if(checkId.includes(flightId)) {
         res.status(404).send("Id included");
     } else {
         console.log(flightDate);
     const gotFlight: Object = await createFlight(fromLocation,toLocation,totalSeats,depTime,arrTime);
     const flightDetails : Object = await createFlightDetails(flightDate, price, totalSeats);
     const flightStatus = req.body;
     res.status(201).send({succes: true, message:`Created a flight successfully`, flightStatus});
     await next;
    }
}


function updateFlights(depTime, arrTime, id) {
    return new Promise((resolve,reject) => {
        con.query(updateFlight, [depTime, arrTime, Number(id)], (err,results) => {
            if(err) {
                reject(err)
            }
            resolve(results)
        })
    })
}

function updateFlightDetails(price,totalSeats, id) {
    return new Promise((resolve, reject) => {
        con.query(updateDetails, [price, totalSeats, Number(id)], (err,results) => {
            if(err) {
                reject(err)
            }
            resolve(results)
        })
    })
}

async function update(req,res,next) {
const { id } : {id: string} = req.params;
const {
    price,
    totalSeats,
    depTime,
    arrTime
}:{
    price: ?number,
    totalSeats: ?number,
    depTime: ?string,
    arrTime: ?string
} = req.body
let oldData = {
    price,
    totalSeats,
    depTime,
    arrTime
}
const flightDb = await getSingleFlight(id);
const flightDetail = await getFlightDetails(id);
const singleDetail = flightDetail[0]
const flightData = flightDb[0];
if(!price) {
    oldData.price = singleDetail.price
} else {
    oldData.price = price
}
if(!totalSeats) {
    oldData.totalSeats = singleDetail.available_seats
} else {
    oldData.totalSeats = totalSeats
}
if(!depTime) {
    oldData.depTime = flightData.departure_time
} else {
    oldData.depTime = depTime
}
if(!arrTime) {
   oldData.arrTime = flightData.arrival_time
} else {
    oldData.arrTime = arrTime
}
const updateGiven = await updateFlights(oldData.depTime,oldData.arrTime, id);
const updateDetail = await updateFlightDetails(oldData.price, oldData.totalSeats, id);
res.status(200).send('Successfully updated');

await next;
}

function deleteFlightId(id) {
    return new Promise((resolve, reject) => {
     con.query(removeFlights, [Number(id)], (err, results) => {
       if(err) {
         reject(err)
       }
       resolve(results)
     });
    });
  }



const del = async(req,res,next) => {
    const { id }: { id: string } = req.params
    const getFlightId = await listAllFlights();
    const checkId = getFlightId.map(({id}) => (id));
    let checked = checkId.includes(Number(id));
    console.log(checked);
    if(checked == true) {
    const deleteNow: Object = await deleteFlightId(id);
    res.status(202).send({ success: true, message: `Flight with id ${id} has been deleted`, body: deleteNow});
    return
    }
    res.status(404).send({ success: false, message: `Flight with id ${id} has not been found`, body: ''})
    await next;
}


export default {
    list,
    create,
    update,
    get,
    del 
}