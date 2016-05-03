var arr1 = ['red', 'green', 'blue', 'yellow', 'purple'];
var arr2 = ['red', 'dog', 'water', 'life'];

console.log(arr1);

var diff = arr1.filter(function(item) {
    return arr2.indexOf(item) === -1;
});

var same = arr1.filter(function(item) {
    return arr2.indexOf(item) !== -1;
}); 

console.log(diff);
console.log(same);
