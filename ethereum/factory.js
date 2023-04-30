import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x45BeC92cF659C09E0a243bdB5f537211421e68B6'
);

export default instance;