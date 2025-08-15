// Recupera elementos do HTML
const calendarEl = document.getElementById('calendar');
const taskListEl = document.getElementById('task-list');
const pointActionButton = document.getElementById('point-action-button');

// Define as tarefas
const tasks = [
    { time: '09:00', description: 'Banho' },
    { time: '10:00', description: 'Mingau' },
    { time: '11:00', description: 'Uma fruta' },
    { time: '12:00', description: 'Almoço' },
    { time: '18:00', description: 'Banho' },
    { time: '19:00', description: 'Fruta ou iogurte' },
    { time: '20:00', description: 'Passeio ou desenho' },
    { time: '21:00', description: 'Mingau ou janta' }
];

const dailyTasks = [
    'Dar banho',
    'Fazer mingau',
    'Lavar a mamadeira dele ou escaldar',
    'Assistir apenas 1h de desenho',
    'Comer uma fruta ou tomar iogurte',
    'Levar para passear',
    'Brincar no carrinho dele',
    'Varrer e passar pano no ambiente que ele fica',
    'Deixar engatinhar para estimular os passos'
];

// NOVAS ADIÇÕES PARA A LISTA DE COMPRAS
const cartButton = document.getElementById('cart-button');
const shoppingModal = document.getElementById('shopping-list-modal');
const shoppingCloseButton = document.getElementById('shopping-close-button');
const shoppingListItemsEl = document.getElementById('shopping-list-items');

const shoppingItems = [
    'Fraldas', 'Mingau', 'Pomada', 'Leite em pó', 'Lenços umedecidos', 'Frutas'
];

// --- Funções para o Calendário Dinâmico ---
const calendarButton = document.getElementById('calendar-button');
const calendarModal = document.getElementById('calendar-modal');
const calendarCloseButton = document.getElementById('calendar-close-button');

function openCalendarModal() {
    calendarModal.style.display = 'flex';
    generateCalendar();
}

function closeCalendarModal() {
    calendarModal.style.display = 'none';
}

function generateCalendar() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    calendarEl.innerHTML = '';

    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        calendarEl.appendChild(dayHeader);
    });

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        calendarEl.appendChild(emptyDay);
    }

    const workedDays = JSON.parse(localStorage.getItem('workedDays')) || {};
    const monthKey = `${currentYear}-${currentMonth}`;

    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'day';
        dayEl.textContent = day;
        dayEl.dataset.date = `${currentYear}-${currentMonth}-${day}`;

        if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayEl.classList.add('today');
        }

        if (workedDays[monthKey] && workedDays[monthKey].includes(day)) {
            dayEl.classList.add('selected');
        }

        dayEl.addEventListener('click', () => {
            dayEl.classList.toggle('selected');
            saveWorkedDay(day, currentMonth, currentYear);
        });

        calendarEl.appendChild(dayEl);
    }
}

function saveWorkedDay(day, month, year) {
    const monthKey = `${year}-${month}`;
    const workedDays = JSON.parse(localStorage.getItem('workedDays')) || {};

    if (!workedDays[monthKey]) {
        workedDays[monthKey] = [];
    }

    const index = workedDays[monthKey].indexOf(day);
    if (index > -1) {
        workedDays[monthKey].splice(index, 1);
    } else {
        workedDays[monthKey].push(day);
    }

    localStorage.setItem('workedDays', JSON.stringify(workedDays));
}

// --- Funções para a Lista de Tarefas ---
function displayTasks() {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    
    const nextTask = tasks.find(task => {
        const [taskHour, taskMinute] = task.time.split(':').map(Number);
        const taskTimeInMinutes = taskHour * 60 + taskMinute;
        return taskTimeInMinutes >= currentTimeInMinutes;
    });

    taskListEl.innerHTML = '';
    
    if (nextTask) {
        const li = document.createElement('li');
        li.textContent = `Próxima tarefa: ${nextTask.time} - ${nextTask.description}`;
        li.classList.add('next-task');
        taskListEl.appendChild(li);
    } else {
        const li = document.createElement('li');
        li.textContent = 'Todas as tarefas programadas foram concluídas!';
        taskListEl.appendChild(li);
    }

    dailyTasks.forEach((taskText, index) => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';

        const label = document.createElement('span');
        label.textContent = taskText;
        label.className = 'task-label';

        const savedTasks = JSON.parse(localStorage.getItem('savedTasks')) || {};
        const todayKey = new Date().toDateString();
        const taskKey = `${todayKey}-${taskText}`;

        if (savedTasks[taskKey]) {
            checkbox.checked = true;
            li.classList.add('completed');
        }

        li.appendChild(checkbox);
        li.appendChild(label);
        taskListEl.appendChild(li);

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                li.classList.add('completed');
                savedTasks[taskKey] = true;
            } else {
                li.classList.remove('completed');
                delete savedTasks[taskKey];
            }
            localStorage.setItem('savedTasks', JSON.stringify(savedTasks));
        });
    });
}

// --- Funções para o Modal da Lista de Compras ---
function openShoppingModal() {
    shoppingModal.style.display = 'flex';
    loadShoppingList();
}

function closeShoppingModal() {
    shoppingModal.style.display = 'none';
}

function loadShoppingList() {
    const neededItems = JSON.parse(localStorage.getItem('neededItems')) || [];
    shoppingListItemsEl.innerHTML = '';

    shoppingItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        
        if (neededItems.includes(item)) {
            li.classList.add('needed');
        }

        li.addEventListener('click', () => {
            li.classList.toggle('needed');
            saveShoppingList(item);
        });

        shoppingListItemsEl.appendChild(li);
    });
}

