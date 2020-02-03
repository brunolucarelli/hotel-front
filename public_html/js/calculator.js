/* Script para calcular o valor da diária no hotel
 * - Uma diária no hotel de segunda à sexta custa R$120,00;
 * - Uma diária no hotel em finais de semana custa R$150,00;
 * - Caso a pessoa precise de uma vaga na garagem do hotel há um acréscimo diário, sendo R$15,00 de segunda à sexta e R$20,00 nos finais de semana;
 * - Caso o horário da saída seja após às 16:30h deve ser cobrada uma diária extra.
*/

// A função recebe a data de Entrada (data1), data de Saída (data2) e um boolean veículo
function calculate(data1, data2, veiculo) {
    
    // Função para criar uma array com todas as datas entre a data de entrada e saída (será usada para verificar os dias da semana)
    var getDates = function (startDate, endDate) {
        var dates = [],
                currentDate = startDate,
                addDays = function (days) {
                    var date = new Date(this.valueOf());
                    date.setDate(date.getDate() + days);
                    return date;
                };
        while (currentDate <= endDate) {
            dates.push(currentDate);
            currentDate = addDays.call(currentDate, 1);
        }
        return dates;
    };

    // Divide o registro do campo Datetime para alimentar a função do cálculo
    
    // Divide a data inicial em partes por '-'
    var dataEntrada = data1.split('-');
    // Separa o ano da hora
    var splitAnoEntrada = dataEntrada[2].split('T');
    var anoEntrada = $.trim(dataEntrada[0]);
    // Como os meses vão de 0 a 11, é reduzido um mês do valor recebido para realizar o cálculo e manter a informação correta
    // Exemplo: mês fornecido = 02 (fevereiro), porém o script lê como março (0-jan,1-fev,2-mar), então reduzindo 1 fica como 01 (fev)
    var mesEntrada = parseInt($.trim(dataEntrada[1])) - 1;
    var diaEntrada = $.trim(splitAnoEntrada[0]);

    // Divide a data inicial em partes por '-'
    var dataSaida = data2.split('-');
    // Separa o ano da hora
    var splitAnoSaida = dataSaida[2].split('T');

    var anoSaida = $.trim(dataSaida[0]);
    // Como os meses vão de 0 a 11, é reduzido um mês do valor recebido para realizar o cálculo e manter a informação correta
    // Exemplo: mês fornecido = 02 (fevereiro), porém o script lê como março (0-jan,1-fev,2-mar), então reduzindo 1 fica como 01 (fev)
    var mesSaida = parseInt($.trim(dataSaida[1])) - 1;
    var diaSaida = $.trim(splitAnoSaida[0]);

    // Separa a hora/min da data de saída (usada para calcular o acréscimo de mais uma diária caso passe das 16:30)
    var splitHorarioSaida = splitAnoSaida[1].split(':');
    var horaSaida = $.trim(splitHorarioSaida[0]);
    var minutoSaida = $.trim(splitHorarioSaida[1]);

    // Define o valor inicial da diária como 0
    valor = 0;

    // Cria as variáveis no formato Date
    var getDateEntrada = new Date(anoEntrada, mesEntrada, diaEntrada);
    var getDateSaida = new Date(anoSaida, mesSaida, diaSaida);

    var dates = getDates(getDateEntrada, getDateSaida);
    dates.forEach(function (date) {
        
        // Consegue um número referente ao dia da semana
        var n = date.getDay();
        
        // Verifica se o dia da semana é entre segunda (1) e sexta (5)
        if (n >= 1 && n <= 5) {
            // Soma 120 reais caso seja um dia entre segunda e sexta
            valor = valor + 120;
            if (veiculo == true) {
                // Caso possua véiculo, adiciona mais 15 reais
                valor = valor + 15;
            }
            // Caso a data verifica no momento seja igual a data de saída, verifica-se se o checkout foi feito após as 16:30
            if (date == getDateSaida) {
                if (horaSaida == 16 && minutoSaida >= 30 || horaSaida >= 17) {
                    // Caso o checkout tenha sido feito após as 16:30, adiciona-se uma nova diária
                    valor = valor + 120;
                    if (veiculo == true) {
                        valor = valor + 15;
                    }
                }
            }
        }
        
        // Verifica se o dia da semana é domingo (0) ou sábado (6)
        if (n == 0 || n == 6) {
            // Soma o valor da diária no final de semana
            valor = valor + 150;
            if (veiculo == true) {
                valor = valor + 20;
            }
            // Caso a data verifica no momento seja igual a data de saída, verifica-se se o checkout foi feito após as 16:30
            if (date == getDateSaida) {
                // Caso o checkout tenha sido feito após as 16:30, adiciona-se uma nova diária
                if (horaSaida == 16 && minutoSaida >= 30 || horaSaida >= 17) {
                    valor = valor + 120;
                    if (veiculo == true) {
                        valor = valor + 15;
                    }
                }
            }
        }
    });
    return valor;
};