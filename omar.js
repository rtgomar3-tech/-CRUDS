let title = document.getElementById('title');
let price = document.getElementById('price');
let cost = document.getElementById('cost');
let sypRate = document.getElementById('sypRate');
let total = document.getElementById('total');
let count = document.getElementById('count');
let totalAllCount = document.getElementById('totalAllCount'); 
let size = document.getElementById('size');
let brand = document.getElementById('brand');
let origin = document.getElementById('origin');
let category = document.getElementById('category');
let submit = document.getElementById('submit');

let mood = 'create'; 
let tmp; 

function getTotal() {
    let p = +price.value || 0;
    let rate = +sypRate.value || 0;
    let c = +count.value || 0;

    if (price.value !== '' && sypRate.value !== '') {
        let result = p * rate;
        total.innerHTML = result.toLocaleString('en-US') + ' ل.س';
        total.style.background = '#28a745'; 
    } else {
        total.innerHTML = '';
        total.style.background = 'transparent'; 
    }

    if (c > 0 && p > 0) {
        let totalUSD = c * p;
        let totalSYP = rate > 0 ? (totalUSD * rate).toLocaleString('en-US') + ' ل.س' : 'غير محدد';
        totalAllCount.value = `${totalUSD.toLocaleString('en-US')} $ (${totalSYP})`;
    } else {
        totalAllCount.value = '';
    }
}

let datPro;
if (localStorage.product != null) {
    datPro = JSON.parse(localStorage.product);
} else {
    datPro = [];
}

submit.onclick = function () {
    let p = +price.value || 0;
    let rate = +sypRate.value || 0;
    let c = +count.value || 1;

    let resultSyp = (p > 0 && rate > 0) ? (p * rate) : 0;
    let totalAllUSD = p * c;
    let totalAllSYP = resultSyp * c;

    let newPro = {
        title: title.value,
        brand: brand.value,
        size: size.value || '-',
        count: c,
        cost: cost.value || 0,
        origin: origin.value || '-',
        category: category.value || '-',
        price: p,
        priceSyp: resultSyp ? resultSyp.toLocaleString('en-US') + ' ل.س' : '-',
        totalAllUSD: totalAllUSD, 
        totalAllSYP: totalAllSYP ? totalAllSYP.toLocaleString('en-US') + ' ل.س' : '-' 
    };

    if (mood === 'create') {
        datPro.push(newPro);
    } else {
        datPro[tmp] = newPro;
        mood = 'create';
        submit.innerHTML = 'إنشاء';
    }

    localStorage.setItem('product', JSON.stringify(datPro));

    clearData();
    showData();
}

// تنظيف الحقول
function clearData() {
    title.value = '';
    price.value = '';
    cost.value = '';
    sypRate.value = '';
    total.innerHTML = '';
    count.value = '';
    totalAllCount.value = '';
    size.value = '';
    brand.value = '';
    origin.value = '';
    category.value = '';
}

// عرض البيانات بالجدول
function showData() {
    getTotal();
    let table = '';
    for (let i = 0; i < datPro.length; i++) {
        table += `
        <tr>
            <td>${i + 1}</td>
            <td>${datPro[i].title || '-'}</td>
            <td>${datPro[i].brand || '-'}</td>
            <td>${datPro[i].size || '-'}</td>
            <td>${datPro[i].count || 1}</td>
            <td>${datPro[i].origin || '-'}</td>
            <td>${datPro[i].cost || 0} $</td>
            <td>${datPro[i].price || 0} $</td>
            <td>${datPro[i].priceSyp || '-'}</td>
            <td><strong>${(datPro[i].totalAllUSD || 0).toLocaleString('en-US')} $</strong></td>
            <td><strong>${datPro[i].totalAllSYP || '-'}</strong></td>
            <td>${datPro[i].category || '-'}</td>
            <td><button onclick="updateData(${i})" id="update">تعديل</button></td>
            <td><button onclick="deleteData(${i})" id="delete">حذف</button></td>
        </tr>
        `;
    }
    document.getElementById('tbody').innerHTML = table;
    calculateTotals(dataArray)
}

showData();

// الحذف
function deleteData(i){
    datPro.splice(i,1);
    localStorage.product = JSON.stringify(datPro);
    showData();
    
}

// التعديل
function updateData(i) {
    title.value = datPro[i].title;
    price.value = datPro[i].price;
    cost.value = datPro[i].cost;
    count.value = datPro[i].count;
    size.value = datPro[i].size;
    brand.value = datPro[i].brand;
    origin.value = datPro[i].origin;
    category.value = datPro[i].category;
    
    getTotal(); 
    
    submit.innerHTML = 'تعديل';
    mood = 'update';
    tmp = i;
    scroll({
        top: 0,
        behavior: 'smooth'
    });
}

// البحث المباشر
function searchData(value) {
    let table = '';
    let val = value.toLowerCase().trim();

    for (let i = 0; i < datPro.length; i++) {
        if ((datPro[i].title || '').toLowerCase().includes(val)) {
            table += `
            <tr>
                <td>${i + 1}</td>
                <td>${datPro[i].title || '-'}</td>
                <td>${datPro[i].brand || '-'}</td>
                <td>${datPro[i].size || '-'}</td>
                <td>${datPro[i].count || 1}</td>
                <td>${datPro[i].origin || '-'}</td>
                <td>${datPro[i].cost || 0} $</td>
                <td>${datPro[i].price || 0} $</td>
                <td>${datPro[i].priceSyp || '-'}</td>
                <td><strong>${(datPro[i].totalAllUSD || 0).toLocaleString('en-US')} $</strong></td>
                <td><strong>${datPro[i].totalAllSYP || '-'}</strong></td>
                <td>${datPro[i].category || '-'}</td>
                <td><button onclick="updateData(${i})" id="update">تعديل</button></td>
                <td><button onclick="deleteData(${i})" id="delete">حذف</button></td>
            </tr>
            `;
        }
    }
    document.getElementById('tbody').innerHTML = table;
    calculateTotals(dataArray)
}



function calculateTotals(dataArray) {
    let totalSalesUSD = 0;
    let totalSalesSYP = 0;

    for (let i = 0; i < dataArray.length; i++) {
        // جمع سعر جميع القطع بالدولار
        let salesUSD = +dataArray[i].totalAllUSD || 0;
        
        // استخراج الرقم من نص الليرة السورية وحسابه
        let salesSYPText = (dataArray[i].totalAllSYP || '').replace(/[^0-9.]/g, '');
        let salesSYP = parseFloat(salesSYPText) || 0;

        totalSalesUSD += salesUSD;
        totalSalesSYP += salesSYP;
    }

    // تصميم صف المجموع بأسلوب مدمج وواضح
    let footContent = `
        <tr class="total-row">
            <td colspan="6" class="total-label">المجموع الإجمالي لجميع المنتجات:</td>
            <td colspan="4" class="total-value-usd">
                ${totalSalesUSD.toLocaleString('en-US', {maximumFractionDigits: 2})} $
            </td>
            <td colspan="4" class="total-value-syp">
                ${totalSalesSYP.toLocaleString('en-US', {maximumFractionDigits: 0})} ل.س
            </td>
        </tr>
    `;

    document.getElementById('tfoot').innerHTML = footContent;
}

// أضف السطر التالي في نهاية دالة showData() ودالة searchData():
// calculateTotals(datPro);  <- في showData
// calculateTotals(filteredData); <- في searchData