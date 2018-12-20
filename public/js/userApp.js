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
            type: "POST",
            data: {username:username}
        }).then(function(data){
            $("#username-success-modal").modal("show");
        });
    }
});