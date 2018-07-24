pragma solidity ^0.4.23;

import "./Verifier.sol";

contract WorglCoin {

  /***********************************/
  /******* CONTRACT ATTRIBUTES *******/
  /***********************************/

  struct Consumer {
    bool isSet;
    address consumerAddress;
    uint tokenBalance;
    uint[] allOrders;
  }

  struct Business {
    bool isSet;
    address businessAddress;
    uint tokenBalance;
    uint[] itemsSupplied;
    bool complaintAgainst;
    uint noOfComplaints;
    uint[] allOrders;
    string name;
  }

  struct Order {
    uint orderID;
    uint itemID;
    address customerAddress;
    uint quantityOrdered;
    bool sent;
  }

  struct Item {
    uint itemID;
    string picture;
    string name;
    uint quantity;
    uint price; // in tokens
    address supplier;
  }

  address public master;
  uint public tokenValue; // measured in Wei
  uint public topUpLevel;

  mapping(address => Consumer) public consumerDetails;
  mapping(address => Business) public businessDetails;
  mapping(uint => Item) public allItems;
  mapping(uint => Order) public allOrders;

  address[] consumerAddresses;
  address[] businessAddresses;
  uint[] itemIDs;
  uint[] orderIDs;

  uint public noOfConsumers;
  uint public noOfBusinesses;
  uint public noOfItems;
  uint public noOfOrders;
  mapping(bytes32 => bool) eligibleConsumers;
  uint public balance;

  /***********************************/
  /************* MODIFIERS ***********/
  /***********************************/

  modifier isOwner() {
    require(msg.sender == master);
    _;
  }

  modifier isConsumer() {
    require(consumerDetails[msg.sender].isSet);
    _;
  }

  modifier isBusiness() {
    require(businessDetails[msg.sender].isSet);
    _;
  }

  /***********************************/
  /************** EVENTS *************/
  /***********************************/

  event ConsumerAdded(address consumerAddress);
  event BusinessAdded(address businessAddress);
  event ItemAdded(uint itemID);
  event OrderAdded(uint orderID, address businessAddress);

  event TokenDistribution();
  event TopUp();

  event ConsumerChange(address consumerAddress);
  event BusinessChange(address businessAddress);
  event ItemChange(uint itemID);
  event OrderChange(uint orderID, address businessAddress);

  /***********************************/
  /********* PUBLIC FUNCTIONS ********/
  /***********************************/

  /*
  * @dev                          Constructor for WorglCoin
  * @param  _tokenValue           the value of each coin measured in Wei
  * @param  _topUpLevel           the number of tokens that each recipient will be topped up to
  */
  constructor(uint _tokenValue, uint _topUpLevel) public {
    master = msg.sender;
    noOfConsumers = 0;
    noOfBusinesses = 0;
    noOfItems = 0;
    balance = 0;
    tokenValue = _tokenValue;
    topUpLevel = _topUpLevel;
  }

  /*
  * @dev                        allows the owner of the contract to change the address of the owner
  * @param    newOwner          the Ethereum address of the new owner
  */
  function changeOwner(address newOwner) public isOwner {
    master = newOwner;
  }

  /*
  * @dev                        allows the owner of the contract to add an eligible consumer detail hash
  * @param    hash              SHA-256 hash of the details of an eligible citizen
  */
  function addConsumerHash(bytes32 hash) public isOwner {
    require(!eligibleConsumers[hash]);
    eligibleConsumers[hash] = true;
  }

  /*
  * @dev                          allows the owner of the contract to add a token recipient
  * @param    hash                SHA-256 hash of the consumer signing up
  */
  function consumerSignUp(bytes32 hash) public {
    // Check that the address is not already in the system
    require(!consumerDetails[msg.sender].isSet);

    // The problem here is that someone could just read hashes and then enter them.
    // If you enter details (name, address etc.) people will be able to see this in the transaction hash
    // Need to think of a way to do this with privacy and compare against eligible data hashes
    require(eligibleConsumers[hash]);

    // Add the consumer to the database
    Consumer memory newConsumer;
    newConsumer.isSet = true;
    newConsumer.consumerAddress = msg.sender;
    newConsumer.tokenBalance = 0;
    consumerDetails[msg.sender] = newConsumer;

    // Increment the number of consumers and trigger the event
    noOfConsumers = add(noOfConsumers, 1);
    consumerAddresses.push(msg.sender);
    emit ConsumerAdded(msg.sender);
  }

  /*
  * @dev                        allows the owner of the contract to add a business
  * @param    _consumerAddress  the Ethereum address of the business to be added
  * @param    _name             the name of the business to be added
  */
  function addBusiness(address _businessAddress, string _name) public isOwner {
    // Check that the address is not already in the system
    require(!businessDetails[_businessAddress].isSet);

    // Add the business to the database
    Business memory newBusiness;
    newBusiness.isSet = true;
    newBusiness.businessAddress = _businessAddress;
    newBusiness.tokenBalance = 0;
    newBusiness.complaintAgainst = false;
    newBusiness.noOfComplaints = 0;
    newBusiness.name = _name;
    businessDetails[_businessAddress] = newBusiness;

    // Increment the number of businesses and trigger the event
    noOfBusinesses = add(noOfBusinesses, 1);
    businessAddresses.push(_businessAddress);
    emit BusinessAdded(_businessAddress);
  }

  /*
  * @dev                       allows the owner of the contract to change the top up balance
  * @param    newTopUpLevel    the new top up balance
  */
  function changeTokenBalance(uint newTopUpLevel) public isOwner {
    topUpLevel = newTopUpLevel;
    emit TopUp();
  }

  /*
  * @dev                       allows the owner of the contract to change the value of the tokens
  * @param    newValue         the new value that the tokens can be exchanged for in Wei
  */
  function changeTokenValue(uint newValue) public isOwner {
    tokenValue = newValue;
    emit TopUp();
  }

  /*
  * @dev    allows the owner of the contract to reset all token balances for consumers
  */
  function resetTokenBalance() public isOwner payable {

    // Reset all consumer balances
    for(uint i = 0; i<noOfConsumers; i++) {
      consumerDetails[consumerAddresses[i]].tokenBalance = topUpLevel;
    }

    // Pay out all funds to business
    for (uint j = 0; j<noOfBusinesses; j++) {
      businessDetails[businessAddresses[j]].tokenBalance = 0;
      businessAddresses[j].transfer(mul(businessDetails[businessAddresses[j]].tokenBalance, tokenValue));
    }

    emit TokenDistribution();
  }

  /*
  * @dev                          allows anyone to view the token balance of another consumer
  * @param    address     the new value that the tokens can be exchanged for in Wei
  * @return   balances            the balance of the address
  */
  function getTokenBalance(address holderAddress) public view returns (string, uint) {
    if(consumerDetails[holderAddress].isSet){
      return ('Consumer',
      consumerDetails[holderAddress].tokenBalance);
    }

    else if(businessDetails[holderAddress].isSet){
      return ('Business',
      businessDetails[holderAddress].tokenBalance);
    }

    else if(holderAddress == master){
      return ('Contract Owner',
      0);
    }

    else {
      return ('Not Signed Up',
      0);
    }
  }

  /*
  * @dev                          allows a business to list an item for sale
  * @param    _name               the name of the item for sale
  * @param   _quantity            the quantity of the item for sale
  * @param   _price               the number of tokens required to buy the item
  */
  function sellItem(string _name, string _picture, uint _quantity, uint _price) public isBusiness {
    // Have to ensure the business has no complaints against it to list items
    require(!businessDetails[msg.sender].complaintAgainst);

    // Add the item to the database
    uint itemIDNumber = noOfItems;
    Item memory newItem;
    newItem.itemID = itemIDNumber;
    newItem.name = _name;
    newItem.picture = _picture;
    newItem.quantity = _quantity;
    newItem.price = _price;
    newItem.supplier = msg.sender;
    allItems[itemIDNumber] = newItem;

    // Increment the number of items and trigger the event
    businessDetails[msg.sender].itemsSupplied.push(itemIDNumber);
    itemIDs.push(itemIDNumber);
    noOfItems = add(noOfItems, 1);
    emit ItemAdded(itemIDNumber);
  }


  /*
  * @dev                          allows a consumer to submit an order for an item
  * @param    _itemID             the ID of the item wishing to be bought
  * @return   _quantity           the quantity of the item wanting to be bought
  */
  function buyItem(uint _itemID, uint _quantity) public isConsumer {
    uint totalCost = allItems[_itemID].price * _quantity;
    require(consumerDetails[msg.sender].tokenBalance >= totalCost);

    uint _orderID = noOfOrders;

    // Add the order to the database
    Order memory newOrder;
    newOrder.orderID = _orderID;
    newOrder.itemID = _itemID;
    newOrder.customerAddress = msg.sender;
    newOrder.quantityOrdered = _quantity;
    newOrder.sent = false;
    allOrders[_orderID] = newOrder;

    // Increment the number of orders and trigger the event
    noOfOrders = add(noOfOrders, 1);
    orderIDs.push(_orderID);
    businessDetails[allItems[_itemID].supplier].allOrders.push(_orderID);

    // Add to consumers orders
    consumerDetails[msg.sender].allOrders.push(_orderID);

    // Decrement the tokens from the consumers balance
    consumerDetails[msg.sender].tokenBalance = sub(consumerDetails[msg.sender].tokenBalance, totalCost);

    // Decrement the quantity from the total quantity of items available
    allItems[_itemID].quantity = sub(allItems[_itemID].quantity, _quantity);
    emit OrderAdded(_orderID, allItems[_itemID].supplier);
    emit ItemChange(_itemID);
  }

  /*
  * @dev                          allows a business to mark an order as sent
  * @param    _orderID            the ID of the order being mark as sent
  */
  function markOrderAsSent(uint _orderID) public isBusiness {
    // Make sure it is the actual supplier marking an order as sent
    require(allItems[allOrders[_orderID].itemID].supplier == msg.sender);
    allOrders[_orderID].sent = true;

    // Transfer tokens to the business
    uint totalRevenue = allItems[allOrders[_orderID].itemID].price * allOrders[_orderID].quantityOrdered;
    businessDetails[msg.sender].tokenBalance = add(businessDetails[msg.sender].tokenBalance, totalRevenue);
    emit OrderChange(_orderID, msg.sender);
  }

  /*
  * @dev                          allows a customer to complain about a business if they haven't received item
  * @param    _orderID            the ID of the order that is being complained about
  */
  function makeComplaint(uint _orderID) public isConsumer {
    require(allOrders[_orderID].customerAddress == msg.sender);
    require(allOrders[_orderID].sent);
    businessDetails[allItems[allOrders[_orderID].itemID].supplier].complaintAgainst = true;
    businessDetails[allItems[allOrders[_orderID].itemID].supplier].noOfComplaints = add(businessDetails[allItems[allOrders[_orderID].itemID].supplier].noOfComplaints,1);
    emit OrderChange(_orderID, allItems[allOrders[_orderID].itemID].supplier);
  }

  /*
  * @dev                          allows the owner of the contract to reset a business complaint
  * @param    _businessAddress    the address of the business
  */
  function resetComplaint(uint _orderID) public {
    require(msg.sender == allOrders[_orderID].customerAddress);
    businessDetails[allItems[allOrders[_orderID].itemID].supplier].noOfComplaints =
      sub(businessDetails[allItems[allOrders[_orderID].itemID].supplier].noOfComplaints, 1);

    if (businessDetails[allItems[allOrders[_orderID].itemID].supplier].noOfComplaints == 0) {
      businessDetails[allItems[allOrders[_orderID].itemID].supplier].complaintAgainst = false;
    }
    emit OrderChange(_orderID, allItems[allOrders[_orderID].itemID].supplier);
  }

  /*
  * @dev                          allows you to return all consumer addresses
  */
  function getAllConsumers() public view returns(address[]) {
    return consumerAddresses;
  }

  /*
  * @dev                          allows you to return all business addresses
  */
  function getAllBusinesses() public view returns(address[]) {
    return businessAddresses;
  }

  /*
  * @dev                          allows you to return all order IDs for a consumer or business
  * @param    _consumerAddress    the address of the consumer or business
  */
  function getAllOrders(address holderAddress) public view returns(uint[]) {
    if(consumerDetails[holderAddress].isSet){
      return consumerDetails[holderAddress].allOrders;
    }

    else if(businessDetails[holderAddress].isSet){
      return businessDetails[holderAddress].allOrders;
    }

    else {
      return;
    }
  }

  /*
  * @dev                          allows you to return all items
  */
  function getAllItems() public view returns(uint[]) {
    return itemIDs;
  }

  /*
  * @dev                          allows you to return all order details
  * @param    _orderID            the ID of the order
  */
  function getOrderDetails(uint _orderID) public view returns(uint, address, uint, bool) {
    return  ( allOrders[_orderID].itemID,
              allOrders[_orderID].customerAddress,
              allOrders[_orderID].quantityOrdered,
              allOrders[_orderID].sent);
  }

  /*
  * @dev                         allows you to return all item details
  * @param    _itemID            the ID of the item
  */
  function getItemDetails(uint _itemID) public view returns(string, string, uint, uint, address) {
    return  ( allItems[_itemID].name,
              allItems[_itemID].picture,
              allItems[_itemID].quantity,
              allItems[_itemID].price,
              allItems[_itemID].supplier);
  }

  /*
  * @dev                         allows you to return all item details
  * @param    _businessAddress   the addres of the business
  */
  function getBusinessDetails(address _businessAddress) public view returns(uint, uint[], bool, uint, uint[], string) {
    return  ( businessDetails[_businessAddress].tokenBalance,
              businessDetails[_businessAddress].itemsSupplied,
              businessDetails[_businessAddress].complaintAgainst,
              businessDetails[_businessAddress].noOfComplaints,
              businessDetails[_businessAddress].allOrders,
              businessDetails[_businessAddress].name);
  }

  // `fallback` function called when eth is sent to Payable contract
    function topUpContract() public payable isOwner {
      balance = add(balance, msg.value);
      emit TopUp();
  }


  /***********************************/
  /******** INTERNAL FUNCTIONS *******/
  /***********************************/

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
    // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
    c = a + b;
    assert(c >= a);
    return c;
  }

}
