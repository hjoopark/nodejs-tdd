// api 로직
const models = require('../../models');

const index = function (req, res) {
    req.query.limit = req.query.limit || 10;    //limit이 설정되지 않은 경우에는 기본 값을 10으로 설정
    const limit = parseInt(req.query.limit, 10);   //사용자가 보낸 limit을 받을 수 있다. 문자열로 들어옴 "2"
    if(Number.isNaN(limit)) {           // 숫자가 아니면 실행
        return res.status(400).end();
    }

    models.User
        .findAll({
            limit: limit
        })
        .then(users => {
            res.json(users);
        });

    //res.json(users.slice(0, limit));    // slice(어디서부터, 어디까지)
};

const show = function(req, res) {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) return res.status(400).end();      //숫자가 아닌 경우 400으로 응답
    
   // const user = users.filter((user) => user.id === id)[0];      //filter는 array니까 [0]에 접근해야된다.
    
    models.User.findOne({
        where: {id}
    }).then(user => {
        if(!user) return res.status(404).end();         //id로 유저를 찾을 수 없는 경우
        res.json(user);
    });
};

const destroy = (req, res) => {
    const id = parseInt(req.params.id, 10);         //parseInt(,진법)
    if(Number.isNaN(id)) return res.status(400).end();      //숫자가 아닌 경우 400으로 응답
    
    models.User.destroy({
        where: {id}
    }).then(() => {
        res.status(204).end();
    })

    // users = users.filter(user => user.id !== id);      // filter로 users에서 id가 같지 않는 것들을 users배열로 바꿔치기한다
    
};

const create = (req, res) =>{
    const name = req.body.name;

    if(!name) return res.status(400).end();

    //user에 같은 이름이 있으면 배열을 따로 빼서 길이를 잰다. 길이가 있으면 409
    // const isConflic = users.filter(user => user.name === name).length;
    // if(isConflic) return res.status(409).end();

    models.User.create({name})
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            if(err.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).end();
            }
            res.status(500).end();
        })

    // const id = Date.now();
    // const user = {id, name};
    // users.push(user);
};

const update = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) return res.status(400).end();

    const name = req.body.name;     // name을 받는 부분
    if(!name) return res.status(400).end();

    // const isConflict = users.filter(user => user.name === name).length;
    // if(isConflict) return res.status(409).end();

    // const user = users.filter(user=> user.id === id)[0];    // 유저를 찾는 부분
    // if(!user) return res.status(404).end();

    models.User.findOne({where: {id}})
        .then(user => {
            if(!user) return res.status(404).end();

            user.name = name;
            user.save()
                .then(_ => {
                    res.json(user);
                })
                .catch(err => {
                    if(err.name === 'SequelizeUniqueConstraintError') {
                        return res.status(409).end();
                    }
                    res.status(500).end();
                })
        })
};

module.exports = {index, show,  destroy, create, update};