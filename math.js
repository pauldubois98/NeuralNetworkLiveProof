BOXES = [];
EPSILON = 20;

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

function calculate_boxes_0(){
    BOXES = [];
    // find index of A in FUNCTION_PTS_X
    var index_A = 0;
    for(var i = 0; i < FUNCTION_PTS_X.length; i++){
        if(FUNCTION_PTS_X[i] == A){
            index_A = i;
            break;
        }
    }
    var box_x1 = A;
    var box_x2 = A;
    var current_index = index_A;
    var current_y_min = FUNCTION_PTS_Y[index_A]
    var current_y_max = FUNCTION_PTS_Y[index_A]
    for(current_index = index_A+1; FUNCTION_PTS_X[current_index] <= B; current_index++){
        if( Math.abs(current_y_max - current_y_min) > EPSILON ){
            box_x2 = FUNCTION_PTS_X[current_index-1];
            BOXES.push( [box_x1, box_x2, current_y_min, current_y_max] );
            box_x1 = FUNCTION_PTS_X[current_index-1];
            current_y_min = FUNCTION_PTS_Y[current_index];
            current_y_max = FUNCTION_PTS_Y[current_index];
        } else{
            if(FUNCTION_PTS_Y[current_index] > current_y_max){
                current_y_max = FUNCTION_PTS_Y[current_index];
            }
            if(FUNCTION_PTS_Y[current_index] < current_y_min){
                current_y_min = FUNCTION_PTS_Y[current_index];
            }
        }
    }
    if (BOXES[BOXES.length-1][1] == B) {
        box_x2 = B
        BOXES.push( [box_x1, box_x2, current_y_min, current_y_max] );
    }
}

function check_delta(delta){
    for (var i = delta; i < FUNCTION_PTS_X.length; i++) {
        if (Math.abs(FUNCTION_PTS_Y[i] - FUNCTION_PTS_Y[i-delta]) > EPSILON
        && FUNCTION_PTS_X[i] <= B && FUNCTION_PTS_X[i-delta] >= A) {
            return false;
        }
    }
    return true;
}
function calculate_boxes(){
    // caculate delta
    var delta = 1;
    while (check_delta(delta)) {
        delta++;
    }
    delta--;
    // find boxes
    BOXES = [];
    var index_A = 0;
    for(var i = 0; i < FUNCTION_PTS_X.length; i++){
        if(FUNCTION_PTS_X[i] == A){
            index_A = i;
            break;
        }
    }
    var box_x1 = A;
    var box_x2 = A+delta;
    var current_index = index_A;
    var current_y_min = FUNCTION_PTS_Y[index_A]
    var current_y_max = FUNCTION_PTS_Y[index_A]
    while (box_x2<B){
        for(var i=0; i<=delta; i++){
            if(FUNCTION_PTS_Y[current_index+i] > current_y_max){
                current_y_max = FUNCTION_PTS_Y[current_index+i];
            }
            if(FUNCTION_PTS_Y[current_index+i] < current_y_min){
                current_y_min = FUNCTION_PTS_Y[current_index+i];
            }
        }
        BOXES.push( [box_x1, box_x2, current_y_min, current_y_max] );
        box_x1 += delta;
        box_x2 += delta;
        current_index += delta;
        current_y_min = FUNCTION_PTS_Y[current_index];
        current_y_max = FUNCTION_PTS_Y[current_index];
    }
    var i = 0;
    while(FUNCTION_PTS_X[current_index+i] <= B){
        if(FUNCTION_PTS_Y[current_index+i] > current_y_max){
            current_y_max = FUNCTION_PTS_Y[current_index+i];
        }
        if(FUNCTION_PTS_Y[current_index+i] < current_y_min){
            current_y_min = FUNCTION_PTS_Y[current_index+i];
        }
        i++;
    }
    BOXES.push( [box_x1, B, current_y_min, current_y_max] );
}