function saveShoppingList(item) {
    let neededItems = JSON.parse(localStorage.getItem('neededItems')) || [];
    const index = neededItems.indexOf(item);

    if (index > -1) {
        neededItems.splice(index, 1);
    } else {
        neededItems.push(item);
    }
    localStorage.setItem('neededItems', JSON.stringify(neededItems));
}


const pointRecordsList = document.getElementById('point-records');

const pointStates = ['Entrada', 'Saída (Intervalo)', 'Retorno (Intervalo)', 'Saída'];

function updatePointButton() {
    const state = localStorage.getItem('pointState') || 'Entrada';
    pointActionButton.textContent = state;
    pointActionButton.className = 'action-button';
    
    switch (state) {
        case 'Entrada':
            pointActionButton.classList.add('point-entrada');
            break;
        case 'Saída (Intervalo)':
            pointActionButton.classList.add('point-intervalo');
            break;
        case 'Retorno (Intervalo)':
            pointActionButton.classList.add('point-retorno');
            break;
        case 'Saída':
            pointActionButton.classList.add('point-saida');
            break;
    }
}

function handlePointAction() {
    const currentState = localStorage.getItem('pointState') || 'Entrada';
    
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const record = { type: currentState, time: timeString };
    const today = now.toLocaleDateString();

    const records = JSON.parse(localStorage.getItem(`pointRecords_${today}`)) || [];
    records.push(record);
    localStorage.setItem(`pointRecords_${today}`, JSON.stringify(records));

    const currentIndex = pointStates.indexOf(currentState);
    const nextIndex = (currentIndex + 1) % pointStates.length;
    const nextState = pointStates[nextIndex];
    localStorage.setItem('pointState', nextState);

    if (currentState === 'Saída') {
        generateAndSendReport();
        localStorage.removeItem(`pointRecords_${today}`);
        localStorage.removeItem('savedTasks');
        localStorage.removeItem('pointState');
    }
    
    updatePointButton();
}

// --- Geração de Relatório e Alerta de Água ---
function generateAndSendReport() {
    const today = new Date().toLocaleDateString();
    const tasks = JSON.parse(localStorage.getItem('savedTasks')) || {};
    const pointRecords = JSON.parse(localStorage.getItem(`pointRecords_${today}`)) || [];
    const neededItems = JSON.parse(localStorage.getItem('neededItems')) || {};

    let reportText = `*Relatório da Rotina - ${today}*\n\n`;

    reportText += '*Tarefas Concluídas:*\n';
    const completedTasks = Object.keys(tasks).filter(taskKey => tasks[taskKey]);
    if (completedTasks.length > 0) {
        completedTasks.forEach(taskKey => {
            const taskName = taskKey.split('-').slice(1).join('-');
            reportText += `- ${taskName}\n`;
        });
    } else {
        reportText += 'Nenhuma tarefa diária concluída.\n';
    }

    reportText += '\n*Registros de Ponto:*\n';
    if (pointRecords.length > 0) {
        pointRecords.forEach(record => {
            reportText += `- ${record.type}: ${record.time}\n`;
        });
    } else {
        reportText += 'Nenhum registro de ponto.\n';
    }
    
    reportText += '\n*Lista de Compras:*\n';
    if (neededItems.length > 0) {
        neededItems.forEach(item => {
            reportText += `- ${item}\n`;
        });
    } else {
        reportText += 'Tudo em estoque.\n';
    }

    const encodedText = encodeURIComponent(reportText);
    const phoneNumber = '+559284011876';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
}

function waterAlert() {
    alert('Hora de dar água para o bebê!');
    showNotification();
}

function showNotification() {
    if (!("Notification" in window)) {
        console.log("Este navegador não suporta notificações.");
        return;
    }

    const nextTask = tasks.find(task => {
        const [taskHour, taskMinute] = task.time.split(':').map(Number);
        const now = new Date();
        const taskTimeInMinutes = taskHour * 60 + taskMinute;
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
        return taskTimeInMinutes >= currentTimeInMinutes;
    });

    const title = nextTask ? `Próxima Tarefa: ${nextTask.description}` : "Rotina do Bebê";
    const body = nextTask ? `A hora de ${nextTask.description} é às ${nextTask.time}!` : "Todas as tarefas de hoje foram concluídas. Não se esqueça de dar água para o bebê.";

    if (Notification.permission === "granted") {
        new Notification(title, { body: body });
    }
}

function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
}

function startAlerts() {
    setInterval(waterAlert, 2 * 60 * 60 * 1000);
    setInterval(displayTasks, 60 * 1000);
}

// --- Adiciona eventos de clique ---
calendarButton.addEventListener('click', openCalendarModal);
cartButton.addEventListener('click', openShoppingModal);

calendarCloseButton.addEventListener('click', closeCalendarModal);
shoppingCloseButton.addEventListener('click', closeShoppingModal);

window.addEventListener('click', (event) => {
    if (event.target === calendarModal) {
        closeCalendarModal();
    }
    if (event.target === shoppingModal) {
        closeShoppingModal();
    }
});

pointActionButton.addEventListener('click', handlePointAction);

// --- Chamadas iniciais ---
displayTasks();
startAlerts();
requestNotificationPermission();
updatePointButton();