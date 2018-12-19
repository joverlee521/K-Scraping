var regex = /^[a-zA-Z0-9]*$/

$("#new-username-form").on("submit", function(event){
    event.preventDefault();
    var username = $("#username-input").val().trim();
    if(username.length < 2 || !regex.test(username)){
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