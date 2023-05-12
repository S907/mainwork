$(document).ready(function() {
    $(".catid").on("click", function(e) {
        e.preventDefault();
        $(".allposts").hide();
        $(".filterposts").empty();
        let myHtmlCode = "";
        // alert($(this).data("value"))
        $.ajax({
            url: "/fetchproducts",
            type: "POST",
            data: {
                catId: $(this).data("value")
            },
            success: function(result) {
                // console.log(result);
                $.each(result, function(key, value) {
                    console.log(value);
                    myHtmlCode += '<div class="blog-left-grid"><div class="blog-left-grid-left"><h3><a href="viewpost/' + value.image + '">' + value.title + '</a></h3><p>by <span> ' + value.user.firstName + '</span> | ' + value.createdAt + '</p></div><div class="clearfix"> </div><a href="viewpost/' + value.slug + '"><img src="uploads/' + value.image + '" alt=" " class="img-responsive" style="width:750px; height: 320px" /></a><p class="para">' + value.postText.slice(0, 999) + " ........" + '</p><br><div class="rd-mre"><a href="viewpost/' + value.slug + '" class="hvr-bounce-to-bottom quod">Read More</a></div></div>';
                })
                if (myHtmlCode) {
                    $(".filterposts").append(myHtmlCode);
                } else {
                    $(".filterposts").append("<h1>No Posts Found In This Category</h1>");
                }
            },
            error: function(err) {
                console.log(err);
            }
        })
    })
})