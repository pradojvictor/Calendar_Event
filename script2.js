const addEventBt = document.querySelector(".add-note-btn"),
    addEventContaine = document.querySelector(".add-note-wrapper"),
    addEventCloseBn = document.querySelector(".close"),
    eventbody = document.querySelector(".painel-events"),
    inputName = document.querySelector(".note-name"),
    inputDate = document.querySelector(".note-date"),
    inputValo = document.querySelector(".note-valo"),
    inputType = document.querySelector(".note-select"),
    inputSave = document.querySelector(".add-note-bnt"),
    painelGo = document.querySelector(".valor-go"),
    painelExit = document.querySelector(".valor-exit"),
    painelTotal = document.querySelector(".valor-total");

addEventBt.addEventListener("click", () => {
    addEventContaine.classList.add("active");
});

addEventCloseBn.addEventListener("click", () => {
    addEventContaine.classList.remove("active");
});

document.addEventListener("click", (e) => {
    if (e.target != addEventBt && !addEventContaine.contains(e.target)) {
        addEventContaine.classList.remove("active");
    }
})

let notes;

inputSave.onclick = () => {
    if (inputName.value === "" || inputValo.value === "" || inputType.value === "" || inputDate.value === "") {
        return alert("Preencha todos os dados!");
    }

    notes.push({
        title: inputName.value,
        date: inputDate.value,
        valor: inputValo.value,
        type: inputType.value,
    });

    setNotesDB();
    loadNotes();

    inputName.value = "";
    inputDate.value = "";
    inputValo.value = "";
}

function deleteNote(index) {
    notes.splice(index, 1);
    setNotesDB();
    loadNotes();
}

function insertItem(note, index) {
    eventbody.innerHTML += `
    <div class="event">
        <div class="title">${note.title}</div>
        <div class="date-hora">${note.date}</div>
        <div class="status">
            ${note.type === "entrou"
            ? '<i>↓</i>'
            : '<i>↑</i>'
        }
        </div>
                <div class="valo">
                    <span>$</span>
                    ${note.valor}
                </div>
        <div class="div-btn-delete" >
            <button class="btn-delete" onclick="deleteNote(${index})">
                <img src="img/lixeira01.svg" alt="icon finance">
            </button>
        </div>
    </div>
    `;
}

function loadNotes() {
    notes = getNotesBD();
    eventbody.innerHTML = "";
    notes.forEach((note, index) => {
        insertItem(note, index);
    });
    getTotals();
}

function getTotals() {
    const valorGo = notes
        .filter((note) => note.type === "entrou")
        .map((transaction) => Number(transaction.valor));

    const valorExit = notes
        .filter((note) => note.type === "saiu")
        .map((transaction) => Number(transaction.valor));

    const totalGo = valorGo
        .reduce((acc, cur) => acc + cur, 0)
        .toFixed(2);

    const totalExit = Math.abs(
        valorExit.reduce((acc, cur) => acc + cur, 0)
    ).toFixed(2);

    const totalNotes = (totalGo - totalExit).toFixed(2);

    painelGo.innerHTML = `$ ${totalGo}`;
    painelExit.innerHTML = `$ ${totalExit}`;
    painelTotal.innerHTML = `$ ${totalNotes}`;
}

const getNotesBD = () => JSON.parse(localStorage.getItem("db_notes")) ?? [];
const setNotesDB = () => localStorage.setItem("db_notes", JSON.stringify(notes));
loadNotes()

