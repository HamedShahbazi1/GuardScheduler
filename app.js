/*=====================================
        تنظیمات برنامه
=====================================*/
window.TOTAL_DAYS = 31;

window.PASSES_PER_DAY = 3;

window.TOTAL_PASSES =
    window.TOTAL_DAYS * window.PASSES_PER_DAY;

window.ALLOWED_SCORES = [0.5,1,2];


/*=====================================
        اطلاعات لیست‌ها
=====================================*/

window.lists = {

    chief: [],

    guard: [],

    night: [],

    reserve: []

};
/*=====================================
        Local Storage
=====================================*/
const STORAGE_KEYS = {

    chief: "guard_scheduler_chief",

    guard: "guard_scheduler_guard",

    night: "guard_scheduler_night",

    reserve: "guard_scheduler_reserve"

};
const persons = lists.chief;

const reservePersons = lists.reserve;

const guardPersons = lists.guard;

const nightPersons = lists.night;
/*=====================================
      ذخیره اطلاعات
=====================================*/
function saveList(listName) {

    localStorage.setItem(

        STORAGE_KEYS[listName],

        JSON.stringify(lists[listName])

    );

}
/*=====================================
      بارگذاری اطلاعات
=====================================*/

function loadList(listName) {

    const data = localStorage.getItem(

        STORAGE_KEYS[listName]

    );

    if (!data) {

        return;

    }

    lists[listName].push(

        ...JSON.parse(data)

    );

}
/*=====================================
        عناصر صفحه
=====================================*/
const chiefTable = document.getElementById("chiefTable");

const guardTable = document.getElementById("guardTable");

const nightTable = document.getElementById("nightTable");

const newPersonNameInput = document.getElementById("newPersonName");

const addPersonBtn = document.getElementById("addPersonBtn");
const generateBtn = document.getElementById("generateBtn");
const pdfBtn = document.getElementById("pdfBtn");
const exportBtn =
    document.getElementById("exportBtn");

const importBtn =
    document.getElementById("importBtn");

const importFile =
    document.getElementById("importFile");
const scheduleContainer = document.getElementById("scheduleContainer");
const fairnessContainer = document.getElementById("fairnessContainer");
const reserveTable =
    document.getElementById("reserveTable");

const newReserveNameInput =
    document.getElementById("newReserveName");

const addReserveBtn =
    document.getElementById("addReserveBtn");
const toastContainer = document.getElementById("toastContainer");

const modalOverlay = document.getElementById("modalOverlay");

const modalTitle = document.getElementById("modalTitle");

const modalMessage = document.getElementById("modalMessage");

const modalInput = document.getElementById("modalInput");
const modalSelect =
    document.getElementById("modalSelect");
const modalConfirmBtn = document.getElementById("modalConfirmBtn");

const modalCancelBtn = document.getElementById("modalCancelBtn");
const startDate =
    document.getElementById("startDate");

/*=====================================
            توابع
=====================================*/

/*=====================================
      ساخت ردیف جدول پرسنل
=====================================*/
function createPersonRow(person, index, listName) {

    const tr = document.createElement("tr");

    let period = "";

    if (person.score == 0.5) {

        period = "روز 1 تا 10";

    }
    else if (person.score == 1) {

        period = "روز 11 تا 20";

    }
    else {

        period = "روز 21 تا 31";

    }

    if (!person.active) {

        tr.classList.add("inactive-person");

    }

    // 👇 اینجا دقیقاً tr.innerHTML قرار می‌گیرد

    tr.innerHTML = `

<td>${index + 1}</td>

<td>${person.name}</td>

<td>

<select
class="score-select"
data-list="${listName}"
data-id="${person.id}">

<option value="0.5" ${person.score == 0.5 ? "selected" : ""}>0.5</option>

<option value="1" ${person.score == 1 ? "selected" : ""}>1</option>

<option value="2" ${person.score == 2 ? "selected" : ""}>2</option>

</select>

</td>

<td>${period}</td>

<td>

${person.replacementId

            ?

            reservePersons.find(r => r.id === person.replacementId)?.name

            ||

            "---"

            :

            "---"

        }

</td>

<td>

<button 
class="replace-btn "
data-list="${listName}"
data-id="${person.id}">

🔄

</button>

<button
class="edit-btn "
data-list="${listName}"
data-id="${person.id}">

✏️

</button>

<button
class="delete-btn"
data-list="${listName}"
data-id="${person.id}">

🗑️

</button>

</td>

`;

    // 👇 بعد از innerHTML


    return tr;


}


