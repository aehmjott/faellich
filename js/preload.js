preload = function(callback){
    game.images = [
        "assets/clubhaus.png",
        "assets/stammkneipe.png",
        "assets/kneipe.png",
        "assets/kampfer.png"
    ];
    var counter = 0;
    for(var i = 0; i < game.images.length; i++){
        var url = game.images[i];
        game.images[i] = new Image();
        game.images[i].src = url;
        game.images[i].onload = function(){
            counter++;
            if(counter === game.images.length){
                callback();
            }
        };
    }
}