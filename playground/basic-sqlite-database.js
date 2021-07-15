var Sequelize = require('sequelize');
const { Op } = require('sequelize');
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
})

sequelize.sync().then(function() {
    console.log('Tudo sincronizado !');

    Todo.create({
        description: 'Ir ao super',
        completed: false
    }).then(function(todo) {
        // console.log('finalizado');
        // console.log(todo)
        return Todo.create( {
            description: 'Cinema'
        });
    }).then(function() {
        //return Todo.findByPk(1)
        return Todo.findAll({
            where: {
                //completed: false
                description: {
                    [Op.like]: '%cinema%'
                }
            }
        });
    }).then(function (todos){
        if (todos) {
            //console.log(todos.toJSON());
            todos.forEach(todo => {
                console.log(todo.toJSON());
            });
        } else {
            console.log('No TODO found')
        }
    }).catch( function(e) {
        console.log(e);
    })
});
