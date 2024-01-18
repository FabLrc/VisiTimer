function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return [hours, minutes, remainingSeconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .join(":");
}

function updateDisplay(counter) {
  const formattedTime = formatTime(counter);
  document.getElementById("counter").innerText = formattedTime;
}

// Mettre à jour l'affichage lorsque le popup est chargé
document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(["counter"], function (result) {
    if (chrome.runtime.lastError) {
      console.error("Error fetching counter:", chrome.runtime.lastError);
    } else {
      updateDisplay(result.counter ? result.counter : 0);
    }
  });

  // Écouter les messages du script d'arrière-plan pour les mises à jour en temps réel
  chrome.runtime.onMessage.addListener(function (message) {
    if (message.counter !== undefined) {
      updateDisplay(message.counter);
    }
  });

  // Gestionnaire de clic pour le bouton Discord
  const discordButton = document.getElementById("discordButton");
  if (discordButton) {
    discordButton.addEventListener("click", function () {
      chrome.tabs.create({ url: "https://discordapp.com/users/hirochifaa" }); // Remplacez par l'URL spécifique si nécessaire
    });
  }
});