/*=====================================
      نمایش جدول پرسنل
=====================================*/
function renderList(listName, tableBody) {

    tableBody.innerHTML = "";

    lists[listName].forEach(function (person, index) {

        const row = createPersonRow(
            person,
            index,
            listName
        );

        tableBody.appendChild(row);

    });

}

/*=====================================
        تولید شناسه یکتا
=====================================*/

function generatePersonId() {

    return Date.now() + Math.floor(Math.random() * 1000);

}


/*=====================================
      بررسی نام پرسنل
=====================================*/
function isPersonNameValid(name) {

    return name.trim() !== "";

}



/*=====================================
      بررسی تکراری نبودن نام
=====================================*/


function personExists(listName, name) {

    return lists[listName].some(function (person) {

        return person.name.trim() == name.trim();

    });

}
/*=====================================
            Toast
=====================================*/
function showToast(message, type = "info") {

    const toast = document.createElement("div");

    toast.className = "toast";

    switch (type) {

        case "success":

            toast.style.background = "#16a34a";
            break;

        case "error":

            toast.style.background = "#dc2626";
            break;

        case "warning":

            toast.style.background = "#d97706";
            break;

        default:

            toast.style.background = "#2563eb";

    }

    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(function () {

        toast.remove();

    }, 3000);

}

/*=====================================
            Modal
=====================================*/
function hideModal() {

    modalOverlay.style.display = "none";

    modalInput.value = "";

}
function showConfirmModal(title, message, onConfirm) {

    modalTitle.textContent = title;

    modalMessage.textContent = message;

    modalInput.style.display = "none";

    modalOverlay.style.display = "flex";

    modalConfirmBtn.onclick = function () {

        hideModal();

        onConfirm();

    };

    modalCancelBtn.onclick = hideModal;

}
function showInputModal(title, message, value, onConfirm) {

    modalTitle.textContent = title;

    modalMessage.textContent = message;

    modalInput.style.display = "block";

    modalInput.value = value;

    modalOverlay.style.display = "flex";

    modalInput.focus();

    modalConfirmBtn.onclick = function () {

        onConfirm(modalInput.value);

        hideModal();

    };

    modalCancelBtn.onclick = hideModal;

}

/*=====================================
        افزودن پرسنل
=====================================*/


function addPersonToList(listName,inputElement,tableElement){

    const name = inputElement.value.trim();


    if(name===""){

        showToast(
            "نام پرسنل را وارد کنید.",
            "warning"
        );

        return;

    }


    if(personExists(listName,name)){

        showToast(
            "این پرسنل قبلاً ثبت شده است.",
            "error"
        );

        return;

    }


    const person={

        id:generatePersonId(),

        name:name,

        score:1,

        active:true,

        assigned:false,

        createdAt:new Date().toISOString(),

        assignedDay:null,

        replacementId:null

    };


    lists[listName].push(person);


    saveList(listName);


    renderList(
        listName,
        tableElement
    );


    inputElement.value="";


    showToast(
        "پرسنل اضافه شد.",
        "success"
    );

}

function addChiefPerson(){

    addPersonToList(
        "chief",
        document.getElementById("newPersonName"),
        chiefTable
    );

}


function addGuardPerson(){

    addPersonToList(
        "guard",
        document.getElementById("newGuardName"),
        guardTable
    );

}


