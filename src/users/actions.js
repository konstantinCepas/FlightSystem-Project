import database from '../database/mysql';
import queries from '../mysql_options/queries';
import bcrypt from 'bcrypt';
import Bluebird from 'bluebird'
import jwt from 'jsonwebtoken'




const { con } = database;
const { registerUser, listUsers, getSingleUser, updateUser, addCreditCard, 
    insertCash, userFlightSearch, userGetSpecificFlight, deleteOldFlights, 
    getSingleCardHolder, sumCreditAmounts, buyFlight, listUserbyId, listFlightDate, 
    reserveSeat, getavailableSeats, updateSeat, getUserBalance, getFlightPrice,
    deleteCreditCard, getCardNumber, userListTickets, cancelDate, deleteTicket,
     retrieveSeat, getUsername } = queries;

Bluebird.promisifyAll(bcrypt);
Bluebird.promisifyAll(jwt);


function registerNewUser(username, firstName, lastName, password, salt) {
    return new Promise( (resolve, reject) => {
        con.query(registerUser, [username, firstName, lastName, password, salt], (err, results) => {
             if(err) {
                 reject(err)
             } 
             resolve(results)
        });
    });
}


function listUsernames() {
    return new Promise( (resolve, reject) => {
     con.query(listUsers, (err, results) => {
        if(err) {
            reject(err)
        }
        resolve(results)
     });
    });
}

async function register(req, res, next) {
    const {
        username,
        firstName,
        lastName,
        password
    }: {
        username: string,
        firstName: ?string,
        lastName: ?string,
        password: ?string
    } = req.body
    const listBefore: Array = await listUsernames();
    const checkNames = listBefore.map(({username}) => (username))
    let checkExisting = checkNames.includes(username);
    if(checkExisting == true) {
        res.status(409).send({success: false, message: `Username ${username} is already taken, please provide a new name`})
        return
    } else if(password.length < 6 ) {
            res.status(409).send({success: false, message: `Your password length is too short! Minimum length is 6 characters please provide a new one`});
            return
    }
    const salt = bcrypt.genSaltSync(10);
    const getRounds = bcrypt.getRounds(salt);
    const pwHash = bcrypt.hashSync(password, getRounds);
    const register: Object = await registerNewUser(username, firstName, lastName, pwHash, salt);
    console.log('Ok');
    res.status(202).send({success: true, message: `Succesfuly created username: ${username}`, body:''});
    await next;
}


function getSpecificUser(id) {
    return new Promise( (resolve, reject) =>  {
        con.query(getSingleUser, [Number(id)], (err, results) => {
           if(err) {
               reject(err)
           }
           resolve(results)
        });
    });
}

