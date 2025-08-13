// داده‌های شبیه‌سازی شده
let items = [
    {
        id: 1,
        name: "پلاستیک ABS",
        unit: "کیلوگرم",
        unitPrice: 45000,
        description: "پلاستیک با کیفیت بالا برای قالب‌گیری"
    },
    {
        id: 2,
        name: "رنگ مات سفید",
        unit: "لیتر",
        unitPrice: 85000,
        description: "رنگ با پوشش مات و مقاومت بالا"
    },
    {
        id: 3,
        name: "موتور DC 12V",
        unit: "عدد",
        unitPrice: 250000,
        description: "موتور با گشتاور بالا و عمر طولانی"
    },
    {
        id: 4,
        name: "سنسور لیزری",
        unit: "عدد",
        unitPrice: 350000,
        description: "سنسور با دقت بالا برای اندازه‌گیری فاصله"
    },
    {
        id: 5,
        name: "پردازنده ARM",
        unit: "عدد",
        unitPrice: 450000,
        description: "پردازنده چند هسته‌ای با مصرف انرژی کم"
    }
];

let products = [
    {
        id: 1,
        name: "روبوت هوشمند خانگی",
        description: "روبوت هوشمند با قابلیت پاکسازی خودکار و نظارت بر محیط",
        bom: [
            {
                id: 101,
                itemId: 1,
                quantity: 5,
                unit: "کیلوگرم",
                unitPrice: 45000,
                children: []
            },
            {
                id: 102,
                itemId: 2,
                quantity: 2,
                unit: "لیتر",
                unitPrice: 85000,
                children: []
            },
            {
                id: 103,
                itemId: 3,
                quantity: 4,
                unit: "عدد",
                unitPrice: 250000,
                children: []
            },
            {
                id: 104,
                itemId: 4,
                quantity: 1,
                unit: "عدد",
                unitPrice: 350000,
                children: []
            },
            {
                id: 105,
                itemId: 5,
                quantity: 1,
                unit: "عدد",
                unitPrice: 450000,
                children: []
            }
        ]
    },
    {
        id: 2,
        name: "سیستم کنترل هوشمند",
        description: "سیستم کنترل مرکزی برای دستگاه‌های صنعتی",
        bom: [
            {
                id: 201,
                itemId: 5,
                quantity: 1,
                unit: "عدد",
                unitPrice: 450000,
                children: [
                    {
                        id: 202,
                        itemId: 4,
                        quantity: 2,
                        unit: "عدد",
                        unitPrice: 350000,
                        children: []
                    }
                ]
            }
        ]
    }
];

// متغیرهای کمکی
let currentProductId = null;
let editingItem = null;
let parentId = null;
let currentTheme = 'light';
let selectedItems = []; // برای ذخیره آیتم‌های انتخاب شده در ایجاد محصول

// توابع کمکی
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// توابع مدیریت آیتم‌ها
function renderItems() {
    const container = document.getElementById('items-container');
    container.innerHTML = '';
    
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.innerHTML = `
            <div class="item-card-header">
                <h3>${item.name}</h3>
            </div>
            <div class="item-card-body">
                <p>${item.description || 'بدون توضیحات'}</p>
                <span class="item-price">${formatCurrency(item.unitPrice)} تومان / ${item.unit}</span>
            </div>
        `;
        
        itemCard.addEventListener('click', () => {
            editItem(item);
        });
        
        container.appendChild(itemCard);
    });
}

function addItem() {
    document.getElementById('item-form-title').textContent = 'افزودن قطعه جدید';
    document.getElementById('item-id').value = '';
    document.getElementById('item-name').value = '';
    document.getElementById('item-unit').value = 'عدد';
    document.getElementById('item-price').value = '0';
    document.getElementById('item-description').value = '';
    showPage('item-form');
}

function editItem(item) {
    document.getElementById('item-form-title').textContent = 'ویرایش قطعه';
    document.getElementById('item-id').value = item.id;
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-unit').value = item.unit;
    document.getElementById('item-price').value = item.unitPrice;
    document.getElementById('item-description').value = item.description || '';
    editingItem = item;
    showPage('item-form');
}

