/* eslint-disable no-param-reassign */
import { ethers, utils } from 'ethers';
import axios from 'axios';

export default {
  install: (Vue) => {
    Vue.prototype.$_cgutils = {
      // formatEthersTx is used to prepare transactions received from the MultiBaas API
      // for submission on the frontend by ethers.js
      // This helper renames the gas field to gasLimit, and deletes some fields that
      // prevent ethers.js from being able to submit the transaction
      formatEthersTx(txFromAPI) {
        const tx = JSON.parse(JSON.stringify(txFromAPI));
        tx.gasLimit = tx.gas;
        tx.gasPrice = utils.bigNumberify(tx.gasPrice);
        tx.value = utils.bigNumberify(tx.value);
        delete tx.gas;
        delete tx.from;
        delete tx.hash;
        return tx;
      },
      connectToWeb3(browserHook) {
        try{
        const result = {
          provider: null,
          web3Available: false,
        };

        if (typeof browserHook !== 'undefined') {
          // Use Mist/MetaMask's provider
          result.provider = new ethers.providers.Web3Provider(browserHook.currentProvider);
          result.web3Available = true;
        } else {
          console.error('Please set up your MetaMask network.');
          console.error('Read the instructions in MultiBaas > Account > Connecting to Geth');
        }
        return result;
      }
      catch (err) {
        console.error("Please set up your Metamask network.")
      }
      },
      createAxiosInstance(baseURL, apiKey) {
        return axios.create({
          baseURL,
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          timeout: 1000,
        });
      },
    };
  },
};
