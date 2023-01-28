function calculate_max_epsilon() {
    var max_epsilon = 0;
    for (var i = 1; i < FUNCTION_PTS.length; i++) {
        var epsilon = Math.abs(FUNCTION_PTS[i].y - FUNCTION_PTS[i - 1].y);
        if (epsilon > max_epsilon) {
            max_epsilon = epsilon;
        }
    }
    return max_epsilon;
}

function calculate_boxes_smart() {
    BOXES = [];
    // find index of A in FUNCTION_PTS
    var index_A = FUNCTION_PTS.findIndex(e => e.x==A) 
    var box_x1 = A;
    var box_x2 = A;
    var current_index = index_A;
    var current_y_min = FUNCTION_PTS[index_A].y;
    var current_y_max = FUNCTION_PTS[index_A].y;
    var current_y_begin = FUNCTION_PTS[index_A].y;
    var current_y_end = undefined;
    for (current_index = index_A; FUNCTION_PTS[current_index].x < B; current_index++) {
        if (Math.abs(current_y_max - current_y_min) > EPSILON) {
            box_x2 = FUNCTION_PTS[current_index - 1].x;
            current_y_end = FUNCTION_PTS[current_index - 1].y;
            BOXES.push({
                x1: box_x1, x2: box_x2,
                y1: current_y_begin, y2: current_y_end,
                y_min: current_y_min, y_max: current_y_max
            });
            current_y_begin = FUNCTION_PTS[current_index - 1].y;
            box_x1 = FUNCTION_PTS[current_index - 1].x;
            current_y_min = Math.min(FUNCTION_PTS[current_index - 1].y, FUNCTION_PTS[current_index].y);
            current_y_max = Math.max(FUNCTION_PTS[current_index - 1].y, FUNCTION_PTS[current_index].y);
        } else {
            if (FUNCTION_PTS[current_index].y > current_y_max) {
                current_y_max = FUNCTION_PTS[current_index].y;
            }
            if (FUNCTION_PTS[current_index].y < current_y_min) {
                current_y_min = FUNCTION_PTS[current_index].y;
            }
        }
    }
    if (BOXES.length == 0 || BOXES[BOXES.length - 1].x2 !== B) {
        box_x2 = B
        current_y_end = FUNCTION_PTS[current_index - 1].y;
        BOXES.push({
            x1: box_x1, x2: box_x2,
            y1: current_y_begin, y2: current_y_end,
            y_min: current_y_min, y_max: current_y_max
        });
    }
}

function check_delta(delta) {
    for (var i = delta; i < FUNCTION_PTS.length; i++) {
        if (Math.abs(FUNCTION_PTS[i].y - FUNCTION_PTS[i - delta].y) > EPSILON
            && FUNCTION_PTS[i].x <= B && FUNCTION_PTS[i - delta].x >= A) {
            return false;
        }
    }
    return true;
}
function calculate_boxes() {
    // caculate delta
    var delta = 1;
    while (check_delta(delta) && delta < FUNCTION_PTS.length + 1) {
        delta++;
    }
    delta--;
    // find boxes
    BOXES = [];
    var index_A = 0;
    for (var i = 0; i < FUNCTION_PTS.length; i++) {
        if (FUNCTION_PTS[i].x == A) {
            index_A = i;
            break;
        }
    }
    var box_x1 = A;
    var box_x2 = A + delta;
    var current_index = index_A;
    var current_y_begin = FUNCTION_PTS[index_A].y;
    var current_y_end = undefined;
    var current_y_min = FUNCTION_PTS[index_A].y;
    var current_y_max = FUNCTION_PTS[index_A].y;
    while (box_x2 < B) {
        for (var i = 0; i <= delta; i++) {
            if (FUNCTION_PTS[current_index + i].y > current_y_max) {
                current_y_max = FUNCTION_PTS[current_index + i].y;
            }
            if (FUNCTION_PTS[current_index + i].y < current_y_min) {
                current_y_min = FUNCTION_PTS[current_index + i].y;
            }
        }
        current_y_end = FUNCTION_PTS[current_index + delta].y;
        BOXES.push({
            x1: box_x1, x2: box_x2,
            y1: current_y_begin, y2: current_y_end,
            y_min: current_y_min, y_max: current_y_max
        });
        box_x1 += delta;
        box_x2 += delta;
        current_index += delta;
        current_y_min = FUNCTION_PTS[current_index].y;
        current_y_max = FUNCTION_PTS[current_index].y;
        current_y_begin = FUNCTION_PTS[current_index].y;
    }
    var i = 0;
    while (current_index + i < FUNCTION_PTS.length && FUNCTION_PTS[current_index + i].x <= B) {
        if (FUNCTION_PTS[current_index + i].y > current_y_max) {
            current_y_max = FUNCTION_PTS[current_index + i].y;
        }
        if (FUNCTION_PTS[current_index + i].y < current_y_min) {
            current_y_min = FUNCTION_PTS[current_index + i].y;
        }
        i++;
    }
    current_y_end = FUNCTION_PTS[current_index + i - 1].y;
    BOXES.push({
        x1: box_x1, x2: B,
        y1: current_y_begin, y2: current_y_end,
        y_min: current_y_min, y_max: current_y_max
    });
}