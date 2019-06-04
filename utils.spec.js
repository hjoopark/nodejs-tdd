//spec이 들어가면 test코드이다. 요구사항
const utils = require('./utils');
const should = require('should');
describe('utils.js모듈의 capitalize() 함수는', ()=> {
    it('문자열의 첫번째 문자를 대문자로 변환한다', ()=> {
        const result = utils.capitialize('hello');
        // assert.equal(result,'Hello');
        result.should.be.equal('Hello');    //should js로 테스트코드의 가독성을 높힌다.
    }) // 테스트 케이스
}) // 테스트 수트