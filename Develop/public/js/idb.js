let db;
const request = indexedDB.open("budgettracker", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("budgettracker", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
   uploadRecords();
  }
};

request.onerror = function (event) {
  console.log("Database Error: " + event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["budgettracker"], "readwrite");
  const store = transaction.objectStore("budgettracker");
  store.add(record);
}

function uploadRecords() {
  const transaction = db.transaction(["budgettracker"], "readwrite");
  const store = transaction.objectStore("budgettracker");
  const getAll = store.getAll();
 
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse.message);
          }
          const transaction = db.transaction(["budgettracker"], "readwrite");
          const store = transaction.objectStore("budgettracker");
          store.clear();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

window.addEventListener("online", uploadRecords);
