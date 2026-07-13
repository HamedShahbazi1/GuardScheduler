/*=====================================
      دریافت افراد فعال
=====================================*/
window.currentProgramDate = null;
let monthCalendar = [];

let holidayDays = [];

let weekendDays = [];

let normalDays = [];

const STORAGE_KEY = "GuardSchedulerSchedule";

const REPORT_KEY = "GuardSchedulerReport";
function getActivePersons(listName) {

    return lists[listName].filter(function (person) {

        return person.active;

    });

}

/*=====================================
      ساخت گروه برنامه
=====================================*/

function createScheduleGroups() {

    return {

        chief: getActivePersons("chief"),

        guard: getActivePersons("guard"),

        night: getActivePersons("night")

    };

}

/*=====================================
      محاسبه سهم هر نفر
=====================================*/

function calculateTargetPass(persons) {


    let totalWeight = 0;


    persons.forEach(function (person) {


        // همه افراد سهم یکسان دارند
        totalWeight += 1;


    });



    persons.forEach(function (person) {


        let weight = 1;



        person.targetPass =
            Math.floor(
                TOTAL_PASSES *
                weight /
                totalWeight
            );


        person.assignedCount = 0;

        person.stats = {

            holiday: 0,

            weekend: 0,

            thursday: 0,

            friday: 0

        };


    });


}

/*=====================================
      بررسی وجود اطلاعات
=====================================*/

function validateScheduleData(groups) {

    if (groups.chief.length === 0) {

        showToast("افسر جانشین ثبت نشده است.", "warning");

        return false;

    }

    if (groups.guard.length === 0) {

        showToast("افسر سر  ثبت نشده است.", "warning");

        return false;

    }

    if (groups.night.length === 0) {

        showToast("افسر پاسدار ثبت نشده است.", "warning");

        return false;

    }

    return true;

}



/*=====================================
      اولویت روز برای هر امتیاز
=====================================*/

function getDayPriority(person, dayInfo) {

    // امتیاز 2 (بهترین روزها)
    if (person.score === 2) {

        if (dayInfo.weekend || dayInfo.holiday) {

            return -1000;

        }

        return 300;

    }

    // امتیاز 1 (متعادل)
    if (person.score === 1) {

        if (dayInfo.holiday) {

            return 120;

        }

        if (dayInfo.weekend) {

            return 150;

        }

        return 200;

    }

    // امتیاز 0.5 (روزهای سخت)
    if (person.score === 0.5) {

        if (dayInfo.holiday) {

            return 300;

        }

        if (dayInfo.weekend) {

            return 250;

        }

        return 50;

    }

    return 0;

}


/*=====================================
      انتخاب نفر
=====================================*/

function pickPerson(persons, day) {




    const dayInfo =
        monthCalendar.find(function (item) {

            return item.day === day;

        });

    let available =
        persons.filter(function (person) {

            if (
                person.score === 2 &&
                (dayInfo.weekend || dayInfo.holiday)
            ) {
                return false;
            }

            return (

                person.assignedCount < person.targetPass

                &&

                !isAlreadyAssigned(
                    person,
                    day
                )

            );

        });



    if (available.length === 0) {

        return null;

    }



    available.sort(function (a, b) {

        const priorityA =
            getDayPriority(a, dayInfo);

        const priorityB =
            getDayPriority(b, dayInfo);

        if (priorityA !== priorityB) {

            return priorityB - priorityA;

        }

        /* اگر امروز تعطیل یا آخر هفته باشد */

        if (dayInfo.weekend || dayInfo.holiday) {

            if (a.stats.holiday !== b.stats.holiday) {

                return a.stats.holiday - b.stats.holiday;

            }

        }

        if (a.assignedCount !== b.assignedCount) {

            return a.assignedCount - b.assignedCount;

        }

        return Math.random() - 0.5;

    });

    const minAssigned = available[0].assignedCount;

    const candidates = available.filter(function (person) {

        return person.assignedCount === minAssigned;

    });

    const randomIndex =
        Math.floor(Math.random() * candidates.length);

    const selected = candidates[randomIndex];





    if (!assignedHistory[selected.id]) {

        assignedHistory[selected.id] = [];

    }


    assignedHistory[selected.id].push(day);

    selected.assignedCount =
        (selected.assignedCount || 0) + 1;

    /* ثبت آمار روز */

    if (dayInfo.weekend) {

        selected.stats.weekend++;

    }

    if (dayInfo.weekDay === "پنجشنبه") {

        selected.stats.thursday++;

    }

    if (dayInfo.weekDay === "جمعه") {

        selected.stats.friday++;

    }

    if (dayInfo.holiday) {

        selected.stats.holiday++;

    }
    /* اگر جایگزین انتخاب شده باشد */
    if (selected.replacementId) {

        const replacement =
            lists.reserve.find(function (person) {

                return person.id === selected.replacementId;

            });

        if (replacement) {

            return {

                ...replacement,

                originalPerson: selected

            };

        }

    }

    return selected;


}

