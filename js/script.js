let nav = 0; // para navegar entre os meses
let clicked = null; // o dia do mês que estiver clicado
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : []; // atividades cadastradas no dia

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const eventTitleInputDescription = document.getElementById('eventTitleInputDescription');
const eventTitleInputDuration = document.getElementById('eventTitleInputDuration');
const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

function openModal(date) {
  clicked = date;

  // todos os eventos encontrados neste dia clicado
  const eventForDay = events.find(e => e.date == clicked);

  if (eventForDay) {
    // modal com título da atividade a ser editada
    document.getElementById('eventText').innerText = `Tarefa: ${eventForDay.title}\nDescrição: ${eventForDay.description}\nDuração: ${eventForDay.duration}`;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }
  backDrop.style.display = 'block';
}

function load() {
  const dt = new Date();

  // avançar e recuar nos meses
  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }
  
  const day = dt.getDate(); 
  const month = dt.getMonth(); // índice no mês atual
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1); // primeiro dia do mês, a partir do mês anterior + 1 
  // console.log(firstDayOfMonth);
  const daysInMonth = new Date(year, month+1,0).getDate(); // último dia do mês

  const dateString = firstDayOfMonth.toLocaleDateString('pt-br', {
    weekday: 'long',
    month: 'numeric',
    year: 'numeric',
    day: 'numeric'
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]); // qtd de dias que estão na primeira semana do calendário
  // console.log(dateString);
  // console.log(paddingDays);
  document.getElementById('monthDisplay').innerText=`${dt.toLocaleDateString('pt-br', {month: 'long'})} ${year}`;

  calendar.innerHTML = '';
  // alinhar os dias do mês de forma a encaixar no calendário
  for (let i=1; i <= (paddingDays + daysInMonth); i++){
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');
    // verificar se o primeiro dia coincide com o primeiro dia da semana, domingo
    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      // data no formado dd/mm/yyyy
      const dayString = `${i-paddingDays}/${month+1}/${year}`;
      // evento armazenado no dia:
      const eventForDay = events.find(e => e.date == dayString);

      // destacar o dia atual, quando o mês estiver no grid
      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      // mostrar evento cadastrado no dia, numa div
      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }


      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('padding');
    }
    calendar.appendChild(daySquare);
  }
}

function closeModal(){
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  eventTitleInputDescription.value = '';
  eventTitleInputDuration.duration ='';
  click=null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');
    events.push({
      date: clicked,
      title: eventTitleInput.value,
      description: eventTitleInputDescription.value,
      duration: eventTitleInputDuration.value
    });
    localStorage.setItem('events', JSON.stringify(events));
    closeModal()
  } else {
    eventTitleInput.classList.add('error');
  }
}

function deleteEvent(){
  // deletar apenas o evento selecionado
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

function initButtons() {
  // navegar entre os meses
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });
  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });
  // salvar e cancelar uma atividade
  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener('click', closeModal);  
  // apagar e fechar uma atividade
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);


}

initButtons();
load();

