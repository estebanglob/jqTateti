var app = {};

app.model = {
  playerSymbol: 'X',
  machineSymbol: 'O',
  picPlayerSelector: '[src="img/manosanta.jpg"]',
  picMachineSelector: '[src="img/tato_bores.jpg"]',
  celds: {
    1: '', 2: '', 3: '',
    4: '', 5: '', 6: '',
    7: '', 8: '', 9: ''
  }
};

app.actions = {
  playerClickHandler: function() {
    app.actions.markPlayerCeld($this);
  },

  handlePlayerClick: function() {
    $('.celd').on('click', app.actions.playerClickHandler);
  },

  checkEmptyCelds: function() {
    var empty = 0;
    for (var i in app.model.celds) {
      if (app.model.celds[i] === '') {
        empty++;
      }
    }

    return empty;
  },
  
  checkWin: function() {},
  checkPlayerkWin: function() {},
  checkMachinekWin: function() {},
  checkDraw: function() {},
  requestNextMachineCeld: function() {},
  showMachineModal: function() {},
  stopHandlingPlayerClick: function() {},
  markPlayerCeld: function($celd) {
    var celdNumber = $celd.attr('class').split(' ')[1].replace('celd', '');
    app.model.celds[ celdNumber ] = app.model.playerSymbol;
    $celd.css('z-index', '-1');
    $('.pic' + celdNumber + app.model.picPlayerSelector).addClass('right');
    // emit event 'playerCeldMarked'
  },
  markMachineCeld: function() {}
};


$(document).ready(function() {
  app.actions.handlePlayerClick();
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



  /* Events bindings */
  /*$('.celd').on('click', function() {

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
  });*/
});
