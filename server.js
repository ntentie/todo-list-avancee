const express = require('express');
const cors = require('cors'); // Pour gérer les requêtes depuis le frontend
const { readTasks, writeTasks } = require('./backend');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Autoriser les requêtes depuis un autre domaine (frontend)
app.use(express.json()); // Permettre de lire les données JSON envoyées par le frontend

// Route pour obtenir toutes les tâches
app.get('/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks); // Envoyer les tâches au frontend
});

// Route pour ajouter une nouvelle tâche
app.post('/tasks', (req, res) => {
  const tasks = readTasks(); // Lire les tâches existantes
  const newTask = req.body; // Nouvelle tâche envoyée par le frontend
  tasks.push(newTask); // Ajouter la nouvelle tâche
  writeTasks(tasks); // Sauvegarder les tâches mises à jour
  res.status(201).json(newTask); // Répondre avec la nouvelle tâche créée
});

// Route pour mettre à jour une tâche
app.put('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id);
  const updatedTask = req.body;

  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask }; // Mettre à jour les données
    writeTasks(tasks);
    res.json(tasks[taskIndex]); // Retourner la tâche mise à jour
  } else {
    res.status(404).json({ error: 'Tâche introuvable' });
  }
});

// Route pour supprimer une tâche
app.delete('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id);

  const updatedTasks = tasks.filter(task => task.id !== taskId); // Filtrer les tâches
  writeTasks(updatedTasks);
  res.status(204).send(); // Réponse vide (No Content)
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