function addNightPerson(){

    addPersonToList(
        "night",
        document.getElementById("newNightName"),
        nightTable
    );

}
function addReservePerson() {

    const name =
        newReserveNameInput.value.trim();

    if (name === "") {

        showToast(
            "نام را وارد کنید",
            "warning");

        return;

    }

    reservePersons.push({

        id: generatePersonId(),

        name: name

    });

    saveList("reserve");

    renderReservePersons();

    newReserveNameInput.value = "";

    showToast(
        "نیروی جایگزین اضافه شد",
        "success");

}
function deleteReservePerson(id) {

    showConfirmModal(

        "حذف",

        "نیروی جایگزین حذف شود؟",

        function () {

            const index =
                reservePersons.findIndex(

                    p => p.id === id

                );

            if (index === -1) {

                return;

            }

            reservePersons.splice(index, 1);

            saveList("chief");

            renderReservePersons();

        }

    );
    persons.forEach(function (person) {

        if (person.replacementId === id) {

            person.replacementId = null;

        }

    });
    saveList("chief");

}
function editReservePerson(id) {

    const person =

        reservePersons.find(

            p => p.id === id

        );

    if (!person) {

        return;

    }

    showInputModal(

        "ویرایش",

        "نام جدید",

        person.name,

        function (value) {

            person.name = value.trim();

            saveList("reserve");

            renderReservePersons();

        }

    );

}
function selectReplacement(listName, id) {

    const person = findPersonById(listName, id);

    if (!person) {

        return;

    }

    modalTitle.textContent = "انتخاب جایگزین";

    modalMessage.textContent = "یک نفر را انتخاب کنید.";

    modalInput.style.display = "none";

    modalSelect.style.display = "block";

    modalOverlay.style.display = "flex";

    modalSelect.innerHTML = "";

    modalSelect.innerHTML += `

    <option value="">

    بدون جایگزین

    </option>

    `;

    reservePersons.forEach(function (item) {

        modalSelect.innerHTML += `

        <option

        value="${item.id}"

        ${person.replacementId === item.id ? "selected" : ""}

        >

        ${item.name}

        </option>

        `;

    });

    modalConfirmBtn.onclick = function () {

        person.replacementId =

            modalSelect.value === ""
                ?

                null

                :

                Number(modalSelect.value);

        saveList(listName);

        if (listName === "chief") {

            renderList("chief", chiefTable);

        }

        if (listName === "guard") {

            renderList("guard", guardTable);

        }

        if (listName === "night") {

            renderList("night", nightTable);

        }

        hideModal();

    };

}
/*=====================================
      یافتن پرسنل
=====================================*/
function findPersonById(listName, id) {

    return lists[listName].find(function (person) {

        return person.id === id;

    });

}

function findPersonIndex(listName, id) {

    return lists[listName].findIndex(function (person) {

        return person.id === id;

    });

}

/*=====================================
        حذف پرسنل
=====================================*/
function deletePerson(listName, id) {

    const index = findPersonIndex(listName, id);

    if (index === -1) {

        return;

    }

    showConfirmModal(

        "حذف پرسنل",

        "آیا از حذف این پرسنل مطمئن هستید؟",

        function () {

            lists[listName].splice(index, 1);

            saveList(listName);

            refreshListTable(listName);
            function refreshListTable(listName) {


                if (listName === "chief") {

                    renderList("chief", chiefTable);

                }


                if (listName === "guard") {

                    renderList("guard", guardTable);

                }


                if (listName === "night") {

                    renderList("night", nightTable);

                }


            }

            showToast("پرسنل حذف شد.", "success");

        }

    );

}

/*=====================================
      فعال / غیرفعال
=====================================*/

function togglePerson(listName, id) {

    const person = findPersonById(listName, id);

    if (!person) {

        return;

    }

    person.active = !person.active;

    saveList(listName);

  refreshListTable(listName);

    showToast("وضعیت پرسنل تغییر کرد.", "success");

}

/*=====================================
        تغییر امتیاز
=====================================*/
function refreshListTable(listName){


    if(listName==="chief"){

        renderList(
            "chief",
            chiefTable
        );

    }


    if(listName==="guard"){

        renderList(
            "guard",
            guardTable
        );

    }


    if(listName==="night"){

        renderList(
            "night",
            nightTable
        );

    }

}
function updateScore(listName, id, score) {

    const person = findPersonById(listName, id);

    if (!person) {

        return;

    }

    person.score = Number(score);
    if(!window.ALLOWED_SCORES.includes(person.score)){

        showToast("امتیاز معتبر نیست.", "error");

        return;

    }

saveList(listName);

refreshListTable(listName);

showToast("امتیاز با موفقیت تغییر کرد.", "success");

}

