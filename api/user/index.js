// 라우팅 설정 로직
const express = require('express');
const router = express.Router();
const ctrl = require('./user.ctrl')

router.get('/', ctrl.index);
router.get('/:id', ctrl.show);
router.delete('/:id', ctrl.destroy);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);

module.exports = router;    //루트에 있는 index에서 써야하기 때문에 exports해줘야 함