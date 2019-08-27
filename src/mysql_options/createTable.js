const createFlights = `
CREATE TABLE IF NOT EXISTS flights (
    id INT NOT NULL AUTO_INCREMENT,
    from_location VARCHAR(25) NOT NULL,
    to_location VARCHAR(25) NOT NULL,
    total_seats INT NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    PRIMARY KEY (id)
)
`;

const getFlight = `
CREATE TABLE IF NOT EXISTS flightDetails (
    flightId INT NOT NULL AUTO_INCREMENT,
    flight_date DATE,
    INDEX (flight_date),
    price INT NOT NULL,
    available_seats INT NOT NULL,
    FOREIGN KEY (flightId) REFERENCES flights(id) ON DELETE CASCADE,
    PRIMARY KEY(flightId)
)
`;

const createUsers = `
CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    password VARCHAR(256) NOT NULL,
    salt VARCHAR(256) NOT NULL,
    PRIMARY KEY(id)
)
`;
const paymentDetails = `
CREATE TABLE IF NOT EXISTS userCards(
    userId INT NOT NULL AUTO_INCREMENT,
    cardName VARCHAR(50),
    amount INT NOT NULL,
    cardNumber VARCHAR(30) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(userId)
)
`;

const ticketDetails = `
CREATE TABLE IF NOT EXISTS tickets(
    id INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    flightId INT NOT NULL,
    flight_date DATE NOT NULL,
    INDEX(flight_date),
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(flightId) REFERENCES flights(id),
    FOREIGN KEY(flight_date) REFERENCES flightDetails(flight_date) ON DELETE CASCADE,
    PRIMARY KEY(id)
)
`;

export default {
    createFlights,
    getFlight,
    ticketDetails,
    createUsers,
    paymentDetails
} 