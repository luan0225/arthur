// Recupera elementos do HTML
const calendarEl = document.getElementById('calendar');
const taskListEl = document.getElementById('task-list');
const pointActionButton = document.getElementById('point-action-button');
const medicationListEl = document.getElementById('medication-list');
const medicationButton = document.getElementById('medication-button');
const medicationModal = document.getElementById('medication-modal');
const medicationCloseButton = document.getElementById('medication-close-button');
const pointTimerEl = document.getElementById('point-timer');


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

// NOVAS ADIÇÕES PARA REMÉDIOS
const medications = [
{ time: '05:00', name: 'Amoxicilina' },
{ time: '06:00', name: 'Paracetamol/Ibuprofeno' },
{ time: '13:00', name: 'Amoxicilina' },
{ time: '14:30', name: 'Paracetamol/Ibuprofeno' },
{ time: '18:00', name: 'Paracetamol/Ibuprofeno' },
{ time: '21:00', name: 'Amoxicilina' },
{ time: '23:00', name: 'Paracetamol/Ibuprofeno' }
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

// Lógica para encontrar e exibir o próximo remédio
const nextMedication = medications.find(med => {
const [medHour, medMinute] = med.time.split(':').map(Number);
const medTimeInMinutes = medHour * 60 + medMinute;
return medTimeInMinutes >= currentTimeInMinutes;
});

if (nextMedication) {
const li = document.createElement('li');
li.textContent = `Próximo remédio: ${nextMedication.time} - ${nextMedication.name}`;
li.classList.add('next-task'); // Reutiliza a classe para destaque
taskListEl.appendChild(li);
} else {
const li = document.createElement('li');
li.textContent = 'Nenhum remédio programado para hoje.';
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

// --- Funções do Sistema de Ponto ---
let pointTimerInterval;
const pointStates = ['Entrada', 'Saída (Intervalo)', 'Retorno (Intervalo)', 'Saída'];

function updatePointButton() {
const state = localStorage.getItem('pointState') || 'Entrada';
pointActionButton.textContent = state;
pointActionButton.className = 'action-button';
pointActionButton.disabled = false;
pointTimerEl.textContent = '';
clearInterval(pointTimerInterval);

switch (state) {
case 'Entrada':
pointActionButton.classList.add('point-entrada');
break;
case 'Saída (Intervalo)':
pointActionButton.classList.add('point-intervalo');
startPointTimer(localStorage.getItem('lastPointTime'), 2 * 60 * 60 * 1000);
break;
case 'Retorno (Intervalo)':
pointActionButton.classList.add('point-retorno');
startPointTimer(localStorage.getItem('lastPointTime'), 60 * 60 * 1000);
break;
case 'Saída':
pointActionButton.classList.add('point-saida');
startPointTimer(localStorage.getItem('lastPointTime'), 60 * 60 * 1000);
break;
}
}

function handlePointAction() {
const currentState = localStorage.getItem('pointState') || 'Entrada';
if (pointActionButton.disabled) {
return;
}
clearInterval(pointTimerInterval);

const now = new Date();
const timeString = now.toLocaleTimeString();
const record = { type: currentState, time: timeString };
const today = now.toLocaleDateString();

const records = JSON.parse(localStorage.getItem(`pointRecords_${today}`)) || [];
records.push(record);
localStorage.setItem(`pointRecords_${today}`, JSON.stringify(records));

// Salva o timestamp da última ação
localStorage.setItem('lastPointTime', now.getTime());

const currentIndex = pointStates.indexOf(currentState);
const nextIndex = (currentIndex + 1) % pointStates.length;
const nextState = pointStates[nextIndex];
localStorage.setItem('pointState', nextState);

if (currentState === 'Saída') {
generateAndSendReport();
localStorage.removeItem(`pointRecords_${today}`);
localStorage.removeItem('savedTasks');
localStorage.removeItem('pointState');
localStorage.removeItem('lastPointTime');
}

updatePointButton();
}

function startPointTimer(lastTime, delay) {
const timeToUnlock = parseInt(lastTime) + delay;
const remaining = timeToUnlock - new Date().getTime();

if (remaining > 0) {
pointActionButton.disabled = true;
pointTimerInterval = setInterval(() => {
const now = new Date().getTime();
const remainingTime = timeToUnlock - now;

if (remainingTime <= 0) {
clearInterval(pointTimerInterval);
pointActionButton.disabled = false;
pointTimerEl.textContent = 'Pronto!';
return;
}
const hours = Math.floor(remainingTime / (1000 * 60 * 60));
const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

const formattedTime =
`${hours.toString().padStart(2, '0')}:` +
`${minutes.toString().padStart(2, '0')}:` +
`${seconds.toString().padStart(2, '0')}`;

pointTimerEl.textContent = `Disponível em: ${formattedTime}`;
}, 1000);
} else {
pointActionButton.disabled = false;
pointTimerEl.textContent = 'Pronto!';
}
}

// --- Funções para a Lista de Remédios ---
function openMedicationModal() {
medicationModal.style.display = 'flex';
displayMedications();
}

function closeMedicationModal() {
medicationModal.style.display = 'none';
}

function displayMedications() {
medicationListEl.innerHTML = '';
medications.forEach(med => {
const li = document.createElement('li');
li.textContent = `${med.time} - ${med.name}`;
medicationListEl.appendChild(li);
});
}

// --- Funções para Notificações de Remédios ---
function setupMedicationAlerts() {
medications.forEach(med => {
const [medHour, medMinute] = med.time.split(':').map(Number);

const now = new Date();
let alertTime = new Date();
alertTime.setHours(medHour, medMinute, 0, 0);

if (alertTime.getTime() < now.getTime()) {
alertTime.setDate(alertTime.getDate() + 1);
}

const timeUntilAlert = alertTime.getTime() - now.getTime();

setTimeout(() => {
showNotification(`Hora do Remédio: ${med.name}`, `Não se esqueça de dar ${med.name} agora!`);
setInterval(() => {
showNotification(`Hora do Remédio: ${med.name}`, `Não se esqueça de dar ${med.name} agora!`);
}, 24 * 60 * 60 * 1000);
}, timeUntilAlert);
});
}


// --- Geração de Relatório e Alerta de Água ---
function generateAndSendReport() {
const today = new Date().toLocaleDateString();
const tasks = JSON.parse(localStorage.getItem('savedTasks')) || {};
const pointRecords = JSON.parse(localStorage.getItem(`pointRecords_${today}`)) || {};
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

function showNotification(title, body) {
if (!("Notification" in window)) {
console.log("Este navegador não suporta notificações.");
return;
}

const nextTask = tasks.find(task => {
const [taskHour, taskMinute] = task.time.split(':').map(Number);
const now = new Date();
const taskTimeInMinutes = taskHour * 60 + now.getMinutes();
const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
return taskTimeInMinutes >= currentTimeInMinutes;
});

const defaultTitle = nextTask ? `Próxima Tarefa: ${nextTask.description}` : "Rotina do Bebê";
const defaultBody = nextTask ? `A hora de ${nextTask.description} é às ${nextTask.time}!` : "Todas as tarefas de hoje foram concluídas. Não se esqueça de dar água para o bebê.";

if (Notification.permission === "granted") {
new Notification(title || defaultTitle, { body: body || defaultBody });
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
medicationButton.addEventListener('click', openMedicationModal);
medicationCloseButton.addEventListener('click', closeMedicationModal);
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
if (event.target === medicationModal) {
closeMedicationModal();
}
});

pointActionButton.addEventListener('click', handlePointAction);

// --- Chamadas iniciais ---
displayTasks();
startAlerts();
setupMedicationAlerts();
requestNotificationPermission();
updatePointButton();