const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

// Initialize web3 with provider from env
const web3 = new Web3(process.env.WEB3_PROVIDER);

// Load contract ABI
const contractABIPath = path.join(__dirname, '../contracts/abi/EventTicketNFT.json');
const contractABI = JSON.parse(fs.readFileSync(contractABIPath, 'utf8'));

/**
 * Deploy a new NFT contract for an event
 * @param {Object} eventData - Event data for contract deployment
 * @param {String} organizerAddress - Blockchain address of event organizer
 * @param {String} privateKey - Private key for transaction signing
 * @returns {Object} Deployed contract info
 */
const deployEventContract = async (eventData, organizerAddress, privateKey) => {
  try {
    // Initialize account from private key
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    
    // Create contract instance
    const eventContract = new web3.eth.Contract(contractABI);
    
    // Prepare contract deployment
    const deployTx = eventContract.deploy({
      data: '0x' + fs.readFileSync(path.join(__dirname, '../contracts/bytecode/EventTicketNFT.bin'), 'utf8'),
      arguments: [
        `${eventData.title} Tickets`, // NFT Name
        `${eventData.title.substring(0, 3).toUpperCase()}TIX`, // NFT Symbol
        eventData.title, // Event Name
        eventData.date.toISOString(), // Event Date
        eventData.location, // Event Location
        eventData.ticketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0), // Max Tickets
        web3.utils.toWei(String(eventData.ticketTypes[0].price), 'ether'), // Base Ticket Price
        organizerAddress // Organizer Address
      ]
    });
    
    // Estimate gas
    const gas = await deployTx.estimateGas({ from: account.address });
    
    // Deploy contract
    const deployedContract = await deployTx.send({
      from: account.address,
      gas,
      gasPrice: await web3.eth.getGasPrice()
    });
    
    return {
      contractAddress: deployedContract.options.address,
      transactionHash: deployedContract.transactionHash,
      blockNumber: deployedContract.blockNumber
    };
  } catch (error) {
    console.error('Contract deployment error:', error);
    throw new Error('Failed to deploy event contract');
  }
};

/**
 * Mint a new NFT ticket
 * @param {String} contractAddress - Address of deployed NFT contract
 * @param {String} userAddress - Address of ticket buyer
 * @param {Object} ticketData - Ticket data
 * @param {String} privateKey - Private key for transaction signing
 * @returns {Object} Minted ticket info
 */
const mintTicket = async (contractAddress, userAddress, ticketData, privateKey) => {
  try {
    // Initialize account from private key
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    
    // Create contract instance
    const ticketContract = new web3.eth.Contract(contractABI, contractAddress);
    
    // Prepare metadata
    const metadata = JSON.stringify({
      ticketType: ticketData.ticketType,
      eventId: ticketData.eventId,
      price: ticketData.price,
      issueDate: new Date().toISOString()
    });
    
    // Ticket token URI (would typically point to IPFS in production)
    const tokenURI = `https://eventgo.io/api/tickets/metadata/${ticketData._id}`;
    
    // Mint ticket
    const mintTx = await ticketContract.methods.mintTicket(
      userAddress,
      tokenURI,
      metadata
    ).send({
      from: account.address,
      value: web3.utils.toWei(String(ticketData.price), 'ether'),
      gas: 500000,
      gasPrice: await web3.eth.getGasPrice()
    });
    
    // Get token ID from event logs
    const tokenId = mintTx.events.TicketMinted.returnValues.tokenId;
    
    return {
      tokenId,
      transactionHash: mintTx.transactionHash,
      blockNumber: mintTx.blockNumber
    };
  } catch (error) {
    console.error('Ticket minting error:', error);
    throw new Error('Failed to mint ticket NFT');
  }
};

/**
 * Transfer ticket ownership
 * @param {String} contractAddress - Address of deployed NFT contract
 * @param {String} fromAddress - Current owner address
 * @param {String} toAddress - New owner address
 * @param {String} tokenId - NFT token ID
 * @param {String} privateKey - Private key of current owner
 * @returns {Object} Transfer transaction info
 */
const transferTicket = async (contractAddress, fromAddress, toAddress, tokenId, privateKey) => {
  try {
    // Initialize account from private key
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    
    // Create contract instance
    const ticketContract = new web3.eth.Contract(contractABI, contractAddress);
    
    // Transfer ticket
    const transferTx = await ticketContract.methods.safeTransferFrom(
      fromAddress,
      toAddress,
      tokenId
    ).send({
      from: account.address,
      gas: 200000,
      gasPrice: await web3.eth.getGasPrice()
    });
    
    return {
      transactionHash: transferTx.transactionHash,
      blockNumber: transferTx.blockNumber
    };
  } catch (error) {
    console.error('Ticket transfer error:', error);
    throw new Error('Failed to transfer ticket NFT');
  }
};

/**
 * Mark a ticket as used
 * @param {String} contractAddress - Address of deployed NFT contract
 * @param {String} tokenId - NFT token ID
 * @param {String} privateKey - Private key of organizer or admin
 * @returns {Object} Transaction info
 */
const useTicket = async (contractAddress, tokenId, privateKey) => {
  try {
    // Initialize account from private key
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    
    // Create contract instance
    const ticketContract = new web3.eth.Contract(contractABI, contractAddress);
    
    // Mark ticket as used
    const useTx = await ticketContract.methods.useTicket(tokenId).send({
      from: account.address,
      gas: 100000,
      gasPrice: await web3.eth.getGasPrice()
    });
    
    return {
      transactionHash: useTx.transactionHash,
      blockNumber: useTx.blockNumber
    };
  } catch (error) {
    console.error('Ticket usage marking error:', error);
    throw new Error('Failed to mark ticket as used on blockchain');
  }
};

module.exports = {
  web3,
  deployEventContract,
  mintTicket,
  transferTicket,
  useTicket
}; 