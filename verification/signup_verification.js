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
            to: email,  
            subject: 'MOIM계정 회원가입 승인 링크입니다',
            html: '<h1>MOIM의 회원이 되신것을 환영합니다!</h1><p>MOIM에서 당신의 모임을 찾아 참여하세요! 모임을 완주하면 참여도에따라 보상 토큰을 받을 수 있습니다:)</p>'
        };


        //메일 전송하는 부분
        transporter.sendMail(mailOption, (err, info) => {
            if (err) {
                console.log('failed..' + err);
            } else {
                console.log('회원가입 메일보내기 성공!!' + info.response);
            }

            transporter.close();
        });

    }
}
