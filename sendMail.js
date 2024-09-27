const nodemailer = require("nodemailer");

class XL_GOI_THU_DIEN_TU {
    Goi_Thu_Lien_he(from, to, subject, body) {
        let transporter = nodemailer.createTransport({
            service:"gmail",
            port: 465,
            secure: true, // Use `true` for port 465, `false` for all other ports
            logger:true,
            debug:true,
            secureConnection:false,
            auth: {
                user: 'phuongnamdpn98@gmail.com', // User gmail 
                pass: 'dkxpsauxqtwhuaep' // 
            },
            tls:{
                rejectUnauthorized: true
            }
        });

        let mailOptions = {
            from: ` MOON nội thất <${from}>`,
            to: to,
            subject: subject,
            html: body
        };
        // Gọi phương thức sendMail -> trả về dạng promise
        return transporter.sendMail(mailOptions)
    }

}

var Goi_thu = new XL_GOI_THU_DIEN_TU()
module.exports = Goi_thu