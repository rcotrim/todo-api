var Sequelize = require('sequelize');
// const {
//     Op
// } = require('sequelize');
const Op = Sequelize.Op;
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/data/dev-todo-api.sqlite'
});

var db = {};

//db.todo = Op.import(__dirname + '/models/todo.js');
db.todo = require('./models/todo.js')(sequelize);
db.sequilize - sequelize;
db.Sequelize = Sequelize;
db.Op = Op;

module.exports = db;