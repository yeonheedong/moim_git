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
            subject: 'MOIM계정 비밀번호 수정 링크입니다',
            html: '<h1>MOIM 계정의 비밀번호를 수정하여 주세요.</h1><p>회원정보 수정 링크입니다.<a href="http://http://localhost:3000/profile_modify/${URL}">링크</a></p>’
        };


        //메일 전송하는 부분
        transporter.sendMail(mailOption, (err, info) => {
            if (err) {
                console.log('failed..' + err);
            } else {
                console.log('비밀번호 변경 메일보내기 성공!!' + info.response);
            }

            transporter.close();
        });

    }
}
