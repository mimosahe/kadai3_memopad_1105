// ページが読み込まれたら処理を開始
$(document).ready(function() {
    
    // 遷移前ページで選択された曜日を取得（予めLocalStorageに上げていた配列を取得）
    if(window.localStorage) {
        let json = localStorage.getItem('activeDay');
        activeDay_array = JSON.parse(json);
    } 
    
    // 曜日数分、献立キー（主菜のみ）を重複しないように作成
    var tmp_array = [];     //①重複しないランダムな配列を作成
    var min = 1, max = 10;   // ※maxは献立選択肢に応じて増減
    function intRandom(min, max){
        return Math.floor( Math.random() * (max - min + 1)) + min;
    }
    for(i = min; i <= max; i++){
        while(true){
            var tmp = intRandom(min, max);
            if(!tmp_array.includes(tmp)){
            tmp_array.push(tmp);
            break;
            }
        }
    }
    var number_mainDish_array = [];     // ②①の配列から7日分の値を取得
    for(i = 0; i <= 6; i++){
        if(activeDay_array[i] === "active"){
            number_mainDish_array.push(tmp_array[i]);
        }else {
            number_mainDish_array.push(0);
        }
    }
    
    // 各曜日の献立キーを作成
    let number_stapleFood_array = [];
    let number_sideDish_array = [];
    let number_soup_array = [];

    for(day_index = 0; day_index <= 6; day_index++){
        let number_mainDish = number_mainDish_array[day_index];

        // 主菜に応じて副菜とスープの献立キーを作成
        if (number_mainDish >= 1 && number_mainDish < 5) { // 1-4：和
            var number_sideDish = Math.floor(Math.random() *4 +1 );
            var number_soup = Math.floor(Math.random() *4 +1);
        }else if (number_mainDish >= 5 && number_mainDish < 8) { // 5-7：洋
            var number_sideDish = Math.floor(Math.random() *3 +5 );
            var number_soup = Math.floor(Math.random() *3 +5 );
        }else if (number_mainDish >= 8 && number_mainDish < 10) { // 8-10：中
            var number_sideDish = Math.floor(Math.random() *3 +8 );
            var number_soup = Math.floor(Math.random() *3 +8 );
        }else if (number_mainDish === 10) {
            var number_sideDish = Math.floor(Math.random() *3 +8 );
            var number_soup = 0
        }else if (number_mainDish === 0) {
            var number_sideDish = 0;
            var number_soup = 0;
        }

        // 主菜に応じて主食の献立キーを作成
        if (number_mainDish === 7) { // 主菜がビーフシチューの場合は主食はパン
            var number_stapleFood = 2;
        }else if (number_mainDish === 10 || number_mainDish === 0) { // 主菜が坦々麺の場合と主菜の献立キーが無い場合は、主食は無し
            var number_stapleFood = 0;
        }else {
            var number_stapleFood = 1; // 上記以外の場合は主食はご飯
        }
        number_stapleFood_array.push(number_stapleFood);
        number_sideDish_array.push(number_sideDish);
        number_soup_array.push(number_soup);
    }

    // 7日分の献立キーをLocalStorageに保存
    if (window.localStorage) {
        let json_mainDish = JSON.stringify(number_mainDish_array, undefined, 1);
        localStorage.setItem('mainDish', json_mainDish);
        let json_sideDish = JSON.stringify(number_sideDish_array, undefined, 1);
        localStorage.setItem('sideDish', json_sideDish);
        let json_stapleFood = JSON.stringify(number_stapleFood_array, undefined, 1);
        localStorage.setItem('stapleFood', json_stapleFood);
        let json_soup = JSON.stringify(number_soup_array, undefined, 1);
        localStorage.setItem('soup', json_soup);
    }

    // 食材データをLocalStorageに格納
    let kondate = [mainDish, sideDish, stapleFood, soup]
    for(day_index = 0; day_index <= 6; day_index++){
        for(kondate_index = 0; kondate_index <= 3; kondate_index++){
            if(kondate_index === 0){
                number = number_mainDish_array[day_index]
            } else if(kondate_index === 1){
                number = number_sideDish_array[day_index]
            } else if(kondate_index === 2){
                number = number_stapleFood_array[day_index]
            } else {
                number = number_soup_array[day_index]
            }
            for(i = 0; i <= kondate[kondate_index][number]["ingredient"].length -1; i++){
                ingredient_item = kondate[kondate_index][number]["ingredient"][i]["item"]
                ingredient_quantity = kondate[kondate_index][number]["ingredient"][i]["quantity"]
                ingredient_category = kondate[kondate_index][number]["ingredient"][i]["category"]
                ingredient_unit = kondate[kondate_index][number]["ingredient"][i]["unit"]
        
                // データを計算してlocalStorageに格納
                let sto  = localStorage.getItem(ingredient_item);
                if(sto !== null){ // 材料キーがLocalStorageにまだ存在しない場合は新規追加
                    ingredient_quantity_new = ingredient_quantity
                }else if(ingredient_category === "ingr4" || ingredient_category === "ingr5"){
                    ingredient_quantity_new = "適量"
                }else { // 材料キーがLocalStorageに既に存在する場合は値を合計
                    ingredient_quantity_old = localStorage.getItem(ingredient_item);
                    ingredient_quantity_new = ingredient_quantity_old + ingredient_quantity
                }
                localStorage.setItem(ingredient_category + "-" + ingredient_item, ingredient_quantity_new);
            }
        }
    }
    // 食材データを出力
    // ローカルストレージのキーを一度全部取得し、配列にする
    arr_length = localStorage.length;
    arr = [];
    for(i = 0; i <= arr_length -1; i++){
        key = localStorage.key(i);
        arr.push(key);
    }
    // 配列の値にingrが入っていれば、そのキーと値を取得し変数に代入する（代入する際に、値はingr以降の文字を代入する
    ingr_key_array = [];
    ingr_value_array = [];
    for(i = 0; i <= arr_length -1; i++){
        check = arr[i].indexOf("ingr");
        if(check > -1){
            key = arr[i];
            value = localStorage.getItem(arr[i]);
            ingr_key_array.push(key);
            ingr_value_array.push(value);
        }
    }
    // 出力
    for(i = 0; i <= ingr_key_array.length -1; i++){
        ingredient_category = ingr_key_array[i].slice(0,5);
        ingredient_item = ingr_key_array[i].substr(6);
        ingredient_quantity = ingr_value_array[i]*2

        if(ingredient_category === "ingr1"){
            $('.ingr1-list').append('<li class= wrapper__ingredient><p>'+ ingredient_item +'</p><p>' + ingredient_quantity + '</p></li>');
        } else if(ingredient_category === "ingr2"){
            $('.ingr2-list').append('<li class= wrapper__ingredient><p>'+ ingredient_item +'</p><p>' + ingredient_quantity + '</p></li>');
        } else if(ingredient_category === "ingr3"){
            $('.ingr3-list').append('<li class= wrapper__ingredient><p>'+ ingredient_item +'</p><p>' + ingredient_quantity + '</p></li>');
        } else if(ingredient_category === "ingr4"){
            $('.ingr4-list').append('<li class= wrapper__ingredient><p>'+ ingredient_item +'</p></li>');
        } else if(ingredient_category === "ingr5"){
            $('.ingr5-list').append('<li class= wrapper__ingredient><p>'+ ingredient_item +'</p></li>');
        }
    }
});

