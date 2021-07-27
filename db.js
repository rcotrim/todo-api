var Sequelize = require('sequelize');
// const {
//     Op
// } = require('sequelize');
const Op = Sequelize.Op;
var env = process.env.NODE_ENV || 'development'      // variáveis de ambiente

var sequelize
if (env === 'productin') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    });
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/data/dev-todo-api.sqlite'
    });
}


var db = {};

//db.todo = Op.import(__dirname + '/models/todo.js');
db.todo = require('./models/todo.js')(sequelize);
db.user = require('./models/user.js')(sequelize);
db.sequilize - sequelize;
db.Sequelize = Sequelize;
db.Op = Op;

db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);

module.exports = db;