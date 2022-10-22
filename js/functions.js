hoge = () => {
    console.log("here!")
}

function convert() {
    $("#alert").text("");

    var option = document.querySelector('input[name=op1]:checked').value;
    var inputText = $("#textInput").val();
    var inputJson;
    try {
        inputJson = JSON.parse(inputText)
    } catch (e){
        $("#alert").text("This is not a json text.");
        return;
    }
    try {
        const key = inputJson["meta"]["mode_ext"]["column"];
        if (option == "4kto6k"){

        } else if (option == "keyToSlide"){

        } else if (option == "removeSOFLAN"){

        } else if (option == "shift"){

        } else if (option == "customizedRandom"){

        } else {
            $("#alert").text("Something is wrong, I can feel it.");
        }
    } catch (e){
        $("#alert").text("This is not a beatmap text.");
        return;
    }


    textOutput.value = inputText + option;
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
            $("#alert").text("This is not a json text.");
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
