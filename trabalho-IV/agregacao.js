// insert 
db.cliente.insertOne({
    _id: 153,
    nome: "Alice",
    email: "alice@gmail.com"
})

db.venda.insertOne({
    _id: 57,
    cliente_id: 153,
    data_venda: ISODate("2023-01-15T08:00:00Z"),
    mes: 1,
    ano: 2023
})

db.item.insertOne({
    _id: 1,
    venda_id: 57,
    produto: "Laptop",
    quantidade: 2,
    preco_unitario: 1200
})

// Ex 1 Contagem de Vendas por Cliente:

