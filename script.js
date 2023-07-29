  // Функція для збереження даних у local storage
  function saveDataToLocalStorage(data) {
    localStorage.setItem('tasks', JSON.stringify(data));
}

// Функція для отримання даних з local storage
function getDataFromLocalStorage() {
    const data = localStorage.getItem('tasks');
    return data ? JSON.parse(data) : [];
}

// Функція для відображення таблиці зі збереженими даними
function renderTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    const tasks = getDataFromLocalStorage();
    let totalTime = 0;

    tasks.forEach((task, index) => {
        const { taskName, comment, startTime, endTime } = task;
        const row = document.createElement('tr');

        const taskCell = document.createElement('td');
        taskCell.textContent = taskName;
        row.appendChild(taskCell);

        const commentCell = document.createElement('td');
        commentCell.textContent = comment;
        row.appendChild(commentCell);

        const startTimeCell = document.createElement('td');
        startTimeCell.textContent = startTime;
        row.appendChild(startTimeCell);

        const endTimeCell = document.createElement('td');
        endTimeCell.textContent = endTime;
        row.appendChild(endTimeCell);

        const durationCell = document.createElement('td');
        const duration = calculateDuration(startTime, endTime);
        durationCell.textContent = formatDuration(duration);
        row.appendChild(durationCell);

        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Видалити';
        deleteButton.addEventListener('click', () => deleteTask(index));
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        tableBody.appendChild(row);

        totalTime += duration;
    });

    updateTotalTime(totalTime);
}

// Функція для обрахунку тривалості завдання в хвилинах
function calculateDuration(startTime, endTime) {
  const startParts = startTime.split(":");
  const endParts = endTime.split(":");

  const startHour = parseInt(startParts[0], 10);
  const startMinute = parseInt(startParts[1], 10);
  const endHour = parseInt(endParts[0], 10);
  const endMinute = parseInt(endParts[1], 10);

  const start = new Date(1970, 0, 1, startHour, startMinute);
  const end = new Date(1970, 0, 1, endHour, endMinute);

  const duration = (end - start) / 60000;
  return Math.abs(duration);
}

// Функція для форматування тривалості в години і хвилини
function formatDuration(duration) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours} год ${minutes} хв`;
}

// Функція для оновлення загального часу виконання
function updateTotalTime(totalTime) {
    const totalTimeCell = document.getElementById('total-time');
    totalTimeCell.textContent = formatDuration(totalTime);
}




// Функція для додавання нового завдання
function addTask() {
    const taskName = document.getElementById('task').value;
    const comment = document.getElementById('comment').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

    const task = {
        taskName,
        comment,
        startTime,
        endTime
    };

    const tasks = getDataFromLocalStorage();
    tasks.push(task);

    saveDataToLocalStorage(tasks);
    renderTable();

    document.getElementById('task').value = '';
    document.getElementById('comment').value = '';
    document.getElementById('start-time').value = '';
    document.getElementById('end-time').value = '';
}

// Функція для видалення завдання за індексом
function deleteTask(index) {
    const tasks = getDataFromLocalStorage();
    tasks.splice(index, 1);

    saveDataToLocalStorage(tasks);
    renderTable();
}
function generateTableText() {
          const tasks = getDataFromLocalStorage();
          let tableText = "Завдання\tКоментар\tПочаток\tЗавершення\tЧас виконання\n";

          tasks.forEach((task) => {
              const { taskName, comment, startTime, endTime } = task;
              const duration = calculateDuration(startTime, endTime);
              const formattedDuration = formatDuration(duration);
              tableText += `${taskName}\t${comment}\t${startTime}\t${endTime}\t${formattedDuration}\n`;
          });

          return tableText;
      }

      // Функція для створення та завантаження txt файлу таблиці
      function downloadTable() {
          const tableText = generateTableText();
          const blob = new Blob([tableText], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "task_table.txt";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
      }

      function setPlannedTime() {
        const plannedHoursInput = document.getElementById("planned-hours");
        const plannedHours = parseInt(plannedHoursInput.value, 10);
    
        // Оновлюємо планований час
        plannedTotalMinutes = plannedHours * 60;
        updateTotalTime();
    }
    let plannedTotalMinutes = 0; // Initialize the planned total minutes variable.

// ...

function updateTotalTime() {
    const tasks = getDataFromLocalStorage();
    let totalTime = 0;

    tasks.forEach((task) => {
        const { startTime, endTime } = task;
        const duration = calculateDuration(startTime, endTime);
        totalTime += duration;
    });

    // Calculate the remaining planned time.
    const remainingPlannedTime = plannedTotalMinutes - totalTime;
    const formattedRemainingTime = formatDuration(remainingPlannedTime);

    // Display the total time and remaining planned time.
    const totalTimeCell = document.getElementById('total-time');
    totalTimeCell.textContent = formatDuration(totalTime) + " (Залишилось: " + formattedRemainingTime + ")";
}

// Call updateTotalTime() when the page loads to display the correct total time.
updateTotalTime();

    // Функція для генерації Excel-файлу
    function generateExcel() {
      const tasks = getDataFromLocalStorage();
      const worksheet = XLSX.utils.json_to_sheet(tasks);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      // Створюємо Blob з даними Excel-файлу
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'task_table.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  }

// Відображення таблиці при завантаженні сторінки
renderTable();