function updateMyUser(firstName, lastName, password, salt, id) {
    return new Promise( (resolve,reject) => {
        con.query(updateUser,[firstName, lastName, password, salt, Number(id)], (err, result) =>{
            if(err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    } )
}


async function update(req, res, next) {
    const { id }: {id : string}=req.params
    const {
        firstName,
        lastName,
        password
    }: {
        firstName: ?string,
        lastName: ?string,
        password: ?string
    } = req.body;
      let oldData = {
           firstName,
           lastName,
           password
      };
      const getUser = await getSpecificUser(id);
      const oldUser = getUser[0];
      if(!firstName) {
          oldData.firstName = oldUser.firstName
      } else {
          oldData.firstName = firstName
      } if (!lastName) {
          oldData.lastName = oldUser.lastName
      } else {
          oldData.lastName = lastName
      } if (!password) {
          oldData.password = oldUser.password
      } else {
          oldData.password = password
      }  if(password && password.length < 6) {
        oldData.password = oldUser.password
        res.status(409).send({success: false, message:`Your newly entered password has lower than 6 characters please try again!`});
        return
    }
      const salt = bcrypt.genSaltSync(10);
      const getRounds = bcrypt.getRounds(salt);
      const pwHash = bcrypt.hashSync(oldData.password, getRounds);
      const updateNow = await updateMyUser(oldData.firstName, oldData.lastName, pwHash, salt,id);
      res.status(202).send({success: true, message: `Update for user ${oldUser.username} has been successfull`});
      await next;
}


function addUserCard(userId, cardName, amount, cardNumber) {
    return new Promise( (resolve, reject) => {
        con.query(addCreditCard, [Number(userId), cardName, amount, cardNumber], (err, result) => {
            if(err) {
                reject(err)
            } 
            resolve(result);
        })
    })
}

function validateCardName(cardName) {
    let regExp = /^([A-Za-z]+ [A-Za-z]+)/;
    if(regExp.test(cardName)) {
        return true
    } else
    return false
}
function validateCardNumber(cardNumber) {
    let regExp = /([0-9]{4}[0-9]{4}[0-9]{4}[0-9]{4})/;
    if(regExp.test(cardNumber)){
        return true
    }else 
    return false
}

async function addCredit(req, res, next) {
    const { userId } : { userId: string } = req.params
    const {
        cardName,
        cardNumber
    }:{
        cardName: string,
        cardNumber: number
    } = req.body
    const nameValidate = await validateCardName(cardName);
    const cardValidate = await validateCardNumber(cardNumber)
    console.log(cardValidate);
    if(nameValidate == false) {
        res.status(409).send({success: false, message:`Your entered card name ${cardName} is not valid please enter a valid name, Example: John Jones`})
        return
    }else if (cardName.length < 8) {
        res.status(409).send({success: false, message:`Your entered card name ${cardName} is not valid please enter a valid name, Example: John Jones`})
        return
    }if(cardValidate == false) {
        res.status(409).send({success: false, message:`Your entered card number ${cardNumber} is not a valid number please try again,Write as a full number  Example: 1234567890012345`})
    }
    const amount = 0;
    const addCCard : Object = await addUserCard(userId, cardName, amount, cardNumber);
    res.status(202).send({success: true, message: `Credit card has been added successfully`});
    await next;
}

function addCash(userId, amount) {
    return new Promise( (resolve, reject) => {
        con.query(insertCash,[Number(userId), amount], (err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result)
        });
    });
}

function getSingleCCard(userId) {
    return new Promise( (resolve, reject) =>{
        con.query(getSingleCardHolder,[Number(userId)], (err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result)
        });
    });
}

function getUserCardNum(userId) {
    return new Promise( (resolve, reject) =>{
        con.query(getCardNumber,[Number(userId)], (err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result)
        });
    });
}



async function updateBalance(req, res, next) {
    const { userId }: {userId: string } = req.params;
    const { amount } : {amount: number} = req.body;
    const getUserCC = await getSingleCCard(userId);
    if(getUserCC[0].cardNumber == null) {
        res.status(409).send({success: false, message:`You have no credit card present on your account`});
        return
    }
    console.log(getUserCC);
    const amountSum = getUserCC[0].amount;
    let sumBothof = amountSum + amount;
    const addBalance : Object = await addCash(sumBothof, userId)
    res.status(202).send({success: true, message: `Credit balance has been updated you have added ${amount} to your account.Now you have ${sumBothof} on your balance`});
    await next; 
}

function listAllFlights() {
    return new Promise((resolve,reject) => {
        con.query(userFlightSearch, (err, results) => {
            if(err) {
                reject(err)
            }
            resolve(results)
        });
    })
}

function deletePastFlights() {
    return new Promise( (resolve, reject) => {
        con.query(deleteOldFlights, (err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result)
        })
    })
}

async function userListFlights(req, res, next) {
    const removeOld = await deletePastFlights();
    console.log(removeOld);
    const flights: Array = await listAllFlights();
    res.status(200).send({success: true, message:'List of all available flights', body: flights});
    await next;
}

function userGetSingleFlight(flightId) {
    return new Promise( (resolve, reject) => {
        con.query(userGetSpecificFlight,[Number(flightId)], (err, result) => {
            if(err){
                reject(err)
            }
            resolve(result)
        })
    })
}

async function userGotFlight(req, res, next) {
    const { flightId } : { flightId: string} = req.params
    const getSpecFlight: Object = await userGetSingleFlight(flightId);
    res.status(202).send({sucess:true, message: `Flight Details`, body: getSpecFlight});
    await next;
}

function buyTicket(userId, flightId, flightDate) {
    return new Promise((resolve, reject) => {
         con.query(buyFlight, [Number(userId), Number(flightId), flightDate], (err, result) => {
             if(err) {
                 reject(err)
             }
             resolve(result)
         })
    })
}

function listUserIds() {
    return new Promise((resolve, reject) => {
        con.query(listUserbyId, (err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result)
        })
    })
}


