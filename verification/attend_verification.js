module.exports = {
    send: function (email) {
        //nodemailer모듈 불러오기
        var nodemailer = require('nodemailer');

        //transporter객체를 만드는 nodemailer의 createTransport메소드의 인자로 사용된다. 


        //var transporter를 exports 객체 속성으로해야 모듈로 쓸수 있다. (다른것도 exports로 해야하는지 모름..)
        var transporter = nodemailer.createTransport({
            service: 'naver',
            auth: {
                user: 'moim_9001@naver.com',
                pass: 'spongebob5959'
            }
        });

        //메일 내용
        var mailOption = {
            from: 'moim_9001@naver.com',
            to: 'bmofinnjake08@gmail.com', //받는 부분을 user.email로 
            subject: 'MOIM 출석 인증 링크입니다',
            html: '<h1>출석 인증 QR코드</h1><p>출석 인증으로 모임 참여도가 올라갑니다!<br><a href="http://m.site.naver.com/0pgbu"><img src="https://qrcodethumb-phinf.pstatic.net/20180901_253/moim_9001_1535777347988k9o6G_PNG/0pgbu.png"/></a></br></p>'
        };


        //메일 전송하는 부분
        transporter.sendMail(mailOption, (err, info) => {
            if (err) {
                console.log('failed..' + err);
            } else {
                console.log('출석 메일보내기 성공!!' + info.response);
            }

            transporter.close();
        });

    }
}
