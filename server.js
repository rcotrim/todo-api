var express = require('express');
var app = express();
//var PORT = 3000;
//Para usar heroku:
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1,
    description: 'Almoço com Carlos',
    completed: false
},{
    id: 2,
    description: 'Ir ao super',
    completed: false
}, {
    id: 3,
    description: 'Colocar gasolina',
    completed: true
}];

app.get('/', function (req, res) {
    res.send('TODO API root');
});

// GET /todos
app.get('/todos', function (req, res) {
    res.json(todos);
});

//GET /todos/:id
app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo;
    //res.send('Perguntando pelo todo com ID = ' + req.params.id)
    todos.forEach( function(todo) {
        if (todoId === todo.id) {
            matchedTodo = todo;
        }
    });
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

app.listen(PORT, function() {
    console.log('Express escutando na porta ' + PORT + '!');
})