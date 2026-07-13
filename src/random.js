function randomName(){
    let chars = "abcdefghijklmnopqrstuvwxyz";

    let out="_";

    for(let i=0;i<12;i++){
        out += chars[
            Math.floor(
                Math.random()*chars.length
            )
        ];
    }

    return out;
}

module.exports={
    randomName
};