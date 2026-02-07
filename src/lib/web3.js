import { ethers } from 'ethers';

const BOT_WALLET_ADDRESS = "0x24c80f19649c0Da8418011eF0B6Ed3e22007758c"

export const connectWallet = async () => {
  try {
    
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
    }

    
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }],
    });
    
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const address = await signer.getAddress()

    return { 
      success: true,
      provider, 
      signer, 
      address 
    };
  } catch (error) {
    console.error("Wallet connection error:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

export const lockInFunds = async (amount) => {
  try { 
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    const valueToSend = ethers.parseEther(amount.toString());

    const tx = await signer.sendTransaction({
      to: BOT_WALLET_ADDRESS,
      value: valueToSend
    });
    
    console.log("Transaction submitted:", tx.hash);
    await tx.wait();

    return { 
      success: true, 
      hash: tx.hash 
    }
  } catch (error) {
    console.error("Lock funds error:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

export const getBalance = async (address) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const balance = await provider.getBalance(address)
    return ethers.formatEther(balance)
  } catch (error) {
    console.error("Get balance error:", error);
    return "0"
  }
}