function saveItem() {
    const id = document.getElementById('item-id').value || generateId();
    const name = document.getElementById('item-name').value.trim();
    const unit = document.getElementById('item-unit').value;
    const unitPrice = parseInt(document.getElementById('item-price').value) || 0;
    const description = document.getElementById('item-description').value.trim();
    
    if (!name) {
        alert('لطفا نام قطعه را وارد کنید');
        return;
    }
    
    const newItem = {
        id: parseInt(id),
        name: name,
        unit: unit,
        unitPrice: unitPrice,
        description: description
    };
    
    if (editingItem) {
        // ویرایش آیتم موجود
        const index = items.findIndex(i => i.id === editingItem.id);
        if (index !== -1) {
            items[index] = newItem;
        }
        editingItem = null;
    } else {
        // اضافه کردن آیتم جدید
        items.push(newItem);
    }
    
    renderItems();
    showPage('items-list');
}

// توابع مدیریت محصولات
function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    products.forEach(product => {
        // محاسبه آمار محصول
        let totalItems = 0;
        let totalCost = 0;
        
        function calculateStats(bom) {
            bom.forEach(item => {
                totalItems += item.quantity || 0;
                totalCost += (item.quantity || 0) * (item.unitPrice || 0);
                if (item.children && item.children.length > 0) {
                    calculateStats(item.children);
                }
            });
        }
        
        calculateStats(product.bom);
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        productCard.innerHTML = `
            <div class="product-card-header">
                <h3>${product.name}</h3>
            </div>
            <div class="product-card-body">
                <p>${product.description || 'بدون توضیحات'}</p>
                <div class="product-stats">
                    <div class="stat-item">
                        <span class="stat-label">تعداد قطعات</span>
                        <span class="stat-value">${totalItems}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">هزینه کل</span>
                        <span class="stat-value">${formatCurrency(totalCost)} تومان</span>
                    </div>
                </div>
            </div>
        `;
        
        productCard.addEventListener('click', () => {
            currentProductId = product.id;
            document.getElementById('product-title').textContent = `BOM - ${product.name}`;
            renderBOM();
            showPage('bom-management');
        });
        
        container.appendChild(productCard);
    });
}

function createProduct() {
    document.getElementById('product-name').value = '';
    document.getElementById('product-description').value = '';
    selectedItems = [];
    renderItemsSelection();
    showPage('create-product');
}

