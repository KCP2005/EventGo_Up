// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EventTicketNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Event information
    string public eventName;
    string public eventSymbol;
    string public eventDate;
    string public eventLocation;
    uint256 public maxTickets;
    uint256 public availableTickets;
    bool public saleActive;
    
    // Ticket price in wei
    uint256 public ticketPrice;
    
    // Mapping to track if a ticket has been used
    mapping(uint256 => bool) public ticketUsed;
    
    // Mapping to track ticket metadata (type, seat, etc)
    mapping(uint256 => string) public ticketMetadata;
    
    // Event organizer address
    address public organizer;
    
    // Events
    event TicketMinted(address indexed to, uint256 tokenId, string metadata);
    event TicketUsed(uint256 tokenId, address indexed user);
    event TicketTransferred(uint256 tokenId, address indexed from, address indexed to);
    
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _eventName,
        string memory _eventDate,
        string memory _eventLocation,
        uint256 _maxTickets,
        uint256 _ticketPrice,
        address _organizer
    ) ERC721(_name, _symbol) {
        eventName = _eventName;
        eventDate = _eventDate;
        eventLocation = _eventLocation;
        maxTickets = _maxTickets;
        availableTickets = _maxTickets;
        ticketPrice = _ticketPrice;
        organizer = _organizer;
        saleActive = true;
        
        // Transfer ownership to the organizer
        transferOwnership(_organizer);
    }
    
    // Modifier to check if sender is organizer
    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Only event organizer can call this function");
        _;
    }
    
    // Function to mint a new ticket NFT
    function mintTicket(address to, string memory uri, string memory metadata) 
        public 
        payable 
        returns (uint256) 
    {
        require(saleActive, "Ticket sale is not active");
        require(availableTickets > 0, "No more tickets available");
        require(msg.value >= ticketPrice, "Insufficient payment");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, uri);
        
        // Store ticket metadata
        ticketMetadata[newTokenId] = metadata;
        
        // Update available tickets
        availableTickets--;
        
        emit TicketMinted(to, newTokenId, metadata);
        
        return newTokenId;
    }
    
    // Function to mark ticket as used (only by owner or organizer)
    function useTicket(uint256 tokenId) public {
        require(_exists(tokenId), "Ticket does not exist");
        require(
            ownerOf(tokenId) == msg.sender || msg.sender == organizer,
            "Only ticket owner or organizer can mark as used"
        );
        require(!ticketUsed[tokenId], "Ticket already used");
        
        ticketUsed[tokenId] = true;
        
        emit TicketUsed(tokenId, msg.sender);
    }
    
    // Function to set sale status (only by organizer)
    function setSaleStatus(bool _active) public onlyOrganizer {
        saleActive = _active;
    }
    
    // Function to withdraw funds (only by organizer)
    function withdraw() public onlyOrganizer {
        payable(organizer).transfer(address(this).balance);
    }
    
    // Override transfer function to emit custom event
    function transferFrom(address from, address to, uint256 tokenId) public override {
        super.transferFrom(from, to, tokenId);
        emit TicketTransferred(tokenId, from, to);
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId) public override {
        super.safeTransferFrom(from, to, tokenId);
        emit TicketTransferred(tokenId, from, to);
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override {
        super.safeTransferFrom(from, to, tokenId, data);
        emit TicketTransferred(tokenId, from, to);
    }
} 