// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';
import './standards/xL2GovernanceERC20.sol';

contract HabtorFixedSavings is PausableUpgradeable {
    using SafeERC20 for IERC20;

    address public owner;

    address public l2Habtor;
    address public xHabtor;
    uint256 public totalStakeCount;
    // set closing time if you want to stop giving out interest anymore
    uint256 public stakingCloseTimestamp;
    uint256 public constant FLAT_INTEREST_PER_PERIOD = 22; // 0.22% scaled by ten thousand
    // a period is equal to LOCK_TIME + UNSTAKE_TIME
    uint256 public constant LOCK_TIME = 2 weeks;
    uint256 public constant UNSTAKE_TIME = 2 days;

    struct StakeData {
        uint256 stakeId;
        address account;
        uint256 depositAmount;
        uint256 depositTimestamp;
        bool isActive;
    }

    // stakeId to stakeData
    mapping (uint256 => StakeData) public stakeDataMap;
    // address to no of stakes
    mapping (address => uint256) public personalStakeCount;
    // address to pos to stakeId
    mapping (address => mapping(uint256 => uint256)) public personalStakePos;

    constructor() {
    }

    modifier onlyOwner() {
        require(msg.sender == owner || owner == address(0), 'Caller is not the owner');
        _;
    }

    modifier onlyNotInitialized() {
        require(address(l2Habtor) == address(0), "Contract has been initialized");
        _;
    }

    function transferOwnership(
        address _newOwner
    )
        public
        onlyOwner
    {
        require(_newOwner != address(0), 'New owner cannot be the zero address');
        owner = _newOwner;
    }

    function initialize(address l2HabtorAddress, address xHabtorAddress) public onlyOwner onlyNotInitialized initializer {
        l2Habtor = l2HabtorAddress;
        xHabtor = xHabtorAddress;
        owner = msg.sender;

        __Context_init_unchained();
        __Pausable_init_unchained();
    }

    function stake(uint256 _amount) external whenNotPaused {
        // change if want amounts to be in lot sizes
        require(_amount > 0, "Amount to stake cannot be zero");
        IERC20(l2Habtor).safeTransferFrom(msg.sender, address(this), _amount);

        totalStakeCount++;

        stakeDataMap[totalStakeCount] = StakeData({
            stakeId: totalStakeCount,
            account: msg.sender,
            depositAmount: _amount,
            depositTimestamp: block.timestamp,
            isActive: true
        });

        // map that count pos to index
        personalStakePos[msg.sender][personalStakeCount[msg.sender]] = totalStakeCount;
        // add personal count for each staker address too
        personalStakeCount[msg.sender] += 1;

        // mint xHABTOR for the user
        _mintXHABTOR(msg.sender, _amount);
    }

    function unstake(uint256 stakeId) public {
        StakeData storage stakeData = stakeDataMap[stakeId];
        require(stakeData.isActive, "Stake is not active or already claimed");
        require(stakeData.account == msg.sender, "Sender not owner of the funds");
        // unstake logic
        require((block.timestamp - stakeData.depositTimestamp)%(LOCK_TIME + UNSTAKE_TIME) > LOCK_TIME, "Not on unstaking period");

        stakeData.isActive = false;

        // burn xHabtor
        _burnXHABTOR(msg.sender, stakeData.depositAmount);

        IERC20(l2Habtor).safeTransfer(msg.sender, stakeData.depositAmount);
        // pay out interest, not compounded
        uint256 finalTimestamp = block.timestamp;
        if (stakingCloseTimestamp != 0) {
            finalTimestamp = stakingCloseTimestamp;
        }
        uint256 noOfPeriods = ((finalTimestamp - stakeData.depositTimestamp)/(LOCK_TIME + UNSTAKE_TIME)) + 1;
        uint256 totalReward = (stakeData.depositAmount * FLAT_INTEREST_PER_PERIOD * noOfPeriods) / 10000;
        IERC20(l2Habtor).safeTransfer(msg.sender, totalReward);
    }

    function _mintXHABTOR(address account, uint256 amount) internal {
        xL2GovernanceERC20(xHabtor).mint(account, amount);
    }

    function _burnXHABTOR(address account, uint256 amount) internal {
        xL2GovernanceERC20(xHabtor).burn(account, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function stopStakingContract() external onlyOwner {
        stakingCloseTimestamp = block.timestamp;
    }
}