function listFlightDates() {
    return new Promise((resolve, reject) => {
        con.query(listFlightDate, (err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result)
        })
    })
}

function getSeats(flightId) {
    return new Promise((resolve, reject) => {
        con.query(getavailableSeats, [Number(flightId)], (err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result)
        })
    })
}
function bookSeat(flightId) {
    return new Promise((resolve, reject) => {
        con.query(reserveSeat, [Number(flightId)], (err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result)
        })
    })
}

function updateAvailableSeats(availableSeats, flightId) {
    return new Promise((resolve, reject) => {
        con.query(updateSeat, [Number(availableSeats), Number(flightId)], (err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result)
        })
    })
}

function getBalanceForUser(userId) {
    return new Promise((resolve, reject) => {
        con.query(getUserBalance, [Number(userId)], (err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result)
        })
    })
}

function getFlightCost(flightId) {
    return new Promise((resolve, reject) => {
        con.query(getFlightPrice, [Number(flightId)], (err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result)
        })
    })
}



async function userBuyTicket(req, res, next) {
    const { userId, flightId} : {userid: string, flightId: string } = req.params
    const {flightDate}: { flightDate: string } = req.body
    const listFlight = await listAllFlights();
    const listUsers = await listUserIds();
    const listDates = await listFlightDates();
    const checkFlightsId = listFlight.map(({id}) => (id));
    const checkUserIds = listUsers.map(({id}) => (id));
    const checkDate = listDates.map(({utcdate}) => (utcdate))
    if(checkFlightsId.includes(Number(flightId)) == false) {
        res.status(409).send({success: false, message:`Flight with id:${flightId} has not been found`});
        return
    }else if(checkUserIds.includes(Number(userId)) == false) {
        res.status(409).send({success: false, message: `User with id ${userId} has not been found`});
        return
    }else if(flightDate.charAt(4) === '-' || flightDate.charAt(4) === '.' || flightDate.charAt(6) === '-' || flightDate.charAt(6) === '.') {
        res.status(409).send({success: false, message:`Please provide the date as a whole number with yyyymmdd, Example: 20190816`});
        return
    }else if(checkDate.includes(flightDate) == false) {
       res.status(409).send({success: false, message:`Entered Flight Date ${flightDate} is not compatible with flight id ${flightId}`});
       return
    }
    const checkCreditCard = await getUserCardNum(userId);
    let gotCreditCard = checkCreditCard;
    if(gotCreditCard.length < 1) {
        res.status(409).send({success: false, message: `No credit card found for user with id ${userId},please add a credit card to proceed with reservation`});
        return
    } 
    const gotBalance = await getBalanceForUser(userId);
    const availableSeats = await getSeats(flightId);
    const flightPrice = await getFlightCost(flightId);
    let checkSeats = availableSeats[0].allAvailable;
    let checkBalance = gotBalance[0].amount;
    console.log(gotBalance);
    let totalPrice = flightPrice[0].price;
    if(checkSeats <= 0) {
        res.status(409).send({success: false, message: `All available seats for this flight have been taken,please choose another flight or check if a ticket has been canceled later`});
        return
    }else if(checkBalance < totalPrice) {
        res.status(409).send({success:false, message: `You dont have the total amount to buy a ticket for this flight,flight price is ${totalPrice} your credit amount is ${checkBalance}`})
        return   
    }
    let cashOut = checkBalance - totalPrice;
    const updateNewBalance = await addCash(cashOut, userId);
    console.log(updateNewBalance);
    const reservedSeat = await bookSeat(flightId);
    let updateBookedSeat = reservedSeat[0].available;
    const updateNewAvailable = await updateAvailableSeats(updateBookedSeat, flightId);
    const boughtTicket = await buyTicket(userId, flightId, flightDate);
    res.status(202).send({success: true, message: `Succesfully bought ticket`});
    await next;
}

function removeCreditCard(userId) {
    return new Promise( (resolve, reject) =>{
        con.query(deleteCreditCard, [Number(userId)], (err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result)
        })
    })
}

async function deleteCC(req,res,next) {
    const {userId }: {userId: string} = req.params
    const deleteNow = await removeCreditCard(userId);
    res.status(202).send({success: true, message:`Your credit card has been successfully removed`});
    await next;
}


