function getFirebase() {
  const fbStatus = new XMLHttpRequest();
  const url='/admin/controls/firebaseStatus';
  fbStatus.open("GET", url);
  fbStatus.send();
  fbStatus.onreadystatechange = (e) => {
    console.log(fbStatus.responseText);
    const state = JSON.parse(fbStatus.responseText);
    if (state.firebaseStatus == true) {
      document.getElementById("status").textContent = "Verbindung zu Firebase hergestellt";
    } else {
      document.getElementById("status").textContent = "Verbindung zu Firebase nicht hergestellt";
    }
  }
}

function requestBackup() {
  const backup = new XMLHttpRequest();
  const url='/admin/controls/createBackup';
  backup.open("POST", url);
  backup.send();
  backup.onreadystatechange = (e) => {
    console.log(backup.responseText);
    const state = JSON.parse(backup.responseText);
    if (state.createdBackup == true) {
      document.getElementById("backup").textContent = "Backup erstellt";
    } else if (state.createdBackup == false) {
      document.getElementById("backup").textContent = "Backup konnte nicht erstellt werden";
    }
  }
}

function requestPopulate() {
  const populate = new XMLHttpRequest();
  const url='/admin/controls/populateDB';
  populate.open("POST", url);
  populate.send();
  populate.onreadystatechange = (e) => {
    console.log(populate.responseText);
    const state = JSON.parse(populate.responseText);
    if (state.performedPopulate == true) {
      document.getElementById("populate").textContent = "Datenbank aktualisiert";
    } else if (state.performedPopulate == false) {
      document.getElementById("populate").textContent = "Datenbank konnte nicht aktualisiert werden";
    }
  }
}
