const duLieu = {
    sanPham: [{ id: "PRODUCT1", name: "Laptop Dell", key: "LAPTOP-DELL", desc: "Laptop Dell core i5", price: "15000000", brand: "Dell", unit: "Chiếc", mfg: "2024-05-10", exp: "2025-05-10", wh: "W1" }],
    donHang: [{ id: "ORDER1", date: "2024-05-12", delivery: "2024-05-22", price: "10000000", payment: "2024-05-25" }],
    nhaCungCap: [{ id: "SUP1", name: "Cung cấp A", email: "email1@example.com", address: "Số 1, HN" }],
    khoHang: [{ id: "W1", name: "Kho Trung tâm", location: "Hà Nội", capacity: "10000" }],
    giaoHang: [{ id: "SHIP1", name: "Đơn vị vận chuyển A", email: "email1@example.com", address: "Hà Nội", phone: "0912345678", status: "Đang vận chuyển", recv: "50", deliv: "0" }],
    phieuXuat: [{ id: "DN1", date: "2024-05-23", price: "10000000", wh: "W1" }],
    phieuNhap: [{ id: "RECEIPT1", date: "2024-05-13", qty: "100", price: "10000000", wh: "W1" }]
};

// Bảng map giúp JS tự biết trang nào cần lấy dữ liệu nào
const mapTrang = {
    'product-page': { dataKey: 'sanPham', tableId: 'bang-san-pham' },
    'order-page': { dataKey: 'donHang', tableId: 'bang-don-hang' },
    'supplier-page': { dataKey: 'nhaCungCap', tableId: 'bang-nha-cung-cap' },
    'warehouse-page': { dataKey: 'khoHang', tableId: 'bang-kho-hang' },
    'ship-page': { dataKey: 'giaoHang', tableId: 'bang-giao-hang' },
    'delivery-page': { dataKey: 'phieuXuat', tableId: 'bang-phieu-xuat' },
    'receipt-page': { dataKey: 'phieuNhap', tableId: 'bang-phieu-nhap' }
};

// Biến toàn cục lưu trạng thái xem ta đang "Thêm" hay "Sửa"
let idDangSua = null;
// Hàm 1: Đăng nhập
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

// Hàm 2: Chuyển trang và Render bảng
function chuyenTrang(idTrangDich) {
    let cacTrang = document.getElementsByClassName('view-section');
    for (let i = 0; i < cacTrang.length; i++) cacTrang[i].classList.add('hidden');
    document.getElementById(idTrangDich).classList.remove('hidden');

    // Hủy trạng thái đang sửa (nếu có) khi đổi trang
    idDangSua = null; 

    if (mapTrang[idTrangDich]) {
        renderBang(idTrangDich);
        resetForm(idTrangDich); // Làm sạch ô input khi đổi trang
    }
}

// Hàm 3: Render Bảng dữ liệu tự động
function renderBang(idTrang) {
    let config = mapTrang[idTrang];
    let tbody = document.getElementById(config.tableId);
    tbody.innerHTML = ""; 

    let mangDuLieu = duLieu[config.dataKey];
    for (let item of mangDuLieu) {
        let tr = document.createElement('tr');
        let noiDungRow = "";
        for (let key in item) noiDungRow += `<td>${item[key]}</td>`;
        
        // Gắn luôn tham số vào các nút Sửa, Xóa
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

// Hàm 4: Lưu thông tin (Dùng chung cho cả Thêm mới và Sửa bản ghi)
function luuThongTin(idTrang) {
    let config = mapTrang[idTrang];
    let container = document.getElementById('form-' + idTrang);
    let cacInput = container.querySelectorAll('input');
    
    let banGhiMoi = {};
    // Quét tất cả các ô input có thuộc tính data-key để đóng gói thành 1 object
    for (let input of cacInput) {
        let key = input.getAttribute('data-key');
        if (key) banGhiMoi[key] = input.value;
    }

    // Bắt lỗi cơ bản (Sử dụng If/Else)
    if (!banGhiMoi.id || banGhiMoi.id.trim() === "") {
        alert("Bạn phải nhập mã ID đầu tiên!");
        return;
    }

    let mangDuLieu = duLieu[config.dataKey];

    if (idDangSua === null) {
        // LOGIC THÊM MỚI: Kiểm tra trùng ID
        let tonTai = mangDuLieu.find(x => x.id === banGhiMoi.id);
        if (tonTai) {
            alert("ID này đã tồn tại, vui lòng nhập mã khác!");
            return;
        }
        mangDuLieu.push(banGhiMoi);
    } else {
        // LOGIC CẬP NHẬT: Tìm vị trí phần tử cũ và ghi đè
        for (let i = 0; i < mangDuLieu.length; i++) {
            if (mangDuLieu[i].id === idDangSua) {
                mangDuLieu[i] = banGhiMoi;
                break;
            }
        }
        idDangSua = null; // Hoàn thành cập nhật, reset trạng thái
        container.querySelector('.btn-add').innerText = "Thêm"; // Đổi lại tên nút
    }

    resetForm(idTrang);
    renderBang(idTrang);
}

// Hàm 5: Bắt đầu Sửa (Đẩy dữ liệu từ bảng lên các ô Input)
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
    
    idDangSua = idCanSua; // Bật cờ đánh dấu đang sửa
    container.querySelector('.btn-add').innerText = "Lưu Update";
}

// Hàm 6: Xóa bản ghi
function xoaBanGhi(idTrang, idCanXoa) {
    let xacNhan = confirm("Bạn có chắc chắn muốn xóa bản ghi: " + idCanXoa + "?");
    if (xacNhan) {
        let config = mapTrang[idTrang];
        // Lọc bỏ phần tử bị xóa ra khỏi mảng
        duLieu[config.dataKey] = duLieu[config.dataKey].filter(item => item.id !== idCanXoa);
        renderBang(idTrang);
        resetForm(idTrang);
    }
}

// Hàm 7: Xóa rỗng các ô nhập liệu
function resetForm(idTrang) {
    let container = document.getElementById('form-' + idTrang);
    let cacInput = container.querySelectorAll('input');
    for (let input of cacInput) input.value = '';
    container.querySelector('.btn-add').innerText = "Thêm";
    idDangSua = null;
}

// Hàm 8: Đăng xuất
function dangXuat() {
    document.getElementById('main-nav').classList.add('hidden');
    chuyenTrang('login-page');
    document.getElementById('password').value = "";
}