function renderItemsSelection() {
    const container = document.getElementById('items-selection');
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = '<p>هیچ قطعه‌ای برای انتخاب وجود ندارد. لطفاً ابتدا قطعات را تعریف کنید.</p>';
        return;
    }
    
    let tableHTML = `
        <table class="items-table">
            <thead>
                <tr>
                    <th>انتخاب</th>
                    <th>نام قطعه</th>
                    <th>واحد</th>
                    <th>قیمت واحد</th>
                    <th>تعداد</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    items.forEach(item => {
        const isSelected = selectedItems.some(si => si.itemId === item.id);
        const selectedItem = selectedItems.find(si => si.itemId === item.id);
        const quantity = selectedItem ? selectedItem.quantity : 1;
        
        tableHTML += `
            <tr>
                <td>
                    <input type="checkbox" class="item-checkbox" data-id="${item.id}" ${isSelected ? 'checked' : ''}>
                </td>
                <td>${item.name}</td>
                <td>${item.unit}</td>
                <td>${formatCurrency(item.unitPrice)} تومان</td>
                <td>
                    <input type="number" class="quantity-input" data-id="${item.id}" value="${quantity}" min="1">
                </td>
            </tr>
        `;
    });
    
    tableHTML += `
                </tbody>
            </table>
    `;
    
    container.innerHTML = tableHTML;
    
    // اضافه کردن event listeners
    document.querySelectorAll('.item-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const itemId = parseInt(this.dataset.id);
            const quantityInput = document.querySelector(`.quantity-input[data-id="${itemId}"]`);
            
            if (this.checked) {
                const item = items.find(i => i.id === itemId);
                selectedItems.push({
                    itemId: itemId,
                    quantity: parseInt(quantityInput.value) || 1,
                    unit: item.unit,
                    unitPrice: item.unitPrice
                });
            } else {
                selectedItems = selectedItems.filter(si => si.itemId !== itemId);
            }
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const itemId = parseInt(this.dataset.id);
            const checkbox = document.querySelector(`.item-checkbox[data-id="${itemId}"]`);
            
            if (checkbox.checked) {
                const selectedItem = selectedItems.find(si => si.itemId === itemId);
                if (selectedItem) {
                    selectedItem.quantity = parseInt(this.value) || 1;
                }
            }
        });
    });
}

function saveProduct() {
    const name = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-description').value.trim();
    
    if (!name) {
        alert('لطفا نام محصول را وارد کنید');
        return;
    }
    
    if (selectedItems.length === 0) {
        alert('لطفا حداقل یک قطعه برای محصول انتخاب کنید');
        return;
    }
    
    const newProduct = {
        id: generateId(),
        name: name,
        description: description,
        bom: selectedItems.map(item => {
            return {
                id: generateId(),
                itemId: item.itemId,
                quantity: item.quantity,
                unit: item.unit,
                unitPrice: item.unitPrice,
                children: []
            };
        })
    };
    
    products.push(newProduct);
    renderProducts();
    showPage('products-list');
}

// توابع مدیریت BOM
function calculateTotals(bom) {
    let totalItems = 0;
    let totalCost = 0;
    
    function traverse(items) {
        items.forEach(item => {
            totalItems += item.quantity || 0;
            totalCost += (item.quantity || 0) * (item.unitPrice || 0);
            if (item.children && item.children.length > 0) {
                traverse(item.children);
            }
        });
    }
    
    traverse(bom);
    return { totalItems, totalCost };
}

function formatCurrency(amount) {
    if (amount === undefined || amount === null) return "0";
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getItemNameById(itemId) {
    // جستجو در آیتم‌ها
    const item = items.find(i => i.id === itemId);
    if (item) return item.name;
    
    // جستجو در محصولات (برای زیرمحصولات)
    const product = products.find(p => p.id === itemId);
    if (product) return product.name;
    
    return 'قطعه نامشخص';
}

function renderBOM() {
    const product = products.find(p => p.id === currentProductId);
    if (!product) return;
    
    // محاسبه و نمایش خلاصه
    const { totalItems, totalCost } = calculateTotals(product.bom);
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-cost').textContent = `${formatCurrency(totalCost)} تومان`;
    
    const container = document.getElementById('bom-tree');
    container.innerHTML = '';
    
    function renderItems(items, level = 0) {
        const ul = document.createElement('div');
        ul.className = level > 0 ? 'bom-item-children' : '';
        
        items.forEach(item => {
            const itemName = getItemNameById(item.itemId);
            const quantity = item.quantity || 0;
            const unitPrice = item.unitPrice || 0;
            const itemCost = quantity * unitPrice;
            
            const li = document.createElement('div');
            li.className = 'bom-item';
            li.innerHTML = `
                <div class="bom-item-header">
                    <div>
                        <span class="bom-item-title">${itemName}</span>
                    </div>
                    <div class="bom-item-details">
                        <span class="bom-item-quantity">${quantity} ${item.unit || ''}</span>
                        <span class="bom-item-price">${formatCurrency(unitPrice)} تومان</span>
                        <span class="bom-item-price" style="background: var(--info);">${formatCurrency(itemCost)} تومان</span>
                    </div>
                    <div class="bom-item-actions">
                        <button class="btn-icon-sm add-child" title="افزودن زیرمجموعه" data-id="${item.id}">
                            ➕
                        </button>
                        <button class="btn-icon-sm edit" title="ویرایش" data-id="${item.id}">
                            ✏️
                        </button>
                        <button class="btn-icon-sm delete" title="حذف" data-id="${item.id}">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
            
            // اضافه کردن event listener برای دکمه‌ها
            li.querySelector('.add-child').addEventListener('click', (e) => {
                e.stopPropagation();
                parentId = item.id;
                openBOMItemForm();
            });
            
            li.querySelector('.edit').addEventListener('click', (e) => {
                e.stopPropagation();
                editBOMItem(item);
            });
            
            li.querySelector('.delete').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteBOMItem(item.id);
            });
            
            ul.appendChild(li);
            
            // نمایش زیرمجموعه‌ها
            if (item.children && item.children.length > 0) {
                const childrenContainer = renderItems(item.children, level + 1);
                li.appendChild(childrenContainer);
            }
        });
        
        return ul;
    }
    
    container.appendChild(renderItems(product.bom));
}

