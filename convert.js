'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('evaluation_apo_de_2020-10-19-10-57_confusionMatrix_2020-10-15-15-46-10.json');
let confusionMatrix = JSON.parse(rawdata);

let yAxisElementSet = new Set();

let sparseArr = confusionMatrix.reduce((arr, obj) => {
    let xCrId = Number(Object.keys(obj)[0]);
    
    arr[xCrId] = Object.entries(obj[xCrId]).reduce((freqArray, [yCrIdStr, frequency]) => {
        let yCrId = Number(yCrIdStr);
        yAxisElementSet.add(yCrId);
        freqArray[Number(yCrId)] = frequency;
        return freqArray;
    }, []);
    return arr;
}, []);


let xAxisElements = Object.keys(sparseArr); // .sort()
let yAxisElements = [... yAxisElementSet].sort((a, b) => a - b);

let outputData = Object.entries(sparseArr).map(([xCrId, frequencies]) => {
    
    let column = yAxisElements.map(yAxisElement => {
        
        let retval = frequencies[yAxisElement] || 0;
        return [Number(xCrId), yAxisElement, retval];
    });

    // if (xCrId == 0) {
    //     console.log("column = ", column);
    // }
    return column;
});

fs.writeFileSync('out.json', JSON.stringify(outputData.reduce((flat, val) => flat.concat(val), []), null, 3));
fs.writeFileSync('out-x.json', JSON.stringify(xAxisElements, null, 3));
fs.writeFileSync('out-y.json', JSON.stringify(yAxisElements , null, 3));