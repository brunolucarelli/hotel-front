var app = angular.module('hotelFront', []);

// Criação inicial do array check-in
var checkinList = [{
        nome: 'João da Silva',
        documento: 123456789,
        dataEntrada: '2020-01-01T11:40',
        dataSaida: '',
        possuiVeiculo: false,
        valor: 1939.00
    }, {
        nome: 'Maria de Souza',
        documento: 456789123,
        dataEntrada: '2020-01-01T11:40',
        dataSaida: '2020-01-10T11:00',
        possuiVeiculo: false,
        valor: 949.00
    }, {
        nome: 'Pedro Sauro',
        documento: 789456123,
        dataEntrada: '2020-02-01T11:40',
        dataSaida: '2020-02-04T11:00',
        possuiVeiculo: false,
        valor: 650.00
    }];

// Criação inicial do array hospedes
var hospedes = [{
        nome: 'João da Silva',
        documento: 123456789,
        telefone: '11 1111-1111'
    }, {
        nome: 'Maria de Souza',
        documento: 456789123,
        telefone: '22 2222-2222'
    }, {
        nome: 'Pedro Sauro',
        documento: 789456123,
        telefone: '33 3333-3333'
    }];

app.controller('HotelController', function ($scope) {

    /* Botão "Incluir pessoa"
     * - Relaciona as arrays do JS com a tela
     * - Salva as informações na memória
     * - Limpa os campos da tela
     * - Fecha o modal de incluir pessoa
    */
    $scope.hospede = {};
    $scope.hospedes = hospedes;
    $scope.salvar = function (hospede) {
        hospedes.push(hospede);
        $scope.hospede = {};
        hospede = {};
        document.getElementById("incluirPessoa").style.display = "none";
    };

    /* Botão "Salvar" - Faz o checkin de uma pessoa cadastrada
     * - Relaciona as arrays do JS com a tela
     */
    $scope.data = {};
    $scope.checkinList = checkinList;
    $scope.checkin = function (data) {
        
        // Variável utilizada para adicionar uma nova pessoa cada não haja nenhum checkin para ela
        var pessoaEncontrada = false;
        
        // Divide o nome do documento - campo Pessoa
        var search = $('#search').val().split('|');
        var nome = $.trim(search[0]);
        var documento = parseInt($.trim(search[1]));

        for (var i = 0; i < checkinList.length; i++) {
            if (checkinList[i].documento == documento) {
                pessoaEncontrada = true;
                
                // Verifica se o campo Data Entrada foi preenchido
                if (data.dataEntrada != undefined && data.dataEntrada != "") {
                    // Verifica se já existe alguma data de entrada cadastrada no checkin
                    if (checkinList[i].dataEntrada == "") {
                        checkinList[i].dataEntrada = data.dataEntrada;
                    }
                }
                
                // Verifica se o campo Data Saída foi preenchido
                if (data.dataSaida != undefined || data.dataSaida != "") {
                    // Verifica se já existe alguma data de saída cadastrada no checkin
                    if (checkinList[i].dataSaida == "") {
                        checkinList[i].dataSaida = data.dataSaida;                        
                        // O valor da diária é calculado nesta etapa, com as informações sobre a data de saída
                        // Para o cálculo, verifica-se também se possui veículo
                        if (data.veiculo == undefined) {
                            data.veiculo = false;
                        }
                        checkinList[i].valor = calculate(checkinList[i].dataEntrada, checkinList[i].dataSaida, checkinList[i].veiculo);
                    }
                    // Caso o campo Data Saída não tenha sido preenchido, atribui valor 0 para diária
                    if (data.dataSaida == undefined || data.dataSaida == "") {
                        checkinList[i].valor = 0;
                    }
                    }
                }
                // Salva o status do checkbox "Possui veículo" na array
                if (checkinList[i].possuiVeiculo == "") {
                    if (data.veiculo == undefined) {
                        checkinList[i].possuiVeiculo = false;
                    }
                    if (data.veiculo != undefined) {
                        checkinList[i].possuiVeiculo = data.veiculo;
                    }
                }
                break;
            }        
        // Caso a pessoa não possua nenhum checkin, é criado um novo com as informações do formulário
        if (pessoaEncontrada == false) {
            var obj = {};
            obj["nome"] = nome;
            obj["documento"] = documento;
            // Verifica se o checkbox não foi marcado nenhuma vez
            if (data.veiculo == undefined) {
                data.veiculo = false;
            }
            obj["possuiVeiculo"] = data.veiculo;
            // Verifica se o campo Data Entrada possui algum registro
            if (data.dataEntrada != undefined || data.dataEntrada != "") {
                obj["dataEntrada"] = data.dataEntrada;
            }
            // Caso o campo Data Entrada esteja vazio, ele é salvo sem conteúdo
            if (data.dataEntrada == undefined || data.dataEntrada == "") {
                obj["dataEntrada"] = "";
            }
            // Verifica se o campo Data Saída possui algum registro
            // Caso possua, calcula o valor da diária com base na data informada
            if (data.dataSaida != undefined && data.dataSaida != "") {
                obj["dataSaida"] = data.dataSaida;
                if (!data.dataEntrada) {
                    obj["valor"] = calculate(data.dataEntrada, data.dataSaida, data.veiculo);
                }
            }
            // Caso o campo Data Saída esteja vazio, ele é salvo sem conteúdo e o valor da diária é definido como 0
            if (data.dataSaida == undefined || data.dataSaida == "") {
                obj["dataSaida"] = "";
                obj["valor"] = 0;
            }
            // Carrega as informações do novo checkin na array
            checkinList.push(obj);
        }
        
        // Verifica se a Data de Saída foi preenchida para então atualizar a consulta de "Pessoas que já deixaram o hotel" na tela
        if (data.dataSaida != undefined || data.dataSaida != "") {
            $scope.sairam();
        }
        // Verifica se a Data de Entrada foi preenchida para então atualizar a consulta de "Pessoas ainda presentes" na tela
        if (data.dataEntrada != undefined || data.dataEntrada != "" && data.dataSaida == undefined || data.dataSaida == "") {
            $scope.presentes();
        }
        // Limpa os campos da tela
        $scope.data = {};
        $('#search').val('');
    };

    // Criação da variável de consulta na tela
    var final = [{}];
    $scope.final = final;
    // Função para filtrar as pessoas que não estão mais no hotel
    $scope.sairam = function statusSaida() {
        final.splice(0);
        for (var i = 0; i < checkinList.length; i++) {
            // Verifica quais registros da array possuem uma data de saída e salva na array que aparece na tela
            if (checkinList[i].dataSaida != "") {
                final.push(checkinList[i]);
            }
        }
        ;
    };
    
    // Função para filtrar as pessoas que ainda estão no hotel
    $scope.presentes = function statusPresentes() {
        final.splice(0);
        for (var i = 0; i < checkinList.length; i++) {
            // Verifica quais registros da array não possuem uma data de saída e salva na array que aparece na tela
            if (checkinList[i].dataSaida == "") {
                final.push(checkinList[i]);
            }
        }
        ;
    };
    
    // Carregamento da consulta inicial na tela quando carrega a página pela primeira vez
    document.onload = $scope.presentes();
});

// Função para definir o tipo do campo "Data entrada" e "Data saída" como datetime
$(document).ready(function () {
    $("#dataSaida").focus(function () {
        $(this).attr({type: 'datetime-local'});
    });
    $("#dataEntrada").focus(function () {
        $(this).attr({type: 'datetime-local'});
    });
});