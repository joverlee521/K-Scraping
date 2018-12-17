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
            var newComment = $("<li>").addClass("list-group-item text-dark");
            var topRow = $("<div>").addClass("row justify-content-between");
            var author = $("<div>").addClass("col-4").html("<span><strong>" + data.author + "</strong></span>");
            var date = $("<div>").addClass("col-6 text-right").html("<span><small>" + data.createdAt + "</small></span>");
            topRow.append(author, date);
            var bottomRow = $("<div>").addClass("row");
            var comment = $("<div>").addClass("col-12").html("<p>" + data.comment + "</p>");
            bottomRow.append(comment);
            newComment.append(topRow, bottomRow);
            $(that).siblings(".comment-list").append(newComment);
        }
    });
});