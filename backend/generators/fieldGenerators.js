const { v4: uuidv4 } = require('uuid');
const faker = require('faker');

// Initialize faker with locale
function initFaker(locale) {
    try {
        faker.locale = locale || 'en';
    } catch (e) {
        faker.locale = 'en';
    }
}

const fieldGenerators = {
    name: (field, index, locale) => {
        initFaker(locale);
        return faker.name.findName();
    },
    
    email: (field, index, locale) => {
        initFaker(locale);
        return faker.internet.email();
    },
    
    phone: (field, index, locale) => {
        initFaker(locale);
        return faker.phone.phoneNumber();
    },
    
    address: (field, index, locale) => {
        initFaker(locale);
        return faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.country();
    },
    
    country: (field, index, locale) => {
        initFaker(locale);
        return faker.address.country();
    },
    
    city: (field, index, locale) => {
        initFaker(locale);
        return faker.address.city();
    },
    
    company: (field, index, locale) => {
        initFaker(locale);
        return faker.company.companyName();
    },
    
    number: (field, index, locale) => {
        return Math.floor(Math.random() * 10000) + 1;
    },
    
    date: (field, index, locale) => {
        const start = new Date(2020, 0, 1);
        const end = new Date();
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return date.toISOString().split('T')[0];
    },
    
    boolean: (field, index, locale) => {
        return Math.random() > 0.5;
    },
    
    uuid: (field, index, locale) => {
        return uuidv4();
    },
    
    url: (field, index, locale) => {
        initFaker(locale);
        return faker.internet.url();
    },
    
    ip: (field, index, locale) => {
        initFaker(locale);
        return faker.internet.ip();
    },
    
    price: (field, index, locale) => {
        return (Math.random() * 999 + 1).toFixed(2);
    },
    
    custom: (field, index, locale) => {
        const pattern = field.pattern || '####';
        let result = '';
        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] === '#') {
                result += Math.floor(Math.random() * 10);
            } else if (pattern[i] === '?') {
                result += String.fromCharCode(65 + Math.floor(Math.random() * 26));
            } else {
                result += pattern[i];
            }
        }
        return result;
    },
    
    text: (field, index, locale) => {
        initFaker(locale);
        return faker.lorem.word();
    }
};

module.exports = fieldGenerators;