function openBOMItemForm() {
    // پر کردن select با آیتم‌های موجود
    const select = document.getElementById('bom-item-select');
    select.innerHTML = '<option value="">انتخاب کنید...</option>';
    
    // اضافه کردن قطعات
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} (${item.unit})`;
        select.appendChild(option);
    });
    
    // اضافه کردن محصولات (برای زیرمحصولات)
    products.forEach(product => {
        // جلوگیری از انتخاب خود محصول
        if (product.id !== currentProductId) {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `محصول: ${product.name}`;
            select.appendChild(option);
        }
    });
    
    document.getElementById('bom-form-title').textContent = parentId ? 'افزودن زیرمجموعه' : 'افزودن آیتم BOM';
    document.getElementById('bom-item-id').value = '';
    document.getElementById('bom-item-select').value = '';
    document.getElementById('bom-quantity').value = '1';
    document.getElementById('bom-unit').value = '';
    document.getElementById('bom-price').value = '';
    showPage('bom-item-form');
}

function editBOMItem(item) {
    // پر کردن select با آیتم‌های موجود
    const select = document.getElementById('bom-item-select');
    select.innerHTML = '<option value="">انتخاب کنید...</option>';
    
    // اضافه کردن قطعات
    items.forEach(i => {
        const option = document.createElement('option');
        option.value = i.id;
        option.textContent = `${i.name} (${i.unit})`;
        select.appendChild(option);
    });
    
    // اضافه کردن محصولات (برای زیرمحصولات)
    products.forEach(p => {
        // جلوگیری از انتخاب خود محصول
        if (p.id !== currentProductId) {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = `محصول: ${p.name}`;
            select.appendChild(option);
        }
    });
    
    document.getElementById('bom-form-title').textContent = 'ویرایش آیتم BOM';
    document.getElementById('bom-item-id').value = item.id;
    document.getElementById('bom-item-select').value = item.itemId;
    document.getElementById('bom-quantity').value = item.quantity || 1;
    
    // تنظیم واحد و قیمت بر اساس آیتم انتخاب شده
    const selectedItem = items.find(i => i.id == item.itemId) || products.find(p => p.id == item.itemId);
    if (selectedItem) {
        document.getElementById('bom-unit').value = selectedItem.unit || '';
        document.getElementById('bom-price').value = selectedItem.unitPrice || 0;
    }
    
    editingItem = item;
    showPage('bom-item-form');
}

function saveBOMItem() {
    const itemId = document.getElementById('bom-item-select').value;
    const quantity = parseInt(document.getElementById('bom-quantity').value) || 1;
    
    if (!itemId) {
        alert('لطفا یک قطعه یا محصول را انتخاب کنید');
        return;
    }
    
    // پیدا کردن آیتم انتخاب شده (قطعه یا محصول)
    const selectedItem = items.find(item => item.id == itemId) || products.find(product => product.id == itemId);
    if (!selectedItem) {
        alert('آیتم انتخاب شده معتبر نیست');
        return;
    }
    
    const newItem = {
        id: generateId(),
        itemId: parseInt(itemId),
        quantity: quantity,
        unit: selectedItem.unit || '',
        unitPrice: selectedItem.unitPrice || 0,
        children: editingItem ? editingItem.children : []
    };
    
    const product = products.find(p => p.id === currentProductId);
    if (!product) return;
    
    if (editingItem) {
        // ویرایش آیتم موجود
        function updateItem(items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === editingItem.id) {
                    items[i] = newItem;
                    return true;
                }
                if (items[i].children && updateItem(items[i].children)) {
                    return true;
                }
            }
            return false;
        }
        
        updateItem(product.bom);
        editingItem = null;
    } else if (parentId) {
        // اضافه کردن زیرمجموعه
        function addItem(items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === parentId) {
                    if (!items[i].children) items[i].children = [];
                    items[i].children.push(newItem);
                    return true;
                }
                if (items[i].children && addItem(items[i].children)) {
                    return true;
                }
            }
            return false;
        }
        
        addItem(product.bom);
        parentId = null;
    } else {
        // اضافه کردن آیتم اصلی
        product.bom.push(newItem);
    }
    
    renderBOM();
    showPage('bom-management');
}

function deleteBOMItem(itemId) {
    if (!confirm('آیا از حذف این آیتم اطمینان دارید؟')) return;
    
    const product = products.find(p => p.id === currentProductId);
    if (!product) return;
    
    function removeItem(items) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === itemId) {
                items.splice(i, 1);
                return true;
            }
            if (items[i].children && removeItem(items[i].children)) {
                return true;
            }
        }
        return false;
    }
    
    removeItem(product.bom);
    renderBOM();
}

// تغییر تم
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.className = currentTheme + '-theme';
}

// توابع مدیریت گزارشات
function renderReportsPage() {
    const select = document.getElementById('report-product-select');
    select.innerHTML = '<option value="">یک محصول را انتخاب کنید...</option>';

    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        select.appendChild(option);
    });

    document.getElementById('report-container').innerHTML = '';
    showPage('reports-page');
}

function generateReport(productId) {
    const container = document.getElementById('report-container');
    if (!productId) {
        container.innerHTML = '<p>لطفا یک محصول را برای نمایش گزارش انتخاب کنید.</p>';
        return;
    }

    const product = products.find(p => p.id == productId);
    if (!product) {
        container.innerHTML = '<p>محصول مورد نظر یافت نشد.</p>';
        return;
    }

    let reportHTML = `
        <div class="report-header">
            <h3>گزارش BOM برای: ${product.name}</h3>
            <p>${product.description || ''}</p>
        </div>
        <table class="report-table">
            <thead>
                <tr>
                    <th>نام قطعه</th>
                    <th>تعداد</th>
                    <th>واحد</th>
                    <th>قیمت واحد</th>
                    <th>مجموع هزینه</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalCost = 0;

    function renderRow(item, level = 0) {
        const itemName = getItemNameById(item.itemId);
        const itemCost = (item.quantity || 0) * (item.unitPrice || 0);
        totalCost += itemCost;

        reportHTML += `
            <tr>
                <td style="padding-right: ${level * 20}px;">${itemName}</td>
                <td>${item.quantity}</td>
                <td>${item.unit}</td>
                <td>${formatCurrency(item.unitPrice)} تومان</td>
                <td>${formatCurrency(itemCost)} تومان</td>
            </tr>
        `;

        if (item.children && item.children.length > 0) {
            item.children.forEach(child => renderRow(child, level + 1));
        }
    }

    product.bom.forEach(item => renderRow(item));

    reportHTML += `
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" style="text-align: left; font-weight: bold;">هزینه کل:</td>
                    <td style="font-weight: bold;">${formatCurrency(totalCost)} تومان</td>
                </tr>
            </tfoot>
        </table>
    `;

    container.innerHTML = reportHTML;
}

