var express = require('express');
const {
    filter, rest
} = require('underscore');
//var bodyParser = require('body-parser');
var _ = require("underscore");
var db = require('./db.js');
var bcrypt = require('bcrypt');
var middleware = require('./middleware.js')(db);

var app = express();
//var PORT = 3000;
//Para usar heroku:
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(express.json());

app.get('/', function (req, res) {
    res.send('TODO API root');
});

// GET /todos?completed=true&q=work
app.get('/todos', middleware.requireAuthentication, function (req, res) {
    //Implementando com sequelize para acesso ao banco
    var query = req.query;
    var where = {
        userId: req.user.get('id')
    }; 
    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }
    if (query.hasOwnProperty('q') && query.q.trim().length > 0) {
        where.description = {
            [db.Op.like]: '%' + query.q + '%'
        };
    }

    db.todo.findAll({
        where: where
    }).then(function (todos) {
        res.json(todos);
    }, function (e) {
        res.status(500).send();
    });

    // var queryParam = req.query;
    // var filteredTodos = todos;
    // //if has property && completed === 'true'
    // if (queryParam.hasOwnProperty('completed') && queryParam.completed === 'true') {
    //     filteredTodos = _.where(filteredTodos, {completed: true});
    // } else if (queryParam.hasOwnProperty('completed') && queryParam.completed === 'false') {
    //     filteredTodos = _.where(filteredTodos, {completed: false});
    // }

    // if (queryParam.hasOwnProperty('q') && queryParam.q.trim().length > 0) {
    //     filteredTodos = _.filter(filteredTodos, function (todo) {
    //         return todo.description.toLowerCase().indexOf(queryParam.q.toLowerCase().trim()) > -1;
    //     });
    // }

    // res.json(filteredTodos);
});

//GET /todos/:id
app.get('/todos/:id', middleware.requireAuthentication, function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    // var matchedTodo;
    // //res.send('Perguntando pelo todo com ID = ' + req.params.id)
    // todos.forEach( function(todo) {
    //     if (todoId === todo.id) {
    //         matchedTodo = todo;
    //     }
    // });

    // usign the underscore library
    // var matchedTodo = _.findWhere(todos, {id:todoId});
    // if (matchedTodo) {
    //     res.json(matchedTodo);
    // } else {
    //     res.status(404).send();
    // }
    // Usando sequelize

    db.todo.findOne({
        where: {
            id: todoId,
            userId: req.user.get('id')
        }
    }).then(function (todo) {
        if (!!todo) { // para converter um objeto em BOLLEAN 
            res.json(todo.toJSON());
        } else {
            res.status(404).json({
                "error": "nenhum todo achado com o id:" + todoId
            });
        }
    }, function (e) {
        res.status(500).send();
    })
});

//POST /todos
app.post('/todos', middleware.requireAuthentication, function (req, res) {
    //var body = req.body;
    //console.log('description: ' + body.description);
    // usando underscore "pick" para s?? pegar os dados de interesse
    var body = _.pick(req.body, 'description', 'completed');

    // call create on db.todo - Database
    // responde with 200 and todo
    // res.statusw(400).json(e)
    db.todo.create(body).then(function (todo) {
        req.user.addTodo(todo).then(function () {
            return todo.reload();
        }).then(function (todo){
            res.json(todo.toJSON());
        })
    }, function (e) {
        res.status(400).json(e);
    })

    // //Validando dados usando underscore
    // if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    //     return res.status(400).send();
    // }
    // body.description = body.description.trim();

    // // add id field
    // body.id = todoNextId++;

    // // push body into array
    // todos.push(body);

    // res.json(body);
});

