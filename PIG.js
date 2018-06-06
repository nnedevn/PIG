document.querySelector("button").addEventListener('click', initialize);


function initialize(){
	console.log('initializing');
	let dictionary = store_data();

	console.log(experiment(dictionary));



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
			return
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
	if (bank1<bank2){
		return player_one
	
	}
	else{
		return player_two
	}
}

function experiment(dictionary){
	console.log('exoperimenting')
	var data = []
	for(let i = 1; i <= dictionary.num_of_trials; ++i){
		console.log(i, "looping")
		data.push(trial(dictionary))
	}

	return data;
}