/*=====================================
      ساخت اطلاعات یک روز
=====================================*/

function createDaySchedule(day) {

    return {

        day: day,

        chief: null,

        guard: null,

        night: null

    };

}

function addToReport(person, role, day) {

    if (!person) {

        return;

    }

    const id = person.originalPerson
        ? person.originalPerson.id
        : person.id;

    const name = person.originalPerson
        ? person.originalPerson.name
        : person.name;

    if (!scheduleReport[id]) {

        scheduleReport[id] = {

            name: name,

            role: role,

            count: 0,

            days: []

        };

    }

    scheduleReport[id].count++;

    scheduleReport[id].days.push(day);

}

/*=====================================
      ساخت برنامه ماهانه
=====================================*/

let monthlySchedule = [];

let assignedHistory = {};
let scheduleReport = {};


/*=====================================
      ذخیره برنامه
=====================================*/

function saveSchedule() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(monthlySchedule)
    );

    localStorage.setItem(
        REPORT_KEY,
        JSON.stringify(scheduleReport)
    );

}


/*=====================================
      بازیابی برنامه
=====================================*/

function loadSchedule() {

    const schedule =
        localStorage.getItem(STORAGE_KEY);

    const report =
        localStorage.getItem(REPORT_KEY);

    if (!schedule) {

        return false;

    }

    monthlySchedule =
        JSON.parse(schedule);

    if (report) {

        scheduleReport =
            JSON.parse(report);

    }

    return true;

}

function generateSchedule() {

    const groups = createScheduleGroups();
    calculateTargetPass(groups.chief);

    calculateTargetPass(groups.guard);

    calculateTargetPass(groups.night);


    if (!validateScheduleData(groups)) {

        return;

    }


    monthlySchedule = [];

    assignedHistory = {};

    scheduleReport = {};
    localStorage.removeItem(STORAGE_KEY);

    localStorage.removeItem(REPORT_KEY);
    buildMonthCalendar();

    console.log(monthCalendar);

    console.log(weekendDays);

    console.log(normalDays);

    for (
        let day = 1;
        day <= TOTAL_DAYS;
        day++
    ) {


        const schedule =
            createDaySchedule(day);



        const chief =
            pickPerson(groups.chief, day);

        const guard =
            pickPerson(groups.guard, day);

        const night =
            pickPerson(groups.night, day);


        schedule.chief = chief;
        schedule.guard = guard;
        schedule.night = night;


        monthlySchedule.push(schedule);
        addToReport(schedule.chief, "افسر جانشین", day);

        addToReport(schedule.guard, "افسر سر", day);

        addToReport(schedule.night, "افسر پاسدار", day);

    }


    console.log(monthlySchedule);


    renderSchedule();

    renderReport();
    saveSchedule();
    showToast(
        "برنامه 31 روزه ایجاد شد",
        "success"
    );


}
function getPassPriority(person) {

    if (person.score === 2) {

        return ["pass1", "pass2"];

    }


    if (person.score === 1) {

        return ["pass2", "pass3"];

    }


    if (person.score === 0.5) {

        return ["pass3"];

    }


    return [];

}
/*=====================================
      بررسی انتخاب قبلی
=====================================*/

function isAlreadyAssigned(person, day) {


    if (!assignedHistory[person.id]) {

        assignedHistory[person.id] = [];

    }


    return assignedHistory[person.id].includes(day);


}

/*=====================================
      نمایش برنامه ماهانه
=====================================*/

/*=====================================
      نمایش برنامه ماهانه کارت بندی
=====================================*/

