// Cria uma lista automática com base nas informações digitas no campo Pessoa
$(document).ready(function () {
    $.ajaxSetup({cache: false});
    // Verifica a lista a cada tecla digitada
    $('#search').keyup(function () {
        $('#result').html('');
        $('#state').val('');
        var searchField = $('#search').val();
        var expression = new RegExp(searchField, "i");
        $.each(hospedes, function (key, value) {
            if (value.nome.search(expression) != -1)
            {
                // Cria uma lista com o nome e documento dos registros encontrados
                $('#result').append('<li class="list-group-item link-class"> ' + value.nome + ' | <span class="text-muted">' + value.documento + '</span></li>');
            }
        });
    });

    // Carrega as informações da pessoa selecionada no campo
    $('#result').on('click', 'li', function () {
        var click_text = $(this).text();
        $('#search').val(click_text);
        
        // Divide as informações nome e documento para buscar as datas de entrada e saída na array
        // e carregá-las nos respectivos campos
        var search = $('#search').val().split('|');
        var documento = parseInt($.trim(search[1]));       

        for (var i = 0; i < checkinList.length; i++) {
            // Verifica se existe algum registro no checkin com o mesmo documento
            if (checkinList[i].documento == documento) {
                // Caso exista, verifica se existe dados sobre a Data de Entrada e carrega-os no campo
                if (checkinList[i].dataEntrada != "") {
                    $('#dataEntrada').val(checkinList[i].dataEntrada);
                }
                // Verifica se existe dados sobre a Data de Saída e carrega-os no campo
                if (checkinList[1].dataSaida != "") {
                    $('#dataSaida').val(checkinList[i].dataSaida);
                }            
            }
        };
    });
    
    // Fecha as opções da pesquisa por pessoas caso haja qualquer clique fora da lista
    $('body').on('click', function () {
        $("#result").html('');
    });
});