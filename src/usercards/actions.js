import database from '../database/mysql';
import queries from '../mysql_options/queries';



const { con } = database

const { listUserCards, listUsersAndCards, SpecificUserAndCard, deleteCreditCard } = queries


function listUserCCards() {
    return new Promise( (resolve, reject) => {
     con.query(listUserCards, (err, results) => {
        if(err) {
            reject(err)
        }
        resolve(results)
     });
    });
}

function listUsersInfoCCards() {
    return new Promise( (resolve, reject) => {
     con.query(listUsersAndCards, (err, results) => {
        if(err) {
            reject(err)
        }
        resolve(results)
     });
    });
}

function specificUserCard(userId) {
    return new Promise ( (resolve, reject) => {
        con.query(SpecificUserAndCard, [Number(userId)], (err, results) => {
            if(err){
                reject(err)
            }
            resolve(results)
        })
    })
}

async function list(req, res, next) {
    const listAll : Array = await listUserCCards();
    res.status(202).send({success: true, message:`List of creditCards`, body: listAll});
    await next
}


async function listUsersCCInfo(req, res, next) {
    const listAll : Array = await listUsersInfoCCards()
    res.status(202).send({success: true, message:`List of all creditCards with usernames`, body: listAll});
    await next
}


async function specificUser(req, res, next) {
    const { userId } : {userId: string } = req.params
    const getSpecific : Object = await specificUserCard(userId);
    if(getSpecific.length < 1) {
        res.status(404).send({success: false, message:`User with id: ${userId} has not been found`});
        return
    }
    res.status(202).send({success: true, message: `List of user and creditcard info for user with id ${userId}`, body: getSpecific});
    await next
}

function deleteCC(userId) {
    return new Promise((resolve, reject) => {
        con.query(deleteCreditCard, [Number(userId)], (err,results) => {
            if(err) {
                reject(err)
            }
            resolve(results)
        })
    })
}

async function del(req, res, next) {
    const {userId} : {userId: string} = req.params
    const listBefore = await listUserCCards();
    const checkIds = listBefore.map(({userId}) => (userId))
    console.log(checkIds);
    if(checkIds.includes(Number(userId)) == false) {
        res.status(404).send({succes:false, message:`Credit Card id: ${userId} has not been found`});
        return
    }
    const deleteCreditC = await deleteCC(userId)
    res.status(202).send({success: true, message:`CreditCard for user with id: ${userId} has been deleted`});
    await next;
}

export default {
    list,
    listUsersCCInfo,
    specificUser,
    del
}