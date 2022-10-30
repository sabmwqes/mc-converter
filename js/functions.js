function customizedRandom(inputJson, patternString){
    const numOfKeys = inputJson["meta"]["mode_ext"]["column"]; // 入力譜面のキー数
    var pattern = Array(numOfKeys).fill().map(e => []); // 配列の要素を[]で初期化
    for (var i=0 ; i<patternString.length ; i++){
        try {
            pattern[parseInt(patternString[i])].push(i);
        } catch {} // 無効な文字があっても無視
    }
    // console.log(pattern);
    var outputJson = Object.assign({}, inputJson); // オブジェクトの値渡し
    outputJson["note"] = []; // 譜面クリア
    const notes = inputJson["note"]; // 参照渡し
    for (var i=0 ; i<notes.length ; i++ ) {
        if ("column" in notes[i]) { // 音源指定オブジェクトにはcolumnがない
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
    return outputJson;
}

function keyToSlide(inputJson){

}

function convert(){
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
        if (option == "4kto6k"){
            outputJson = customizedRandom(inputJson, "001233");
        } else if (option == "keyToSlide"){
            
        } else if (option == "removeSOFLAN"){
            
        } else if (option == "shift"){
            
        } else if (option == "customizedRandom"){
            outputJson = customizedRandom(inputJson, $("#customPattern").val());
        } else {
            $("#alert").text("Something weird happened with option settings.");
        }
    } catch (e){
        $("#alert").text("This is not a beatmap text.");
        return;
    }
    $("#textOutput").val(JSON.stringify(outputJson));
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

function copytext(){
    var text = $("#textOutput").val();
    navigator.clipboard.writeText(text);
    $(".copyMessage").text("Copied!");
    $(".copyMessage").fadeIn(1);
    $(".copyMessage").fadeOut(1000);
}
