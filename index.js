const fs = require('fs');

const INPUT_FILE = './customers.txt';
const OUTPUT_FILE = './output.txt';

const DUBLIN_LATITUDE_RAD = 0.9309486397304539;
const DUBLIN_LONGITUDE_RAD = -0.10921684028351844;
const RADIUS = 6378.137;

const calculateDistance = (latitude, longitude) => {
    const latitudeRad = latitude * Math.PI / 180;
    const longitudeRad = longitude * Math.PI / 180;
    const longitudeDifference = DUBLIN_LONGITUDE_RAD - longitudeRad;
    const firstAddend = Math.sin(latitudeRad) * Math.sin(DUBLIN_LATITUDE_RAD);
    const secondAddend = Math.cos(latitudeRad) * Math.cos(DUBLIN_LATITUDE_RAD)
        * Math.cos(longitudeDifference);
    return RADIUS * Math.acos(firstAddend + secondAddend);
};

const findCloseCustomers = customers => {
    return customers.filter(customer => {
        return calculateDistance(customer.latitude, customer.longitude) <= 100;
    }).map(({ name, user_id }) => ({ name, user_id }))
      .sort((first, second) => first.user_id - second.user_id);
};

const readFile = path => {
    const data = fs.readFileSync(path, { encoding: 'utf8' });
    return data.length ? data.split('\n').map(JSON.parse) : [];
};

const writeToFile = (path, data) => fs.writeFileSync(path, data);

const customers = readFile(INPUT_FILE);
writeToFile(OUTPUT_FILE, JSON.stringify(findCloseCustomers(customers)));