// タブ：選択された曜日の献立を表示
$(function(){
    $("#tab_resultDay li").click(function(){
      $("#tab_resultDay li").removeClass("active");
      $(this).addClass("active");
      var tabDay_index = $(this).index();

      if (window.localStorage) {
        let json_mainDish = localStorage.getItem('mainDish');
        number_mainDish_array = JSON.parse(json_mainDish);
        let json_stapleFood = localStorage.getItem('stapleFood');
        number_stapleFood_array = JSON.parse(json_stapleFood);
        let json_sideDish = localStorage.getItem('sideDish');
        number_sideDish_array = JSON.parse(json_sideDish);
        let json_soup = localStorage.getItem('soup');
        number_soup_array = JSON.parse(json_soup);
    } 

    // 選択されたタブが、献立提案対象の曜日であれば、献立提案内容を表示する
        let number_mainDish = number_mainDish_array[tabDay_index];
        let number_stapleFood = number_stapleFood_array[tabDay_index];
        let number_sideDish = number_sideDish_array[tabDay_index];
        let number_soup = number_soup_array[tabDay_index];

        document.getElementById("result__title_mainDish").innerHTML = mainDish[number_mainDish].title
        document.getElementById("result__title_sideDish").innerHTML = sideDish[number_sideDish].title
        document.getElementById("result__title_stapleFood").innerHTML = stapleFood[number_stapleFood].title
        document.getElementById("result__title_soup").innerHTML = soup[number_soup].title

        document.getElementById("result__img_mainDish").src = "img/mainDish-" + number_mainDish + ".png"
        document.getElementById("result__img_sideDish").src = "img/sideDish-" + number_sideDish + ".png"
        document.getElementById("result__img_stapleFood").src = "img/stapleFood-" + number_stapleFood + ".png"
        document.getElementById("result__img_soup").src = "img/soup-" + number_soup + ".png"
    });
});
// 献立の選択肢の定義（材料はすべて1人分）
// 主菜リストの定義
const mainDish = [
    {title: "-",
    ingredient: [
       {item: "", quantity: "", category: "", unit: ""}]}, //0
    {title: "肉じゃが",
     ingredient: [
        {item: "牛薄切り肉", quantity: 70, category: "ingr1", unit: "g"},
        {item: "じゃがいも", quantity: 1, category: "ingr2", unit: "個"},
        {item: "にんじん", quantity: 0.25, category: "ingr2", unit: "本"},
        {item: "玉ねぎ", quantity: 0.25, category: "ingr2", unit: "個"},
        {item: "しらたき", quantity: 50, category: "ingr2", unit: "g"},
        {item: "きぬさや", quantity: 3, category: "ingr2", unit: "枚"},
        {item: "ごま油", quantity: 1, category: "ingr4", unit: "小さじ"},
        {item: "だし汁", quantity: 0.5, category: "ingr4", unit: "カップ"},
        {item: "砂糖", quantity: 3, category: "ingr4", unit: "小さじ"},
        {item: "みりん", quantity: 1.5, category: "ingr4", unit: "小さじ"},
        {item: "しょうゆ", quantity: 3, category: "ingr4", unit: "小さじ"}]}, //1
    {title: "豚肉のしょうが焼き",
    ingredient: [
       {item: "豚ロース肉", quantity: 4, category: "ingr1", unit: "枚"},
       {item: "キャベツ", quantity: 0.25, category: "ingr2", unit: "個"},
       {item: "ミニトマト", quantity: 2, category: "ingr2", unit: "個"},
       {item: "しょうが", quantity: 1.5, category: "ingr4", unit: "小さじ"},
       {item: "しょうゆ", quantity: 2, category: "ingr4", unit: "小さじ"},
       {item: "酒", quantity: 2, category: "ingr4", unit: "小さじ"},
       {item: "みりん", quantity: 2, category: "ingr4", unit: "小さじ"},
       {item: "サラダ油", quantity: 1, category: "ingr4", unit: "小さじ"}]}, //2
    {title: "ぶりの照り焼き",
    ingredient: [
       {item: "ぶり", quantity: 1, category: "ingr1", unit: "切れ"},
       {item: "青唐辛子", quantity: 2, category: "ingr2", unit: "本"},
       {item: "酒", quantity: 1.5, category: "ingr4", unit: "小さじ"},
       {item: "みりん", quantity: 3, category: "ingr4", unit: "小さじ"},
       {item: "しょうゆ", quantity: 3, category: "ingr4", unit: "小さじ"},
       {item: "砂糖", quantity: 0.5, category: "ingr4", unit: "小さじ"},
       {item: "サラダ油", quantity: 0.5, category: "ingr4", unit: "小さじ"}]}, //3
    {title: "鶏の唐揚げ",
    ingredient: [
       {item: "鶏もも肉", quantity: 100, category: "ingr1", unit: "g"},
       {item: "サラダ菜", quantity: 3, category: "ingr2", unit: "枚"},
       {item: "酒", quantity: 1, category: "ingr4", unit: "小さじ"},
       {item: "しょうゆ", quantity: 1, category: "ingr4", unit: "小さじ"},
       {item: "しょうが", quantity: 1.5, category: "ingr4", unit: "小さじ"},
       {item: "砂糖", quantity: 0.25, category: "ingr4", unit: "小さじ"},
       {item: "こしょう", quantity: "適量", category: "ingr4", unit: "小さじ"},
       {item: "片栗粉", quantity: "適量", category: "ingr4", unit: "小さじ"},
       {item: "揚げ油", quantity: "適量", category: "ingr4", unit: "小さじ"}]}, //4
    {title: "ハンバーグ",
    ingredient: [
       {item: "合いびき肉", quantity: 100, category: "ingr1", unit: "g"},
       {item: "玉ねぎ", quantity: 0.1, category: "ingr2", unit: "個"},
       {item: "牛乳", quantity: 3, category: "ingr3", unit: "小さじ"},
       {item: "パン粉", quantity: 3, category: "ingr4", unit: "小さじ"},
       {item: "卵", quantity: 0.25, category: "ingr3", unit: "個"},
       {item: "塩", quantity: 0.1, category: "ingr4", unit: "小さじ"},
       {item: "ナツメグ", quantity: "適量", category: "ingr4", unit: "小さじ"},
       {item: "サラダ油", quantity: "適量", category: "ingr4", unit: "小さじ"},
       {item: "赤ワイン", quantity: 3, category: "ingr4", unit: "小さじ"},
       {item: "デミグラスソース", quantity: 30, category: "ingr4", unit: "ml"},
       {item: "トマトケチャップ", quantity: 1.5, category: "ingr4", unit: "小さじ"},
       {item: "にんじん", quantity: 0.25, category: "ingr2", unit: "本"},
       {item: "ブロッコリー", quantity: 0.25, category: "ingr2", unit: "個"}]}, //5
    {title: "サーモンムニエル",
    ingredient: [
       {item: "サーモン", quantity: 1, category: "ingr1", unit: "切れ"},
       {item: "塩", quantity: 0.3, category: "ingr4", unit: "小さじ"},
       {item: "こしょう", quantity: "適量", category: "ingr4", unit: "小さじ"},
       {item: "小麦粉", quantity: 3, category: "ingr4", unit: "小さじ"},
       {item: "サラダ油", quantity: 1.5, category: "ingr4", unit: "小さじ"},
       {item: "バター", quantity: 0.7, category: "ingr3", unit: "小さじ"},
       {item: "サラダ菜", quantity: 3, category: "ingr2", unit: "枚"}]}, //6
    {title: "ビーフシチュー",
    ingredient: [
       {item: "牛バラかたまり肉", quantity: 150, category: "ingr1", unit: "g"},
       {item: "玉ねぎ", quantity: 0.1, category: "ingr2", unit: "個"},
       {item: "酒", quantity: 1, category: "ingr4", unit: "小さじ"},
       {item: "にんにく", quantity: 1, category: "ingr2", unit: "かけ"},
       {item: "赤ワイン", quantity: 0.25, category: "ingr4", unit: "カップ"},
       {item: "洋風スープ", quantity: 1, category: "ingr4", unit: "カップ"},
       {item: "デミグラスソース", quantity: 50, category: "ingr4", unit: "ml"},
       {item: "トマトペースト", quantity: 0.25, category: "ingr4", unit: "小さじ"},
       {item: "玉ねぎ", quantity: 0.5, category: "ingr2", unit: "個"},
       {item: "じゃがいも", quantity: 0.5, category: "ingr2", unit: "個"},
       {item: "にんじん", quantity: 0.2, category: "ingr2", unit: "本"},
       {item: "小麦粉", quantity: 18, category: "ingr4", unit: "g"},
       {item: "こしょう", quantity: "適量", category: "ingr4", unit: "小さじ"},
       {item: "塩", quantity: "適量", category: "ingr4", unit: "小さじ"},

       {item: "バター", quantity: 15, category: "ingr3", unit: "g"}]}, //7
    {title: "焼き餃子",
    ingredient: [
       {item: "餃子の皮", quantity: 10, category: "ingr5", unit: "枚"},
       {item: "白菜", quantity: 0.1, category: "ingr2", unit: "個"},
       {item: "ねぎ", quantity: 0.1, category: "ingr2", unit: "本"},
       {item: "にら", quantity: 0.25, category: "ingr2", unit: "わ"},
       {item: "にんにく", quantity: 0.5, category: "ingr2", unit: "かけ"},
       {item: "豚ひき肉", quantity: 50, category: "ingr1", unit: "g"},
       {item: "砂糖", quantity: 1, category: "ingr4", unit: "小さじ"},
       {item: "片栗粉", quantity: 1, category: "ingr4", unit: "小さじ"},
       {item: "ごま油", quantity: 1, category: "ingr4", unit: "小さじ"},
       {item: "しょうゆ", quantity: 1, category: "ingr4", unit: "小さじ"},
       {item: "塩", quantity: "適量", category: "ingr4", unit: "小さじ"},
       {item: "こしょう", quantity: "適量", category: "ingr4", unit: "枚"}]}, //8
    {title: "八宝菜",
    ingredient: [
       {item: "鶏肉", quantity: 30, category: "ingr1", unit: "g"},
       {item: "いか", quantity: 25, category: "ingr1", unit: "g"},
       {item: "えび", quantity: 4, category: "ingr1", unit: "尾"},
       {item: "たけのこ", quantity: 0.25, category: "ingr2", unit: "個"},
       {item: "にんじん", quantity: 0.25, category: "ingr2", unit: "本"},
       {item: "青梗菜", quantity: 0.5, category: "ingr2", unit: "株"},
       {item: "生しいたけ", quantity: 1, category: "ingr2", unit: "枚"},
       {item: "うずらのゆで卵", quantity: 3, category: "ingr3", unit: "個"},
       {item: "しょうゆ", quantity: 0.5, category: "ingr4", unit: "小さじ"},
       {item: "中華風スープ", quantity: 0.5, category: "ingr4", unit: "カップ"},
       {item: "片栗粉", quantity: 1, category: "ingr4", unit: "小さじ"},
       {item: "サラダ油", quantity: "適量", category: "ingr4", unit: "小さじ"}]}, //9
    {title: "坦々麺",
    ingredient: [
       {item: "中華麺", quantity: 1, category: "ingr5", unit: "玉"},
       {item: "豚ひき肉", quantity: 30, category: "ingr1", unit: "g"},
       {item: "しょうゆ", quantity: 1.5, category: "ingr4", unit: "小さじ"},
       {item: "砂糖", quantity: 1.5, category: "ingr4", unit: "小さじ"},
       {item: "芝麻醤", quantity: 4, category: "ingr4", unit: "小さじ"},
       {item: "みそ", quantity: 1.5, category: "ingr4", unit: "小さじ"},
       {item: "酢", quantity: 1.5, category: "ingr4", unit: "小さじ"},
       {item: "豆板醤", quantity: 0.5, category: "ingr4", unit: "小さじ"},
       {item: "にんにく", quantity: 1, category: "ingr2", unit: "かけ"},
       {item: "中華風スープ", quantity: 0.5, category: "ingr4", unit: "カップ"},
       {item: "サラダ油", quantity: "適量", category: "ingr4", unit: "小さじ"}]} //10
]

