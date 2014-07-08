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


/*
Utility Functions
*/

var checkTwoInThree = function(celdList, player) {
  var i = 0,
      l = winCombinations.length,
      symbol = player ? playerSymbol : machineSymbol,
      resultObj = {
        celdNumber: -1,
        isPossibleWin: false
      },
      currentComb;

  for (; i < l; i++) {
    currentComb = winCombinations[i];

    if ((celdList[ currentComb[0] ] === '') &&
        (celdList[ currentComb[1] ] === symbol) &&
        (celdList[ currentComb[2] ] === symbol)) {
      resultObj.celdNumber = currentComb[0];
      resultObj.isPossibleWin = true;
      return resultObj;
    }

    if ((celdList[ currentComb[1] ] === '') &&
        (celdList[ currentComb[0] ] === symbol) &&
        (celdList[ currentComb[2] ] === symbol)) {
      resultObj.celdNumber = currentComb[1];
      resultObj.isPossibleWin = true;
      return resultObj;
    }

    if ((celdList[ currentComb[2] ] === '') &&
        (celdList[ currentComb[1] ] === symbol) &&
        (celdList[ currentComb[0] ] === symbol)) {
      resultObj.celdNumber = currentComb[2];
      resultObj.isPossibleWin = true;
      return resultObj;
    }
  }

  return resultObj;
};

/*
End Utility Functions
*/


var machineMove = function(celdList) {
  var selectedCeld = null;
  /*
  1. check if the machine can win in only one movement.
  In some of the possible win combinations, there must be one empty celd,
  and the other two must have the machine's symbol.
  */
  var checkTwoInThreeRes = checkTwoInThree(celdList, false);
  if (checkTwoInThreeRes.isPossibleWin) {
    return checkTwoInThreeRes.celdNumber;
  }


  /*
  2. There is not a possible win in just one movement. Let's check then
  if the player has a possible win in just one movement, and if so, try to avoid it.
  */
  checkTwoInThreeRes = checkTwoInThree(celdList, true);
  if (checkTwoInThreeRes.isPossibleWin) {
    return checkTwoInThreeRes.celdNumber;
  }


  /*
  3. There is not a possible win for the player. If the center cled is empty, take it.
  Else, take a random celd.
  */
  if (celdList[5] === '') {
    selectedCeld = 5;
  }
  else {
    var randomCeld = -1;
    while (true) {
      randomCeld = parseInt((Math.random() * 9) + 1, 10);
      if (celdList[randomCeld] === '') {
        selectedCeld = randomCeld;
        break;
      }
    }
  }

  return selectedCeld;
};



module.exports = machineMove;
