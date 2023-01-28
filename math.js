BOXES_X = [];
BOXES_Y = [];
EPSILON = 10;

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

function change_epsilon(){
    EPSILON = document.getElementById("range_Epsilon").value/50;
    if (EPSILON < calculate_max_epsilon()) {
        console.log(epsilon, "Epsilon is too small");
    } else{
        console.log(epsilon, "Epsilon is good");
    }
}

function calculate_boxes(){
    BOXES_X = [A];
    // find index of A in FUNCTION_PTS_X
    var index_A = 0;
    for(var i = 0; i < FUNCTION_PTS_X.length; i++){
        if(FUNCTION_PTS_X[i] == A){
            index_A = i;
            break;
        }
    }
    BOXES_Y = [FUNCTION_PTS_Y[index_A]];
    var current_index = index_A;
    var current_y = FUNCTION_PTS_Y[index_A]
    for(current_index = index_A+1; FUNCTION_PTS_X[current_index] <= B; current_index++){
        if(Math.abs(FUNCTION_PTS_Y[current_index] - current_y) > EPSILON){
            BOXES_X.push(FUNCTION_PTS_X[current_index-1]);
            BOXES_Y.push(FUNCTION_PTS_Y[current_index-1]);
            current_y = FUNCTION_PTS_Y[current_index];
        }
    }
    if (!BOXES_X.includes(B)) {
        BOXES_X.push(B);
        BOXES_Y.push(FUNCTION_PTS_Y[current_index-1]);
    }
}