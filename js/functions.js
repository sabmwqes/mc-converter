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
    outputJson["meta"]["version"] = "[CR: " + patternString + "]" + inputJson["meta"]["version"]; //差分名更新
    return outputJson;
}

function keyToSlide(inputJson){
    const gcd = (x, y) => { //最大公約数
        return (x % y) ? gcd(y, x % y) : y;
    }
    const numOfKeys = inputJson["meta"]["mode_ext"]["column"]; // 入力譜面のキー数
    const width = Math.round(255 / numOfKeys);
    const offsetX = Math.round(255 / (numOfKeys * 2));
    const notes = inputJson["note"]; // 参照渡し
    var outputJson = Object.assign({}, inputJson); // オブジェクトの値渡し
    outputJson["note"] = []; // 譜面クリア

    for (var i=0 ; i<notes.length ; i++) {
        if ("column" in notes[i]) { // 音源指定オブジェクトにはcolumnがない
        //console.log("Coverting: " + String(i));
            var note = {};
            note["beat"] = notes[i]["beat"];
            note["x"] = notes[i]["column"] * width + offsetX;
            note["w"] = width;
            if ("endbeat" in notes[i]){ // ロングノーツの場合
                var startbeat = notes[i]["beat"].slice();
                var endbeat = notes[i]["endbeat"].slice();
                var relativeEndbeat = Array(3);
                
                startbeat[1] += startbeat[0] * startbeat[2]; //仮分数に直す
                endbeat[1] += endbeat[0] * endbeat[2];
                startbeat[1] *= endbeat[2]; //通分
                endbeat[1] *= startbeat[2];
                relativeEndbeat[0] = 0;
                relativeEndbeat[1] = endbeat[1] - startbeat[1];
                relativeEndbeat[2] = startbeat[2] * endbeat[2];
                while (relativeEndbeat[1] >= relativeEndbeat[2]){
                    relativeEndbeat[0] += 1;
                    relativeEndbeat[1] -= relativeEndbeat[2]; //帯分数に戻す
                }
                var reduct = gcd(relativeEndbeat[1], relativeEndbeat[2]); //約分
                relativeEndbeat[1] /= reduct;
                relativeEndbeat[2] /= reduct;

                note["seg"] = [{"beat": relativeEndbeat, "x": 0}]; // 相対表記
                //console.log(note["beat"] + " " + note["seg"][0]["beat"]);
            }
            outputJson["note"].push(note);
        } else {
            outputJson["note"].push(notes[i]);
        }
    }
    outputJson["meta"]["mode"] = 7; //Slide mode
    outputJson["meta"]["version"] = "[Slide]" + inputJson["meta"]["version"]; //差分名更新
    //console.log("done!")
    return outputJson;
}

function convert(){
    $("#alert").text("");
    
    var option = document.querySelector('input[name=op1]:checked').value;
    var inputText = $("#textInput").val();
    var inputJson;
    var outputJson;
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
            outputJson = keyToSlide(inputJson);
        } else if (option == "removeSOFLAN"){
            
        } else if (option == "shift"){
            
        } else if (option == "customizedRandom"){
            outputJson = customizedRandom(inputJson, $("#customPattern").val());
        } else {
            $("#alert").text("Something unexpected happened with option settings.");
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