function listTickets(userId) {
    return new Promise( (resolve, reject) =>{
        con.query(userListTickets, [Number(userId)], (err, results) => {
            if(err) {
                reject(err)
            }
            resolve(results)
        })
    })
}

async function listMyTicket(req, res, next) {
    const { userId } : { userId: string} = req.params;
    const listUsers = await listUserIds();
    const checkUserIds = listUsers.map(({id}) => (id));
    if(checkUserIds.includes(Number(userId)) == false) {
        res.status(409).send({success: false, message:`User with id ${userId} has not been found`});
        return
    }
    const listAll = await listTickets(userId);
    res.status(202).send({success: true, message:`List of all tickets for user ${userId}`, body:listAll})
    await next;
}

function checkUserTicket(flightDate, id, userId) {
    return new Promise( (resolve, reject) =>{
        con.query(cancelDate,[flightDate, Number(id), Number(userId)], (err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result)
        })
    })
}

function removeTicket(id) {
    return new Promise( (resolve, reject) =>{
        con.query(deleteTicket, [Number(id)], (err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result)
        })
    })
}

function returnSeat(flightId) {
    return new Promise((resolve, reject) => {
        con.query(retrieveSeat, [Number(flightId)], (err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result)
        })
    })
}



async function cancelTicket(req, res, next) {
    const { userId } : {userId : string} = req.params
    const { id, flightDate, flightId } : { id: number, flightDate: string, flightId: number } = req.body
    const checkTicket = await checkUserTicket(flightDate, id, userId);
    let gotOrNot = checkTicket
    console.log(gotOrNot);
    if(gotOrNot.length < 1) {
        res.status(409).send({success: false, message:`Your entered ticket id ${id} and flightDate ${flightDate} don't match any of your tickets please check them again`});
        return
    }
    let ticketStatus = gotOrNot[0].IsTrue;
    console.log(ticketStatus)
    console.log(ticketStatus == 0);
    if(ticketStatus == 0) {
       const plusSeat = await returnSeat(flightId);
       let sumSeats = plusSeat[0].available;
       console.log(sumSeats);
       const addSeat = await updateAvailableSeats(sumSeats, flightId)
       const removeWithoutMoney = await removeTicket(id);
       res.status(202).send({success: true, message: `Your ticket with id ${id}, has been successfully removed.Your funds have not been returned since flight is in 10 days or lower`})
       return
    }
    const plusSeat = await returnSeat(flightId);
    console.log(plusSeat);
       let sumSeats = plusSeat[0].available;
       console.log(sumSeats);
       const addSeat = await updateAvailableSeats(sumSeats, flightId)
       const getTheBalance = await getBalanceForUser(userId);
       const flightPrice = await getFlightCost(flightId);
       let gotBalance = getTheBalance[0].amount;
       let gotPrice = flightPrice[0].price;
       let halfPrice = gotPrice / 2;
       let newBalance = gotBalance + halfPrice;
       const updatedBalance = addCash(newBalance, userId);
       const removeWithMoney = await removeTicket(id);
       res.status(202).send({success: true, message: `Ticket with id:${id} has been removed,You have been refunded ${halfPrice} to your credit balance now you have ${newBalance}`});
    await next;
}

function logUsername(username) {
    return new Promise( (resolve, reject) =>{
        con.query(getUsername,[username], (err, results) => {
            if(err) {
                reject(err)
            }
            resolve(results)
        })
    })
}


async function login(req, res, next) {
    const {username, password} : {username: string, password: string } = req.body
    const getUserStats = await logUsername(username);
    console.log(getUserStats);
    if(getUserStats.length < 1) {
       res.status(409).send({success: false, message:`Username ${username} has not been found`}); 
       return
    }
    const user = getUserStats[0];
    const checkPass = bcrypt.compareSync(password, user.password);
    if(checkPass == false) {
       res.status(409).send({success: false, message:`Your enter password doesn't match with username ${username}`});
       return
    }
    delete user.password
    delete user.salt
    const userId = user.id
    const giveToken = jwt.sign({ user }, 'secret', { expiresIn: '1h'});
    res.status(202).send({message: `Logged In`, token: giveToken});
    await next;
}

export default {
    register,
    update,
    addCredit,
    updateBalance,
    userListFlights,
    userGotFlight,
    userBuyTicket,
    deleteCC,
    listMyTicket,
    cancelTicket,
    login
}