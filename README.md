# mc-converter
https://sabmwqes.github.io/mc-converter/
>**Warning**
>機能追加中です！現在は「customizedRandom」と「keyToSlide」,「removeSOFLAN」のみ実装されています（v1.2現在）
## Overview / 概要

This is a chart/beatmap converter for .mc file.

mcファイルをいろいろ変換できる、webブラウザ上で動くツールです。
4keyを6keyに変換したり、Keyモード譜面をSlideモード譜面に変換したり，速度変化を除去したりできます。

## Usage / 使い方
### ※PCやandroid等はゲーム内の譜面フォルダを直接開いて3~7を行うのが簡単です
1. アプリ内でコンバート（変換）したい譜面がある曲を選択し、左上の鉛筆アイコンから「譜面を共有」を押し、mczファイルをどこかに保存します。
2. 保存したmczファイルを展開（解凍）します。スマホでのファイル展開はDocumentsというアプリがおすすめです
3. mczファイルを展開してできたフォルダの中に、「(数字).mc」という名前の譜面ファイルがあるので開きます（これは1.で選択した曲に入っている譜面のデータです）。複数ある場合は、テキストの最初の方に譜面名があるので、それを探して判別してください。
4. 変換したい譜面ファイル(.mc)を開いたら、そのテキストを全てコピーし、Inputにペーストします。
5. Optionsで変換方式を設定して、Convert!ボタンを押して変換を実行します。Outputにテキストが表示されれば成功です。
6. 2.にてmczファイルを展開してできたフォルダに、新しくテキストファイルを作ります。ファイル名は特に無ければ「推奨ファイル名：」のところに表示されているものでいいです **（拡張子は絶対「.mc」にしてください）**。
7. 作ったテキストファイルに、Outputに表示されているテキストをコピー＆ペーストして保存します。Copy textボタンからコピーできます。
8. フォルダを圧縮して、名前を元の「(曲名).mcz」に変更します。これをアプリにインポートすれば完了です。
## Feature(expected) / 機能（予定）
- customizedRandom
- keyToSlide
- removeSOFLAN
- shift

> ### About customized random / カスタムランダムについて
> 
> inputの譜面のレーンはそれぞれ左から0,1,2,3...といったように「0から」番号付けされます。
> この数字を自由に並び替えて配置することができます。（同じ数字の重複も可）
>
> 例：4keyの譜面をinputに入れるとき、"0123"が正規、"3210"のときミラーになります。　また、4kから6kへの変換が"001233"となっています.
> 
> 注：3key~10keyを超える範囲はゲームが対応していませんが、**keyToSlideでSlide譜面に変換することによって制限を突破できます。**


## Requirement / 必要なもの
Web browser such as Chrome.

スマホからでも動作します
## Note / メモ
The number in the mc file name is UNIX time (epoch seconds).
## Author / 作者
-> user/203125
## License
"mc-converter" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).