/*=====================================
        ویرایش نام
=====================================*/
function editPerson(listName, id) {

    const person = findPersonById(listName, id);

    if (!person) {

        return;

    }

    showInputModal(

        "ویرایش پرسنل",

        "نام جدید را وارد کنید.",

        person.name,

        function (value) {

            const name = value.trim();

            if (name === "") {

                showToast("نام نمی‌تواند خالی باشد.", "warning");

                return;

            }

            person.name = name;

            saveList(listName);

     refreshListTable(listName);

            showToast("اطلاعات ویرایش شد.", "success");

        }

    );

}
function renderReservePersons() {

    reserveTable.innerHTML = "";

    reservePersons.forEach(function (person, index) {

        const tr = document.createElement("tr");

        tr.innerHTML = `

        <td>${index + 1}</td>

        <td>${person.name}</td>

        <td>

            <button
            class="edit-reserve-btn"
            data-id="${person.id}">

            ویرایش

            </button>

            <button
            class="delete-reserve-btn"
            data-id="${person.id}">

            حذف

            </button>

        </td>

        `;

        reserveTable.appendChild(tr);

    });

}
/*=====================================
      نمایش تاریخ ایجاد برنامه
=====================================*/

/*=====================================
      نمایش تاریخ ایجاد برنامه
=====================================*/

function showCurrentDate() {

    const now = new Date();

    const dateFormatter = new Intl.DateTimeFormat(
        "fa-IR",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
    );

    const timeFormatter = new Intl.DateTimeFormat(
        "fa-IR",
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }
    );

    startDate.innerHTML = `
        <div>تاریخ امروز </div>
        <div>${dateFormatter.format(now)}</div>
        <div>ساعت ${timeFormatter.format(now)}</div>
    `;

}
/*=====================================
        Export Backup
=====================================*/

function exportData() {

    const backup = {

        chief: lists.chief,

        guard: lists.guard,

        night: lists.night,

        reserve: lists.reserve

    };

    const json =
        JSON.stringify(
            backup,
            null,
            2
        );

    const blob =
        new Blob(
            [json],
            {
                type:"application/json"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "guard-scheduler-backup.json";

    link.click();

    URL.revokeObjectURL(url);

    showToast(
        "فایل پشتیبان دانلود شد.",
        "success"
    );

}
/*=====================================
          رویدادها
=====================================*/

addPersonBtn.addEventListener(
    "click",
    addChiefPerson
);
document
.getElementById("addGuardBtn")
.addEventListener(
    "click",
    addGuardPerson
);


document
.getElementById("addNightBtn")
.addEventListener(
    "click",
    addNightPerson
);
document
.getElementById("newGuardName")
.addEventListener(
    "keydown",
    function(event){

        if(event.key==="Enter"){

            addGuardPerson();

        }

    }
);


document
.getElementById("newNightName")
.addEventListener(
    "keydown",
    function(event){

        if(event.key==="Enter"){

            addNightPerson();

        }

    }
);
newPersonNameInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        addPerson();

    }

});
function handlePersonActions(event, listName) {

    const id = Number(event.target.dataset.id);


    if (event.target.classList.contains("replace-btn")) {

        selectReplacement(listName, id);

    }


    if (event.target.classList.contains("edit-btn")) {

        editPerson(listName, id);

    }


    if (event.target.classList.contains("delete-btn")) {

        deletePerson(listName, id);

    }

}
chiefTable.addEventListener("click", function (event) {

    handlePersonActions(event, "chief");

});


guardTable.addEventListener("click", function (event) {

    handlePersonActions(event, "guard");

});


nightTable.addEventListener("click", function (event) {

    handlePersonActions(event, "night");

});
function handleScoreChange(event, listName) {

    if (!event.target.classList.contains("score-select")) {

        return;

    }


    const id = Number(event.target.dataset.id);


    updateScore(

        listName,

        id,

        event.target.value

    );

}



chiefTable.addEventListener(
    "change",
    function (event) {

        handleScoreChange(event, "chief");

    }
);



guardTable.addEventListener(
    "change",
    function (event) {

        handleScoreChange(event, "guard");

    }
);



nightTable.addEventListener(
    "change",
    function (event) {

        handleScoreChange(event, "night");

    }
);
addReserveBtn.addEventListener("click", addReservePerson);

newReserveNameInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        addReservePerson();

    }

});

reserveTable.addEventListener("click", function (event) {

    const id = Number(event.target.dataset.id);

    if (event.target.classList.contains("edit-reserve-btn")) {

        editReservePerson(id);

    }

    if (event.target.classList.contains("delete-reserve-btn")) {

        deleteReservePerson(id);

    }

});

loadList("chief");

loadList("guard");

loadList("night");

loadList("reserve");

renderList("chief", chiefTable);

renderList("guard", guardTable);

renderList("night", nightTable);

renderReservePersons();

showCurrentDate();

setInterval(showCurrentDate, 1000);

exportBtn.addEventListener(

    "click",

    exportData

);
