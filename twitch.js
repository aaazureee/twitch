$(() => {
    var streamList = ["HSdogdog", "AdmiralBulldog", "vanNDota", "DreamLeague", "WubWoofWolf", "17uu", "lamperkat", "febbydoto", "Arteezy", "AmazHS", "Moonmeander", "WagamamaTV", "dotademon", "feardota", "esl_dota2", "monkeys_forever", "Dendi", "sheevergaming", "BigDaddy", "Draskyl", "Chessie", "FollowAkke", "bOne7", "attackerdota", "noobfromua", "egm", "qojqva", "alohadancetv", "pajkattdota", "dotastarladder_en", "barnyyy", "zai", "aui_2000", "universedota", "ppd", "fogged", "purgegamers", "meraclechamlotte", "7ckngmad", "miracle_doto", "puppey", "h4nn1", "420jenkins", "illidanstrdoto", "sumaildoto", "jeraxai", "grandgrant", "jeyodude", "bananaslamjamma", "yawar_", "merlinidota", "beyondthesummit", "s4", "stormspirittv", "synderen", "funn1k", "emperorpenguin83", "kano", "miserytheslayer", "reimudesu", "shigetora", "matumbaman", "era17", "sneykingdota", "siractionslacks", "moodota2", "dizzykitten", "sakurafrost225", "Rafis0", "odpixel", "d47biryu", "vampyrette", "w33haa", "blitzdota", "ritsugamer", "limmp", "himegurecia", "dotamajor", "babyknight", "ccncdota2", "lil_hardy", "angelsimosu", "vankhoahoang", "resolut1ontv", "blackdotatv", "sing_sing", "midone", "eternalenvyy", "dotacapitalist", "keemerah", "osu_HDHR", "mssdota", "epicenter_en1", "koushudota", "yapzordota", "moonducktv", "pikachama", "qSnake_", "stan_king", "dota2fata", "madaradota2", "braxton911", "cr1tdota", "mikah138", "evilgeniuses", "dotagasm", "official_niqua", "arise_3012", "nooneboss", "forev", "ramzesdoto", "aliastar", "bububu", "0timado0", "envybaer", "smashdota", "nurbika", "brinkdota", "canceldota", "qodota2", "day9tv", "zingle313", "kvhdota", "abed_dota", "ohaiyodota", "boris_dota", "gorgcc", "ltt98", "pgl_dota", "spare", "hfndota", "happystick", "itshafu", "thijshs", "qsnake", "lizzarddota2", "ek0p", "godot", "chainsito11", "freecodecamp", "epicenter_en2", "Clarkeezy", "NoctisAK47", "Solitary_Judge", "khezzu"];
    var online = [];
    var offline = [];
    var k = 0;
    var promise = []; // outer ajax request for /streams/
    var promise2 = []; // inner ajax request for /channels/
    for (let i = 0; i < streamList.length; i++) {
        var request = $.ajax({
            url: "https://api.twitch.tv/kraken/streams/" + streamList[i] + "?client_id=rznf9ecq10bbcwe91n6hhnul3dbpg9",
            dataType: 'json'
        });

        request.done(data => {
            if (data.stream !== null) {
                online[k++] = {
                    channel: data.stream.channel.display_name,
                    game: data.stream.game,
                    title: data.stream.channel.status,
                    viewer: data.stream.viewers,
                    icon: data.stream.channel.logo
                };
            } else if (data.stream === null) {
                var request2 = $.ajax({
                    url: "https://api.twitch.tv/kraken/channels/" + streamList[i] + "?client_id=rznf9ecq10bbcwe91n6hhnul3dbpg9",
                    dataType: 'json'
                });

                request2.done(data2 => {
                    offline.push({
                        channel: data2.display_name,
                        game: data2.game,
                        title: data2.status,
                        viewer: "Offline",
                        icon: data2.logo
                    });
                });
                promise2.push(request2); // push inner ajax promises
            }
        });
        promise.push(request); // push outer ajax promises
    }

    $.when.apply($, promise).then(() => { // when all outer ajax promises fulfilled, i.e. ajax returns good data.
        promise2 = $.map(promise2, p => { // map promise of inner promises array to resolve after it has been called
            // i.e. to make sure that all inner promises in promise2 will be resolved AND wait for all to be resolved before APPENDING.
            // (don't actually care the result, fail or successful, just need wait everything done -> APPEND)
            var dfd = $.Deferred();
            p.always(() => {
                dfd.resolve();
            });
            return dfd.promise();

        });
        $.when.apply($, promise2).done(() => {
            // animation for content
            $("table").addClass("animated fadeIn");
            // hide ajax loading gif
            $(".loading").detach();
            // Sort streamers by viewer property
            online.sort((a, b) => {
                if (a.viewer > b.viewer) {
                    return -1;
                } else if (a.viewer < b.viewer) {
                    return 1;
                }
                return 0;
            });
            // Append data based on online/offline status
            $("thead").append(`<tr><th style='width:25%' class = 'channel'>Channel</th><th class = 'game' style = 'width:20%'>Game</th><th>Title</th><th style = 'width: 15%'>Viewers</th></tr>`);

            for (var i in online) {
                if (online[i].icon !== null) {
                    $(".table").append(`<tr><td class="name"><img class ="icon" src = "${online[i].icon}"> ${online[i].channel}</td><td> ${online[i].game}</td><td>${online[i].title}</td><td><span id="red"></span> ${online[i].viewer}</td></tr>`);
                } else if (online[i].icon === null) {
                    $(".table").append(`<tr><td class="name"><img class ="icon" src = "https://i.imgur.com/0C7WUis.png"> ${online[i].channel}</td><td> ${online[i].game}</td><td>${online[i].title}</td><td><span id="red"></span> ${online[i].viewer}</td></tr>`);
                }
            }

            for (var j in offline) {
                if (offline[j].icon !== null) {
                    $(".table").append(`<tr><td class="name" style="color:#B2ADBF"><img class="icon-offline" src = "${offline[j].icon}"> ${offline[j].channel}</td><td style="color:#B2ADBF"><em>${offline[j].game}</em></td><td style="color:#B2ADBF">${offline[j].title}</td><td style="color:#B2ADBF">${offline[j].viewer}</td></tr>`);

                } else if (offline[j].icon === null) {
                    $(".table").append(`<tr><td class="name" style="color:#B2ADBF"><img class="icon-offline" src = "https://i.imgur.com/0C7WUis.png"> ${offline[j].channel}</td><td style="color:#B2ADBF"><em>${offline[j].game}</em></td><td style="color:#B2ADBF">${offline[j].title}</td><td style="color:#B2ADBF">${offline[j].viewer}</td></tr>`);
                }
            }
            // Make every row a clickable link
            var mywidth = $(".table").width();
            $('.table>tbody>tr>td:nth-child(1)').each((index, element) => {
                $(element).css('position', 'relative');
                var myA = $('<a></a>');
                $(element).append(myA);
                var myheight = $(element).outerHeight() + 50;
                var link = "https://twitch.tv/" + $(element).text().replace(" ", "");
                myA.css({
                        'display': 'block',
                        'left': '0',
                        'top': '0',
                        'bottom': '0',
                        'position': 'absolute'
                    })
                    .attr({
                        'href': link,
                        'target': "_blank"
                    })
                    .width(mywidth)
                    .height(myheight);
            });
        });
    });


});
