function solution(my_string) {
    const numbers = str.match(/\d/g);

    // 문자열을 숫자 배열로 변환
    const numberArray = numbers.map(Number);
    const sum = numberArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum;
}