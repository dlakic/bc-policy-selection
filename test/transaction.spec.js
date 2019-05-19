const supertest = require('supertest');
const app = require('../app');

const username = 'Test';
const minTemp = 15;
const maxTemp = 23;
const iterations = 100

describe('Transaction', () => {
    for (let i = 1; i <= iterations; i++){
        it('should make transactions', (done) =>{
            supertest(app)
                .post('/api/create-transactions')
                .field('username', username)
                .field('minTemp', minTemp)
                .field('maxTemp', maxTemp)
                .attach('xlsxFile', 'sample-data/random15-20.xlsx')
                .expect(201, done)
        })
    }
});