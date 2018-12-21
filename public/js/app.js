// Takes articles returned from API call and dynamically displays them on page
function displayArticles(headline, summary, link, id, comments, bookmarked, loggedIn, user){
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
    commentBtn.html("<small>Comments</small>");
    commentBtnCol.append(commentBtn);
    buttonsRow.append(readBtnCol, commentBtnCol);
    var collapse = $("<div>").addClass("collapse m-3").attr("id", "a" + id);
    var form = $("<form>").addClass("comment-form my-4").attr("data-id", id);
    var fieldset = $("<fieldset>").prop("disabled", true);
    var newName = $("<div>").addClass("form-group");
    var nameInput = $("<input>").addClass("form-control-plaintext text-white comment-author");
    nameInput.attr({"type": "text", "placeholder": "Name"});
    nameInput.prop("readonly", true);
    nameInput.val("Please sign in to post a comment!");
    newName.append(nameInput);
    var newComment = $("<div>").addClass("form-group");
    var commentInput = $("<textarea>").addClass("form-control comment-body");
    commentInput.attr({"rows": 3, "style": "resize:none", "placeholder": "Comment"});
    commentInput.prop("required", true);
    newComment.append(commentInput);
    var submitBtn = $("<button>").addClass("btn float-right");
    submitBtn.attr("type", "submit").text("Submit");
    fieldset.append(newName, newComment, submitBtn);
    form.append(fieldset);
    var commentList = $("<ul>").addClass("list-group comment-list");
    // Only appends comments if they already exist in the database
    if(comments.length > 0){
        for(var i = 0; i < comments.length; i++){
            var author = comments[i].author;
            var authorId = comments[i].authorId;
            var commentBody = comments[i].comment
            var createDate = comments[i].createdAt;
            var commentId = comments[i]._id;
            var existingComment = displayComments(commentId, author, authorId, createDate, commentBody, user);
            commentList.append(existingComment);
        }
    }
    collapse.append(form, $("<br><br>"), commentList);
    if(loggedIn){
        fieldset.prop("disabled", false);
        nameInput.val(user.username);
        var bookmarkBtn = $("<button>").addClass("btn float-right mr-2 px-1 py-0 bookmark-btn");
        bookmarkBtn.attr({"data-toggle": "tooltip", "data-placement": "right", "data-original-title": "Bookmark!", "data-id": id});
        if(bookmarked){
            bookmarkBtn.prop("disabled", true);
        }
        var bookmarkIcon = $("<i>").addClass("fas fa-bookmark");
        bookmarkBtn.append(bookmarkIcon);
        newArticle.append(bookmarkBtn);
    }
    newArticle.append(headline, summary, buttonsRow, collapse);
    $("#articles-list").append(newArticle);
}

// Takes comments returned from API call and dynamically creates their display
// Returns the new comment so it can be appended to corresponding articles
function displayComments(commentId, author, authorId, createDate, commentBody, user){
    var newComment = $("<li>").addClass("list-group-item text-dark");
    var topRow = $("<div>").addClass("row justify-content-between");
    var authorName = $("<div>").addClass("col-4").html("<span><strong>" + author + "</strong></span>");
    var date = $("<div>").addClass("col-6 text-right").html("<span><small>" + createDate + "</small></span>");
    topRow.append(authorName, date);
    var bottomRow = $("<div>").addClass("row");
    var comment = $("<div>").addClass("col-12").html("<p>" + commentBody + "</p>");
    bottomRow.append(comment);
    newComment.append(topRow, bottomRow);
    if(user && authorId === user.oauthToken){
        var deleteRow = $("<div>").addClass("row");
        var deleteCol = $("<div>").addClass("col text-right");
        var deleteBtn = $("<button>").addClass("btn btn-outline-danger btn-sm delete-comment-btn");
        deleteBtn.text("Delete Comment");
        deleteBtn.attr("data-id", commentId);
        deleteCol.append(deleteBtn);
        deleteRow.append(deleteCol);
        newComment.append(deleteRow);
    }
    return newComment;
}

// Loops through an array of articles and passes each article into displayArticles function
function deconstructArticlesArray(article, loggedIn, user){
    for(var i = 0; i < article.length; i++){
        var headline = article[i].headline;
        var summary = article[i].summary;
        var link = article[i].link;
        var id = article[i]._id;
        var comments = article[i].comment;
        var bookmarked = article[i].bookmarked;
        displayArticles(headline, summary, link, id, comments, bookmarked, loggedIn, user);
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

// Clicking "Load More k-Scraps" grabs older articles from the database
// Skips the previous articles so there are no duplicates displayed
$("#load-more-btn").on("click", function(){
    var numOfArticles = $(".articles").length;
    $.get("/loadMore/" + numOfArticles, function(data){
        console.log(data);
        // If nothing is returned, modal will alert user there a no more articles to display
        if(data[0].length === 0){
            $("#modal-head").text("No More k-Scraps!");
            $("#modal-message").html("Looks like we are out of k-Scraps! <br> Click on 'Get Latest k-Scraps' to load the newest k-Scraps!");
            $("#my-modal").modal("show");
        }
        else if(data.length > 1){
            deconstructArticlesArray(data[0], true, data[1]);
        }
        else{
            deconstructArticlesArray(data[0], false);
        }
    });
});

$(document).ready(function(){
    $("body").tooltip({
        selector: "[data-placement='right']",
        trigger: "hover"
    });
    if(performance.navigation.type == 2){
        location.reload(true);
    }
});