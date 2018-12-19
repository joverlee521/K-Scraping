function displayArticles(headline, summary, link, id, comments){
    var newArticle = $("<li>").addClass("articles list-group-item");
    var headline = $("<h5>").text(headline);
    var summary = $("<p>").text(summary);
    var buttonsRow = $("<div>").addClass("row");
    var readBtnCol = $("<div>").addClass("col");
    var readBtn = $("<a>").addClass("btn read-button").attr("href", link);
    readBtn.html("<small>Read Article</small>");
    readBtnCol.append(readBtn);
    var commentBtnCol = $("<div>").addClass("col text-right");
    var commentBtn = $("<button>").addClass("btn comment-btn collapsed");
    commentBtn.attr({"data-toggle": "collapse", "data-target": "#a" + id});
    commentBtn.html("<small>Comment</small>");
    commentBtnCol.append(commentBtn);
    buttonsRow.append(readBtnCol, commentBtnCol);
    var collapse = $("<div>").addClass("collapse m-3").attr("id", "a" + id);
    var form = $("<form>").addClass("comment-form my-4").attr("data-id", id);
    var newName = $("<div>").addClass("form-group");
    var nameInput = $("<input>").addClass("form-control comment-author");
    nameInput.attr({"type": "text", "placeholder": "Name"});
    nameInput.prop("required", true);
    newName.append(nameInput);
    var newComment = $("<div>").addClass("form-group");
    var commentInput = $("<textarea>").addClass("form-control comment-body");
    commentInput.attr({"rows": 3, "style": "resize:none", "placeholder": "Comment"});
    commentInput.prop("required", true);
    newComment.append(commentInput);
    var submitBtn = $("<button>").addClass("btn float-right");
    submitBtn.attr("type", "submit").text("Submit");
    form.append(newName, newComment, submitBtn);
    var commentList = $("<ul>").addClass("list-group comment-list");
    if(comments.length > 0){
        for(var i = 0; i < comments.length; i++){
            var user = comments[i].author;
            var commentBody = comments[i].comment
            var createDate = comments[i].createdAt;
            var existingComment = displayComments(user, createDate, commentBody);
            commentList.append(existingComment);
        }
    }
    collapse.append(form, $("<br><br>"), commentList);
    newArticle.append(headline, summary, buttonsRow, collapse);
    $("#articles-list").append(newArticle);
}

function displayComments(user, createDate, commentBody){
    var newComment = $("<li>").addClass("list-group-item text-dark");
    var topRow = $("<div>").addClass("row justify-content-between");
    var author = $("<div>").addClass("col-4").html("<span><strong>" + user + "</strong></span>");
    var date = $("<div>").addClass("col-6 text-right").html("<span><small>" + createDate + "</small></span>");
    topRow.append(author, date);
    var bottomRow = $("<div>").addClass("row");
    var comment = $("<div>").addClass("col-12").html("<p>" + commentBody + "</p>");
    bottomRow.append(comment);
    newComment.append(topRow, bottomRow);
    return newComment;
}

$("#new-scraps-btn").on("click", function(){
    $.get("/scrape", function(data){
        window.location = "/";
    });
});

$(document).on("click", ".comment-btn", function(){
    if($(this).hasClass("collapsed")){
        $(this).parent().parent().parent().css({"background-color": "white", "color": "black"});
    }
    else{
        $(this).parent().parent().parent().css({"background-color": "#544B8C", "color": "white"});
    }
});

$(document).on("submit", ".comment-form", function(event){
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
            var newComment = displayComments(data.author, data.createdAt, data.comment);
            $(that).siblings(".comment-list").append(newComment);
        }
    });
});

$("#load-more-btn").on("click", function(){
    var numOfArticles = $(".articles").length;
    $.get("/loadMore/" + numOfArticles, function(data){
        console.log(data);
        if(data.length === 0){
            $("#no-articles-modal").modal("show");
        }
        for(var i = 0; i < data.length; i++){
            var headline = data[i].headline;
            var summary = data[i].summary;
            var link = data[i].link;
            var id = data[i]._id;
            var comments = data[i].comment;
            displayArticles(headline, summary, link, id, comments);
        }
    });
});