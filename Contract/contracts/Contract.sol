// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import "@layerzerolabs/solidity-examples/contracts/token/onft721/interfaces/IONFT721.sol";
import "@layerzerolabs/solidity-examples/contracts/token/onft721/ONFT721Core.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract LZContract is ONFT721Core, IONFT721, ERC721URIStorage {
    uint private CHAIN_ID;

    event TokenCreated(uint indexed tokenId, address indexed owner, string tokenURI, uint price);
    event MarketSale(uint indexed tokenId, address indexed seller, address indexed buyer, uint price, uint saleValue);
    event TokenSent(uint indexed tokenId, address indexed sender, uint16 indexed dstChainId, string tokenURI);
    event TokenReceived(uint indexed tokenId, address indexed sender, string tokenURI);
    event MarketItemCreated(uint indexed tokenId, address seller, address owner, uint price, bool sold);
    event LzReceive(bytes indexed payload);

    struct MarketItem {
        uint tokenId;
        address payable seller;
        address payable owner;
        uint price;
        bool sold;
        uint creationTimestamp;
    }

    mapping(uint => MarketItem) private idToMarketItem;
    mapping(uint => address) public lockedOwnerToken;
    mapping(uint => uint[]) private rangeToTokens;
    mapping(uint => uint[]) private lengthMarketTokens;

    constructor(
        string memory _name,
        string memory _symbol,
        uint _minGasToTransfer,
        address _lzEndpoint,
        uint _chainId
    ) ERC721(_name, _symbol) ONFT721Core(_minGasToTransfer, _lzEndpoint) {
        CHAIN_ID = _chainId;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ONFT721Core, ERC721URIStorage, IERC165) returns (bool) {
        return interfaceId == type(IONFT721).interfaceId || super.supportsInterface(interfaceId);
    }

    //CreateToken
    function createToken(string memory tokenURI, uint price) external payable returns (uint) {
        bytes32 hash = keccak256(abi.encodePacked(block.timestamp, msg.sender, blockhash(block.number - 1), price));
        uint newTokenId = uint(hash) % 10000000;

        require(!_exists(newTokenId), "Token ID already exists");
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        emit TokenCreated(newTokenId, msg.sender, tokenURI, price);

        idToMarketItem[newTokenId] = MarketItem(newTokenId, payable(address(0)), payable(msg.sender), price, false, block.timestamp);

        lengthMarketTokens[CHAIN_ID].push(newTokenId);

        return newTokenId;
    }

    //createMarketSale
    function createMarketSale(uint tokenId, uint saleValue) public payable nonReentrant {
        uint price = idToMarketItem[tokenId].price;
        uint totalAmount = price + saleValue;
        require(msg.value == totalAmount, "Please submit the asking price in order to complete the purchase");

        // Transfer price to seller
        (bool sellerTransferSuccess, ) = idToMarketItem[tokenId].seller.call{value: price}("");
        require(sellerTransferSuccess, "Seller transfer failed");

        // Transfer saleValue to contract
        (bool listingTransferSuccess, ) = address(this).call{value: saleValue}("");
        require(listingTransferSuccess, "Listing transfer failed");

        emit MarketSale(tokenId, idToMarketItem[tokenId].seller, msg.sender, price, saleValue);

        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));

        _transfer(address(this), msg.sender, tokenId);
    }

    //Send0nft
    function sendOnft(
        uint16 destChainId,
        uint tokenId,
        bytes memory adapter,
        uint sendValue
    ) external payable nonReentrant {
        require(idToMarketItem[tokenId].owner == msg.sender, "Only token owner can perform this operation");

        string memory _tokenURI = tokenURI(tokenId);
        //bytes memory _tokenURIBytes = bytes(_tokenURI);
        address _tokenOwner = ownerOf(tokenId);
        //bytes20 _tokenOwnerBytes = bytes20(_tokenOwner);

        bytes memory payload = abi.encode(_tokenURI, _tokenOwner, tokenId);

        // Update the locked owner every time.
        lockedOwnerToken[tokenId] = _tokenOwner;
        // isTokenLocked[tokenId] = true;
        idToMarketItem[tokenId].owner = payable(address(0));
        transferFrom(msg.sender, address(this), tokenId);

        // uint sendValue = 0.0001 ether;

        // Transfer value to contract
        (bool appValueTransferSuccess, ) = address(this).call{value: sendValue}("");
        require(appValueTransferSuccess, "appValue transfer failed");

        uint bridgeValue = msg.value - sendValue;

        _lzSend(destChainId, payload, payable(msg.sender), address(0x0), adapter, bridgeValue);

        // _debitFrom(_tokenOwner, 0, bytes(""), tokenId);
        emit TokenSent(tokenId, msg.sender, destChainId, _tokenURI);
    }

    //lock onft
    function _debitFrom(
        address _from,
        uint16,
        bytes memory,
        uint _tokenId
    ) internal virtual override {}

    //recieve onft
    function _nonblockingLzReceive(
        uint16,
        bytes memory,
        uint64,
        bytes memory _payload
    ) internal override {
        emit LzReceive(_payload);

        recieveONFT(_payload);
    }

    function recieveONFT(bytes memory _payload) internal {
        (string memory _tokenURI, address _tokenOwner, uint _tokenId) = abi.decode(_payload, (string, address, uint));

        if (lockedOwnerToken[_tokenId] == _tokenOwner) {
            idToMarketItem[_tokenId].owner = payable(_tokenOwner);
            transferFrom(address(this), _tokenOwner, _tokenId);
        } else {
            _safeMint(_tokenOwner, _tokenId);
            _setTokenURI(_tokenId, _tokenURI);
            idToMarketItem[_tokenId] = MarketItem(_tokenId, payable(address(0)), payable(_tokenOwner), 0, false, block.timestamp);
            rangeToTokens[CHAIN_ID].push(_tokenId);
        }
        emit TokenReceived(_tokenId, _tokenOwner, _tokenURI);
    }

    function _creditTo(
        uint16,
        address _toAddress,
        uint _tokenId
    ) internal virtual override {}

    function fetchMarketItems() external view returns (MarketItem[] memory) {
        uint itemCount = 0;

        uint[] memory tokensInMarket = lengthMarketTokens[CHAIN_ID];

        for (uint i = 0; i < tokensInMarket.length; i++) {
            uint tokenId = tokensInMarket[i];
            if (idToMarketItem[tokenId].owner == address(this)) {
                itemCount += 1;
            }
        }

        // Loop through the tokens received from other chains
        uint[] memory tokensInCurrentRange = rangeToTokens[CHAIN_ID];
        for (uint i = 0; i < tokensInCurrentRange.length; i++) {
            uint currentId = tokensInCurrentRange[i];
            if (idToMarketItem[currentId].owner == address(this)) {
                itemCount += 1;
            }
        }

        // Initialize the items array with the calculated itemCount
        MarketItem[] memory items = new MarketItem[](itemCount);

        // Loop through your own NFTs on the current chain
        uint currentIndex = 0;
        for (uint i = 0; i < tokensInMarket.length; i++) {
            uint tokenId = tokensInMarket[i];
            if (idToMarketItem[tokenId].owner == address(this)) {
                items[currentIndex] = idToMarketItem[tokenId];
                currentIndex += 1;
            }
        }

        // Loop through the tokens received from other chains
        for (uint i = 0; i < tokensInCurrentRange.length; i++) {
            uint currentId = tokensInCurrentRange[i];
            if (idToMarketItem[currentId].owner == address(this)) {
                items[currentIndex] = idToMarketItem[currentId];
                currentIndex += 1;
            }
        }

        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() external view returns (MarketItem[] memory) {
        uint itemCount = 0;

        uint[] memory tokensInMarket = lengthMarketTokens[CHAIN_ID];

        for (uint i = 0; i < tokensInMarket.length; i++) {
            uint tokenId = tokensInMarket[i];
            if (idToMarketItem[tokenId].owner == msg.sender) {
                itemCount += 1;
            }
        }

        // Loop through the tokens received from other chains
        uint[] memory tokensInCurrentRange = rangeToTokens[CHAIN_ID];
        for (uint i = 0; i < tokensInCurrentRange.length; i++) {
            uint currentId = tokensInCurrentRange[i];
            if (idToMarketItem[currentId].owner == msg.sender) {
                itemCount += 1;
            }
        }

        // Initialize the items array with the calculated itemCount
        MarketItem[] memory items = new MarketItem[](itemCount);

        // Loop through your own NFTs on the current chain
        uint currentIndex = 0;
        for (uint i = 0; i < tokensInMarket.length; i++) {
            uint tokenId = tokensInMarket[i];
            if (idToMarketItem[tokenId].owner == msg.sender) {
                items[currentIndex] = idToMarketItem[tokenId];
                currentIndex += 1;
            }
        }

        // Loop through the tokens received from other chains
        for (uint i = 0; i < tokensInCurrentRange.length; i++) {
            uint currentId = tokensInCurrentRange[i];
            if (idToMarketItem[currentId].owner == msg.sender) {
                items[currentIndex] = idToMarketItem[currentId];
                currentIndex += 1;
            }
        }

        return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() external view returns (MarketItem[] memory) {
        uint itemCount = 0;

        uint[] memory tokensInMarket = lengthMarketTokens[CHAIN_ID];

        for (uint i = 0; i < tokensInMarket.length; i++) {
            uint tokenId = tokensInMarket[i];
            if (idToMarketItem[tokenId].seller == msg.sender) {
                itemCount += 1;
            }
        }

        // Loop through the tokens received from other chains
        uint[] memory tokensInCurrentRange = rangeToTokens[CHAIN_ID];
        for (uint i = 0; i < tokensInCurrentRange.length; i++) {
            uint currentId = tokensInCurrentRange[i];
            if (idToMarketItem[currentId].seller == msg.sender) {
                itemCount += 1;
            }
        }

        // Initialize the items array with the calculated itemCount
        MarketItem[] memory items = new MarketItem[](itemCount);

        // Loop through your own NFTs on the current chain
        uint currentIndex = 0;
        for (uint i = 0; i < tokensInMarket.length; i++) {
            uint tokenId = tokensInMarket[i];
            if (idToMarketItem[tokenId].seller == msg.sender) {
                items[currentIndex] = idToMarketItem[tokenId];
                currentIndex += 1;
            }
        }

        // Loop through the tokens received from other chains
        for (uint i = 0; i < tokensInCurrentRange.length; i++) {
            uint currentId = tokensInCurrentRange[i];
            if (idToMarketItem[currentId].seller == msg.sender) {
                items[currentIndex] = idToMarketItem[currentId];
                currentIndex += 1;
            }
        }

        return items;
    }

    //cancelListing
    function cancelListing(uint tokenId) external payable {
        require(idToMarketItem[tokenId].seller == msg.sender, "Only item owner can perform this operation");

        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = 0;
        idToMarketItem[tokenId].seller = payable(address(0));
        idToMarketItem[tokenId].owner = payable(msg.sender);

        _transfer(address(this), msg.sender, tokenId);
    }

    //reselToken
    function resellToken(uint tokenId, uint price) external payable {
        require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");

        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        _transfer(msg.sender, address(this), tokenId);
    }

    //withdraw
    function withdraw() public payable onlyOwner {
        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success);
    }

    receive() external payable {}
}
