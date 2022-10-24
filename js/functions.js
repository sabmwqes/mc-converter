function convert() {
    $("#alert").text("");

    var option = document.querySelector('input[name=op1]:checked').value;
    var inputText = $("#textInput").val();
    var inputJson;
    try {
        inputJson = JSON.parse(inputText)
    } catch (e){
        $("#alert").text("This is not a beatmap text.");
        return;
    }
    try {
        const numOfKeys = inputJson["meta"]["mode_ext"]["column"]; //キー数
        if (option == "4kto6k"){

        } else if (option == "keyToSlide"){

        } else if (option == "removeSOFLAN"){

        } else if (option == "shift"){

        } else if (option == "customizedRandom"){
            var patternString = $("#customPattern").val();
            var pattern = Array(numOfKeys).fill().map(e => []); //[]で初期化
            for (var i=0 ; i<patternString.length ; i++){
                try {
                    pattern[parseInt(patternString[i])].push(i);
                } catch {}
            }
            // console.log(pattern);
            var outputJson = Object.assign({}, inputJson); //オブジェクトの値渡し
            outputJson["note"] = []; //譜面クリア
            const notes = inputJson["note"]; //参照渡し
            for (var i=0 ; i<notes.length ; i++ ) {
                if ("column" in notes[i]) {
                    var column = notes[i]["column"];
                    for (var k of pattern[column]){
                        var note = Object.assign({}, notes[i]);
                        note["column"] = k;
                        outputJson["note"].push(note);
                    }
                } else {
                    var note = Object.assign({}, notes[i]);
                    outputJson["note"].push(note);
                }
            }
            outputJson["meta"]["mode_ext"]["column"] = patternString.length; //キー数設定更新
            outputJson["meta"]["version"] = "[CR: " + patternString + "]" + outputJson["meta"]["version"]; //差分名更新
            $("#textOutput").val(JSON.stringify(outputJson));
        } else {
            $("#alert").text("Something is wrong, I can feel it.");
        }
    } catch (e){
        $("#alert").text("This is not a beatmap text.");
        return;
    }
    $("#filename").text("推奨ファイル名: " + Math.floor(Date.now() / 1000) + ".mc");
}
function toggleInfo(){
    $("#alert").text("");
    if ( $("#infoBtn").text() == "Hide"){
        $("#info").hide()
        $("#infoBtn").text("Info");
        return;
    } else {
        var inputText = $("#textInput").val();
        var inputJson;
        try {
            inputJson = JSON.parse(inputText)
        } catch (e){
            $("#alert").text("This is not a beatmap text.");
            return;
        }
        try {
            $("#title").text("Song: " + inputJson["meta"]["song"]["title"]);
            $("#version").text("Version: " + inputJson["meta"]["version"]);
            $("#notes").text("(" + inputJson["meta"]["mode_ext"]["column"] + "keys, " + String(inputJson["note"].length - 1) + "notes)"); //複数の音源を設定している場合誤差が生じるが，稀有なので簡略化
        } catch (e){
            $("#alert").text("This is not a beatmap text.");
            return;
        }
        $("#info").show()
        $("#infoBtn").text("Hide");
        return;
    }
}

function clearInput(){
    $("#textInput").val("");
    $("#alert").text("");
}

function copytext() {
    var text = $("#textOutput").val();
    navigator.clipboard.writeText(text);
    $(".copyMessage").text("Copied!");
    $(".copyMessage").fadeIn(1);
    $(".copyMessage").fadeOut(1000);
}
