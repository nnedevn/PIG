document.querySelector("button").addEventListener('click', logThis);


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


