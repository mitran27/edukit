$("#search").keyup(function() {

    console.log($("#search").val())
    axios
        .post("/class/search", {
            search: $("#search").val()
        })
        .then(res => {
            $('.searchclass').empty()
            searchclass = res.data;
            console.log(res.data)




            console.log(newarray)
            for (i = 0; i < res.data.length; i++) {
                var x = res.data[i]
                var cid = '<%= user["id"]%>'


                if ((cid != x.tutorid) && (!(newarray.indexOf(x._id) > -1))) {

                    if (x.students == undefined) {
                        nos = 0;
                    } else {
                        nos = x.students.length
                    }



                    $('.searchclass').append('<div class="searched" id="' + i + '">' + res.data[i].name + '</div>')

                }
            }
            /////
            $(".searched").click(function(y) {
                $('.searchedclass').empty()
                console.log('search is clicked')
                var selectedclass = $(y.target).attr('id')
                console.log(selectedclass)

                if ((res.data[parseInt(selectedclass)].type == 'all' || res.data[parseInt(selectedclass)].institute == usersinstitute) && nos < res.data[parseInt(selectedclass)].number) {

                    var z = res.data[parseInt(selectedclass)].lessons
                    if (z) {
                        console.log(z)







                        $('.searchedclass').show()
                        $('.searchedclass').append(' <center>  <h2 style="margin-bottom: 0px;">' + res.data[parseInt(selectedclass)].name + ' </h2> by' + res.data[parseInt(selectedclass)].tutor + '  <br><br> <button class="btn2">join class</button></center>')
                        console.log('appended')
                        for (y = 0; y < z.length; y++) {
                            $('.singleclassdisp').hide()

                            $('.searchedclass').append('<h2 style="color: red; font-size: 18px;">' + z[y].lnno + z[y].title + ' </h2><br><textarea class="lncontent" style="display: none; height: 400px; width: 100%;">' + z[y].lesson + '</textarea><textarea class="lncontent" style="display: none; height: 90px;">' + z[y].resourses + '</textarea> ')
                            $('h2').click(x => {
                                console.log('h2 clicked')
                                $(x.target).next().next().show();

                            })


                        }
                        $('.btn2').click(() => {
                            console.log('join clicked')
                            axios
                                .post("/class/join", {
                                    class: res.data[parseInt(selectedclass)]._id,
                                    studeid: studeid,
                                    studname: studname
                                })
                                .then(res => {
                                    location.reload(true);
                                })
                                .catch(err => console.error(err));
                        })
                    } else {
                        alert('class   ' + res.data[parseInt(selectedclass)].name + ' has no lessons')
                    }
                } else {
                    //  console.log(res.data[parseInt(selectedclass)].institute, usersinstitute, res.data[parseInt(selectedclass)].institute == usersinstitute, nos < res.data[parseInt(selectedclass)].number, res.data[parseInt(selectedclass)].type == 'all', res.data[parseInt(selectedclass)] == usersinstitute, nos < res.data[parseInt(selectedclass)].number)
                    var reasonnotjoin = []
                    var selectclasswhynot = res.data[parseInt(selectedclass)];
                    if (selectclasswhynot.institute != usersinstitute) {
                        reasonnotjoin.push('not in same institute')
                    }
                    if (nos > res.data[parseInt(selectedclass)].number) {
                        reasonnotjoin.push('class is full')
                    }
                    reasonnotjoin += 'you are not eleigible because'
                    alert(reasonnotjoin)
                }
            })
        })
        .catch(err => console.error(err));
});

$("#search").keydown(function() {
    $('.searchclass').empty()

});