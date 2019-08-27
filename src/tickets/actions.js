import database from '../database/mysql';
import queries from '../mysql_options/queries';



const { con } = database

const { listAllTickets, listTicketsUsers, listSpecificTicketHolder, deleteTicket } = queries


function listTickets() {
    return new Promise( (resolve, reject) => {
     con.query(listAllTickets, (err, results) => {
        if(err) {
            reject(err)
        }
        resolve(results)
     });
    });
}

function listTicketsWithUsers() {
    return new Promise( (resolve, reject) => {
     con.query(listTicketsUsers, (err, results) => {
        if(err) {
            reject(err)
        }
        resolve(results)
     });
    });
}

function specificUserTicket(userId) {
    return new Promise ( (resolve, reject) => {
        con.query(listSpecificTicketHolder, [Number(userId)], (err, results) => {
            if(err){
                reject(err)
            }
            resolve(results)
        })
    })
}

async function list(req, res, next) {
    const listAll : Array = await listTickets();
    res.status(202).send({success: true, message:`List of all Tickets`, body: listAll});
    await next
}


async function listTicketUsersInfo(req, res, next) {
    const listAll : Array = await listTicketsWithUsers()
    res.status(202).send({success: true, message:`List of all tickets with usernames`, body: listAll});
    await next
}


async function specificUser(req, res, next) {
    const { userId } : {userId: string } = req.params
    const getSpecific : Object = await specificUserTicket(userId);
    if(getSpecific.length < 1) {
        res.status(404).send({success: false, message:`Ticket with userid: ${userId} has not been found`});
        return
    }
    res.status(202).send({success: true, message: `List of user and ticket info for user with id ${userId}`, body: getSpecific});
    await next
}

function deleteTicketId(id) {
    return new Promise((resolve, reject) => {
        con.query(deleteTicket, [Number(id)], (err,results) => {
            if(err) {
                reject(err)
            }
            resolve(results)
        })
    })
}

async function del(req, res, next) {
    const {id} : {id: string} = req.params
    const listBefore = await listTickets();
    const checkIds = listBefore.map(({id}) => (id))
    if(checkIds.includes(Number(id)) == false) {
        res.status(404).send({succes:false, message:`Ticked id: ${id} has not been found`});
        return
    }
    const deleteQuery = await deleteTicketId(id);
    res.status(202).send({success: true, message:`Ticket for user with id: ${userId} has been deleted`});
    await next;
}

export default {
    list,
    listTicketUsersInfo,
    specificUser,
    del
}