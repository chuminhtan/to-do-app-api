const sgMail = require('@sendgrid/mail')
const  sendGridAPIKey = process.env.SEND_GRID_API_KEY

sgMail.setApiKey(sendGridAPIKey)

const sendWelcomeEmail = (email, name) => {
    console.log(process.env.EMAIL)
    sgMail.send({
        to: email,
        from: process.env.EMAIL,
        subject: `Chào Mừng ${name} Đến Với To-do App`,
        text: `Chào mừng ${name} đến với To-do App. Bạn có thể dùng tài khoản mới để truy cập và sử dụng ứng dụng`,
        html: `<div style="max-width: 500px;margin: 0 auto;"><img width="516" border="0" src="https://ci5.googleusercontent.com/proxy/4fAxIsZrJJnDp8Ywr9F2iusOLY_rPDauYNLmooDChExPyHwJnumqPbVmyZwkBiE59-ZX91taqxQae3xwrdlBy-FM3mRIMDLMyyThBA=s0-d-e1-ft#https://services.google.com/fh/files/emails/topdesign.png" alt="Ảnh bìa" style="width:100%;text-align:center;border:none" class="CToWUd"><h2 style="text-align: center;color: #00b08c;">To-do App</h2><p style="font-size: 20px;text-align: justify;line-height: 39px;color: gray;">Chào mừng ${name} đến với To-do App. Bạn có thể dùng tài khoản mới để truy cập và sử dụng ứng dụng. Chúc bạn có những trải nghiệm vui vẻ. Thân ái!</p><div dir="ltr"><div><br></div><img src="https://ci5.googleusercontent.com/proxy/XLyeAvKO3RUsTIklizG4PmgD0I4SKmwOTxXPuRpEh9EGFW_005Na5Sz0eXa4ij2pYuAzs6Qoy6EBWwY8a5bo6FZ8w_A9RjwXc3PNgnYzKKvFVFB_F4twiN4tDEYEZSN9PVicy7z3E6dTT0k98g3YsdJx2fSTSyuTaje7IIm7P2a7U2NtE4oWHrA7SfOESmyBhmOrfsGLQp_dpzSHLA=s0-d-e1-ft#https://docs.google.com/uc?export=download&amp;id=1XZ5xl-QbZY7UHtYQUkpkdBldN8U1znot&amp;revid=0B7Fw-jHCbyZVb3JweVNjd1JaMTl2RnVmaVpLcy9pU244NmpjPQ" class="CToWUd"><div><b>To-do App</b><div><div>Ho Chi Minh City, VN</div></div><a href="https://taan-todoapp.herokuapp.com/" style="color: #00b08c text-decoration: none;">https://taan-todoapp.herokuapp.com/</a></div></div></div>`
    }).then(()=>{
        console.log('Sended');
    }).catch(error=>{
        console.log(error.response.body)
    })
}

const sendResetPasswordEmail = (email, name, link) =>{
    sgMail.send({
        to: email,
        from: process.env.EMAIL,
        subject: `Reset Mật Khẩu To-do App`,
        text: `Xin chào ${name}, hãy nhấn vào liên kết sau để tiến hành thay đổi mật khẩu: ${link}`,
        html:`<div style="max-width: 500px; margin: 0 auto;"><img width="516"border="0"src="https://ci5.googleusercontent.com/proxy/4fAxIsZrJJnDp8Ywr9F2iusOLY_rPDauYNLmooDChExPyHwJnumqPbVmyZwkBiE59-ZX91taqxQae3xwrdlBy-FM3mRIMDLMyyThBA=s0-d-e1-ft#https://services.google.com/fh/files/emails/topdesign.png" alt="Ảnh bìa" style="width: 100%; text-align: center; border: none;"class="CToWUd"/><h2 style="text-align: center; color: #00b08c;">To-do App</h2><p style="font-size: 20px;text-align: justify;line-height: 39px;color: gray;">Xin chào ${name}, hãy nhấn vào liên kết sau để tiến hành thay đổi mật khẩu.</p><br><a href="${link}">${link}</a><p style="font-size: 15px;text-align: justify;line-height: 39px;color: gray;font-weight:bold;font-style:italic;">Lưu ý: Đường dẫn sẽ hết hạn sau 15 phút.</p><div dir=""><div><br /></div><img src="https://ci5.googleusercontent.com/proxy/XLyeAvKO3RUsTIklizG4PmgD0I4SKmwOTxXPuRpEh9EGFW_005Na5Sz0eXa4ij2pYuAzs6Qoy6EBWwY8a5bo6FZ8w_A9RjwXc3PNgnYzKKvFVFB_F4twiN4tDEYEZSN9PVicy7z3E6dTT0k98g3YsdJx2fSTSyuTaje7IIm7P2a7U2NtE4oWHrA7SfOESmyBhmOrfsGLQp_dpzSHLA=s0-d-e1-ft#https://docs.google.com/uc?export=download&amp;id=1XZ5xl-QbZY7UHtYQUkpkdBldN8U1znot&amp;revid=0B7Fw-jHCbyZVb3JweVNjd1JaMTl2RnVmaVpLcy9pU244NmpjPQ" class="CToWUd"/><div><b>To-do App</b><div><div>Ho Chi Minh City, VN</div></div><a href="https://taan-todoapp.herokuapp.com/" style="color: #00b08c;text-decoration: none;">https://taan-todoapp.herokuapp.com/</a></div></div></div>`
    }).then(()=>{
        console.log('Sended');
    }).catch(error=>{
        console.log(error.response.body);
    })
}

module.exports = {
    sendWelcomeEmail,
    sendResetPasswordEmail
}