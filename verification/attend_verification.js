//출석 인증   
//3자리 랜덤 정수 OTP생성
module.exports = {
    genRandom: function () {
        var rand = 0;
        var otp = ""; //3자리 랜덤수 저장(000~999까지)
        for (var i = 0; i < 3; i++) {
            rand = 0;
            rand = Math.floor(Math.random() * (9 - 0 + 1)) + 0; //0~9 랜덤 숫자 
            console.log(rand);
            otp = otp + rand;
        }
        return otp;
    }
}


