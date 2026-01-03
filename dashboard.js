let activations = [];

// Initialize Dashboard
async function initDashboard() {
    try {
        const response = await fetch('activations.json');
        activations = await response.json();
    } catch (error) {
        console.warn('Could not load activations.json, starting with empty or demo data.');
        // Fallback to demo data if file doesn't exist or error occurs
        activations = [
            { name: "Ahmed Ali", phone: "777123456", serial: "DEVICE-ABC-123", active: true },
            { name: "Mohammed Saleh", phone: "771987654", serial: "DEVICE-XYZ-789", active: false }
        ];
    }
    renderTable();
}

// Render the activations table
function renderTable() {
    const tbody = document.getElementById('activation-table-body');
    tbody.innerHTML = '';

    activations.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.phone}</td>
            <td><code>${item.serial}</code></td>
            <td>
                <span class="status-badge ${item.active ? 'status-active' : 'status-inactive'}">
                    ${item.active ? 'نشط' : 'متوقف'}
                </span>
            </td>
            <td>
                <div class="action-btns">
                    <button class="action-btn" onclick="toggleStatus(${index})" title="${item.active ? 'إيقاف' : 'استئناف'}">
                        <i class="fas ${item.active ? 'fa-pause' : 'fa-play'}"></i>
                    </button>
                    <button class="action-btn" onclick="openModal(${index})" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteActivation(${index})" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Modal Logic
function openModal(index = -1) {
    const modal = document.getElementById('modal-overlay');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('activation-form');

    if (index === -1) {
        title.innerText = 'إضافة مستخدم جديد';
        form.reset();
        document.getElementById('edit-index').value = -1;
    } else {
        const item = activations[index];
        title.innerText = 'تعديل بيانات المستخدم';
        document.getElementById('name').value = item.name;
        document.getElementById('phone').value = item.phone;
        document.getElementById('serial').value = item.serial;
        document.getElementById('edit-index').value = index;
    }

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
}

// CRUD Actions
document.getElementById('activation-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const index = parseInt(document.getElementById('edit-index').value);
    const newData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        serial: document.getElementById('serial').value,
        active: index === -1 ? true : activations[index].active
    };

    if (index === -1) {
        activations.push(newData);
    } else {
        activations[index] = newData;
    }

    renderTable();
    closeModal();
});

function toggleStatus(index) {
    activations[index].active = !activations[index].active;
    renderTable();
}

function deleteActivation(index) {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
        activations.splice(index, 1);
        renderTable();
    }
}

// Export Data Logic
function exportData() {
    const jsonString = JSON.stringify(activations, null, 4);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'activations.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('تم تحميل ملف activations.json الجديد. يرجى استبدال الملف القديم به.');
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('modal-overlay');
    if (event.target == modal) {
        closeModal();
    }
}

// Start
initDashboard();
