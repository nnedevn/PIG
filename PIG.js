document.querySelector("button").addEventListener("click", initialize);

function initialize() {
  console.log("initializing");
  let dictionary = store_data();

  let gameData = experiment(dictionary);
  let results = calculateRatio(gameData);
  // makePlottableArrays(results);
  renderResults(results);

  drawChart();
}

function renderResults(results) {
  document.querySelector("#playerOneStats").innerHTML = results[0];
  document.querySelector("#playerTwoStats").innerHTML = results[1];
}

function store_data() {
  let dictionary = {};

  dictionary.win_condition = document.querySelector("#win_condition").value;
  dictionary.num_of_trials = document.querySelector("#num_of_trials").value;
  dictionary.hand_limit_1 = document.querySelector("#hl1").value;
  dictionary.roll_limit_1 = document.querySelector("#rl1").value;
  dictionary.hand_limit_2 = document.querySelector("#hl2").value;
  dictionary.roll_limit_2 = document.querySelector("#rl2").value;

  return dictionary;
}

function player_start_turn(hand_limit, iterations_limit) {
  var hand = 0;
  var iterations = 0;

  while (hand <= hand_limit && iterations <= iterations_limit) {
    var dice_roll = Math.floor(6 * Math.random()) + 1;
    if ([2, 3, 4, 5, 6].indexOf(dice_roll) != -1) {
      hand += dice_roll;
    } else {
      hand = 0;
      return hand;
    }
    iterations += 1;
  }
  return hand;
}

function trial(dictionary) {
  var bank1 = 0;
  var bank2 = 0;
  var player_one = [1, 0];
  var player_two = [0, 1];
  while (
    bank1 <= dictionary.win_condition &&
    bank2 <= dictionary.win_condition
  ) {
    bank1 += player_start_turn(
      dictionary.hand_limit_1,
      dictionary.roll_limit_1
    );
    bank2 += player_start_turn(
      dictionary.hand_limit_2,
      dictionary.roll_limit_2
    );
  }
  if (bank1 <= bank2) {
    return player_one;
  } else {
    return player_two;
  }
}

function experiment(dictionary) {
  var data = [];
  for (let i = 1; i <= dictionary.num_of_trials; ++i) {
    data.push(trial(dictionary));
  }

  return data;
}

function calculateRatio(data) {
  let results = [];
  var player1Wins = 0;
  var player2Wins = 0;
  var test = 0;

  for (let i = 0; i < data.length; i++) {
    // test+=data[i][0]
    player1Wins += data[i][0];
    player2Wins += data[i][1];
  }
  results[0] = player1Wins / data.length;
  results[1] = player2Wins / data.length;

  return results;
}

function transpose(a) {
  return Object.keys(a[0]).map(function(c) {
    return a.map(function(r) {
      return r[c];
    });
  });
}

function cumSum(array) {
	return array.reduce((total, currentValue) => {return total + currentValue}, 0 )

}

function makePlottableArrays(results) {
  var resultsT = transpose(results);
  var player1Wins = resultsT[0];
  var player2Wins = cumSum(resultsT[1]);
  var player1PlottableArray = [];
  var player2PlottableArray = [];
  console.log(player1Wins);
  console.log(player2Wins);
  for (let i = 0; i < results.length; i++) {
    player1PlottableArray.push([i, player1Wins[i]]);
    player2PlottableArray.push([i, player2Wins[i]]);
  }
  console.log(player1PlottableArray, player2PlottableArray);
  return [player1PlottableArray, player2PlottableArray];
}

function drawChart(data) {
  let dataPlayerOne = [1, 2, 3, 3, 3, 3, 4, 5, 6, 7, 7, 7, 7, 8];
  let dataPlayerTwo = [0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 4, 5, 6, 6];
  let maxWins =
    Math.max(...dataPlayerOne) > Math.max(...dataPlayerTwo)
      ? Math.max(...dataPlayerOne)
      : Math.max(...dataPlayerTwo);

  let dataLabel = [];
  for (let i = 0; i <= dataPlayerOne.length; i += 1) {
    dataLabel.push(i + "");
  }

  let config = {
    // Type of chart
    type: "line",
    data: {
      // labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11,", "12", "13", "14", "15"],
      labels: dataLabel,
      datasets: [
        {
          label: "Player One Wins",
          data: dataPlayerOne,
          fill: false,
          borderColor: "rgba(206, 0, 0, 1)",
          backgroundColor: "none"
        },
        {
          label: "Player Two Wins",
          data: dataPlayerTwo,
          fill: false,
          borderColor: "rgba(0, 0, 206, 1)"
        }
      ]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: "Chart.js Line Chart"
      },
      tooltips: {
        mode: "index",
        intersect: false
      },
      hover: {
        mode: "nearest",
        intersect: true
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Number of plays"
            }
          }
        ],
        yAxes: [
          {
            display: true,
            ticks: {
              suggestedMax: maxWins + 1
            },
            scaleLabel: {
              display: true,
              labelString: "Wins"
            }
          }
        ]
      }
    }
  };

  console.log(maxWins);

  let ctx = document.querySelector("#chart").getContext("2d");
  let simChart = new Chart(ctx, config);
}
