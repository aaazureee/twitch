$(document).ready(function () {
    var streamList = ["HSdogdog", "AdmiralBulldog", "vanNDota", "DreamLeague", "WubWoofWolf", "17uu", "lamperkat", "febbydoto", "Arteezy", "AmazHS", "Moonmeander", "WagamamaTV", "dotademon", "feardota", "esl_dota2", "monkeys_forever", "Dendi", "sheevergaming", "BigDaddy", "Draskyl", "Chessie", "FollowAkke", "bOne7", "attackerdota", "noobfromua", "egm", "qojqva", "alohadancetv", "pajkattdota", "dotastarladder_en", "barnyyy", "zai", "aui_2000", "universedota", "ppd", "fogged", "purgegamers", "meraclechamlotte", "7ckngmad", "miracle_doto", "puppey", "h4nn1", "420jenkins", "illidanstrdoto", "sumaildoto", "jeraxai", "grandgrant", "jeyodude", "bananaslamjamma", "yawar_", "merlinidota", "beyondthesummit", "s4", "stormspirittv", "synderen", "funn1k", "emperorpenguin83", "kano", "miserytheslayer", "reimudesu", "shigetora", "matumbaman", "era17", "sneykingdota", "siractionslacks", "moodota2", "dizzykitten", "sakurafrost225", "Rafis0", "odpixel", "d47biryu", "vampyrette", "w33haa", "blitzdota", "ritsugamer", "limmp", "himegurecia", "dotamajor", "babyknight", "ccncdota2", "khezzu", "lil_hardy", "angelsimosu", "vankhoahoang", "resolut1ontv", "blackdotatv", "sing_sing", "midone", "eternalenvyy", "dotacapitalist", "keemerah", "osu_HDHR", "mssdota", "epicenter_en1", "koushudota", "yapzordota", "moonducktv", "pikachama", "qSnake_", "stan_king", "dota2fata", "madaradota2", "braxton911", "cr1tdota", "mikah138", "evilgeniuses", "dotagasm", "official_niqua", "arise_3012", "nooneboss", "forev", "ramzesdoto", "aliastar", "bububu", "0timado0", "envybaer", "smashdota", "nurbika", "brinkdota", "canceldota", "qodota2", "day9tv", "zingle313", "kvhdota", "abed_dota", "ohaiyodota", "boris_dota", "gorgcc", "ltt98", "pgl_dota", "spare", "hfndota", "happystick"];
    var online = [];
    var offline = [];
    var k = 0;
    for (let i = 0; i < streamList.length; i++) {
        $.ajax({
                url: "https://api.twitch.tv/kraken/streams/" + streamList[i] + "?client_id=rznf9ecq10bbcwe91n6hhnul3dbpg9",
                dataType: 'json'
            })
            .done(function (data) {
                if (data.stream !== null) {
                    online[k++] = {
                        channel: data.stream.channel.display_name,
                        game: data.stream.game,
                        title: data.stream.channel.status,
                        viewer: data.stream.viewers,
                        icon: data.stream.channel.logo
                    };
                } else if (data.stream === null) {
                    $.ajax({
                            url: "https://api.twitch.tv/kraken/channels/" + streamList[i] + "?client_id=rznf9ecq10bbcwe91n6hhnul3dbpg9",
                            dataType: 'json'
                        })
                        .done(function (data2) {
                            offline.push({
                                channel: data2.display_name,
                                game: data2.game,
                                title: data2.status,
                                viewer: "Offline",
                                icon: data2.logo
                            });
                        });
                }
            });
    }
    $(document).ajaxStop(function () {
        $(".loading").detach();
        online.sort(function (a, b) {
            if (a.viewer > b.viewer) {
                return -1;
            } else if (a.viewer < b.viewer) {
                return 1;
            }
            return 0;
        });

        $("thead").append("<tr><th style='width:35%'>Channel</th><th class = 'game'>Game</th><th>Title</th><th style='width:15%'>Viewers</th></tr>");

        for (var i = 0; i < online.length; i++) {
            if (online[i].icon !== null) {
                $(".table").append("<tr><td class='name'><img class ='icon' src ='" + online[i].icon + "'>" + online[i].channel + "</td><td>" + online[i].game + "</td><td>" + online[i].title + "</td><td><span id='red'></span> " + online[i].viewer + "</td></tr>");
            } else if (online[i].icon === null) {
                $(".table").append("<tr><td class='name'><img class ='icon' src='https://i.imgur.com/0C7WUis.png'>" + online[i].channel + "</td><td>" + online[i].game + "</td><td>" + online[i].title + "</td><td><span id='red'></span> " + online[i].viewer + "</td></tr>");
            }
        }

        for (var j = 0; j < offline.length; j++) {
            if (offline[j].icon !== null) {
                $(".table").append("<tr><td class='name' style='color:#B2ADBF'><img class ='icon-offline' src ='" + offline[j].icon + "'>" + offline[j].channel + "</td><td style='color:#B2ADBF'><em>" + offline[j].game + "</em></td><td style='color:#B2ADBF'>" + offline[j].title + "</td><td style='color:#B2ADBF'>" + offline[j].viewer + "</td></tr>");
            } else if (offline[j].icon === null) {
                $(".table").append("<tr><td class='name' style='color:#B2ADBF'><img class ='icon-offline' src='https://i.imgur.com/0C7WUis.png'>" + offline[j].channel + "</td><td style='color:#B2ADBF'><em>" + offline[j].game + "</em></td><td style='color:#B2ADBF'>" + offline[j].title + "</td><td style='color:#B2ADBF'>" + offline[j].viewer + "</td></tr>");
            }
        }

        $("tbody tr").click(function () {
            window.open("https://www.twitch.tv/" + $(this).find('td.name').text());
        });
    });


});
