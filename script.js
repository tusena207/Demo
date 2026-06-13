const duLieu = {
    sanPham: [{ id: "PRODUCT1", name: "Laptop Dell", key: "LAPTOP-DELL", desc: "Laptop Dell core i5", price: "15000000", brand: "Dell", unit: "Chiếc", mfg: "2024-05-10", exp: "2025-05-10", wh: "W1" }],
    donHang: [{ id: "ORDER1", date: "2024-05-12", delivery: "2024-05-22", price: "10000000", payment: "2024-05-25" }],
    nhaCungCap: [{ id: "SUP1", name: "Cung cấp A", email: "email1@example.com", address: "Số 1, HN" }],
    khoHang: [{ id: "W1", name: "Kho Trung tâm", location: "Hà Nội", capacity: "10000" }],
    giaoHang: [{ id: "SHIP1", name: "Đơn vị vận chuyển A", email: "email1@example.com", address: "Hà Nội", phone: "0912345678", status: "Đang vận chuyển", recv: "50", deliv: "0" }],
    phieuXuat: [{ id: "DN1", date: "2024-05-23", price: "10000000", wh: "W1" }],
    phieuNhap: [{ id: "RECEIPT1", date: "2024-05-13", qty: "100", price: "10000000", wh: "W1" }]
};


const mapTrang = {
    'product-page': { dataKey: 'sanPham', tableId: 'bang-san-pham' },
    'order-page': { dataKey: 'donHang', tableId: 'bang-don-hang' },
    'supplier-page': { dataKey: 'nhaCungCap', tableId: 'bang-nha-cung-cap' },
    'warehouse-page': { dataKey: 'khoHang', tableId: 'bang-kho-hang' },
    'ship-page': { dataKey: 'giaoHang', tableId: 'bang-giao-hang' },
    'delivery-page': { dataKey: 'phieuXuat', tableId: 'bang-phieu-xuat' },
    'receipt-page': { dataKey: 'phieuNhap', tableId: 'bang-phieu-nhap' }
};

let idDangSua = null;
function kiemTraDangNhap() {
    let uName = document.getElementById('username').value;
    let pWord = document.getElementById('password').value;
    if (uName === "admin" && pWord === ".") {
        document.getElementById('login-error').style.display = "none";
        document.getElementById('main-nav').classList.remove('hidden');
        chuyenTrang('home-page'); 
    } else {
        document.getElementById('login-error').style.display = "block";
    }
}


function chuyenTrang(idTrangDich) {
    let cacTrang = document.getElementsByClassName('view-section');
    for (let i = 0; i < cacTrang.length; i++) cacTrang[i].classList.add('hidden');
    document.getElementById(idTrangDich).classList.remove('hidden');


    idDangSua = null; 

    if (mapTrang[idTrangDich]) {
        renderBang(idTrangDich);
        resetForm(idTrangDich);
    }
}

function renderBang(idTrang) {
    let config = mapTrang[idTrang];
    let tbody = document.getElementById(config.tableId);
    tbody.innerHTML = ""; 

    let mangDuLieu = duLieu[config.dataKey];
    for (let item of mangDuLieu) {
        let tr = document.createElement('tr');
        let noiDungRow = "";
        for (let key in item) noiDungRow += `<td>${item[key]}</td>`;
        
        noiDungRow += `
            <td>
                <button class="btn-update" onclick="batDauSua('${idTrang}', '${item.id}')">Update</button>
                <button class="btn-delete" onclick="xoaBanGhi('${idTrang}', '${item.id}')">Delete</button>
            </td>
        `;
        tr.innerHTML = noiDungRow;
        tbody.appendChild(tr);
    }
}
function luuThongTin(idTrang) {
    let config = mapTrang[idTrang];
    let container = document.getElementById('form-' + idTrang);
    let cacInput = container.querySelectorAll('input');
    
    let banGhiMoi = {};
    for (let input of cacInput) {
        let key = input.getAttribute('data-key');
        if (key) banGhiMoi[key] = input.value;
    }
    if (!banGhiMoi.id || banGhiMoi.id.trim() === "") {
        alert("Bạn phải nhập mã ID đầu tiên!");
        return;
    }

    let mangDuLieu = duLieu[config.dataKey];

    if (idDangSua === null) {
        let tonTai = mangDuLieu.find(x => x.id === banGhiMoi.id);
        if (tonTai) {
            alert("ID này đã tồn tại, vui lòng nhập mã khác!");
            return;
        }
        mangDuLieu.push(banGhiMoi);
    } else {
        for (let i = 0; i < mangDuLieu.length; i++) {
            if (mangDuLieu[i].id === idDangSua) {
                mangDuLieu[i] = banGhiMoi;
                break;
            }
        }
        idDangSua = null; 
        container.querySelector('.btn-add').innerText = "Thêm"; 
    }

    resetForm(idTrang);
    renderBang(idTrang);
}
function batDauSua(idTrang, idCanSua) {
    let config = mapTrang[idTrang];
    let item = duLieu[config.dataKey].find(x => x.id === idCanSua);
    if (!item) return;

    let container = document.getElementById('form-' + idTrang);
    let cacInput = container.querySelectorAll('input');
    
    for (let input of cacInput) {
        let key = input.getAttribute('data-key');
        if (key && item[key] !== undefined) {
            input.value = item[key];
        }
    }
    
    idDangSua = idCanSua; 
    container.querySelector('.btn-add').innerText = "Lưu Update";
}

function xoaBanGhi(idTrang, idCanXoa) {
    let xacNhan = confirm("Bạn có chắc chắn muốn xóa bản ghi: " + idCanXoa + "?");
    if (xacNhan) {
        let config = mapTrang[idTrang];
        duLieu[config.dataKey] = duLieu[config.dataKey].filter(item => item.id !== idCanXoa);
        renderBang(idTrang);
        resetForm(idTrang);
    }
}

function resetForm(idTrang) {
    let container = document.getElementById('form-' + idTrang);
    let cacInput = container.querySelectorAll('input');
    for (let input of cacInput) input.value = '';
    container.querySelector('.btn-add').innerText = "Thêm";
    idDangSua = null;
}

function dangXuat() {
    document.getElementById('main-nav').classList.add('hidden');
    chuyenTrang('login-page');
    document.getElementById('password').value = "";
}
