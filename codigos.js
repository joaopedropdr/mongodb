db.estadosCidades.aggregate([
    {
      $unwind: "$estados"
    },
    {$unwind: "$estados.cidades"},
    {
      $project: {
        _id: 0,
        nome_cidade: "$estados.cidades",
        estado: "$estados.sigla",
        nome_estado: "$estados.nome"
      }
    }, 
    {
      $out: "cidades_certo"
    }
])

db.pessoas.aggregate([
    {
        $project: {
            _id: 0,
            nome: 1,
            matricula: {
                $floor: {
                    $multiply: [ {$rand: {} }, 100]      
                }
            },
            contratacao: {
                $add: [
                    new Date("2020-01-01"),
                    {$multiply: [{$rand: {}}, (new Date() - new Date("2020-01-01"))]}
                ]
            }
        }
    }, 
    { $limit: 5 },
    {$out: "agentes"}
])  

db.pessoas.aggregate([
    { $sample: { size: 5 } },
    {
        $project: {
            _id: 0,
            nome: 1,
            cpf: 1,
            endereco: 1,
            numero: 1,
            bairro: 1,
            cep: 1,
            sexo: 1,
            cadastro: {
                $add: [
                    new Date("2020-01-01"),
                    {$multiply: [{$rand: {}}, (new Date() - new Date("2020-01-01"))]}
                ]
            }
        }
    }, 
    {$out: "proprietarios"}
])  


