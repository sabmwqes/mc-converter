# mc-converter
https://sabmwqes.github.io/mc-converter/
>**Warning**
>未完成です！
## Overview

This is a chart/beatmap converter for .mc file.

mcファイルをいろいろできるツールです。
4kを6kに変換したり、ソフラン(速度変化)を除去できます。

## Feature(expected)
- keyToSlide
- removeSOFLAN
- shift
- customizedRandom

> ### About customized random
> 
> inputの譜面のレーンはそれぞれ左から0,1,2,3...といったように「0から」番号付けされます。
> この数字を自由に並び替えて配置することができます。（重複も可）
>
> 例：4keyの譜面をinputに入れるとき、"0123"が正規、"3210"のときミラーになります。　なお4kto6kは"001233"となっています.
> 
> 注：3key~10keyを超える範囲ではゲームが対応していません
## Requirement
Web browser such as Chrome.

スマホからでも動作します
## Note
The number in the mc file name is UNIX time (epoch seconds).
## Author
-> user/203125
## License
"mc-converter" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).
