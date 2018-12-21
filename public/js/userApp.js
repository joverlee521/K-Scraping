var regex = /^[a-zA-Z0-9]*$/

$("#new-username-form").on("submit", function(event){
    event.preventDefault();
    var username = $("#username-input").val().trim();
    if(username.length < 2 || !regex.test(username)){
        $("#modal-head").text("Something's Wrong!");
        $("#modal-message").html("The username you have entered is already in use or does not fit our criteria! <br> Usernames must be more than 2 characters and consist only of letters and numbers!");
        $("#username-modal").modal("show");
    }
    else{
        $.ajax("/username", {
            type: "PUT",
            data: {username:username}
        }).then(function(data){
            $("#username-success-modal").modal("show");
        });
    }
});

$(document).on("click", ".bookmark-btn", function(){
    var that = this;
    var id = $(that).data("id");
    $.ajax("/bookmark/" + id, {
        type: "PUT"
    }).then(function(){
        $(that).tooltip("hide");
        $(that).prop("disabled", true);
    });
});

$(document).on("click", ".delete-bookmark-btn", function(){
    var that = this;
    var id = $(that).data("id");
    $.ajax("/bookmark/" + id, {
        type: "DELETE"
    }).then(function(){
        $(that).tooltip("hide");
        $(that).parent().remove();
    });
})

// Submission of a new comment on an article, posts to the database
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
            $(that).find(".comment-body").val("");
            // Comment returned from POST is dynamically appended to the page
            var newComment = displayComments(data[0]._id, data[0].author, data[0].authorId, data[0].createdAt, data[0].comment, data[1]);
            $(that).siblings(".comment-list").append(newComment);
        }
    });
});

$(document).on("click", ".delete-comment-btn", function(){
    var that = this;
    var commentId = $(that).data("id");
    var articleId = $(that).parents("ul").data("id");
    $.ajax("/comment/" + commentId + "/" + articleId, {
        type: "DELETE"
    }).then(function(){
        $(that).parentsUntil("ul").remove();
    })
});