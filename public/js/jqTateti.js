$(document).ready(function() {
  /*
  modales
  */
  var modalStart = $('#modal-dialog-start'),
      modalEnd = $('#modal-dialog-end'),
      modalThinking = $('#modal-dialog-thinking');

  /*
  vars usadas para seleccionar las imágenes que se van a mostrar al marcar
  una celda
  */
  var picPlayerSelector = '[src="img/manosanta.jpg"]';
  var picMachineSelector = '[src="img/tato_bores.jpg"]';

  /*
  var donde vamos a tener el estado de las celdas
  */
  var model = {
      1: '', 2: '', 3: '',
      4: '', 5: '', 6: '',
      7: '', 8: '', 9: ''
    };

  /*
  símbolos que con vamos a marcar, en model, a qué jugador
  pertenece cada celda
  */
  var playerSymbol = 'X',
      machineSymbol = 'O';

  /*
  var con las combinaciones de celdas que forman un ta te ti
  */
  var winCombinations = [
    // horizontals
    [1, 2, 3], [4, 5, 6], [7, 8, 9],

    // verticals
    [1, 4, 7], [2, 5, 8], [3, 6, 9],

    // diagonals
    [1, 5, 9], [3, 5, 7]
  ];

  /*
  Función para limpiar el board
  */
  var clean = function() {
    model = {
      1: '', 2: '', 3: '',
      4: '', 5: '', 6: '',
      7: '', 8: '', 9: ''
    };

    $('.picture').removeClass('right');
    $('.celd').css('z-index', 0);
  };

  // set board and modals left
    var bodyWidth = document.body.offsetWidth;
    var boardLeft = (bodyWidth - 408) / 2;
    $('.board').css('left', boardLeft + 'px');

    var modalStartLeft = (bodyWidth - modalStart.width()) / 2;
    // $('.modal-dialog').css('left', modalStartLeft + 'px').jqm({
    //   modal: true
    // });

    $('.modal-dialog').css('left', '25px').jqm({
      modal: true
    });

    modalStart.jqmShow();

    $('#modal-dialog-start .close-button').on('click', function() {
      // comenzarla partida
      modalStart.jqmHide();
    });

    $('#modal-dialog-end .close-button').on('click', function() {
      // limpiar el board
      clean();
      modalEnd.jqmHide();
    });


  /*
  función para saber si quedan celdas sin marcar. Si no quedan celdas vacías,
  y ni el jugador ni la máquina hicieron ta te ti, estamos ante un empate
  */
  var emptyCelds = function() {
    var empty = 0;
    for (var i in model) {
      if (model[i] === '') {
        empty++;
      }
    }

    return empty;
  };

  /*
  función para comprobar si hay un ta te ti
  */
  var checkWin = function(player) {
    var symbol = player ? playerSymbol : machineSymbol;

    var win = false;

    for (var i = 0, l = winCombinations.length; i < l; i++) {
      var currentComb = winCombinations[i];

      if (model[ currentComb[0] ] === symbol &&
          model[ currentComb[1] ] === symbol &&
          model[ currentComb[2] ] === symbol) {

        win = true;
        break;
      }
    }

    return win;
  };

  var checkPlayerWin = function() {
    return checkWin(true);
  };

  var checkMachineWin = function() {
    return checkWin(false);
  };


  /*
  función para marcar una celda clickeada por el jugador
  */
  var markPlayerCeld = function($celd) {
    var celdNumber = $celd.attr('class').split(' ')[1].replace('celd', '');
    model[ celdNumber ] = playerSymbol;
    $celd.css('z-index', '-1');
    $('.pic' + celdNumber + picPlayerSelector).addClass('right');
  };

  /*
  función para marcar una celda seleccionada por la app
  */
  var markMachineCeld = function(celdNumber) {
    var $celd = $('.celd' + celdNumber);
    var $img = $('.pic' + celdNumber + picMachineSelector);
    model[ celdNumber ] = machineSymbol;
    $celd.css('z-index', '-1');
    $img.addClass('right');
  };


  /*
  registrar el click handler para las celdas. Dentro de este handler, se
  ejecuta la lógica del juego. Cuando el jugador clickea una celda, se la marca,
  se comprueba si el jugador hizo un tateti, o si ya no quedan celdas vacías.
  Caso contrario, se hace una llamada AJAX que devuelve la jugada de la app.
  */
  $('.celd').on('click', function() {
    markPlayerCeld($(this));

    if (checkPlayerWin()) {
      $('.end-of-game-message').text('Ganaste!');
      modalEnd.jqmShow();
      return;
    }

    if (emptyCelds() === 0) {
      $('.end-of-game-message').text('Empate!');
      modalEnd.jqmShow();
      return;
    }
    else {
      modalThinking.jqmShow();
      var thinkingMessage = 'Pensando';
      $('.thinking-message').text(thinkingMessage);
        var thinkingMessageTimes = 0;
        var thinkingInterval = window.setInterval(function() {
          console.info('thinkingInterval');
          if (thinkingMessageTimes === 3) {
            thinkingMessageTimes = 0;
          }
          for (var i = 0; i < thinkingMessageTimes; i++) {
            thinkingMessage = thinkingMessage + '.';
          }
          $('.thinking-message').text(thinkingMessage);
          thinkingMessageTimes++;
        }, 750);
      window.setTimeout(function() {
        $.ajax(
          '/ajax',
          {
            data: model,
            dataType: "json",
            type: "POST",
            success: function(data, textStatus, jqXHR) {
              window.clearInterval(thinkingInterval);
              modalThinking.jqmHide();
              model[ data.machineCeld ] = machineSymbol;
              markMachineCeld(data.machineCeld);
              if (checkMachineWin()) {
                $('.end-of-game-message').text('Gané!');
                modalEnd.jqmShow();
                return;
              }

              if (emptyCelds() === 0) {
                $('.end-of-game-message').text('Empate.');
                modalEnd.jqmShow();
                return;
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              console.info("errorThrown", errorThrown);
            }
          }
        );
      }, 3000);
    }
  });
});