//DELETE /todos/:id
app.delete('/todos/:id', middleware.requireAuthentication, function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    // var matchedTodo;
    // //res.send('Perguntando pelo todo com ID = ' + req.params.id)
    // todos.forEach( function(todo) {
    //     if (todoId === todo.id) {
    //         matchedTodo = todo;
    //     }
    // });

    // usign the underscore library
    // var matchedTodo = _.findWhere(todos, {id: todoId});
    // if (matchedTodo) {
    //     todos = _.without(todos, matchedTodo)
    //     res.json(matchedTodo);
    // } else {
    //     res.status(404).json({"error": "nenhum todo achado com o id:" + todoId});
    // }

    //Usando sequelize
    db.todo.destroy({
        where: {
            id: todoId,
            userId: req.user.get('id')
        }
    }).then(function (rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                "error": "nenhum todo achado com o id:" + todoId
            });
        } else {
            res.status(204).send(); //tudo OK e n??o mando nenhum dado de volta !
        }
    }, function (e) {
        res.status(500).send();
    })
});

// PUT /todos/:id - atualizar um registro
app.put('/todos/:id', middleware.requireAuthentication, function (req, res) {
    // var todoId = parseInt(req.params.id, 10);
    // var matchedTodo = _.findWhere(todos, {id: todoId});
    // var body = _.pick(req.body, 'description', 'completed');
    // var validAttriburtes = {};

    // if (!matchedTodo) {
    //     res.status(404).json({"error": "nenhum todo achado com o id:" + todoId});
    // }

    // //Validando dados passados
    // if (body.hasOwnProperty('completed') && _.isBoolean(body.completed))  {
    //     validAttriburtes.completed = body.completed;
    // } else if (body.hasOwnProperty('completed')) {
    //     return res.status(400).send
    // } else {
    //     // nunca mandou atributos
    // }

    // if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    //     validAttriburtes.description = body.description;
    // } else if (body.hasOwnProperty('description')) {
    //     return res.status(400).send
    // } else {
    //     // nunca mandou atributos
    // }

    // _.extend(matchedTodo, validAttriburtes);
    // res.json(matchedTodo);

    //Implementando com Sequelize para acesso ao banco:
    var todoId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};

    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }
    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }

    db.todo.findOne({
        where:{
            id: todoId,
            userId : req.user.get('id')
        }
    }).then(function (todo) {
        if (!!todo) { // para converter um objeto em BOLLEAN 
            todo.update(attributes).then(function (todo) {
                res.json(todo.toJSON());
            }, function (e) {
                res.status(400).json(e)
            });
        } else {
            res.status(404).json({
                "error": "nenhum todo achado com o id:" + todoId
            });
        }
    }, function () {
        res.status(500).send();
    })

});

app.post('/users', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');

    db.user.create(body).then(function (user) {
        //res.json(user.toJSON());
        res.json(user.toPublicJSON());
    }, function (e) {
        res.status(400).json(e);
    })
});

//POST /users/login
app.post('/users/login', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');
    var userInstance;

    db.user.authenticate(body).then(function (user) {
        var token = user.generateToken('authentication')
        userInstance = user;

        return db.token.create({
            token: token
        });
        // Fica obsoleto uma vez que a valida????o fica no Create da tabela do token !
        // mas precisamos achar uma forma de retornar o token !
        // if (token) {
        //     res.header('Auth', token).json(user.toPublicJSON())
        // } else {
        //     rest.status(402).send();
        // }
    }).then(function (tokenInstance) {
        res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
    }).catch(function() {
        res.status(401).send();
    });

    // if (typeof body.email !== 'string' || typeof body.password !== 'string') {
    //     return res.status(400).send();
    // }
    // db.user.findOne({
    //     where: {
    //         email: body.email
    //     }
    // }).then (function (user) {
    //     if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
    //         return res.status(401).send();
    //     }
    //     res.json(user.toJSON())
    // }, function (e) {
    //     res.status(500).send();
    // })
});

//DELETE /user/login
app.delete('/users/login', middleware.requireAuthentication, function (req, res) {
    req.token.destroy().then(function () {
        res.status(204).send();
    }).catch (function () {
        res.status(500).send();
    });
});

db.todo.sequelize.sync(
    {force: true}
    ).then(function () {
    app.listen(PORT, function () {
        console.log('Express escutando na porta ' + PORT + '!');
    });
});