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
        }else if (number_mainDish >= 8 && number_mainDish < 11) { // 8-10：中
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
        let json_stapleFood = JSON.stringify(number_stapleFood_array, undefined, 1);
        localStorage.setItem('stapleFood', json_stapleFood);
        let json_sideDish = JSON.stringify(number_sideDish_array, undefined, 1);
        localStorage.setItem('sideDish', json_sideDish);
        let json_soup = JSON.stringify(number_soup_array, undefined, 1);
        localStorage.setItem('soup', json_soup);
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
    //   if (activeDay_array[tabDay_index] === "active"){
        let number_mainDish = number_mainDish_array[tabDay_index];
        let number_stapleFood = number_stapleFood_array[tabDay_index];
        let number_sideDish = number_sideDish_array[tabDay_index];
        let number_soup = number_soup_array[tabDay_index];

        document.getElementById("result__title_mainDish").innerHTML = mainDish[number_mainDish].name
        document.getElementById("result__title_sideDish").innerHTML = sideDish[number_sideDish].name
        document.getElementById("result__title_stapleFood").innerHTML = stapleFood[number_stapleFood].name
        document.getElementById("result__title_soup").innerHTML = soup[number_soup].name

        document.getElementById("result__img_mainDish").src = "img/mainDish-" + number_mainDish + ".png"
        document.getElementById("result__img_sideDish").src = "img/sideDish-" + number_sideDish + ".png"
        document.getElementById("result__img_stapleFood").src = "img/stapleFood-" + number_stapleFood + ".png"
        document.getElementById("result__img_soup").src = "img/soup-" + number_soup + ".png"
    //   }
    });
  });

// 献立の選択肢の定義
// 主菜リストの定義
const mainDish = [
    {name: "-"}, //0
    {name: "肉じゃが"}, //1
    {name: "豚肉のしょうが焼き"}, //2
    {name: "ぶりの照り焼き"}, //3
    {name: "鶏の唐揚げ"}, //4
    {name: "ハンバーグ"}, //5
    {name: "サーモンムニエル"}, //6
    {name: "ビーフシチュー"}, //7
    {name: "焼き餃子"}, //8
    {name: "八宝菜"}, //9
    {name: "坦々麺"}, //10
]

// 主食リストの定義
const stapleFood = [
    {name: "-"}, //0
    {name: "ご飯"}, //1
    {name: "パン"}, //2
]

// 副菜リストの定義
const sideDish = [
    {name: "-"}, //0
    {name: "ひじきの炒め煮"}, //1
    {name: "茶碗蒸し"}, //2
    {name: "小松菜と桜海老の蒸し煮"}, //3
    {name: "だし巻き卵"}, //4
    {name: "グリーンサラダ"}, //5
    {name: "ジャーマンポテト"}, //6
    {name: "ラタトゥイユ"}, //7
    {name: "春巻き"}, //8
    {name: "棒棒鶏"}, //9
    {name: "中華風野菜炒め"}, //10
]

// 汁物リストの定義
const soup = [
    {name: "-"}, //0
    {name: "なめこのお味噌汁"}, //1
    {name: "あさりのお味噌汁"}, //2
    {name: "しめじのお吸い物"}, //3
    {name: "豚汁"}, //4
    {name: "オニオンコンソメスープ"}, //5
    {name: "ねぎとじゃがいものスープ"}, //6
    {name: "パンプキンスープ"}, //7
    {name: "中華風卵スープ"}, //8
    {name: "わかめスープ"}, //9
    {name: "幻のスープ"}, //10
]
