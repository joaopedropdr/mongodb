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



// Script para adicionar o id do proprietario na coleção de veiculos
const proprietarios = db.proprietarios.find({}, { _id: 1 }).toArray();
const idsProprietarios = proprietarios.map(p => p._id);

// 2. Itera sobre os veículos e atualiza cada um
db.veiculos.find().forEach(veiculo => {
    // Escolhe um índice aleatório do array de proprietários
    const randomIndex = Math.floor(Math.random() * idsProprietarios.length);
    const randomPropId = idsProprietarios[randomIndex];

    // Atualiza o documento adicionando o campo proprietario_id
    db.veiculos.updateOne(
        { _id: veiculo._id },
        { $set: { proprietario_id: randomPropId } }
    );
});

// Adicionando o proprietario e marca na coleção veiculos
db.veiculos.aggregate([
    { $limit: 100 }, 
    {
        $lookup: {
            from: "marcas",
            localField: "marca",       
            foreignField: "nome_marca", 
            as: "info_marca"
        }
    },
    { $limit: 5 }, 
    {
        $lookup: {
            from: "proprietarios",
            localField: "proprietario_id",     // Campo na coleção veiculos
            foreignField: "_id", // Campo na coleção marcas
            as: "info_prop"
        }
    },
    
    {
        $unwind: {
            path: "$info_marca",
            preserveNullAndEmptyArrays: true // Mantém o veículo se não achar a marca
        }
    },
    
    {
        $unwind: {
            path: "$info_prop",
            preserveNullAndEmptyArrays: true // Mantém o veículo se não achar a marca
        }
    },
    {
        $project: {
            _id: 1,
            modelo: 1,
            ano: 1,
            placa: 1,
            marca: {
                marca_id: "$info_marca._id",
                marca_nome: "$info_marca.nome_marca",
            },
            proprietario: {
                proprietario_id: "$info_marca._id",
                nome_proprietario: "$info_prop.nome",
                sexo_proprietario: "$info_prop.sexo",
                cpf_proprietario: "$info_prop.cpf",
                endereco: {
                    rua: "$info_prop.endereco",
                    numero: "$info_prop.numero",
                    bairro: "$info_prop.bairro",
                    cidade: "$info_prop.cidade_estado.nome_cidade",
                    estado: "$info_prop.cidade_estado.nome_estado"
                }
            }
           
        }
    },
    {$out: "veiculos_certo"}
])


// Script para adicionar o id da cidade na coleção de proprietarios
const cidades = db.cidades_certo.find({}, { _id: 1 }).toArray();
const idsCidades= cidades.map(p => p._id);

// 2. Itera sobre os proprietarios e atualiza cada um
db.proprietarios.find().forEach(proprietario => {
    // Escolhe um índice aleatório do array de proprietários
    const randomIndex = Math.floor(Math.random() * idsProprietarios.length);
    const randomCidadeId = idsCidades[randomIndex];

    // Atualiza o documento adicionando o campo cidade_id
    db.proprietarios.updateOne(
        { _id: proprietario._id },
        { $set: { cidades_id: randomCidadeId } }
    );
});

// Tranformar a cidade em objeto
db.proprietarios.find({ cidades_id: { $exists: true } }).forEach(prop => {
    // Busca a cidade correspondente
    const cidade = db.cidades_certo.findOne({ _id: prop.cidades_id });

    if (cidade) {
        db.proprietarios.updateOne(
            { _id: prop._id },
            { 
                $set: { 
                    cidade_detalhada: cidade // Adiciona o objeto novo
                },
                $unset: { cidades_id: "" } // Remove o ID antigo (opcional)

            }
        );
    }
});


db.multas.insertOne({
    lancamento: ISODate("2026-04-28T10:15:00Z"),
    local: {
        rua: "Av. Major Prado",
        numero: 123,
        cidade: "Bujari",
        estado: "AC"
    },
    id_agente: ObjectId('69e127d8fdfb71e1e6c01a75'),
    infracoes: [
        {
            artigo: "169",
            descricao: "Dirigir sem atenção ou sem os cuidados indispensáveis à segurança.",
            grau: "Leve",
            pontos: 3,
            valor: 88.38
        },
        {
            artigo: "184",
            descricao: "Transitar com o veículo na faixa ou pista da direita, regulamentada co…",
            gravidade: "Média",
            pontos: 4,
            valor: 130.16   
        }
    ],
    id_veiculo: ObjectId('69e1222ae26890e4f925cc86')
})

db.multas.aggregate([
    {
        $lookup: {
            from: "agentes",
            localField: "id_agente",
            foreignField: "_id",
            as: "agentes_info"
        }
    }
])

