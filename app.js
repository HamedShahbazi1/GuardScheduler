/*=====================================
        تنظیمات برنامه
=====================================*/
window.currentProgramDate = null;
window.TOTAL_DAYS = 31;

window.PASSES_PER_DAY = 3;

window.TOTAL_PASSES =
    window.TOTAL_DAYS * window.PASSES_PER_DAY;

window.ALLOWED_SCORES = [0.5, 1, 2];


/*=====================================
        اطلاعات لیست‌ها
=====================================*/
window.replacements = [];
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
    reserve: "guard_scheduler_reserve",
    replacements: "guard_scheduler_replacements"

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
function saveReplacements() {

    localStorage.setItem(
        STORAGE_KEYS.replacements,
        JSON.stringify(window.replacements)
    );

}
function loadReplacements() {

    const data =
        localStorage.getItem(
            STORAGE_KEYS.replacements
        );


    if (data) {

        window.replacements =
            JSON.parse(data);

    }

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
    document.getElementById("exportDataBtn");

const importBtn =
    document.getElementById("importDataBtn");

const importFile =
    document.getElementById("importFile");
const scheduleContainer = document.getElementById("scheduleContainer");
const fairnessContainer = document.getElementById("fairnessContainer");
const reserveTable =
    document.getElementById("reserveTable");

const newReserveNameInput =
    document.getElementById("newReserveName");
const newReserveRoleSelect =
    document.getElementById("newReserveRole");
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
function getPersonReplacementName(listName, personId) {

    const replacement = window.replacements.find(function (item) {

        return (
            item.role === listName &&
            item.originalId === personId
        );

    });


    if (!replacement) {

        return "---";

    }


    if (replacement.replacementId === 0) {

        return "بدون جایگزین";

    }


    const person = reservePersons.find(function (p) {

        return p.id === replacement.replacementId;

    });


    return person
        ? person.name
        : "---";

}
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


<td>

${getPersonReplacementName(listName, person.id)}

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

    console.log("hideModal");

    modalOverlay.style.display = "none";


    modalInput.value = "";

    modalInput.style.display = "none";

    modalSelect.style.display = "none";


    const oldDaySelect =
        document.getElementById("replacementDaySelect");

    if (oldDaySelect) {

      oldDaySelect.style.display = "none";

    }


    const oldLabel =
        document.querySelector(".replacement-label");

    if (oldLabel) {

      oldDaySelect.style.display = "none";

    }

}
function showConfirmModal(title, message, onConfirm) {

    modalTitle.textContent = title;

    modalMessage.textContent = message;

    modalInput.style.display = "none";

    modalOverlay.style.display = "flex";

    modalInput.style.display = "none";

    modalSelect.style.display = "none";
    modalConfirmBtn.onclick = function () {

        hideModal();

        onConfirm();

    };

    modalCancelBtn.onclick = hideModal;

}
function showInputModal(title, message, value, onConfirm) {

 // مخفی کردن بخش های مربوط به جایگزینی
    const replacementDay =
        document.getElementById("replacementDaySelect");

modalSelect.style.display = "none";

modalSelect.innerHTML = "";
    if (replacementDay) {

        replacementDay.style.display = "none";

    }


    const replacementLabel =
        document.querySelector(".replacement-label");


    if (replacementLabel) {

        replacementLabel.style.display = "none";

    }
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


function addPersonToList(listName, inputElement, tableElement) {

    const name = inputElement.value.trim();


    if (name === "") {

        showToast(
            "نام پرسنل را وارد کنید.",
            "warning"
        );

        return;

    }


    if (personExists(listName, name)) {

        showToast(
            "این پرسنل قبلاً ثبت شده است.",
            "error"
        );

        return;

    }


    const person = {

        id: generatePersonId(),

        name: name,

        score: 1,

        active: true,

        assigned: false,

        createdAt: new Date().toISOString(),

        assignedDay: null,

        replacementId: null

    };


    lists[listName].push(person);


    saveList(listName);


    renderList(
        listName,
        tableElement
    );


    inputElement.value = "";


    showToast(
        "پرسنل اضافه شد.",
        "success"
    );

}

function addChiefPerson() {

    addPersonToList(
        "chief",
        document.getElementById("newPersonName"),
        chiefTable
    );

}


function addGuardPerson() {

    addPersonToList(
        "guard",
        document.getElementById("newGuardName"),
        guardTable
    );

}


function addNightPerson() {

    addPersonToList(
        "night",
        document.getElementById("newNightName"),
        nightTable
    );

}
function addReservePerson() {

    const name =
        newReserveNameInput.value.trim();
    const role =
        newReserveRoleSelect.value;
    if (!role) {

        showToast(
            "سمت نیرو را انتخاب کنید",
            "warning"
        );

        return;

    }
    if (name === "") {

        showToast(
            "نام را وارد کنید",
            "warning");

        return;

    }

    reservePersons.push({

        id: generatePersonId(),

        name: name,

        role: role

    });

    saveList("reserve");

    renderReservePersons();

    newReserveNameInput.value = "";
    newReserveRoleSelect.value = "chief";
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

            saveList("reserve");

            renderReservePersons();

        }

    );
    ["chief", "guard", "night"].forEach(function (listName) {

        lists[listName].forEach(function (person) {
            const days = getPersonScheduleDays(
                listName,
                person.id
            );


            if (days.length === 0) {

                showToast(
                    "این فرد هنوز پاس ندارد",
                    "warning"
                );

                return;

            }
            if (person.replacementId === id) {

                person.replacementId = null;

            }

        });

        saveList(listName);

    });

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
    let currentReplacement = null;


    const oldReplacement = window.replacements.find(function (item) {

        return (
            item.originalId === id &&
            item.role === listName
        );

    });


    if (oldReplacement) {

        currentReplacement = oldReplacement.replacementId;

    }

    if (!person) {

        return;

    }


    const days = getPersonScheduleDays(
        listName,
        id
    );


    if (days.length === 0) {

        showToast(
            "ابتدا برنامه را ایجاد کنید",
            "warning"
        );

        return;

    }



    modalTitle.textContent =
        "انتخاب روز جایگزینی";



    modalMessage.textContent =
        "روز مورد نظر برای جایگزینی را انتخاب کنید.";

