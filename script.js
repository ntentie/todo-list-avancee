const tasksContainer = document.getElementById('tasks-container');
const taskForm = document.getElementById('create-task-form');

// URL de l'API backend
const API_URL = 'http://localhost:3000/tasks';

// Tableau pour stocker les tâches
let tasks = [];

// Charger les tâches au démarrage
async function loadTasks() {
  const response = await fetch(API_URL);
  tasks = await response.json(); // Charger les tâches depuis le backend
  renderTasks(); // Afficher les tâches
}

// Fonction pour afficher les tâches
function renderTasks() {
    // Réinitialiser les conteneurs (sections de statut)
    tasksContainer.innerHTML = `
      <h3>Pas commencé</h3>
      <ul id="not-started"></ul>
      <h3>En cours</h3>
      <ul id="in-progress"></ul>
      <h3>Terminé</h3>
      <ul id="completed"></ul>
    `;
  
    // Ajouter chaque tâche mise à jour dans la bonne section
    tasks.forEach(task => {
      const taskList = document.getElementById(task.status.replace(' ', '-')); // Section correspondante
      const taskElement = document.createElement('li');
  
      // Contenu HTML pour chaque tâche
      taskElement.innerHTML = `
        <div class="task-details">
          <strong>${task.title}</strong>
          <span class="badge priority-${task.priority}">${task.priority}</span>
          <p>${task.description}</p>
          <small>
            Créée : ${task.createdAt}
            ${task.updatedAt ? `| Modifiée : ${task.updatedAt}` : ''}
          </small>
        </div>
        <div class="task-actions">
          <select class="change-status">
            <option value="not started" ${task.status === 'not started' ? 'selected' : ''}>Pas commencé</option>
            <option value="in progress" ${task.status === 'in progress' ? 'selected' : ''}>En cours</option>
            <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Terminé</option>
          </select>
          <button class="edit">✏ Modifier</button>
          <button class="delete">✖ Supprimer</button>
        </div>
      `;
  
      // Gestion des événements pour cette tâche
      taskElement.querySelector('.change-status').addEventListener('change', function () {
        const newStatus = this.value; // Nouveau statut
        const updatedTask = { ...task, status: newStatus, updatedAt: new Date().toLocaleString() };
        updateTask(task.id, updatedTask); // Mise à jour via API
      });
  
      taskElement.querySelector('.delete').addEventListener('click', function () {
        deleteTaskFromInterface(task.id); // Supprimer uniquement de l'interface
      });
  
      taskElement.querySelector('.edit').addEventListener('click', function () {
        editTask(task); // Pré-remplir le formulaire pour modification
      });
  
      // Ajouter la tâche mise à jour à la section correspondante
      taskList.appendChild(taskElement);
    });
  }
  
  

// Ajouter une nouvelle tâche
taskForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;
  const priority = document.getElementById('task-priority').value;

  const task = {
    id: Date.now(),
    title,
    description,
    priority,
    status: 'not started',
    createdAt: new Date().toLocaleString(),
    updatedAt: null,
  };

  // Envoyer la nouvelle tâche au backend
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });

  if (response.ok) {
    tasks.push(await response.json()); // Ajouter la tâche localement
    renderTasks(); // Réafficher les tâches
    taskForm.reset(); // Réinitialiser le formulaire
  }
});

// Mettre à jour une tâche
async function updateTask(taskId, updatedData) {
    // Envoyer la mise à jour au backend
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
  
    if (response.ok) {
      // Remplacer la tâche dans le tableau local
      tasks = tasks.map(task => task.id === taskId ? { ...task, ...updatedData } : task);
  
      // Re-rendre uniquement l'interface
      renderTasks(); // Rafraîchir les sections d'affichage
    } else {
      console.error('Erreur lors de la mise à jour de la tâche');
    }
  }
   

// Supprimer une tâche
async function deleteTask(taskId) {
  await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
  tasks = tasks.filter(task => task.id !== taskId);
  renderTasks();
}

// Modifier une tâche (pré-remplir le formulaire pour modification)
function editTask(task) {
    // Pré-remplir les champs du formulaire avec les données de la tâche
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-description').value = task.description;
    document.getElementById('task-priority').value = task.priority;
  
    // Remplacer l'action du formulaire par une mise à jour
    taskForm.onsubmit = async function (event) {
      event.preventDefault();
  
      // Mettre à jour les détails de la tâche
      const updatedTask = {
        ...task, // Conserve les autres propriétés existantes
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        priority: document.getElementById('task-priority').value,
        updatedAt: new Date().toLocaleString(), // Met à jour la date de modification
      };
  
      // Envoie la tâche modifiée au backend
      await updateTask(task.id, updatedTask);
  
      // Réinitialiser le formulaire et revenir à la logique d'ajout
      taskForm.reset();
      taskForm.onsubmit = addTask; // Revenir à l'ajout après la modification
    };
  }
  function deleteTaskFromInterface(taskId) {
    // Supprimer uniquement dans le tableau local
    tasks = tasks.filter(task => task.id !== taskId);
  
    // Mettre à jour l'affichage
    renderTasks();
  }
  
  function deleteTaskFromInterface(taskId) {
    // Supprimer uniquement dans le tableau local
    tasks = tasks.filter(task => task.id !== taskId);
  
    // Mettre à jour l'affichage
    renderTasks();
  }  

// Charger les tâches au lancement
loadTasks();
