var Sequelize = require('sequelize');
const { Op } = require('sequelize');
const todo = require('../models/todo');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-dqlite-database.sqlite'
});

var Todo = sequelize.define('todo' , {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1,250]
        }
    }, 
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

var User = sequelize.define('user', {
    email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
    // force: true
}).then(function() {
    console.log('Tudo sincronizado !');

    // User.create({
    //     email: 'luis@teste.com'
    // }).then(function () {
    //     return Todo.create({
    //         description: 'Lavar Carro'
    //     });
    // }).then(function (todo) {
    //     User.findByPk(1).then(function(user) {
    //         user.addTodo(todo);
    //     })
    // })

    User.findByPk(1).then(function (user){
        user.getTodos({
            where: {
                completed: false
            }
        }).then(function (todos) {
            todos.forEach(function (todo) {
                console.log(todo.toJSON());
            });
        })
    })
});
