/*=====================================
      دریافت افراد فعال
=====================================*/

window.currentProgramDate = null;
let monthCalendar = [];

let holidayDays = [];

let weekendDays = [];

let normalDays = [];
let score05Days = [];
let score1Days = [];

let score2Days = [];
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

    persons.forEach(function (person) {

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


function getDayScore(person, dayInfo) {

    let score = 0;


    const holiday = getHolidayInfo(
        getShamsiDateByProgramDay(dayInfo.day)
    );


    const isHoliday = holiday !== null;



    switch (person.score) {


        case 0.5:

            if (dayInfo.weekDay === "پنجشنبه")
                score += 300;

            if (dayInfo.weekDay === "جمعه")
                score += 290;

            if (dayInfo.weekDay === "شنبه")
                score += 270;


            // تعطیلات رسمی برای امتیاز نیم
            if (isHoliday)
                score += 285;


            break;



        case 1:

            if (dayInfo.weekDay === "یکشنبه")
                score += 300;

            if (dayInfo.weekDay === "دوشنبه")
                score += 250;

            if (dayInfo.weekDay === "شنبه")
                score += 200;

            if (dayInfo.weekDay === "پنجشنبه")
                score += 100;



            // تعطیلات رسمی با درصد کمتر
            if (isHoliday)
                score += 50;


            break;



        case 2:

            if (dayInfo.weekDay === "دوشنبه")
                score += 300;

            if (dayInfo.weekDay === "سه‌شنبه")
                score += 290;

            if (dayInfo.weekDay === "چهارشنبه")
                score += 280;


            break;

    }


    return score;

}
/*=====================================
      اولویت روز برای هر امتیاز
=====================================*/

function assignGroup(persons, role) {

    const score05 = persons.filter(p => p.score === 0.5);
    const score1 = persons.filter(p => p.score === 1);
    const score2 = persons.filter(p => p.score === 2);

    fillPersons(score05, role);
    fillPersons(score1, role);
    fillPersons(score2, role);

}
function fillPersons(persons, role) {

    let level = 1;

    while (true) {

        let added = false;
        persons.sort(function (a, b) {

            if (a.assignedCount !== b.assignedCount) {

                return a.assignedCount - b.assignedCount;

            }

            return Math.random() - 0.5;

        });
        persons.forEach(function (person) {

            if (person.assignedCount >= level)
                return;

            const day = findBestDay(
                person,
                role,
                persons
            );

            if (day !== null) {


                let finalPerson = person;



                monthlySchedule[day - 1][role] = finalPerson;


                person.assignedCount++;


                addToReport(finalPerson, role, day);


                added = true;


            }

        });

        if (!added)
            break;

        level++;

    }

}


/*=====================================
      بررسی مجاز بودن روز
=====================================*/


/*=====================================
      چیدمان یک گروه
=====================================*/

/*=====================================
      چیدن افراد داخل روزهای مجاز
=====================================*/

/*=====================================
      روزهای مجاز هر امتیاز
=====================================*/

function getAllowedDays(score, dayInfo) {

    const holiday = getHolidayInfo(
        getShamsiDateByProgramDay(dayInfo.day)
    );

    const isHoliday = holiday !== null;


    if (score === 0.5) {

        const days = [
            "پنجشنبه",
            "جمعه",
            "شنبه"
        ];

        if (isHoliday) {

            days.push(dayInfo.weekDay);

        }

        return days;

    }


    if (score === 1) {

        const days = [
            "شنبه",
            "یکشنبه",
            "دوشنبه",
            "پنجشنبه"
        ];

        if (isHoliday) {

            days.push(dayInfo.weekDay);

        }

        return days;

    }


    if (score === 2) {

        return [
            "دوشنبه",
            "سه‌شنبه",
            "چهارشنبه"
        ];

    }

    return [];

}



function hasRecentPass(person, role, day) {

    // روز قبل
    if (day > 1) {

        const yesterday = monthlySchedule[day - 2][role];

        if (yesterday && yesterday.id === person.id) {

            return true;

        }

    }

    return false;

}
function findBestDay(person, role) {


    let candidates = [];
    let bestScore = -1;


    monthCalendar.forEach(function (info) {
const allowedDays = getAllowedDays(
    person.score,
    info
);

if (!allowedDays.includes(info.weekDay))
    return;
        if (!allowedDays.includes(info.weekDay))
            return;
        const holiday = getHolidayInfo(
            getShamsiDateByProgramDay(info.day)
        );


        // امتیاز 2 در تعطیلی رسمی انتخاب نشود
        if (
            person.score === 2 &&
            holiday
        ) {
            return;
        }
        if (monthlySchedule[info.day - 1][role] !== null)
            return;
        if (hasRecentPass(person, role, info.day))
            return;
        const score = getDayScore(
            person,
            info
        );

        if (score > bestScore) {

            bestScore = score;

            candidates = [info];

        }
        else if (score === bestScore) {

            candidates.push(info);

        }

    });

    if (candidates.length === 0) {

        return null;

    }

    const randomIndex = Math.floor(Math.random() * candidates.length);

    return candidates[randomIndex].day;

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


    const score = person.originalPerson
        ? person.originalPerson.score
        : person.score;



    if (!scheduleReport[id]) {

        scheduleReport[id] = {

            name: name,

            role: role,

            score: score,

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

window.replacements = window.replacements || [];
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


    localStorage.setItem(
        "GuardScheduler_StartDate",
        window.currentProgramDate.toISOString()
    );


    localStorage.setItem(
        "GuardSchedulerReplacements",
        JSON.stringify(window.replacements)
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
    const savedStartDate =
        localStorage.getItem(
            "GuardScheduler_StartDate"
        );


    if (savedStartDate) {

        window.currentProgramDate =
            new Date(savedStartDate);

    }
    if (report) {

        scheduleReport =
            JSON.parse(report);

    }
    const savedReplacements =
        localStorage.getItem(
            "GuardSchedulerReplacements"
        );


    if (savedReplacements) {

        window.replacements =
            JSON.parse(savedReplacements);

    }
    return true;

}

function generateSchedule() {
    window.currentProgramDate = new Date();
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

    monthlySchedule = [];

    for (let day = 1; day <= TOTAL_DAYS; day++) {

        monthlySchedule.push({
            day,
            chief: null,
            guard: null,
            night: null
        });

    }

    assignGroup(groups.chief, "chief");
    assignGroup(groups.guard, "guard");
    assignGroup(groups.night, "night");
    applyReplacements();
    console.log(monthlySchedule);


    renderSchedule();

    renderReport();
    saveSchedule();
    showToast(
        "برنامه 31 روزه ایجاد شد",
        "success"
    );


}

/*=====================================
      بررسی انتخاب قبلی
=====================================*/



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


    ${getHolidayInfo(getShamsiDateByProgramDay(day.day))

                ?

                `
        <div class="holiday-title">

            🔴 
            ${getHolidayInfo(getShamsiDateByProgramDay(day.day)).title}

        </div>
        `

                :

                ""

            }

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

🔄 جایگزین افسر: ${day.guard.originalPerson.name}

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

🔄 جایگزین افسر: ${day.night.originalPerson.name}

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
    score05Days = [];
    score1Days = [];
    score2Days = [];


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

        // روزهای مخصوص امتیاز 0.5
        if (
            info.weekDay === "پنجشنبه" ||
            info.weekDay === "جمعه" ||
            info.weekDay === "شنبه"
        ) {
            score05Days.push(info);
        }

        // روزهای مخصوص امتیاز 1
        if (
            info.weekDay === "شنبه" ||
            info.weekDay === "یکشنبه" ||
            info.weekDay === "دوشنبه"
        ) {
            score1Days.push(info);
        }

        // روزهای مخصوص امتیاز 2
        if (
            info.weekDay === "دوشنبه" ||
            info.weekDay === "سه‌شنبه" ||
            info.weekDay === "چهارشنبه"
        ) {
            score2Days.push(info);
        }

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


    createReportSection(
        "👮 افسر جانشین",
        "chief"
    );


    createReportSection(
        "🛡️ افسر سر",
        "guard"
    );


    createReportSection(
        "🌙 افسر پاسدار",
        "night"
    );


}

function getPersonScheduleDays(listName, personId) {

    let result = [];


    monthlySchedule.forEach(function (day) {

        const assignedPerson = day[listName];


        if (!assignedPerson) {
            return;
        }


        const originalId =
            assignedPerson.originalPerson
                ? assignedPerson.originalPerson.id
                : assignedPerson.id;


        if (originalId === personId) {

            result.push({

                day: day.day,

                weekDay: getWeekDayByProgramDay(day.day)

            });

        }


    });


    return result;

}
function applyReplacements() {

    // اول همه جایگزین ها را پاک کن و نفر اصلی را برگردان
    monthlySchedule.forEach(function (day) {

        ["chief", "guard", "night"].forEach(function (role) {

            const person = day[role];

            if (person && person.originalPerson) {

                day[role] = person.originalPerson;

            }

        });

    });


    // بعد جایگزین های باقی مانده را اعمال کن
    window.replacements.forEach(function (item) {


        const day =
            monthlySchedule[item.day - 1];


        if (!day) {
            return;
        }


        const original =
            lists[item.role].find(p =>
                p.id === item.originalId
            );


        if (!original) {
            return;
        }


        // بدون جایگزین
        if (item.replacementId === 0) {

            day[item.role] = original;

            return;

        }



        const replacement =
            reservePersons.find(p =>
                p.id === item.replacementId
            );


        if (replacement) {

            day[item.role] = {

                ...replacement,

                originalPerson: original

            };

        }


    });


}
function createReportSection(title, role) {


    const section = document.createElement("div");

    section.className = "guard-report-section";


    const header = document.createElement("div");

    header.className = "guard-report-header";

    header.innerHTML = title;



    const card = document.createElement("div");

    card.className = "guard-report-card";



    const table = document.createElement("table");

    table.className = "guard-report-table";



    table.innerHTML = `

<thead>

<tr>

<th>نام</th>
  <th>امتیاز</th>
<th>تعداد پاس</th>

<th>روزهای پاس</th>
<th>وضعیت روز</th>

</tr>

</thead>


<tbody>

</tbody>

`;



    const tbody = table.querySelector("tbody");



    Object.values(scheduleReport)

        .filter(function (item) {

            return item.role === role;

        })

        .forEach(function (item) {



            const tr = document.createElement("tr");


            tr.innerHTML = `


<td>

${item.name}

</td>
<td>

<span class="guard-report-score">

${item.score}

</span>

</td>


<td>

<span class="guard-report-count">

${item.count}

</span>

</td>



<td>

<div class="guard-report-days">


${item.days.map(function (day) {


                const holiday = getHolidayInfo(
                    getShamsiDateByProgramDay(day)
                );


                return `


<div class="guard-report-day">


روز ${day}


<br>


<small>

${getWeekDayByProgramDay(day)}

</small>


<br>


<small>

${getShamsiDateByProgramDay(day)}

</small>






</div>


`;


            }).join("")}


</div>

</td>
<td>

${item.days.map(function (day) {

                const holiday = getHolidayInfo(
                    getShamsiDateByProgramDay(day)
                );


                return holiday
                    ?
                    `
    <div class="report-holiday">

    🔴 روز ${day}
    <br>
    ${holiday.title}

    </div>
    `
                    :
                    "";

            }).join("")

                }

</td>

`;



            tbody.appendChild(tr);



        });



    card.appendChild(table);


    section.appendChild(header);


    section.appendChild(card);



    fairnessContainer.appendChild(section);



}