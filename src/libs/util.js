
//二分查找算法
function binarySearch($array, $val) {
    var $count = $array.length;
    var $low = 0;
    var $high = $count - 1;
    while ($low <= $high) {//跳出条件
        $mid = parseInt(($low + $high) / 2);
        if ($array[$mid] <= $val && $array[$mid+1]>$val ) {
            return $mid;
        }
        if ($array[$mid] < $val) {
            $low = $mid + 1;
        } else {
            $high = $mid - 1;
        }
    }
    return false;
}

//测量文本的宽度
var cavsMeasure = document.createElement('canvas');
var ctx = cavsMeasure.getContext('2d');
function measureText(text){
    var inputc = document.querySelector('.v-content');
    // ctx.font = "12px sans-serif";
    ctx.font = window.getComputedStyle(inputc).font;
    return ctx.measureText(text).width;
}

module.exports = {
    binarySearch:binarySearch,
    measureText:measureText
}