function printReport() {
    const reportContent = document.getElementById('report-container').innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = reportContent;
    window.print();
    document.body.innerHTML = originalContent;

    // نیاز به بازسازی Event Listeners پس از چاپ
    // این یک راه حل ساده است، در یک برنامه واقعی باید این بخش بهتر مدیریت شود
    location.reload();
}


// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // نمایش منوی اصلی
    showPage('main-menu');
    
    // دکمه‌های ناوبری اصلی
    document.getElementById('nav-items').addEventListener('click', () => {
        renderItems();
        showPage('items-list');
    });
    
    document.getElementById('nav-products').addEventListener('click', () => {
        renderProducts();
        showPage('products-list');
    });

    document.getElementById('nav-reports').addEventListener('click', () => {
        renderReportsPage();
    });
    
    // دکمه‌های بازگشت به منوی اصلی
    document.getElementById('back-to-main-from-items').addEventListener('click', () => {
        showPage('main-menu');
    });
    
    document.getElementById('back-to-main-from-products').addEventListener('click', () => {
        showPage('main-menu');
    });

    document.getElementById('back-to-main-from-reports').addEventListener('click', () => {
        showPage('main-menu');
    });

    // رویدادهای صفحه گزارشات
    document.getElementById('report-product-select').addEventListener('change', (e) => {
        generateReport(e.target.value);
    });

    document.getElementById('print-report-btn').addEventListener('click', printReport);
    
    // دکمه‌های مدیریت آیتم‌ها
    document.getElementById('add-item-btn').addEventListener('click', addItem);
    document.getElementById('cancel-item').addEventListener('click', () => {
        showPage('items-list');
    });
    document.getElementById('save-item').addEventListener('click', saveItem);
    
    // دکمه‌های مدیریت محصولات
    document.getElementById('create-product-btn').addEventListener('click', createProduct);
    document.getElementById('back-to-products').addEventListener('click', () => {
        showPage('products-list');
    });
    document.getElementById('save-product').addEventListener('click', saveProduct);
    
    // دکمه‌های مدیریت BOM
    document.getElementById('back-to-products-list').addEventListener('click', () => {
        showPage('products-list');
    });
    document.getElementById('add-bom-item').addEventListener('click', openBOMItemForm);
    document.getElementById('cancel-bom-item').addEventListener('click', () => {
        showPage('bom-management');
    });
    document.getElementById('save-bom-item').addEventListener('click', saveBOMItem);
    
    // دکمه تغییر تم
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // تغییر در select آیتم BOM
    document.getElementById('bom-item-select').addEventListener('change', function() {
        const itemId = this.value;
        if (itemId) {
            const item = items.find(i => i.id == itemId) || products.find(p => p.id == itemId);
            if (item) {
                document.getElementById('bom-unit').value = item.unit || '';
                document.getElementById('bom-price').value = item.unitPrice || 0;
            }
        } else {
            document.getElementById('bom-unit').value = '';
            document.getElementById('bom-price').value = '';
        }
    });
});