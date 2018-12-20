// Takes articles returned from API call and dynamically displays them on page
function displayArticles(headline, summary, link, id, comments, bookmarked, loggedIn){
    var newArticle = $("<li>").addClass("articles list-group-item");
    if(loggedIn){
        var bookmarkBtn = $("<button>").addClass("btn float-right mr-2 px-1 py-0 bookmark-btn");
        bookmarkBtn.attr({"data-toggle": "tooltip", "data-placement": "right", "data-original-title": "Bookmark!", "data-id": id});
        if(bookmarked){
            bookmarkBtn.prop("disabled", true);
        }
        var bookmarkIcon = $("<i>").addClass("fas fa-bookmark");
        bookmarkBtn.append(bookmarkIcon);
        newArticle.append(bookmarkBtn);
    }
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
    commentBtn.html("<small>Comments</small>");
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
    // Only appends comments if they already exist in the database
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

// Takes comments returned from API call and dynamically creates their display
// Returns the new comment so it can be appended to corresponding articles
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

// Loops through an array of articles and passes each article into displayArticles function
function deconstructArticlesArray(data, loggedIn){
    for(var i = 0; i < data.length; i++){
        var headline = data[i].headline;
        var summary = data[i].summary;
        var link = data[i].link;
        var id = data[i]._id;
        var comments = data[i].comment;
        var bookmarked = data[i].bookmarked;
        displayArticles(headline, summary, link, id, comments, bookmarked, loggedIn);
    }
}

// Clicking "Get Latest k-Scraps" calls on API to scrape the web for the latest articles
$("#new-scraps-btn").on("click", function(){
    $.get("/scrape", function(data){
        var foundNewArticle = false;
        var newArticles = [];
        // Loops through the returned object and look for new articles(objects)
        for(var key in data){
            var article = data[key];
            // If the value is not a string(not an error message), store in newArticles array
            // Also change foundNewArticle flag to true
            if(typeof article !== "string"){
                foundNewArticle = true;
                newArticles.push(article);
            }
        }
        // If new articles were found, replace currently displayed articles with new articles
        if(foundNewArticle){
            $("#articles-list").empty();
            deconstructArticlesArray(newArticles);
        }
        // If no new articles were found, display modal
        else{
            $("#modal-head").text("No New k-Scraps Found!");
            $("#modal-message").html("Looks like we already have the latest k-Scraps! <br> Click on 'Load More k-Scraps' to see older k-Scraps!");
            $("#my-modal").modal("show");
        }
    });
});

// Clicking "Comment" changes the background color and text color to show emphasis on current article
$(document).on("click", ".comment-btn", function(){
    if($(this).hasClass("collapsed")){
        $(this).parent().parent().parent().css({"background-color": "white", "color": "black"});
    }
    else{
        $(this).parent().parent().parent().css({"background-color": "#544B8C", "color": "white"});
    }
});

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
            $(that).find(".comment-author").val("");
            $(that).find(".comment-body").val("");
            // Comment returned from POST is dynamically appended to the page
            var newComment = displayComments(data.author, data.createdAt, data.comment);
            $(that).siblings(".comment-list").append(newComment);
        }
    });
});

// Clicking "Load More k-Scraps" grabs older articles from the database
// Skips the previous articles so there are no duplicates displayed
$("#load-more-btn").on("click", function(){
    var numOfArticles = $(".articles").length;
    $.get("/loadMore/" + numOfArticles, function(data){
        // If nothing is returned, modal will alert user there a no more articles to display
        if(data.length === 0){
            $("#modal-head").text("No More k-Scraps!");
            $("#modal-message").html("Looks like we are out of k-Scraps! <br> Click on 'Get Latest k-Scraps' to load the newest k-Scraps!");
            $("#my-modal").modal("show");
        }
        else if(data[0].loggedIn){
            data.shift();
            deconstructArticlesArray(data, true);
        }
        else{
            deconstructArticlesArray(data, false);
        }
    });
});

$(document).ready(function(){
    $("body").tooltip({
        selector: "[data-placement='right']",
        trigger: "hover"
    });
});