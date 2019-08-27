const listFlights = 'SELECT * FROM flight_system.flights';
const postFlight = 'INSERT INTO flight_system.flights (from_location, to_location, total_seats, departure_time, arrival_time) VALUES (?,?,?,?,?)';
const flightDetail = 'INSERT INTO flight_system.flightdetails (flight_date, price, available_seats) VALUES (?,?,?)';
const updateFlight = 'UPDATE flight_system.flights SET departure_time = ?, arrival_time = ? WHERE id = ?';
const updateDetails = 'UPDATE flight_system.flightdetails SET price = ?, available_seats = ? WHERE flightId = ?';
const getFlight = 'SELECT * FROM flight_system.flights WHERE id = ?';
const getDetails = 'SELECT * FROM flight_system.flightdetails WHERE flightId = ?';
const removeFlights = 'DELETE FROM flight_system.flights WHERE id = ?';
const registerUser = 'INSERT INTO flight_system.users (username, firstName, lastName, password, salt)  VALUES (?, ?, ?, ?, ?)';
const listUsers = 'SELECT username FROM flight_system.users';
const updateUser =  'UPDATE flight_system.users SET firstName = ?, lastName = ?, password = ?, salt = ? WHERE id = ?';
const getSingleUser = 'SELECT * FROM flight_system.users WHERE id = ?';
const addCreditCard = 'INSERT INTO flight_system.usercards (userId, cardName, amount, cardNumber) VALUES (?,?,?,?)';
const insertCash = 'UPDATE flight_system.usercards SET amount = ? WHERE userId = ?';
const userFlightSearch = 'SELECT flights.id, flights.from_location, flights.to_location, flights.departure_time, flights.arrival_time, date_format(flight_date, "%Y.%m.%d") FlightDate FROM flight_system.flights LEFT JOIN flight_system.flightdetails ON flight_system.flights.id = flight_system.flightdetails.flightId'
const userGetSpecificFlight = 'SELECT flights.id, flights.from_location, flights.to_location, flights.departure_time, flights.arrival_time, flightdetails.flight_date, flight_system.flightdetails.available_seats, flightdetails.price FROM flight_system.flights LEFT JOIN flight_system.flightdetails ON flight_system.flights.id = flight_system.flightdetails.flightId WHERE flightId = ?'
const deleteOldFlights = 'DELETE flight_system.flights,flight_system.flightdetails FROM flight_system.flights INNER JOIN flight_system.flightdetails ON flights.id = flightdetails.flightId WHERE  flight_date < (NOW() - INTERVAL 1 DAY)'
const getSingleCardHolder ='SELECT * FROM flight_system.usercards WHERE userId = ?';
// const sumCreditAmounts = 'SELECT SUM(? + ?) FROM flight_system.usercards where userId = ?';
const buyFlight = 'INSERT INTO flight_system.tickets(userId, flightId, flight_date) VALUES (?,?,?)';
const listUserbyId = 'SELECT id FROM flight_system.users';
const listFlightDate = 'SELECT date_format(flight_date, "%Y%m%d") utcdate FROM flight_system.flightdetails ';
const getavailableSeats = 'SELECT available_seats allAvailable FROM flight_system.flightdetails where flightId = ?';
const reserveSeat = 'SELECT available_seats - 1  available FROM flight_system.flightdetails where flightId = ?';
const retrieveSeat = 'SELECT available_seats + 1  available FROM flight_system.flightdetails where flightId = ?'
const updateSeat = 'UPDATE flight_system.flightdetails SET available_seats = ? where flightId = ?';
const getUserBalance = 'SELECT amount amount FROM flight_system.usercards where userId = ?';
const getFlightPrice = 'SELECT price price FROM flight_system.flightdetails where flightId = ?';
const deleteCreditCard = 'DELETE FROM flight_system.usercards where userId = ?';
const getCardNumber = 'SELECT cardNumber cardNumber from flight_system.usercards where userId = ?';
const userListTickets = 'SELECT tickets.id, tickets.flightId, tickets.userId, date_format(tickets.flight_date, "%Y.%m.%d") FligthDate,flightdetails.flightId, flightdetails.price FROM flight_system.tickets LEFT JOIN  flight_system.flightdetails  ON flight_system.tickets.flightId = flight_system.flightdetails.flightId where userId = ?'
const cancelDate = 'SELECT flight_date > (NOW() + INTERVAL 10 DAY) IsTrue FROM flight_system.tickets WHERE flight_date = ? AND id = ? AND userId = ?';
const deleteTicket = 'DELETE FROM flight_system.tickets WHERE id = ?';
const getUsername = 'SELECT * FROM flight_system.users WHERE username = ?';
const listUserCards = 'SELECT * FROM flight_system.usercards';
const listUsersAndCards = 'SELECT userId, cardName, cardNumber, amount, username, firstName, lastName  FROM flight_system.usercards LEFT JOIN flight_system.users ON flight_system.usercards.userId = flight_system.users.id'
const SpecificUserAndCard = 'SELECT userId, cardName, cardNumber, amount, username, firstName, lastName  FROM flight_system.usercards LEFT JOIN flight_system.users ON flight_system.usercards.userId = flight_system.users.id WHERE userId = ?'
const listAllTickets = 'SELECT * FROM flight_system.tickets';
const listTicketsUsers= 'SELECT  userId, flightId, flight_date, username, firstName, lastName  FROM flight_system.tickets LEFT JOIN flight_system.users ON flight_system.tickets.userId = flight_system.users.id'
const listSpecificTicketHolder = 'SELECT  userId, flightId, flight_date, username, firstName, lastName  FROM flight_system.tickets LEFT JOIN flight_system.users ON flight_system.tickets.userId = flight_system.users.id WHERE userId = ?';


export default {
    listFlights,
    postFlight,
    getFlight,
    flightDetail,
    updateFlight,
    updateDetails,
    getDetails,
    removeFlights,
    registerUser,
    listUsers,
    updateUser,
    getSingleUser,
    addCreditCard,
    insertCash,
    userFlightSearch,
    userGetSpecificFlight,
    deleteOldFlights,
    getSingleCardHolder,
    // sumCreditAmounts,
    buyFlight,
    listUserbyId,
    listFlightDate,
    reserveSeat,
    getavailableSeats,
    updateSeat,
    getUserBalance,
    getFlightPrice,
    deleteCreditCard,
    getCardNumber,
    userListTickets,
    cancelDate,
    deleteTicket,
    retrieveSeat,
    getUsername,
    listUserCards,
    listUsersAndCards,
    SpecificUserAndCard,
    listAllTickets,
    listTicketsUsers,
    listSpecificTicketHolder
};