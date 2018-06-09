document.querySelector("button").addEventListener('click', initialize);


function initialize(){
	console.log('initializing');
	let dictionary = store_data();

	let gameData = experiment(dictionary);
	let results = calculateRatio(gameData)
	renderResults(results);


}


function renderResults(results){
	document.querySelector("#playerOneStats").innerHTML = results[0]
	document.querySelector("#playerTwoStats").innerHTML = results[1]
}


function store_data(){
	let dictionary = {};
	
	dictionary.win_condition = document.querySelector('#win_condition').value;
	dictionary.num_of_trials = document.querySelector('#num_of_trials').value;
	dictionary.hand_limit_1 = document.querySelector('#hl1').value;
	dictionary.roll_limit_1 = document.querySelector('#rl1').value;
	dictionary.hand_limit_2 = document.querySelector('#hl2').value;
	dictionary.roll_limit_2 = document.querySelector('#rl2').value;

	return dictionary;

}


function player_strat_turn(hand_limit, iterations_limit){
	var hand = 0 
	var iterations = 0

	while((hand<=hand_limit)&&(iterations<=iterations_limit)){
		var dice_roll = Math.floor(6*Math.random())+1;
		if([2,3,4,5,6].indexOf(dice_roll) != -1){
			hand += dice_roll;
		}
		else{
			hand = 0;
			return hand 
		}
		iterations += 1;
	}
	return hand;
}

function trial(dictionary){
	var bank1 = 0
	var bank2 = 0
	var player_one = [1,0]
	var player_two = [0,1]
	while((bank1 <= dictionary.win_condition) && (bank2 <= dictionary.win_condition)){
		bank1+= player_strat_turn(dictionary.hand_limit_1, dictionary.roll_limit_1)
		bank2+= player_strat_turn(dictionary.hand_limit_2, dictionary.roll_limit_2)
	}
	if (bank1<=bank2){
		return player_one;
	
	}
	else{
		return player_two;
	}
}

function experiment(dictionary){
	var data = []
	for(let i = 1; i <= dictionary.num_of_trials; ++i){
		data.push(trial(dictionary))
	}

	return data;
}

function calculateRatio(data){
	let results = []
	var player1Wins = 0;
	var player2Wins = 0;
	var test = 0;

	for(let i = 0; i< data.length; i++){

		// test+=data[i][0]
		player1Wins += data[i][0]
		player2Wins += data[i][1]
	}
	results[0] = player1Wins/data.length
	results[1] = player2Wins/data.length

	return results;

}

function transpose(a) {
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c]; });
    });
}

function cumSum(array){
	var output = [];
	var sum = 0;

	for(var i in array){
	  sum=sum+array[i];
	  output.push(sum)
	}
	return output
}

function makePlottableArrays(results){
	var resultsT= transpose(results);
	var player1Wins = cumSum(resultsT[0]);
	var player2Wins = cumSum(resultsT[1]);
	var player1PlottableArray = [];
	var player2PlottableArray = [];
	console.log(player1Wins)
	console.log(player2Wins)
	for(let i = 0; i<results.length; i++){
		player1PlottableArray.push([i,player1Wins[i]]);
		player2PlottableArray.push([i,player2Wins[i]]);
	}
	return [player1PlottableArray, player2PlottableArray];
}