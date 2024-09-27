// Thư viện http của node
const http = require("http");
// Khai báo port cho dịch vụ
const port = normalizePort(process.env.PORT || 8080);
// Khai báo thư viện fs  của node xử lý thư mục và tập tin
const fs = require("fs");
// Khai báo thư viện mongoDB
const db = require("./mongoDB");
// Khai báo thư viện SendMail
const sendMail = require("./sendMail");


// Tạo dịch vụ:
/*
    request: yêu cầu
    response: hồi đáp
*/
//========================================================================================
const dich_vu = http.createServer((req, res) => {
    let method = req.method;
    let url = req.url;
    // Cấp quyền
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (method == "GET") {
        if (url == "/dsPhongKhach") {
            db.getAll("phongKhach").then(result => {
                let kq = JSON.stringify(result)
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(kq);
            }).catch(err => {
                res.end(JSON.stringify(err));
            })
        } else if (url == "/dsPhongAn") {
            db.getAll("phongAn").then(result => {
                let kq = JSON.stringify(result)
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(kq);
            }).catch(err => {
                res.end(JSON.stringify(err));
            })
        } else if (url == "/dsPhongNgu") {
            db.getAll("phongNgu").then(result => {
                let kq = JSON.stringify(result)
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(kq);
            }).catch(err => {
                res.end(JSON.stringify(err));
            })
        } else if (url == "/dsPhongLamViec") {
            db.getAll("phongLamViec").then(result => {
                let kq = JSON.stringify(result)
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(kq);
            }).catch(err => {
                res.end(JSON.stringify(err));
            })
        } else if (url == "/dsOrder") {
            db.getAll("order").then(result => {
                let kq = JSON.stringify(result)
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(kq);
            }).catch(err => {
                res.end(JSON.stringify(err));
            })
        } else if (url == "/dsBlog") {
            db.getAll("blog").then(result => {
                let kq = JSON.stringify(result)
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(kq);
            }).catch(err => {
                res.end(JSON.stringify(err));
            })
        } else if (url.match("\.jpg$")) {
            let imagePath = `./images/${url}`;
            if (!fs.existsSync(imagePath)) {
                imagePath = `./images/noImage.jpg`;
            }

            let fileStream = fs.createReadStream(imagePath);
            res.writeHead(200, { "Content-Type": "image/jpg" });
            fileStream.pipe(res);
        } else {
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            let kq = `Bạn sử dụng phương thức GET - ${url} `
            res.end(kq);
        }
    } else if (method == "POST") {
        // Lấy dữ liệu gởi
        let noi_dung_nhan = ``;
        // Nhận thông tin gởi gán vào biến noi_dung_nhan
        req.on("data", (data) => {
            noi_dung_nhan += data;
        })
        //////////////////////////////////////////////////////////////
        if (url == "/Dangnhap") {
            req.on("end", () => {
                let ket_qua = {
                    "Noi_dung": true
                }
                let user = JSON.parse(noi_dung_nhan);
                let dieukien = {
                    $and: [
                        { "username": user.username },
                        { "pass": user.pass }
                    ]
                }
                db.getOne("admin", dieukien).then(result => {
                    console.log(result)
                    ket_qua.Noi_dung = {
                        "username": result.username,
                        "email": result.email
                    };
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));

                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                })
            })
        } else if (url == "/Dathang") {
            req.on('end', function () {
                let donDatHang = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.insertOne("order", donDatHang).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                })
            })

        } else if (url == "/SuaPhongKhach") { // thêm - sửa - xóa phong khach
            req.on('end', function () {
                let phongkhach = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.updateOne("phongKhach", phongkhach.condition, phongkhach.update).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua))
                })
            })
        } else if (url == "/ThemPhongKhach") {
            req.on('end', function () {
                let phongkhach = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.insertOne("phongKhach", phongkhach).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                })
            })
        } else if (url == "/ImagesPhongKhach") {
            req.on('end', function () {
                let img = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                // upload img in images ------------------------------

                let kq = saveMedia(img.name, img.src)
                if (kq == "OK") {
                    res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                    res.end(JSON.stringify(Ket_qua));
                } else {
                    Ket_qua.Noi_dung = false
                    res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                    res.end(JSON.stringify(Ket_qua));
                }

            })

        } else if (url == "/XoaPhongKhach") {
            req.on('end', function () {
                let phongkhach = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.deleteOne("phongKhach", phongkhach).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua))
                })

            })

        } else if (url == "/SuaPhongAn") { // thêm - sửa - xóa phong an
            req.on('end', function () {
                let phongAn = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.updateOne("phongAn", phongAn.condition, phongAn.update).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua))
                })
            })
        } else if (url == "/ThemPhongAn") {
            req.on('end', function () {
                let phongAn = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.insertOne("phongAn", phongAn).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                })
            })
        } else if (url == "/ImagesPhongAn") {
            req.on('end', function () {
                let img = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                // upload img in images ------------------------------

                let kq = saveMedia(img.name, img.src)
                if (kq == "OK") {
                    res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                    res.end(JSON.stringify(Ket_qua));
                } else {
                    Ket_qua.Noi_dung = false
                    res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                    res.end(JSON.stringify(Ket_qua));
                }

                
            })

        } else if (url == "/XoaPhongAn") {
            req.on('end', function () {
                let phongAn = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.deleteOne("phongAn", phongAn).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua))
                })

            })

        } else if (url == "/SuaPhongNgu") { // thêm - sửa - xóa Phong Ngu
            req.on('end', function () {
                let phongNgu = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.updateOne("phongNgu", phongNgu.condition, phongNgu.update).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua))
                })
            })
        } else if (url == "/ThemPhongNgu") {
            req.on('end', function () {
                let phongNgu = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.insertOne("phongNgu", phongNgu).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                })
            })
        } else if (url == "/ImagesPhongNgu") {
            req.on('end', function () {
                let img = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                // upload img in images ------------------------------

                let kq = saveMedia(img.name, img.src)
                if (kq == "OK") {
                    res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                    res.end(JSON.stringify(Ket_qua));
                } else {
                    Ket_qua.Noi_dung = false
                    res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                    res.end(JSON.stringify(Ket_qua));
                }

                
            })

        } else if (url == "/XoaPhongNgu") {
            req.on('end', function () {
                let phongNgu = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.deleteOne("phongNgu", phongNgu).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua))
                })

            })

        }else if (url == "/SuaPhongLamViec") { // thêm - sửa - xóa Phong Lam Viec
            req.on('end', function () {
                let phongLamViec = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.updateOne("phongLamViec", phongLamViec.condition, phongLamViec.update).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua))
                })
            })
        } else if (url == "/ThemPhongLamViec") {
            req.on('end', function () {
                let phongLamViec = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.insertOne("phongLamViec", food).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                })
            })
        } else if (url == "/ImagesPhongLamViec") {
            req.on('end', function () {
                let img = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                // upload img in images ------------------------------

                let kq = saveMedia(img.name, img.src)
                if (kq == "OK") {
                    res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                    res.end(JSON.stringify(Ket_qua));
                } else {
                    Ket_qua.Noi_dung = false
                    res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                    res.end(JSON.stringify(Ket_qua));
                }

                
            })

        } else if (url == "/XoaPhongLamViec") {
            req.on('end', function () {
                let phongLamViec = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.deleteOne("phongLamViec", phongLamViec).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua))
                })

            })

        } else if (url == "/SendMail") {
            req.on("end", () => {
                let kq = {
                    "noi_dung": true
                }
                let info = JSON.parse(noi_dung_nhan);

                let from = `phuongnamdpn98@gmail.com`;
                let to = `phuongnamdpn98@gmail.com`;
                let subject = info.subject;
                let body = info.body;
                sendMail.Goi_Thu_Lien_he(from, to, subject, body).then(result => {
                    console.log(result)
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(kq));
                }).catch(err => {
                    console.log(err)
                    kq.noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(kq));
                })
            })
        } else {
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            let kq = `Bạn sử dụng phương thức POST - ${url} `
            res.end(kq);
        }
    } else {
        res.end(`Dịch vụ  method:${method} - url:${url} `)
    }
})

// Dịch vụ lắng nghe tại địa chỉ và cổng nào

dich_vu.listen(port, () => {
    console.log(`Dịch vụ thực thi tại địa chỉ http://localhost:${port}`)
})

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

// Upload Media -----------------------------------------------------------------
function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Error ...');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

function saveMedia(Ten, Chuoi_nhi_phan) {
    var Kq = "OK"
    try {
        var Nhi_phan = decodeBase64Image(Chuoi_nhi_phan);
        var Duong_dan = "./images/" + Ten
        fs.writeFileSync(Duong_dan, Nhi_phan.data);
    } catch (Loi) {
        Kq = Loi.toString()
    }
    return Kq
}
