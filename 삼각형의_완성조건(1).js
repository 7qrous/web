function solution(sides) {
    var temp = sides.sort((a, b) => a - b);
    console.log(temp);
    if (temp[0]+temp[1] > temp[2]){
        return 1;
    }else{
        return 2;
    }
}
console.log(solution([199, 72, 222]));