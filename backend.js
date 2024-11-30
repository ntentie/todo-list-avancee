const fs = require('fs'); // Module pour gérer les fichiers
const path = require('path'); // Module pour gérer les chemins de fichiers

// Chemin du fichier JSON où les tâches seront sauvegardées
const filePath = path.join(__dirname, 'tasks.json');

// Fonction pour lire les tâches depuis le fichier JSON
function readTasks() {
  if (!fs.existsSync(filePath)) {
    // Si le fichier n'existe pas, on retourne une liste vide
    return [];
  }

  const data = fs.readFileSync(filePath, 'utf-8'); // Lire le contenu du fichier
  return JSON.parse(data); // Convertir le JSON en tableau d'objets
}

// Fonction pour écrire les tâches dans le fichier JSON
function writeTasks(tasks) {
  const jsonData = JSON.stringify(tasks, null, 2); // Convertir en JSON avec une mise en forme
  fs.writeFileSync(filePath, jsonData, 'utf-8'); // Écrire dans le fichier
}

// Exporter les fonctions pour les utiliser ailleurs
module.exports = { readTasks, writeTasks };
