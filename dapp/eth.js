//------------------------
// Web3 연결
//------------------------
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
var Web3EthPersonal = require('web3-eth-personal');
var personal = new Web3EthPersonal("http://127.0.0.1:8545");
const TokenContractAddress = "0x77ca9d954bb80627d27f705a1925045ea47c7312";
const MeetContractAddress = "0xca144fa1c3babad15031460add0dcfdf9e93f15b";


var MeetTokenAbi =[
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "minus",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "add",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "tokenName",
				"type": "string"
			},
			{
				"name": "tokenSymbol",
				"type": "string"
			},
			{
				"name": "decimalUnits",
				"type": "uint8"
			},
			{
				"name": "initialSupply",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	}
]
var TokenContract = web3.eth.contract(MeetTokenAbi).at(TokenContractAddress);

var MeetAbi =[
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Ether_To_Token",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Token_To_Ether",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			}
		],
		"name": "Sign_up",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Participate",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "MeetToken",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_addressOfTokenUsedAsReward",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
];
var Meet = web3.eth.contract(MeetAbi).at(MeetContractAddress);

web3.eth.defaultAccount = web3.eth.accounts[0];

//----------------------------
// 토큰 명부 조회 (BalanceOf)
//----------------------------
exports.getTokenAmount = function (address) {
    //+++++++  STEP 4. Get 실습 ++++++++++++
		console.log("eth getTokenAmount address " + address);
    return TokenContract.balanceOf(address);
};

//----------------------------
// 이더 잔액 조회
//----------------------------
exports.getBalance = function (address) {
    //+++++++  STEP 4. Get 실습 ++++++++++++
    return web3.fromWei(web3.eth.getBalance(address), 'ether');
};

//----------------------------
// 계정 언락
//----------------------------
exports.unlockAccount = function (from, passphase) {
    web3.personal.unlockAccount(from, passphase,function (err, hash){
			if(err){
				console.log('invalid passphase');
			}else{

			}
		});
};

//----------------------------
// 이더 트랜잭션 수행
//----------------------------
exports.sendTransaction = function(from, to, value, gas, callback) {
    //+++++++  STEP 4. SET 실습 ++++++++++++
    web3.eth.sendTransaction({
        from: from,
        to: to,
        value: web3.toWei(value,'ether'),
        gas: gas}, function (err, hash) {
        if (err) {
            console.log(err);
            return callback(err, '');
        } else {
    				console.log("* sendTransaction txhash : " + hash );
            return callback(null, hash);
        }
    });
};

//----------------------------
// 이벤트 모니터링
//----------------------------
exports.fundTransferEvent = function( callback ) {
    //+++++++  STEP 5. Event Watch 실습 ++++++++++++
    CrowdFundContract.FundTransfer().watch(function(error, res){
        if (error)
        {
      			console.log(error);
            return callback(err, '');
        } else
        {
            console.log(res);
            return callback(null, res);
        }
    });
};

//=================================
//어카운트 생성
//=================================

exports.addressCreate = function(password,database,email){
	this.unlockAccount(web3.eth.defaultAccount,'',30);
	console.log(email + "@@@@");
	var _promise =  personal.newAccount(password).then(function(text){
		//디비저장 여기에서 가능
		console.log("address : " + text);
		database.db.collection("users").updateOne({'email' : email},{$set : {'address' : text}},function(err,res){
			if(err) throw err;
		});
		Meet.Sign_up(text);
		console.log("100코인 전송 완료");


	})
}

exports.ether_to_token = function(address,value){
	web3.eth.sendTransaction({
			from: address,
			to: web3.eth.defaultAccount,
			value: web3.toWei(value,'ether'),
			gas: 28000}, function (err, hash) {
			if (err) {
					console.log('not enough ether');
			} else {
					Meet.Ether_To_Token(address,value);
					console.log(address + "에 " + value*10 + "토큰 전송 완료" );
			}
	});
}

exports.token_to_ether = function(address,value){
	web3.eth.sendTransaction({
			from: web3.eth.defaultAccount,
			to: address,
			value: web3.toWei(value/10,'ether'),
			gas: 28000}, function (err, hash) {
			if (err) {
					console.log('not enough token');
			} else {
					Meet.Token_To_Ether(address,value);
					console.log(address + "에 " + value/10 + "이더 전송 완료");
			}
	});
}

exports.join = function(address,pw,value){
	this.unlockAccount(address,pw,30);
	this.unlockAccount(web3.eth.defaultAccount,'',30);
	Meet.Participate(address,value);
	console.log(address + "에서 " + value + "토큰 차감");
}
