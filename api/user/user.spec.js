// 테스트 코드
const request = require('supertest');
const should = require('should');
const app = require('../../index');
const models = require('../../models');

describe('GET /users는', ()=> {
    const users = [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}];
    before(()=> models.sequelize.sync({force: true}));
    before(()=> models.User.bulkCreate(users)); // bulkCreate = 여러개의 데이터를 입력하는 메서드
    
    describe('성공시', ()=> {
        it('유저 객체를 담은 배열로 응답한다.', (done)=> {        //비동기에 대한 처리
            request(app)
                .get('/users')
                .end((err, res)=> {
                    res.body.should.be.instanceOf(Array);   // res의 body값이 배열인지 검증하는 코드
                    done();
                });
        });
        it('최대 limit 갯수만큼 응답한다', (done)=> {
            request(app)
            .get('/users?limit=2')
            .end((err, res)=> {
                res.body.should.have.lengthOf(2);   //최대 2개 까지만  
                done();
            });
        });
    });
    describe('실패시', ()=> {
        it('limit이 숫자형이 아니면 400을 응답한다', (done)=> {        //비동기에 대한 처리
            request(app)
                .get('/users?limit=two')
                .expect(400)
                .end(done);
        });
    })
});

describe('GET /users/:id는', ()=> {
    const users = [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}];
    before(()=> models.sequelize.sync({force: true}));
    before(()=> models.User.bulkCreate(users)); // bulkCreate = 여러개의 데이터를 입력하는 메서드

    describe('성공시', ()=> {
        it('id가 1인 유저 객체를 반환한다', (done)=> {        //비동기에 대한 처리
            request(app)
                .get('/users/1')
                .end((err, res)=> {
                    res.body.should.have.property('id', 1);   // id가 1인지 검증하는 코드
                    done();
                });
        });
    });
    describe('실패시', ()=> {
        it('id가 숫자가 아닐 경우 400으로 응답한다', (done)=> {        //비동기에 대한 처리
            request(app)
                .get('/users/one')
                .expect(400)
                .end(done);
        });
        it('id로 유저를 찾을 수 없을 경우 404로 응답한다', (done)=> {        //비동기에 대한 처리
            request(app)
                .get('/users/999')
                .expect(404)
                .end(done);
        });
    });
});

describe('DELETE /users/:id', ()=> {
    const users = [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}];
    before(()=> models.sequelize.sync({force: true}));
    before(()=> models.User.bulkCreate(users)); // bulkCreate = 여러개의 데이터를 입력하는 메서드

    describe('성공시', ()=> {
        it('204를 응답한다', (done)=> {        //비동기에 대한 처리
            request(app)
                .delete('/users/1')
                .expect(204)
                .end(done);
        });
    });
    describe('실패시', ()=> {
        it('id가 숫자가 아닐 경우 400으로 응답한다', (done)=> {        //비동기에 대한 처리
            request(app)
                .delete('/users/one')
                .expect(400)
                .end(done);
        });
    });
});

describe('POST /users', ()=> {
    const users = [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}];
    before(()=> models.sequelize.sync({force: true}));
    before(()=> models.User.bulkCreate(users)); // bulkCreate = 여러개의 데이터를 입력하는 메서드

    describe('성공시', ()=> {
        let body;
        let name = 'daniel'

        before(done=>{
            request(app)
                .post('/users')     // 데이터를 body로 보내줌
                .send({name})
                .expect(201)
                .end((err, res) => {
                    body = res.body;
                    done();
                });
        });    // 테스트 케이스가 동작하기 전에 미리 실행되는 함수

        it('생성된 유저 객체를 반환한다', ()=> {        //비동기에 대한 처리
            body.should.have.property('id');
        });
        it('입력한 name을 반환한다', ()=>{
            body.should.have.property('name', name)
        });
    });
    describe('실패시', ()=> {
        it('name 파라미터 누락 시 400을 반환한다', (done)=> {        //비동기에 대한 처리
            request(app)
                .post('/users')
                .send({})
                .expect(400)
                .end(done);
        });
        it('name이 중복일 경우 409를 반환한다', done=> {        //비동기에 대한 처리
            request(app)
                .post('/users')
                .send({name: 'daniel'})
                .expect(409)
                .end(done);
        });
    });
});

describe('PUT /users/:id', ()=> {
    const users = [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}];
    before(()=> models.sequelize.sync({force: true}));
    before(()=> models.User.bulkCreate(users)); // bulkCreate = 여러개의 데이터를 입력하는 메서드

    describe('성공시', ()=> {
        it('변경된 name을 응답한다', (done)=> {        // 비동기면 done을 써줘야함
            const name = 'chally';
            request(app)
                .put('/users/3')
                .send({name})
                .end((err, res)=> {
                    res.body.should.have.property('name', name);
                    done();
                });
        });
    });
    describe('실패시', ()=> {
        it('정수가 아닌 id일 경우 400 응답', (done)=> {        //비동기에 대한 처리
            request(app)
                .put('/users/one')
                .expect(400)
                .end(done);
        });
        it('name이 없을 경우 400 응답', done=> {        //비동기에 대한 처리
            request(app)
                .put('/users/1')
                .expect(400)
                .end(done);
        });
        it('없는 유저일 경우 404 응답', done=> {        //비동기에 대한 처리
            request(app)
                .put('/users/999')
                .send({name: 'foo'})
                .expect(404)
                .end(done);
        });
        it('이름이 중복일 경우 409 응답', done=> {        //비동기에 대한 처리
            request(app)
                .put('/users/3')
                .send({name: 'bek'})
                .expect(409)
                .end(done);
        });
    });
});