

// Insert dos dados
db.produtos.insertMany([
    {
        _id: 1,
        nome: "Notebook Dell",
        categoria: "Eletrônicos",
        preco: 4500,
        estoque: 15,
        avaliacao: 4.7
    },
    {
        _id: 2,
        nome: "Smartphone Samsung",
        categoria: "Eletrônicos",
        preco: 2500,
        estoque: 30,
        avaliacao: 4.5
    },
    {
        _id: 3,
        nome: "Cadeira Gamer",
        categoria: "Móveis",
        preco: 1200,
        estoque: 10,
        avaliacao: 4.8
    },
])




// Ex 1
// Busca os documentos com o preço maior que 2000
db.produtos.find({preco: {$gt: 2000}})

// Saída
// {
//    _id: 1,
//    nome: "Notebook Dell",
//    categoria: "Eletrônicos",
//    preco: 4500,
//    estoque: 15,
//    avaliacao: 4.7
// }
// {
//    _id: 2,
//    nome: "Smartphone Samsung",
//    categoria: "Eletrônicos",
//    preco: 2500,
//    estoque: 30,
//    avaliacao: 4.5
// }



// Ex 2
db.produtos.find(
    {
        // Filtra os documentos com a categoria Móveis e avaliação maior que 4.5
        $and: [
            {categoria: "Móveis"},
            {avaliacao: {$gt: 4.5}}
        ]   
    }
)
// Saída 
// {
//    _id: 3,
//    nome: "Cadeira Gamer",
//    categoria: "Móveis",
//    preco: 1200,
//    estoque: 10,
//    avaliacao: 4.8
// }


// Ex 3
db.produtos.find({
    // Filtra os documentos com o preço menor que 2000 ou estoque maior que 20
    $or: [
        {preco: {$lt: 2000}},
        {estoque: {$gt: 20}}
    ]
})
// Saída
//    _id: 2,
//    nome: "Smartphone Samsung",
//    categoria: "Eletrônicos",
//    preco: 2500,
//    estoque: 30,
//    avaliacao: 4.5
// }
// {
//    _id: 3,
//    nome: "Cadeira Gamer",
//    categoria: "Móveis",
//    preco: 1200,
//    estoque: 10,
//    avaliacao: 4.8
// }


// Ex 4
// Filtra os documentos que possuem o campo avaliação
db.produtos.find({avaliacao: {$exists: true}})
// Saída
// {
//    _id: 1,
//    nome: "Notebook Dell",
//    categoria: "Eletrônicos",
//    preco: 4500,
//    estoque: 15,
//    avaliacao: 4.7
// }
// {
//    _id: 2,
//    nome: "Smartphone Samsung",
//    categoria: "Eletrônicos",
//    preco: 2500,
//    estoque: 30,
//    avaliacao: 4.5
// }
// {
//    _id: 3,
//    nome: "Cadeira Gamer",
//    categoria: "Móveis",
//    preco: 1200,
//    estoque: 10,
//    avaliacao: 4.8
// }






// Ex 5
db.produtos.find({
    // Exclui os documentos da busca onde a categoria é Eletônicos e o preço é maior que 3000
    $nor: [
        {categoria: "Eletônicos"},
        {preco : {$gt: 3000 }}
    ]
})
