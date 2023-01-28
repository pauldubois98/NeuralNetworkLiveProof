function calculate_max_epsilon(){
    var max_epsilon = 0;
    for(var i = 0; i < FUNCTION_PTS_X.length; i++){
        var epsilon = Math.abs(FUNCTION_PTS_Y[i] - FUNCTION_PTS_Y[i-1]);
        if(epsilon > max_epsilon){
            max_epsilon = epsilon;
        }
    }
    return max_epsilon;
}

