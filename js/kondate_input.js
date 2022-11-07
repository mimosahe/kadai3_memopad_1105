// 曜日選択
$(function(){
    $("#btn_selectDay p").click(function(){
        if ($(this).hasClass("active")){
            $(this).removeClass("active");
        }else{
            $(this).addClass("active");
            var selectDay_index = $(this).index();
        }
        $(".selectDay").eq(selectDay_index).addClass("active");
    });
}); 

// ボタンクリック処理
$(".btn_input").on("click", function() {
    // 「何曜日の献立をつくる？」がactiveの曜日のindexを配列に格納
    var activeDay_index = 0;
    var activeDay_array = [];
    $("#btn_selectDay p").each(function(){
        if ($(this).hasClass("active")){
            activeDay_array.push(activeDay_index);
        }
        activeDay_index++;
    });
    if (activeDay_array.length === 0){
        alert("献立をつくる曜日を選んでください")
    }else {
        // activeDayの配列をローカルストレージに保存
        if (window.localStorage) {
            let json = JSON.stringify(activeDay_array, undefined, 1);
            localStorage.setItem('key_name', json);
            window.location.href = "kondate_result.html";
        }
    }
});