function renderSchedule() {

    scheduleContainer.innerHTML = "";


    monthlySchedule.forEach(function (day) {


        const card = document.createElement("div");

        card.className = "day-card";


        card.innerHTML = `

   <div class="day-title">

    <div>

        روز ${day.day}

    </div>

    <div class="day-week">

        ${getWeekDayByProgramDay(day.day)}

        |

        ${getShamsiDateByProgramDay(day.day)}

    </div>

</div>


        <div class="pass-list">


            <div class="pass-item pass1">


                <strong>
                <span>افسر جانشین</span>

                </strong>
         ${day.chief ? `

${day.chief.originalPerson ? `

<details class="replacement-details">

    <summary>

🔄 جایگزین افسر: ${day.chief.originalPerson.name}

</summary>

    <div class="replacement-content">

       

        <div class="replacement-arrow">

            ⬇

        </div>

        <div class="replacement-person">

            ✅ ${day.chief.name}

        </div>

    </div>

</details>

` : `

<div class="person-name">

    ${day.chief.name}

</div>

`}

` : "---"}

            </div>



            <div class="pass-item pass2">


                <strong>
                <span>افسر سر</span>

                </strong>
    ${day.guard ? `

${day.guard.originalPerson ? `

<details class="replacement-details">

    <summary>

        🔄 دارای جایگزین

    </summary>

    <div class="replacement-content">

      

        <div class="replacement-arrow">

            ⬇

        </div>

        <div class="replacement-person">

            ✅ ${day.guard.name}

        </div>

    </div>

</details>

` : `

<div class="person-name">

    ${day.guard.name}

</div>

`}

` : "---"}

            </div>



            <div class="pass-item pass3">
  <strong>
                <span>افسر پاسدار</span>
 </strong>
              
        ${day.night ? `

${day.night.originalPerson ? `

<details class="replacement-details">

    <summary>

        🔄 دارای جایگزین

    </summary>

    <div class="replacement-content">

     

        <div class="replacement-arrow">

            ⬇

        </div>

        <div class="replacement-person">

            ✅ ${day.night.name}

        </div>

    </div>

</details>

` : `

<div class="person-name">

    ${day.night.name}

</div>

`}

` : "---"}
               

            </div>



        </div>

        `;


        scheduleContainer.appendChild(card);


    });


}



generateBtn.addEventListener(
    "click",
    generateSchedule
);


window.addEventListener("load", function () {

    if (loadSchedule()) {

        renderSchedule();

        renderReport();

    }

});

function buildMonthCalendar() {

    monthCalendar = [];

    holidayDays = [];

    weekendDays = [];

    normalDays = [];

    for (let day = 1; day <= TOTAL_DAYS; day++) {

        const weekDay =
            getWeekDayByProgramDay(day);

        const shamsi =
            getShamsiDateByProgramDay(day);

        const info = {

            day: day,

            weekDay: weekDay,

            shamsi: shamsi,

            weekend:
                weekDay === "پنجشنبه" ||
                weekDay === "جمعه",

            holiday: false

        };

        monthCalendar.push(info);

        if (info.weekend) {

            weekendDays.push(info);

        }
        else {

            normalDays.push(info);

        }

    }

}
function getWeekDay(day) {

    const weekDays = [

        "شنبه",
        "یکشنبه",
        "دوشنبه",
        "سه‌شنبه",
        "چهارشنبه",
        "پنجشنبه",
        "جمعه"

    ];

    return weekDays[(day - 1) % 7];

}

function renderReport() {

    fairnessContainer.innerHTML = "";

    const table = document.createElement("table");

    table.className = "score-table";

    table.innerHTML = `

<thead>

<tr>

<th>نام</th>

<th>سمت</th>

<th>تعداد پاس</th>

<th>روزهای پاس</th>

</tr>

</thead>

<tbody>

</tbody>

`;

    const tbody = table.querySelector("tbody");

    Object.values(scheduleReport).forEach(function (item) {

        const tr = document.createElement("tr");

        tr.innerHTML = `

        <td>${item.name}</td>

        <td>${item.role}</td>

        <td>${item.count}</td>

   <td>

${item.days.map(function (day) {

            return `

<div class="pass-day">

    <span class="pass-day-number">

        روز ${day}

    </span>

    <span class="pass-day-week">

        ${getWeekDayByProgramDay(day)}

    </span>

 

</div>

`;

        }).join("<br>")}

</td>

        `;

        tbody.appendChild(tr);

    });

    fairnessContainer.appendChild(table);

}