// 主食リストの定義
const stapleFood = [
    {title: "-",
    ingredient: [
       {item: "", quantity: "", category: "", unit: ""}]}, //0
    {title: "ご飯",
    ingredient: [
       {item: "米", quantity: "適量", category: "ingr5", unit: ""}]}, //1
    {title: "パン",
    ingredient: [
       {item: "パン", quantity: "適量", category: "ingr5", unit: ""}]} //2
]

// 副菜リストの定義
const sideDish = [
    {title: "-",
    ingredient: [
       {item: "", quantity: "", category: "", unit: ""}]}, //0
    {title: "ひじきの炒め煮",
    ingredient: [
       {item: "乾燥ひじき", quantity: 10, category: "ingr2", unit: "g"},
       {item: "油揚げ", quantity: 0.25, category: "ingr2", unit: "枚"},
       {item: "にんじん", quantity: 0.25, category: "ingr2", unit: "本"},
       {item: "さやいんげん", quantity: 3, category: "ingr2", unit: "本"},
       {item: "ごま油", quantity: 1, category: "ingr4", unit: "小さじ"},
       {item: "砂糖", quantity: 1.5, category: "ingr4", unit: "小さじ"},
       {item: "しょうゆ", quantity: 1.5, category: "ingr4", unit: "小さじ"},
       {item: "みりん", quantity: 0.5, category: "ingr4", unit: "小さじ"},
       {item: "だし汁", quantity: 0.25, category: "ingr4", unit: "カップ"}]}, //1
    {title: "茶碗蒸し",
    ingredient: [
       {item: "えび", quantity: 2, category: "ingr1", unit: "尾"},
       {item: "鶏ささ身", quantity: 0.5, category: "ingr1", unit: "本"},
       {item: "干ししいたけ", quantity: 1, category: "ingr2", unit: "枚"},
       {item: "三つ葉", quantity: 2, category: "ingr2", unit: "本"},
       {item: "かまぼこ", quantity: 0.25, category: "ingr1", unit: "本"},
       {item: "卵", quantity: 0.5, category: "ingr3", unit: "個"},
       {item: "塩", quantity: "適量", category: "ingr4", unit: ""},
       {item: "酒", quantity: "適量", category: "ingr4", unit: ""},
       {item: "だし汁", quantity: 0.5, category: "ingr4", unit: "カップ"},
       {item: "しょうゆ", quantity: 0.5, category: "ingr4", unit: "小さじ"},
       {item: "みりん", quantity: 0.5, category: "ingr4", unit: "小さじ"}]}, //2
    {title: "小松菜と桜海老の蒸し煮",
    ingredient: [
       {item: "小松菜", quantity: 0.5, category: "ingr2", unit: "束"},
       {item: "さくらえび", quantity: 2.5, category: "ingr1", unit: "g"},
       {item: "ちりめんじゃこ", quantity: 20, category: "ingr1", unit: "g"},
       {item: "塩", quantity: "適量", category: "ingr4", unit: "小さじ"},
       {item: "ごま油", quantity: "適量", category: "ingr4", unit: "小さじ"}]}, //3
    {title: "だし巻き卵",
    ingredient: [
       {item: "卵", quantity: 2, category: "ingr3", unit: "個"},
       {item: "だし汁", quantity: 6, category: "ingr4", unit: "小さじ"},
       {item: "しょうゆ", quantity: 0.5, category: "ingr4", unit: "小さじ"},
       {item: "みりん", quantity: 1, category: "ingr4", unit: "小さじ"},
       {item: "塩", quantity: "適量", category: "ingr4", unit: ""},
       {item: "サラダ油", quantity: "適量", category: "ingr4", unit: ""},
       {item: "大根", quantity: 0.25, category: "ingr2", unit: "本"}]}, //4
    {title: "グリーンサラダ",
    ingredient: [
       {item: "サラダ菜", quantity: 7, category: "ingr2", unit: "枚"},
       {item: "トマト", quantity: 2, category: "ingr2", unit: "個"},
       {item: "ブロッコリー", quantity: 0.5, category: "ingr2", unit: "個"},
       {item: "オリーブ", quantity: 3, category: "ingr2", unit: "個"}]}, //5
    {title: "ジャーマンポテト",
    ingredient: [
       {item: "じゃがいも", quantity: 2, category: "ingr2", unit: "個"},
       {item: "玉ねぎ", quantity: 0.5, category: "ingr2", unit: "個"},
       {item: "ベーコン", quantity: 1, category: "ingr1", unit: "枚"},
       {item: "こしょう", quantity: "適量", category: "ingr4", unit: "小さじ"}]}, //6
    {title: "ラタトゥイユ",
    ingredient: [
       {item: "パプリカ", quantity: 0.25, category: "ingr2", unit: "個"},
       {item: "トマト", quantity: 0.25, category: "ingr2", unit: "個"},
       {item: "ズッキーニ", quantity: 0.25, category: "ingr2", unit: "本"},
       {item: "なす", quantity: 0.5, category: "ingr2", unit: "本"},
       {item: "玉ねぎ", quantity: 0.25, category: "ingr2", unit: "個"},
       {item: "にんにく", quantity: 0.5, category: "ingr2", unit: "かけ"},
       {item: "トマトソース", quantity: 0.25, category: "ingr4", unit: "カップ"},
       {item: "砂糖", quantity: 0.75, category: "ingr4", unit: "小さじ"},
       {item: "こしょう", quantity: "適量", category: "ingr4", unit: "小さじ"},
       {item: "オリーブ油", quantity: 3, category: "ingr4", unit: "小さじ"}]}, //7
    {title: "春巻き",
    ingredient: [
       {item: "春巻きの皮", quantity: 3, category: "ingr5", unit: "枚"},
       {item: "豚薄切り肉", quantity: 40, category: "ingr1", unit: "g"},
       {item: "にら", quantity: 0.25, category: "ingr2", unit: "わ"},
       {item: "にんじん", quantity: 0.1, category: "ingr2", unit: "本"},
       {item: "干ししいたけ", quantity: 1, category: "ingr2", unit: "枚"},
       {item: "春雨", quantity: 7.5, category: "ingr5", unit: "g"},
       {item: "しょうゆ", quantity: 0.25, category: "ingr4", unit: "小さじ"},
       {item: "片栗粉", quantity: 0.5, category: "ingr4", unit: "小さじ"},
       {item: "オイスターソース", quantity: 0.5, category: "ingr4", unit: "小さじ"},
       {item: "砂糖", quantity: 0.5, category: "ingr4", unit: "小さじ"},
       {item: "塩", quantity: 0.1, category: "ingr4", unit: "小さじ"},
       {item: "サラダ油", quantity: 1, category: "ingr4", unit: "小さじ"}]}, //8
    {title: "棒棒鶏",
    ingredient: [
       {item: "鶏もも肉", quantity: 75, category: "ingr1", unit: "g"},
       {item: "ねぎ", quantity: 1, category: "ingr2", unit: "本"},
       {item: "しょうが", quantity: 0.1, category: "ingr2", unit: "小さじ"},
       {item: "きゅうり", quantity: 1, category: "ingr2", unit: "本"},
       {item: "芝麻醤", quantity: 0.75, category: "ingr4", unit: "小さじ"},
       {item: "しょうゆ", quantity: 0.75, category: "ingr4", unit: "小さじ"},
       {item: "砂糖", quantity: 1, category: "ingr4", unit: "小さじ"},
       {item: "酢", quantity: 1, category: "ingr4", unit: "小さじ"},
       {item: "ラー油", quantity: 0.5, category: "ingr4", unit: "小さじ"}]}, //9
    {title: "中華風野菜炒め",
    ingredient: [
       {item: "にら", quantity: 0.25, category: "ingr2", unit: "わ"},
       {item: "もやし", quantity: 50, category: "ingr2", unit: "g"},
       {item: "にんじん", quantity: 0.1, category: "ingr2", unit: "本"},
       {item: "ピーマン", quantity: 1, category: "ingr2", unit: "個"},
       {item: "春雨", quantity: 5, category: "ingr5", unit: "g"},
       {item: "豚薄切り肉", quantity: 25, category: "ingr1", unit: "g"},
       {item: "しょうが", quantity: 0.5, category: "ingr2", unit: "小さじ"},
       {item: "塩", quantity: 0.1, category: "ingr4", unit: "小さじ"},
       {item: "砂糖", quantity: 0.3, category: "ingr4", unit: "小さじ"},
       {item: "こしょう", quantity: 0.5, category: "ingr4", unit: "小さじ"},
       {item: "サラダ油", quantity: "適量", category: "ingr4", unit: "小さじ"}]} //10
]

