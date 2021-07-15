var person = {
    name : 'Richard',
    age: 26
};

function updatePerson (obj) {
    // obj = {
    //     name: 'Richard',
    //     age: 57
    // };
    obj.age = 57;
}

updatePerson(person);
console.log(person);

//Array Example
var grades =[8,6];

function addGrages (lista) {
    //lista.push(55);
    //debugger;
    lista = [55];
}

addGrages(grades);
console.log(grades)

