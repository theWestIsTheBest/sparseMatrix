'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('evaluation_apo_de_2020-10-19-10-57_confusionMatrix_2020-10-15-15-46-10.json');
let confusionMatrix = JSON.parse(rawdata);

console.log("finished reading input json...");

let yAxisElementSet = new Set();

let sparseArr = confusionMatrix.reduce((arr, obj) => {
    let xCrId = Number(Object.keys(obj)[0]);
    
    arr[xCrId] = Object.entries(obj[xCrId]).reduce((fooArr, [yCrIdStr, frequency]) => {
        //  console.log("%i = %i", yCrIdStr, frequency);
        let yCrId = Number(yCrIdStr);
        yAxisElementSet.add(yCrId);
        fooArr[Number(yCrId)] = frequency;
        return fooArr;
        // return [Number(yCrId), frequency];
    }, []);
    return arr;
}, []);

// console.log("typeof sparseArr = ", typeof sparseArr);
// console.log("Array.isArray(sparseArr) = ", Array.isArray(sparseArr));
// console.log("yAxisElements.length = ", yAxisElements.size);


let xAxisElements = Object.keys(sparseArr); // .sort()
let yAxisElements = [... yAxisElementSet].sort((a, b) => a - b);

// console.log("sortedKeys = ", sortedKeys);

let outputData = Object.entries(sparseArr).map(([xCrId, frequencies]) => {
    
    // console.log("frequencies = ", frequencies);
    return yAxisElements.map(yAxisElement => {
        
        if (xCrId == 0) {
            console.log("yAxisElement is ", yAxisElement);
        }
        let retval = frequencies[yAxisElement] || 0;
        if (xCrId == 0) {
            console.log("mapping yAxisElement %i to %i", yAxisElement, retval);
        }
        return retval;
    });
});

fs.writeFileSync('out.json', JSON.stringify(outputData, null, 3));
fs.writeFileSync('out-x.json', JSON.stringify(xAxisElements, null, 3));
fs.writeFileSync('out-y.json', JSON.stringify(yAxisElements , null, 3));