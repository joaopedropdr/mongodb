for (let i = 0; i < 100000; i++) {

db.usuarios.insertOne({
nome: `Usuario${i}`,
email: `usuario${i}@email.com`,
idade: Math.floor(Math.random() * 80) + 18

});

}