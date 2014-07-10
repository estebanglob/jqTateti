$(document).ready(function() {
  /*
  set the board position
  document.body.offsetWidth
  */
  var bodyWidth = document.body.offsetWidth;
  var boardLeft = (bodyWidth - 408) / 2;
  $('.board').css('left', boardLeft + 'px');

  var modalStart = $('#modal-dialog-start');
  var modalStartLeft = (bodyWidth - modalStart.width()) / 2;
  $('#modal-dialog-start').css('left', modalStartLeft + 'px');

  /*
  Set the modal dialog
  */

  modalStart.jqm({
    modal: true
  });
  modalStart.jqmShow();
  // modal.jqmShow();
  $('.start-button').on('click', function() {
    modalStart.jqmHide();
  });


  var picPlayerSelector = '[src="img/manosanta.jpg"]';
  var picMachineSelector = '[src="img/tato_bores.jpg"]';

  var model = {
    1: '', 2: '', 3: '',
    4: '', 5: '', 6: '',
    7: '', 8: '', 9: ''
  };

  var playerSymbol = 'X',
      machineSymbol = 'O';

  var winCombinations = [
    // horizontals
    [1, 2, 3], [4, 5, 6], [7, 8, 9],

    // verticals
    [1, 4, 7], [2, 5, 8], [3, 6, 9],

    // diagonals
    [1, 5, 9], [3, 5, 7]
  ];

  var emptyCelds = function() {
    var empty = 0;
    for (var i in model) {
      if (model[i] === '') {
        empty++;
      }
    }

    return empty;
  };

  var checkWin = function(player) {
    var symbol = player ? playerSymbol : machineSymbol;

    console.info("checkWin - symbol", symbol);

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

  var markPlayerCeld = function($celd) {
    var celdNumber = $celd.attr('class').split(' ')[1].replace('celd', '');
    model[ celdNumber ] = playerSymbol;
    $celd.css('z-index', '-1');
    $('.pic' + celdNumber + picPlayerSelector).addClass('right');
  };

  var markMachineCeld = function(celdNumber) {
    var $celd = $('.celd' + celdNumber);
    var $img = $('.pic' + celdNumber + picMachineSelector);
    model[ celdNumber ] = machineSymbol;
    $celd.css('z-index', '-1');
    $img.addClass('right');
  };

  $('.celd').on('click', function() {
    markPlayerCeld($(this));

    if (checkPlayerWin()) {
      window.alert('The player has won!');
    }

    if (emptyCelds() === 0) {
      window.alert('Draw!');
      return;
    }
    else {
      window.setTimeout(function() {
        $.ajax(
          '/ajax',
          {
            data: model,
            dataType: "json",
            type: "POST",
            success: function(data, textStatus, jqXHR) {
              model[ data.machineCeld ] = machineSymbol;
              markMachineCeld(data.machineCeld);
              if (checkMachineWin()) {
                window.alert('The machine has won!');
                return;
              }

              if (emptyCelds() === 0) {
                window.alert('Draw!');
                return;
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              console.info("errorThrown", errorThrown);
            }
          }
        );
      }, 1000);
    }
  });
});
