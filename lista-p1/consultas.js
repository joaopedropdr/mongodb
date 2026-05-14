// Consultas da prova
// 1-Qual modelo de carro tem mais multas?
db.multas.aggregate([
    {
        $lookup: {
            from: "veiculos_certo",
            localField: "id_veiculo",
            foreignField: "_id",
            as: "veiculo_info"
        }

    },
    { $unwind: "$veiculo_info" },
    {
        $group: {
            _id: "$veiculo_info.modelo",
            totalMultasModelo: {$sum: 1}
        }
    },
    {
        $project: {
            _id: 0,           
            modelo: "$_id",          
            totalMultas: 1            
        }
    },
    {
        $sort: { totalMultas: -1 } // Ordena da maior para a menor
    },

    {
        $limit: 1 // Pega o primeiro elemento, pois é o com mais multas
    }
])

// 2 quantas multas por cidade
db.multas.aggregate([
    {
        $group: {
            _id: "$local.cidade",  // Agrupa pela cidade
            totalMultas: { $sum: 1 }     
        }
    },
    {
        $project: {
            _id: 0,           
            cidade: "$_id", // Como o campo _id possui o nome da cidade, ele adiciona um campo cidade com o nome de cada uma.            
            totalMultas: 1            
        }
    },
    {
        $sort: { totalMultas: -1 } // Ordena da maior para a menor
    }
])

// 3-  infração mais aplicada 
db.multas.aggregate([
    {
        $unwind: "$infracoes"
    },
    {
        $group: {
            _id: "$infracoes.artigo",
            totalInfracao: {$sum:1}
        }
    },
    {
        $project: {
            _id: 0,
            artigo: "$_id",
            totalInfracao: 1
        }
    },
    {
        $sort: {totalInfracao: -1}
    },
    {
        $limit: 1
    }
])

// mes com mais multas
db.multas.aggregate([
    {
        $group: {
            _id: {$month: "$lancamento"},
            totalMultasMes: {$sum:1}
        }
    },
    {
        $project: {
            _id: 0,
            mes: "$_id",
            totalMultasMes: 1
        }
    },
    {
        $sort: {mes: 1}
    }
])

// Cor mais multada
// Esqueci de colocar o campo cor na tabela, entao vou ordenar pelo ano
db.multas.aggregate([
    {
        $lookup: {
            from: "veiculos_certo",
            localField: "id_veiculo",
            foreignField: "_id",
            as: "veiculo_info"
        }

    },
    { $unwind: "$veiculo_info" },
    {
        $group: {
            _id: "$veiculo_info.ano",
            totalMultasAno: {$sum:1}
        }
    },
    {
        $project: {
            _id: 0,
            cor_veiculo: "$_id",
            totalMultasAno: 1
        }
    },
    {
        $sort: {totalMultasAno: -1}
    }
]) 

// sexo mais multado
db.multas.aggregate([
    {
        $lookup: {
            from: "veiculos_certo",
            localField: "id_veiculo",
            foreignField: "_id",
            as: "veiculo_info"
        }

    },
    { $unwind: "$veiculo_info" },
    {
        $group: {
            _id: "$veiculo_info.proprietario.sexo_proprietario",
            totalMultasSexo: {$sum:1}
        }
    },
    {
        $project: {
            _id: 0,
            sexo: "$_id",
            totalMultasAno: 1
        }
    },
    {
        $sort: {totalMultasAno: -1}
    }
]) 

// Qual marca de carro os homens preferem. Execução: 1m/s, 1, 1, 1, 1. Média 1m/s
db.multas.aggregate([
    {
        $lookup: {
            from: "veiculos_certo",
            localField: "id_veiculo",
            foreignField: "_id",
            as: "veiculo_info"
        }
    },
    { $unwind: "$veiculo_info" },

    {
        $group: {
            _id: "$veiculo_info.marca.marca_nome",
            totalHomensMarca: {
                $sum: {
                    $cond: [ { $eq: ["$veiculo_info.proprietario.sexo_proprietario", "Masculino"] }, 1, 0 ] // ele verifica se o sexo é igual a masculino e adiciona o numero 1, se não for ele adiciona o 0.
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            marca: "$_id",
            totalHomensMarca: 1,

        }
    },
    {
        $sort: {totalHomensMarca: -1}
    },
    {$limit: 1}

]).explain("executionStats")

// Consulta usando $match. 4m/s, 1, 1, 2, 1. +-4
// $match teve pior desemprenho.
db.multas.aggregate([
    {
        $lookup: {
            from: "veiculos_certo",
            localField: "id_veiculo",
            foreignField: "_id",
            as: "veiculo_info"
        }
    },
    { $unwind: "$veiculo_info" },
    
    // Filtramos apenas os registros onde o sexo é masculino
    { 
        $match: { "veiculo_info.proprietario.sexo_proprietario": "Masculino" } 
    },
    
    // Agora o group só precisa contar as ocorrências (não precisa mais do $cond)
    {
        $group: {
            _id: "$veiculo_info.marca.marca_nome",
            totalHomensMarca: { $sum: 1 }
        }
    },
    {
        $project: {
            _id: 0,
            marca: "$_id",
            totalHomensMarca: 1
        }
    },
    { $sort: { totalHomensMarca: -1 } },
    {$limit: 1}
]).explain("executionStats")

// Ranking de veiculos mais multados
db.multas.aggregate([
    {
        $lookup: {
            from: "veiculos_certo",
            localField: "id_veiculo",
            foreignField: "_id",
            as: "veiculo_info"
        }
      
    },
    { $unwind: "$veiculo_info" }, 
    {
        $group: {
            _id: "$veiculo_info.modelo",
            totalVeiculos: { $sum: 1 }
        }
    }, 
    { 
        $project: {
            _id: 0,
            modelo: "$_id",
            totalVeiculos: 1
        }
    },
    {$sort: {totalVeiculos: -1}}


])