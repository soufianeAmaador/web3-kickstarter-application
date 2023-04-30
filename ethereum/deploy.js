const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory =  require('./build/CampaignFactory.json');
 
const provider = new HDWalletProvider(
  {
    mnemonic: {
      phrase: 'nature copy excite toddler ice solve finish glass stone wage silk receive'
    },
    providerOrUrl: 'https://goerli.infura.io/v3/354daa2890114a18a8652c2d1ed03ffe' 
  }
  
);
 
console.log("has the connection been made: " + provider);

const web3 = new Web3(provider);
 
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
 
  console.log('Attempting to deploy from account', accounts[0]);
 
  let result;
  try{
    web3.eth.getBalance("0x99119B2526dd23440Ea14f58c2b3DdBaC503806e")
    .then(console.log);

    result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: '2000000', from: accounts[0] }); 
    console.log('Contract deployed to', result.options.address);
  } catch(error) {
    console.log(error);
  }
  
  provider.engine.stop();
};
deploy();