$(document).ready(function() {
    console.log('tk')
    $("h4").click(function(x) {

        $('.forgetpass').show()
        $('.otp').hide()
        $('.otp').val('')
        $('.warning2').hide()

    });
    var otp
    var email
    $("#getotp").click(function(x) {

        console.log(($('.forgetpass').val()))
        email = $('.forgetpass').val()
        axios
            .post("/getotp", {
                email: $('.forgetpass').val()
            })
            .then(res => {

                if (res.data == 'error') {
                    alert('email incorrect')
                } else {
                    $('.forgetpass').hide()
                    $('.otp').show()
                    otp = res.data

                }
            }).catch()
    });
    $("#subotp").click(function(x) {
        console.log(toString($('.otp').val()), (parseInt(otp)).toString())
        if (parseInt($('.otp').val()) == otp) {

            var newpass = prompt('enter new password')
            console.log(newpass.length)
            while (newpass.length < 7) {
                var newpass = prompt('enter new password length more than 7')
            }

            axios
                .post("/updatepass", {
                    email: email,
                    pass: newpass
                })
                .then(res => {

                    if (res.data == 'ok') {
                        $('.forgetpass').hide()
                        $('.otp').hide()
                        alert('password updated successfully')
                    } else {

                        alert('server error')


                    }
                }).catch()


        } else {
            alert('invalid otp')
        }
    })

})