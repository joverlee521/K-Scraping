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
    var id = $(this).data("id");
    var author = $(this).find(".comment-author").val();
    var comment = $(this).find(".comment-body").val();
    var commentObj = {
        articleId: id,
        author: author,
        body: comment
    };
    $.ajax("/comment", {
        type: "POST",
        data: commentObj
    }).then(function(data){
        console.log(data);
    });
});