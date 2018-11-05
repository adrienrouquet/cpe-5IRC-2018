
const reducer = (acc, current) => {
    if (!Number.isNaN(Number(current))) {
        acc += Number(current);
    }
    return acc;
};
console.log(`Total (reducer): ${process.argv.reduce(reducer, 0)}`);

let sum = 0;
for (let elm of process.argv) {

    if (!Number.isNaN(Number(elm))) {
        sum += Number(elm);
    }
}
console.log(`Total ${sum}`);
