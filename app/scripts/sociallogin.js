function socialLogin(socialName, socialInfo) {
	var socialLoginUrl = '/socialLogin/' + socialName;
    $.ajax({
        type: 'POST',
        url: socialLoginUrl,
        data: {'socialInfo': socialInfo},
        success: function(data) {
            if (data != 'yes') {
                // some function if success
                return;
            }
            // some function if return data is not correct
        },
        error: function() {
            // some function if post failed
            return;
        }
    });

    // print it some where for review
    turnonOverlay('yourDevice');
    $('#yourDevice .overlay-header p').html(socialName);
    $('#yourDevice .padding').html(socialInfo);
}