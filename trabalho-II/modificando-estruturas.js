// Insert na coleção 
db.menu.insertMany([
    {
        _id: 1,
        dish: "Pizza",
        ingredients: ["Dough", "Tomato Sauce", "Cheese"],
        price: 30,
    },
    {
        _id: 2,
        dish: "Sushi",
        ingredients: ["Rice", "Fish", "Seaweed"],
        price: 40,
    },
    {
        _id: 3,
        dish: "Taco",
        ingredients: ["Tortilla", "Beef", "Cheese"],
        price: 15,
    },
])

// Ex1
// a-) O restaurante decidiu aumentar o preço de todos os pratos em 10%. Atualize os preços.
db.menu.updateMany(
    {price: {$exists: true}},
    { $mul: {price: 1.1}}
)

// b) O Taco agora vem com "Guacamole". Adicione esse ingrediente à lista ingredients.

db.menu.updateOne(
    {dish: "Taco"}, 
    {$push: {ingredients: "Guacamole"}}
)

// c-) O Sushi teve um reajuste e agora custa 35. Atualize esse valor.

db.menu.updateOne(
    {dish: "Sushi"},
    {$set: { price: 35}}
)

// d) O restaurante removeu "Beef" dos Tacos e substituiu por "Chicken". Atualize a lista de ingredientes do Taco.
db.menu.updateOne(
    {dish: "Taco"},
    { $pull: {ingredients: "Beef"}}
    
)
db.menu.updateOne(
    {dish: "Taco"},
    { $push: {ingredients: "Chicken"}}
    
)
