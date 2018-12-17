$(".comment-btn").on("click", function(){
    if(!$(this).hasClass("collapsed")){
        $(this).parent().css({"background-color": "white", "color": "black"});
    }
    else{
        $(this).parent().css({"background-color": "#544B8C", "color": "white"});
    }
});

$(".comment-form").on("submit", function(event){
    event.preventDefault();
    var that = this;
    var id = $(that).data("id");
    var author = $(that).find(".comment-author").val();
    var comment = $(that).find(".comment-body").val();
    var commentObj = {
        articleId: id,
        author: author,
        body: comment
    };
    $.ajax("/comment", {
        type: "POST",
        data: commentObj
    }).then(function(data){
        if(data){
            $(that).find(".comment-author").val("");
            $(that).find(".comment-body").val("");
        }
    });
});