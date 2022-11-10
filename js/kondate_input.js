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

    localStorage.clear();
    var activeDay_index = 0;

    $("#btn_selectDay p").each(function(){
        if ($(this).hasClass("active")){
            localStorage.setItem(activeDay_index, "active");
        } else {
            localStorage.setItem(activeDay_index, null);
        }
        activeDay_index++;
    });

    let activeDay_array = [];
    for( i = 0; i < 7; i++ ){
        let activeDay = localStorage.getItem(i);
        activeDay_array.push(activeDay);
    }
    if (activeDay_array.indexOf("active") === -1){ // 曜日がひとつも選択されていなければアラートを表示
        alert("献立をつくる曜日を選んでください")
    }else { // 曜日が選択されていればそれらをLocalStorageに保存
        if (window.localStorage) {
            let json = JSON.stringify(activeDay_array, undefined, 1);
            localStorage.setItem('activeDay', json);
            window.location.href = "kondate_result.html";
        }
    }
});