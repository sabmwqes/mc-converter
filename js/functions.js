function customizedRandom(inputJson, patternString){
    const numOfKeys = inputJson["meta"]["mode_ext"]["column"]; // 入力譜面のキー数
    if (numOfKeys == null) throw new Error("Cannot read the number of keys");
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
    if (numOfKeys == null) throw new Error("Cannot read the number of keys");
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
                relativeEndbeat[1] = endbeat[1] - startbeat[1];
                relativeEndbeat[2] = startbeat[2] * endbeat[2];
                relativeEndbeat[0] = Math.floor(relativeEndbeat[1] / relativeEndbeat[2]); //帯分数に戻す
                relativeEndbeat[1] = relativeEndbeat[1] % relativeEndbeat[2];
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

function removeSOFLAN(inputJson){
    var outputJson = Object.assign({}, inputJson); // オブジェクトの値渡し
    outputJson["effect"] = [] //effect初期化
    const time = inputJson["time"]; // 参照渡し
    const baseBPM = time[0]["bpm"] //基礎BPM
    for (i=1 ; i<time.length ; i++){
        if (time[i]["bpm"] == 0) throw new Error("Contains 0 BPM.");
        const scrollEffect = {"beat": time[i]["beat"], "scroll": baseBPM / time[i]["bpm"]};
        outputJson["effect"].push(scrollEffect);
    }
    outputJson["meta"]["version"] = "[CONST]" + inputJson["meta"]["version"]; //差分名更新
    return outputJson;
}

function SRAN(inputJson){
    const randint = (n) => {return Math.floor(Math.random() * n)} // 0 ~ n-1

    const rhythm_isEqual = (a, b) => { // a == b か
        if ((!Array.isArray(a)) || (!Array.isArray(b))) return false;
        if (a.length !== 3 || b.length !== 3) return false;
        return ( ( a[0]*a[2] + a[1] )*b[2] == ( b[0]*b[2] + b[1] )*a[2] );
    }

    const rhythm_isAOver = (a, b) => { // a < b か
        if ((!Array.isArray(a)) || (!Array.isArray(b))) return false;
        if (a.length !== 3 || b.length !== 3) return false;
        return ( ( a[0]*a[2] + a[1] )*b[2] < ( b[0]*b[2] + b[1] )*a[2] );
    }

    const shuffle = ([...array]) => {
        for (let i = array.length - 1; i >= 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const numOfKeys = inputJson["meta"]["mode_ext"]["column"]; // 入力譜面のキー数
    if (numOfKeys == null) throw new Error("Cannot read the number of keys");

    var outputJson = Object.assign({}, inputJson); // オブジェクトの値渡し
    const notes = outputJson["note"]; // 参照渡し

    var previousBeat = [-1, -1, -1]
    var keySelection = []
    var isHolded = Array(numOfKeys).fill().map(e => false); // 配列の要素をfalseで初期化
    var numOfChords = 0; //同時押し数-1

    for (var i=0 ; i<notes.length ; i++ ) {
        if ("column" in notes[i]) { // 音源指定オブジェクトにはcolumnがない
            beat = notes[i]["beat"].slice();
            // console.log(beat)
            if (!rhythm_isEqual(previousBeat, beat)) { // 時刻が更新されたら
                numOfChords = 0;
                for (j=0 ; j<numOfKeys ; j++){
                    if (rhythm_isAOver(isHolded[j], beat)) {
                        isHolded[j] = false; //ホールドが終わっていたら制限解除
                        // console.log("Unholded: " + j)
                    }
                }
                keySelection = []
                for (j=0 ; j<numOfKeys ; j++) keySelection.push(j);
                keySelection = shuffle(keySelection); // 0からkey数-1の重複無し乱数列を更新
                // console.log(keySelection);
            }else {
                numOfChords = ( numOfChords + 1 ) % numOfKeys;
                // console.log("chord = " + numOfChords);
            }
            while (isHolded[keySelection[numOfChords]]) {
                numOfChords = ( numOfChords + 1 ) % numOfKeys; //ホールド中なら別のkeyに
                // console.log("chord = " + numOfChords);
            }
            notes[i]["column"] = keySelection[numOfChords];
            console.log("column: " + keySelection[numOfChords]);
            if ("endbeat" in notes[i]){ // ロングノーツの場合
                isHolded[notes[i]["column"]] = notes[i]["endbeat"].slice(); //値渡し
                // console.log("Holded: " + isHolded)
            }
            previousBeat = beat.slice();
        }
    }
    outputJson["meta"]["version"] = "[S-RAN]" + inputJson["meta"]["version"]; //差分名更新
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
            outputJson = customizedRandom(inputJson, "001233"); // unused
        } else if (option == "keyToSlide"){
            outputJson = keyToSlide(inputJson);
        } else if (option == "removeSOFLAN"){
            outputJson = removeSOFLAN(inputJson);
        } else if (option == "S-RAN"){
            outputJson = SRAN(inputJson);
        } else if (option == "customizedRandom"){
            outputJson = customizedRandom(inputJson, $("#customPattern").val());
        } else {
            $("#alert").text("Something unexpected happened with option settings.");
        }
    } catch (e){
        $("#alert").text(e);
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
