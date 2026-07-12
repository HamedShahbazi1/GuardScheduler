/*=====================================
      دریافت افراد فعال
=====================================*/

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


        if (person.score === 2) {

            totalWeight += 4;

        }


        if (person.score === 1) {

            totalWeight += 2;

        }


        if (person.score === 0.5) {

            totalWeight += 1;

        }


    });



    persons.forEach(function (person) {


        let weight = 1;


        if (person.score === 2) {

            weight = 4;

        }


        if (person.score === 1) {

            weight = 2;

        }


        if (person.score === 0.5) {

            weight = 1;

        }



        person.targetPass =
            Math.floor(
                TOTAL_PASSES *
                weight /
                totalWeight
            );


        person.assignedCount = 0;


    });


}

/*=====================================
      بررسی وجود اطلاعات
=====================================*/

function validateScheduleData(groups) {

    if (groups.chief.length === 0) {

        showToast("افسر ثبت نشده است.", "warning");

        return false;

    }

    if (groups.guard.length === 0) {

        showToast("نگهبان ثبت نشده است.", "warning");

        return false;

    }

    if (groups.night.length === 0) {

        showToast("شبکار ثبت نشده است.", "warning");

        return false;

    }

    return true;

}

/*=====================================
      بررسی روز مجاز بر اساس امتیاز
=====================================*/

function isAllowedDay(score, day) {

    if (score === 0.5) {

        return day >= 1 && day <= 10;

    }

    if (score === 1) {

        return day >= 11 && day <= 20;

    }

    if (score === 2) {

        return day >= 21 && day <= 31;

    }

    return false;

}

/*=====================================
      افراد مجاز یک روز
=====================================*/

function getAvailablePersons(persons, day) {

    return persons.filter(function (person) {

        return isAllowedDay(person.score, day);

    });

}

/*=====================================
      انتخاب نفر
=====================================*/

function pickPerson(persons, day) {


    let available =
        persons.filter(function (person) {


            return (

                isAllowedDay(
                    person.score,
                    day
                )

                &&

                person.assignedCount <
                person.targetPass

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

        return a.assignedCount - b.assignedCount;

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

/*=====================================
      ساخت برنامه ماهانه
=====================================*/

let monthlySchedule = [];

let assignedHistory = {};


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


        schedule.chief =
            chief
                ? (chief.reserve || chief)
                : null;

        schedule.guard =
            guard
                ? (guard.reserve || guard)
                : null;

        schedule.night =
            night
                ? (night.reserve || night)
                : null;


        monthlySchedule.push(schedule);


    }


    console.log(monthlySchedule);


    renderSchedule();


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

            روز ${day.day}

        </div>


        <div class="pass-list">


            <div class="pass-item pass1">


                <strong>
                <span>افسر</span>

                </strong>
              ${day.chief ? `
<div class="person-name">
    ${day.chief.name}
</div>

${day.chief.originalPerson ? `
<div class="replacement-info">

    جایگزین
    <strong>${day.chief.originalPerson.name}</strong>

</div>
` : ""}

` : "---"}

            </div>



            <div class="pass-item pass2">


                <strong>
                <span>نگهبان</span>

                </strong>
         ${day.guard ? `
<div class="person-name">
    ${day.guard.name}
</div>

${day.guard.originalPerson ? `
<div class="replacement-info">

    جایگزین
    <strong>${day.guard.originalPerson.name}</strong>

</div>
` : ""}

` : "---"}

            </div>



            <div class="pass-item pass3">
  <strong>
                <span>شبکار</span>
 </strong>
              
              ${day.night ? `
<div class="person-name">
    ${day.night.name}
</div>

${day.night.originalPerson ? `
<div class="replacement-info">

    جایگزین
    <strong>${day.night.originalPerson.name}</strong>

</div>
` : ""}

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