if (!document.querySelector(".replacement-label")) {

    modalSelect.insertAdjacentHTML(
        "beforebegin",
        `
        <label class="replacement-label">
            📅 انتخاب روز پاس
        </label>
        `
    );

}

    modalInput.style.display = "none";

    modalSelect.style.display = "block";
    let daySelect = document.getElementById("replacementDaySelect");


    if (!daySelect) {

        daySelect = document.createElement("select");

        daySelect.id = "replacementDaySelect";
daySelect.className = "replacement-day-select";
        modalSelect.parentNode.appendChild(daySelect);

    }


    daySelect.innerHTML = "";

daySelect.style.display = "block";
    days.forEach(function (item) {

        daySelect.innerHTML += `

    <option value="${item.day}">

    روز ${item.day} - ${item.weekDay}

    </option>

    `;

    });
    modalOverlay.style.display = "flex";






    const available =
        reservePersons.filter(function (item) {

            return item.role === listName;

        });



    if (available.length === 0) {

        showToast(
            "نیروی جایگزین ثبت نشده است",
            "warning"
        );

        hideModal();

        return;

    }


    modalSelect.innerHTML = `

<option value="0">
بدون جایگزین
</option>

`;

    available.forEach(function (item) {

        modalSelect.innerHTML += `

    <option 
    value="${item.id}"
    ${currentReplacement === item.id ? "selected" : ""}
    >

    ${item.name}

    </option>

    `;

    });


    if (currentReplacement === null) {

        modalSelect.value = "0";

    }


    modalConfirmBtn.onclick = function () {

        const day = Number(daySelect.value);

        const replacementId = Number(modalSelect.value);


        // حذف جایگزینی قبلی همان روز
        window.replacements = window.replacements.filter(function (item) {

            return !(
                item.originalId === id &&
                item.role === listName &&
                item.day === day
            );

        });


        // اگر بدون جایگزین انتخاب شده
       if (replacementId === 0) {


    window.replacements =
    window.replacements.filter(function(item){

        return !(
            item.originalId === id &&
            item.role === listName &&
            item.day === day
        );
        

    });



    const original =
    lists[listName].find(function(p){

        return p.id === id;

    });


    if(monthlySchedule[day-1] && original){

        monthlySchedule[day-1][listName] = original;

    }

saveReplacements();

applyReplacements();

renderSchedule();

renderList(
    listName,
    listName === "chief"
        ? chiefTable
        : listName === "guard"
            ? guardTable
            : nightTable
);

saveSchedule();

hideModal();

showToast(
    "جایگزین با موفقیت ثبت شد",
    "success"
);


    return;

}


        // ثبت جایگزین جدید

        window.replacements.push({

            originalId: id,

            replacementId: replacementId,

            role: listName,

            day: day

        });

        saveReplacements();

        applyReplacements();

        renderSchedule();

        renderList(
            listName,
            listName === "chief"
                ? chiefTable
                : listName === "guard"
                    ? guardTable
                    : nightTable
        );

        saveSchedule();

hideModal();

showToast(
    "جایگزین با موفقیت ثبت شد",
    "success"
);
    };


    modalCancelBtn.onclick = hideModal;


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
function refreshListTable(listName) {


    if (listName === "chief") {

        renderList(
            "chief",
            chiefTable
        );

    }


    if (listName === "guard") {

        renderList(
            "guard",
            guardTable
        );

    }


    if (listName === "night") {

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
    if (!window.ALLOWED_SCORES.includes(person.score)) {

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
        if (!person.role) {

            person.role = "chief";

        }
        const tr = document.createElement("tr");

        tr.innerHTML = `

<td>${index + 1}</td>

<td>${person.name}</td>


<td>

${person.role === "chief"
                ? "افسر جانشین"
                : person.role === "guard"
                    ? "افسر سر"
                    : person.role === "night"
                        ? "افسر پاسدار"
                        : "---"
            }

</td>




        <td>

            <button
            class="edit-reserve-btn"
            data-id="${person.id}">

            

✏️



            </button>

            <button
            class="delete-reserve-btn"
            data-id="${person.id}">

            

🗑️



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


    const savedDate = localStorage.getItem(
        "GuardScheduler_StartDate"
    );


    if(savedDate){

        window.currentProgramDate = new Date(savedDate);

    }
    else{

        window.currentProgramDate = now;


        localStorage.setItem(
            "GuardScheduler_StartDate",
            window.currentProgramDate.toISOString()
        );

    }
localStorage.setItem(
    "GuardScheduler_StartDate",
    window.currentProgramDate.toISOString()
);
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
function getWeekDayByProgramDay(day) {

    const date = new Date(window.currentProgramDate);

    date.setDate(
        date.getDate() + (day - 1)
    );

    const weekDays = [

        "یکشنبه",
        "دوشنبه",
        "سه‌شنبه",
        "چهارشنبه",
        "پنجشنبه",
        "جمعه",
        "شنبه"

    ];

    return weekDays[date.getDay()];

}
function getShamsiDateByProgramDay(day) {


    if (!window.currentProgramDate) {

        return "---";

    }


    const date = new Date(window.currentProgramDate);


    date.setDate(
        date.getDate() + (day - 1)
    );


    return new Intl.DateTimeFormat(
        "fa-IR",
        {
            year:"numeric",
            month:"2-digit",
            day:"2-digit"
        }

    ).format(date);


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
        function (event) {

            if (event.key === "Enter") {

                addGuardPerson();

            }

        }
    );


document
    .getElementById("newNightName")
    .addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                addNightPerson();

            }

        }
    );
newPersonNameInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        addChiefPerson();

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
function updateScheduleReplacement() {

    monthlySchedule.forEach(function (day) {

        ["chief", "guard", "night"].forEach(function (role) {

            let person = day[role];

            if (!person) return;

            const original =
                lists[role].find(function (item) {

                    return item.id === (
                        person.originalPerson
                            ? person.originalPerson.id
                            : person.id
                    );

                });

            if (!original) {
                return;
            }

            if (!original.replacementId) {

                day[role] = original;

                return;

            }

            const replacement =
                reservePersons.find(function (item) {

                    return item.id === original.replacementId;

                });

            if (replacement) {

                day[role] = {

                    ...replacement,

                    originalPerson: original

                };

            }

            if (!original.replacementId) {

                day[role] = original;

                return;

            }



            if (replacement) {

                day[role] = {

                    ...replacement,

                    originalPerson: original

                };

            }

        });

    });

}
loadList("chief");

loadList("guard");

loadList("night");

loadList("reserve");

loadReplacements();

renderList("chief", chiefTable);

renderList("guard", guardTable);

renderList("night", nightTable);

renderReservePersons();

showCurrentDate();

setInterval(showCurrentDate, 1000);

