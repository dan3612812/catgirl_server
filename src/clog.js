
exports.log = function (flags, msg, tag) {
    if (flags == "controller") {
        console.log("*********");
        console.log(msg);
        console.log("*********");
    } else if (flags == "mqtt") {
        if (tag == "2") {
            console.log("//////////");
            console.log(msg);
            console.log("//////////");
        } else {
            if (tag == "0") { //server msg mqtt
                console.log("-***-***-***-SERVER MSG-***-***-***-");
            } else if (tag == "1") { // client msg mqtt            
                console.log("--clinet msg--");
            }
            console.log(msg);
            console.log("--------------------");
        }
    }
}