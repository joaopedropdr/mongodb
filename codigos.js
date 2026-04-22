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

db.veiculos.aggregate([
    { $sample: { size: 5 } },
    {
        $lookup: {
            from: "proprietarios",
            localField: "proprietario_id",
            foreignField: "_id",
            as: "proprietario_info"
        }

    },
    {
        $project: {
            _id: 0,
            marca: 1,
            modelo: 1,
            ano: 1,
            placa: 1,
            cor: 1,
            renavan: 1,
            proprietario_id: "$proprietario_info._id"
        }
    },
])

db.veiculos.aggregate([
    {
        $project: {
            _id: 0,
            marca: 1
        }
    },
    { $out: "marcas"}
])


db.veiculos.aggregate([
    {
        $group: {
            _id: "$marca", 
        }
    },
    {
        $project: {
            _id: 0,
            nome_marca: "$_id",
        }
    },
    {
        $out: "marcas"
    }

])

db.veiculos.aggregate([
    { $limit: 100 }, 
    {
        $lookup: {
            from: "marcas",
            localField: "marca",       // Campo na coleção veiculos
            foreignField: "nome_marca", // Campo na coleção marcas
            as: "info_marca"
        }
    },

    {
        $lookup: {
            from: "proprietarios",
            localField: "",       // Campo na coleção veiculos
            foreignField: "nome_marca", // Campo na coleção marcas
            as: "info_marca"
        }
    },
    
    {
        $unwind: {
            path: "$info_marca",
            preserveNullAndEmptyArrays: true // Mantém o veículo se não achar a marca
        }
    },
    {
        $project: {
            _id: 1,
            modelo: 1,
            ano: 1,
            placa: 1,
            marca_veiculo: {
                nome_marca: "$info_marca.nome_marca",
                marca_id: "$info_marca._id"
            }
           
        }
    },
])
