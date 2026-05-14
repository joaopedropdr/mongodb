for (let i = 0; i < 100000; i++) {

db.usuarios.insertOne({
nome: `Usuario${i}`,
email: `usuario${i}@email.com`,
idade: Math.floor(Math.random() * 80) + 18

});

}
// Busca um usario pelo email sem usar indice
db.usuarios.find({email: "usuario99999@email.com"}).explain("executionStats")
// Tempo da busca: 
db.usuarios.createIndex({email: 1})
// Busca um usario pelo email usando indice
db.usuarios.find({email: "usuario99999@email.com"}).explain("executionStats")
// Tempo da busca: 