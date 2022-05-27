import time
import json
import os

def split(data: dict):
    numOfNotes = len(data['note']) - 1 #ノーツ数取得　最後だけノーツの情報ではないのでー１
    #print(f"{numOfNotes}notes\n")
    
    if (data["meta"]["mode_ext"]["column"] == 4):
        data["meta"]["mode_ext"]["column"] = 8 #convert to 8k
    else: 
        print(f'{data["meta"]["version"]}' " <- this is not 4k")
        return 1
    data["meta"]["version"] =  "[SPLIT]" + data["meta"]["version"] #譜面名変更
        
    #print("start duplicating")
    for i in range(numOfNotes): #全てのノーツにおいて、
        data['note'][i]['column'] *= 2 #レーン番号倍
        dupeNote = data['note'][i].copy() #NOT参照渡し！！！！
        dupeNote['column'] += 1 
        data['note'].append(dupeNote) #ノーツを倍　逐次的順番は考慮しなくてもよい
    
    return 0
        
def convert4kto6k(data: dict):
    numOfNotes = len(data['note']) - 1 #ノーツ数取得　最後だけノーツの情報ではないのでー１
    #print(f"{numOfNotes}notes\n")
    
    if (data["meta"]["mode_ext"]["column"] == 4):
        data["meta"]["mode_ext"]["column"] = 6 #convert to 6k
    else: 
        print(f'{data["meta"]["version"]}' " <- this is not 4k")
        return 1
    data["meta"]["version"] =  "[6kCV]" + data["meta"]["version"] #譜面名変更
    data["meta"]["version"] =  "[6kCV]" + data["meta"]["version"] #譜面作者名に追記
        
    #print("start converting")
    for i in range(numOfNotes): #全てのノーツにおいて、
        
        if data['note'][i]['column'] == 0:
            dupeNote = data['note'][i].copy() #NOT参照渡し！！！！
            data['note'].append(dupeNote)

        if data['note'][i]['column'] == 3:
            dupeNote = data['note'][i].copy() #NOT参照渡し！！！！
            dupeNote['column'] = 5
            data['note'].append(dupeNote)
            
        data['note'][i]['column'] += 1 #レーンずらし
    
    return 0
        
def writeChart(data: dict, folderpath: str):
    newChart = str(int(time.time())) + ".mc" #恐らく、譜面ファイル名に使われている数字はUNIX時間
    
    print(f"start writing as {newChart}")
    
    with open(folderpath + os.sep + newChart, "w") as fw: #割譜面出力
        json.dump(data, fw, ensure_ascii=False)
        
    print("Done Writing!")

def main():
    path = input("Enter file path: ")
    
    with open(path, "r") as fr: #譜面json読み込み
        data = json.load(fr)
        
    for val in data["meta"].items(): #とりあえずいろいろな情報を表示
        print(val)
        
    convert4kto6k(data)
    
    folder = os.path.dirname(path) #入力されたファイルが存在するディレクトリを取得
    writeChart(data, folder)
        
    
        

if __name__ == "__main__":
    t = time.time()
    main()
    print(f"--------------------------------------")
    print(f"runTime: {(time.time() - t) * 1000:.2f} ms")