db.multas.insertMany([
    {
        lancamento: ISODate("2026-04-28T10:15:00Z"),
        local: {
            rua: "Av. Major Prado",
            numero: 123,
            cidade: "Bujari",
            estado: "AC"
        },
        id_agente: ObjectId('69e127d8fdfb71e1e6c01a75'),
        infracoes: [
            {
                artigo: "169",
                descricao: "Dirigir sem atenção ou sem os cuidados indispensáveis à segurança.",
                grau: "Leve",
                pontos: 3,
                valor: 88.38
            },
            {   
                artigo: "182 VI",
                descricao: "Parar o veículo no passeio ou sobre faixa destinada a pedestres, nas i…",
                grau: "Média",
                pontos: 4,
                valor: 130.16
            }
        ],
        id_veiculo: ObjectId('69e1222ae26890e4f925cc87')
    },
    {
        lancamento: ISODate("2026-04-28T10:15:00Z"),
        local: {
            rua: "Av. Major Prado",
            numero: 123,
            cidade: "Bujari",
            estado: "AC"
        },
        id_agente: ObjectId('69e127d8fdfb71e1e6c01a75'),
        infracoes: [
            {
                artigo: "172",
                descricao: "Atirar do veículo ou abandonar na via objetos ou substâncias.",
                grau: "Média",
                pontos: 4,
                valor: 130.16
            },
            {   
                artigo: "205",
                descricao: "Ultrapassar veículo em movimento que integre cortejo, préstito, desfil…",
                grau: "Leve",
                pontos: 3,
                valor: 88.38
            }
        ],
        id_veiculo: ObjectId('69ee2906fdfb71e1e6c01a7c')
    },
    {
        lancamento: ISODate("2026-04-28T10:15:00Z"),
        local: {
            rua: "Av. joao neves",
            numero: 123,
            cidade: "Porto Acre",
            estado: "AC"
        },
        id_agente: ObjectId('69e127d8fdfb71e1e6c01a76'),
        infracoes: [
            {
                artigo: "172",
                descricao: "Atirar do veículo ou abandonar na via objetos ou substâncias.",
                grau: "Média",
                pontos: 4,
                valor: 130.16
            },
            {   
                artigo: "205",
                descricao: "Ultrapassar veículo em movimento que integre cortejo, préstito, desfil…",
                grau: "Leve",
                pontos: 3,
                valor: 88.38
            }
        ],
        id_veiculo: ObjectId('69e1222ae26890e4f925cc97')
    },
    {
        lancamento: ISODate("2026-04-28T10:15:00Z"),
        local: {
            rua: "Av. joao neves",
            numero: 123,
            cidade: "Porto Acre",
            estado: "AC"
        },
        id_agente: ObjectId('69e127d8fdfb71e1e6c01a76'),
        infracoes: [
            {
                artigo: "172",
                descricao: "Atirar do veículo ou abandonar na via objetos ou substâncias.",
                grau: "Média",
                pontos: 4,
                valor: 130.16
            },
            {   
                artigo: "205",
                descricao: "Ultrapassar veículo em movimento que integre cortejo, préstito, desfil…",
                grau: "Leve",
                pontos: 3,
                valor: 88.38
            }
        ],
        id_veiculo: ObjectId('69e1222ae26890e4f925cc89')
    },
    {
        lancamento: ISODate("2026-04-28T10:15:00Z"),
        local: {
            rua: "Av. joao neves",
            numero: 123,
            cidade: "Porto Acre",
            estado: "AC"
        },
        id_agente: ObjectId('69e127d8fdfb71e1e6c01a79'),
        infracoes: [
            {
                artigo: "172",
                descricao: "Atirar do veículo ou abandonar na via objetos ou substâncias.",
                grau: "Média",
                pontos: 4,
                valor: 130.16
            },
            {   
                artigo: "205",
                descricao: "Ultrapassar veículo em movimento que integre cortejo, préstito, desfil…",
                grau: "Leve",
                pontos: 3,
                valor: 88.38
            }
        ],
        id_veiculo: ObjectId('69e1222ae26890e4f925cc89')
    },
])
db.multas.insertOne(
    {
        lancamento: ISODate("2026-04-28T10:15:00Z"),
        local: {
            rua: "Av. joao neves",
            numero: 123,
            cidade: "Porto Acre",
            estado: "AC"
        },
        id_agente: ObjectId('69e127d8fdfb71e1e6c01a79'),
        infracoes: [
            {
                artigo: "172",
                descricao: "Atirar do veículo ou abandonar na via objetos ou substâncias.",
                grau: "Média",
                pontos: 4,
                valor: 130.16
            },
            {   
                artigo: "205",
                descricao: "Ultrapassar veículo em movimento que integre cortejo, préstito, desfil…",
                grau: "Leve",
                pontos: 3,
                valor: 88.38
            }
        ],
        id_veiculo: ObjectId('69e1222ae26890e4f925cc89')
    },
)
db.multas.insertOne(
    {
        lancamento: ISODate("2026-04-28T10:15:00Z"),
        local: {
            rua: "Av. joao neves",
            numero: 123,
            cidade: "Sena Madureira",
            estado: "AC"
        },
        id_agente: ObjectId('69e127d8fdfb71e1e6c01a76'),
        infracoes: [
            {
                artigo: "254 I",
                descricao: "É proibido ao pedestre permanecer ou andar nas pistas de rolamento, ex…",
                grau: "Leve",
                pontos: 0,
                valor: 44.19,
            },
            {   

                artigo: "171",
                descricao: "Usar o veículo para arremessar, sobre os pedestres ou veículos, água o…",
                grau: "Média",
                pontos: 4,
                valor: 130.16,
            }
        ],
        id_veiculo: ObjectId('69e1222ae26890e4f925cc8a')
    },
)