// 汁物リストの定義
const soup = [
    {title: "-",
    ingredient: [
       {item: "", quantity: "", category: "", unit: ""}]}, //0
    {title: "なめこのお味噌汁",
    ingredient: [
       {item: "なめこ", quantity: 0.5, category: "ingr2", unit: "袋"},
       {item: "絹ごし豆腐", quantity: 0.25, category: "ingr2", unit: "丁"},
       {item: "だし汁", quantity: 1, category: "ingr4", unit: "カップ"},
       {item: "みそ", quantity: 3, category: "ingr4", unit: "小さじ"}]}, //1
    {title: "あさりのお味噌汁",
    ingredient: [
       {item: "あさり", quantity: 0.5, category: "ingr2", unit: "パック"},
       {item: "三つ葉", quantity: 2, category: "ingr2", unit: "本"},
       {item: "だし汁", quantity: 1, category: "ingr4", unit: "カップ"},
       {item: "みそ", quantity: 3, category: "ingr4", unit: "小さじ"}]}, //2
    {title: "しめじのお吸い物",
    ingredient: [
       {item: "しめじ", quantity: 0.5, category: "ingr2", unit: "パック"},
       {item: "塩", quantity: 0.1, category: "ingr4", unit: "小さじ"},
       {item: "しょうゆ", quantity: 0.25, category: "ingr4", unit: "小さじ"},
       {item: "だし汁", quantity: 1, category: "ingr4", unit: "カップ"}]}, //3
    {title: "豚汁",
    ingredient: [
       {item: "豚薄切り肉", quantity: 50, category: "ingr1", unit: "g"},
       {item: "大根", quantity: 0.1, category: "ingr2", unit: "本"},
       {item: "にんじん", quantity: 0.1, category: "ingr2", unit: "本"},
       {item: "こんにゃく", quantity: 0.1, category: "ingr2", unit: "枚"},
       {item: "里芋", quantity: 1, category: "ingr2", unit: "個"},
       {item: "ごぼう", quantity: 0.5, category: "ingr2", unit: "本"},
       {item: "油揚げ", quantity: 0.1, category: "ingr2", unit: "枚"},
       {item: "サラダ油", quantity: 1, category: "ingr4", unit: "小さじ"},
       {item: "だし汁", quantity: 1.5, category: "ingr4", unit: "カップ"},
       {item: "みそ", quantity: 9, category: "ingr4", unit: "小さじ"}]}, //4
    {title: "オニオンコンソメスープ",
    ingredient: [
       {item: "玉ねぎ", quantity: 2, category: "ingr2", unit: "個"},
       {item: "コンソメ", quantity: 0.5, category: "ingr4", unit: "小さじ"},
       {item: "塩", quantity: 0.1, category: "ingr4", unit: "小さじ"}]}, //5
    {title: "ねぎとじゃがいものスープ",
    ingredient: [
       {item: "じゃがいも", quantity: 1, category: "ingr2", unit: "個"},
       {item: "玉ねぎ", quantity: 0.5, category: "ingr2", unit: "個"},
       {item: "ねぎ", quantity: 0.25, category: "ingr2", unit: "本"},
       {item: "塩", quantity: "適量", category: "ingr4", unit: "小さじ"},
       {item: "こしょう", quantity: "適量", category: "ingr4", unit: "小さじ"},
       {item: "鶏がらスープの素", quantity: 1, category: "ingr4", unit: "小さじ"},
       {item: "バター", quantity: 3, category: "ingr3", unit: "小さじ"}]}, //6
    {title: "パンプキンスープ",
    ingredient: [
       {item: "かぼちゃ", quantity: 0.5, category: "ingr2", unit: "個"},
       {item: "玉ねぎ", quantity: 0.5, category: "ingr2", unit: "個"},
       {item: "コンソメ", quantity: 0.25, category: "ingr4", unit: "小さじ"},
       {item: "牛乳", quantity: 150, category: "ingr3", unit: "ml"},
       {item: "こしょう", quantity: "適量", category: "ingr4", unit: "小さじ"}]}, //7
    {title: "中華風卵スープ",
    ingredient: [
       {item: "卵", quantity: 0.5, category: "ingr3", unit: "個"},
       {item: "コーン缶", quantity: 0.5, category: "ingr5", unit: "個"},
       {item: "ごま油", quantity: 0.1, category: "ingr4", unit: "小さじ"},
       {item: "鶏ガラスープの素", quantity: 0.1, category: "ingr4", unit: "小さじ"}]}, //8
    {title: "わかめスープ",
    ingredient: [
       {item: "わかめ", quantity: 5, category: "ingr2", unit: "g"},
       {item: "ねぎ", quantity: 0.1, category: "ingr2", unit: "本"},
       {item: "白ごま", quantity: 0.25, category: "ingr2", unit: "小さじ"},
       {item: "鶏ガラスープの素", quantity: 0.1, category: "ingr4", unit: "小さじ"}]}, //9
    {title: "幻のスープ",
    ingredient: [
       {item: "幻", quantity: 1, category: "ingr5", unit: ""}]} //10
]
