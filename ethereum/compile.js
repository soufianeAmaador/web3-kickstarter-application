const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
//const output = solc.compile(source,1);

//fs.ensureDirSync(buildPath);

var input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }

};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
//console.log(output);


for (let contractName in output.contracts['Campaign.sol']){

    fs.outputJsonSync(
        path.resolve(buildPath, contractName + '.json'),
        output.contracts['Campaign.sol'][contractName]
    );
}
