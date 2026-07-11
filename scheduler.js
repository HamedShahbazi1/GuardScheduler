//========================================
// لیست ثابت افراد
//========================================
let schedule = [];
const defaultPersons = [
    {
        id: 1,
        name: "مهدی",
        coefficient: 1,
        targetShifts: 0,
        active: true,
        assignedShifts: 0,
        pass1: 0,
        pass2: 0,
        pass3: 0,
           totalAssigned:0,      // مجموع پاس های تمام هفته ها

    carry:0   

    },
    {
        id: 2,
        name: "علی",
        coefficient: 1,
        targetShifts: 0,
        active: true,
        assignedShifts: 0,
        pass1: 0,
        pass2: 0,
        pass3: 0,
           totalAssigned:0,      // مجموع پاس های تمام هفته ها

    carry:0   
    },
    {
        id: 3,
        name: "رضا",
        coefficient: 1,
        targetShifts: 0,
        active: true,
        assignedShifts: 0,
        pass1: 0,
        pass2: 0,
        pass3: 0,
           totalAssigned:0,      // مجموع پاس های تمام هفته ها

    carry:0   
    },
    {
        id: 4,
        name: "حسن",
        coefficient: 1,
        targetShifts: 0,
        active: true,
        assignedShifts: 0,
        pass1: 0,
        pass2: 0,
        pass3: 0,
           totalAssigned:0,      // مجموع پاس های تمام هفته ها

    carry:0   
    },
    {
        id: 5,
        name: "محمد",
        coefficient: 1,
        targetShifts: 0,
        active: true,
        assignedShifts: 0
        , pass1: 0,
        pass2: 0,
        pass3: 0,
           totalAssigned:0,      // مجموع پاس های تمام هفته ها

    carry:0   
    },
    {
        id: 6,
        name: "امیر",
        coefficient: 1,
        targetShifts: 0,
        active: true,
        assignedShifts: 0
        , pass1: 0,
        pass2: 0,
        pass3: 0,
           totalAssigned:0,      // مجموع پاس های تمام هفته ها

    carry:0   
    },
    {
        id: 7,
        name: "سعید",
        coefficient: 1,
        targetShifts: 0,
        active: true,
        assignedShifts: 0,
        pass1: 0,
        pass2: 0,
        pass3: 0,
           totalAssigned:0,      // مجموع پاس های تمام هفته ها

    carry:0   
    },
    {
        id: 8,
        name: "حسین",
        coefficient: 1,
        targetShifts: 0,
        active: true,
        assignedShifts: 0,
        pass1: 0,
        pass2: 0,
        pass3: 0,
           totalAssigned:0,      // مجموع پاس های تمام هفته ها

    carry:0   
    },
    {
        id: 9,
        name: "مجید",
        coefficient: 1,
        targetShifts: 0,
        active: true,
        assignedShifts: 0,
        pass1: 0,
        pass2: 0,
        pass3: 0,
           totalAssigned:0,      // مجموع پاس های تمام هفته ها

    carry:0   
    }
];
let persons = JSON.parse(
    localStorage.getItem("persons")
) || [...defaultPersons];

persons.forEach(person => {

    if (person.active) {

        person.assignedShifts = 0;

        person.pass1 = 0;

        person.pass2 = 0;

        person.pass3 = 0;

    }

});

savePersons();


function savePersons() {

    localStorage.setItem(

        "persons",

        JSON.stringify(persons)

    );

}

//========================================
// ساخت جدول افراد
//========================================

function renderPersons() {

    const tbody = document.getElementById("personTable");

    tbody.innerHTML = "";

    persons.forEach((person, index) => {

        const row = `
          <tr class="${person.active ? "" : "inactive-person"}">

                <td>${index + 1}</td>

                <td>${person.name}</td>

             <td>

               <input
                  type="number"
                   min="0.5"
                  step="0.5"
                value="${person.coefficient}"
                 data-id="${person.id}"
                 class="scoreInput">

                 </td>

                <td>

              <button onclick="editPerson(${person.id})">
                    ✏️
                  </button>

                  <button onclick="deletePerson(${person.id})">
                        🗑️
                         </button>

                      <button onclick="togglePerson(${person.id})">
                     ${person.active ? "🚫" : "✅"}
                      </button>

                </td>
<td>

    ${person.active
                ? '<span class="status active">فعال</span>'
                : '<span class="status inactive">مرخصی</span>'}

</td>
            </tr>
        `;

        tbody.insertAdjacentHTML("beforeend", row);

    });

}



//========================================
// خواندن امتیازها
//========================================

function readScores() {

    const inputs = document.querySelectorAll(".scoreInput");

    inputs.forEach(input => {

        const id = Number(input.dataset.id);

        const person = persons.find(x => x.id === id);

        if (person) {

            person.coefficient = Number(input.value);

        }

    });

    savePersons();

}

function calculateTargetShifts() {

    const TOTAL_SHIFTS = 21;

    const activePersons = persons.filter(person => person.active);

    const totalCoefficient = activePersons.reduce(
        (sum, person) => sum + person.coefficient,
        0
    );


    // محاسبه سهم اولیه

    persons.forEach(person => {

        person.targetShifts = 0;

    });
    activePersons.forEach(person => {

        person.targetShifts = Math.floor(
            (person.coefficient / totalCoefficient) * TOTAL_SHIFTS
        );

        // حداقل یک پاس
        if (person.coefficient > 0 && person.targetShifts === 0) {
            person.targetShifts = 1;
        }

    });



    // بررسی اختلاف

    let currentTotal = activePersons.reduce(
        (sum, p) => sum + p.targetShifts,
        0
    );

    while (currentTotal > TOTAL_SHIFTS) {

        activePersons
            .sort((a, b) => b.targetShifts - a.targetShifts);

        const person = activePersons.find(p => p.targetShifts > 1);

        if (!person) break;

        person.targetShifts--;

        currentTotal--;

    }
    // اگر کمتر از 42 شد
    let i = 0;

    while (currentTotal < TOTAL_SHIFTS) {

        activePersons.sort(
            (a, b) => b.coefficient - a.coefficient
        );

        activePersons[i].targetShifts++;

        currentTotal++;

        i++;

        if (i >= activePersons.length) {
            i = 0;
        }

    }



    // ذخیره تعداد باقی مانده

 activePersons.forEach(person => {

    person.remainingShifts = person.targetShifts;

    // تاثیر برنامه‌های قبلی
    person.priority =
        person.targetShifts -
        (person.historyShifts || 0);

});


}
//========================================
// نمایش اطلاعات در Console
// فعلاً فقط برای تست
//========================================

function showPersons() {

    console.clear();

    console.table(
        persons.map(person => ({
            نام: person.name,
            امتیاز: person.coefficient,
            تعداد_پاس: person.targetShifts
        }))
    );

}



//========================================
// اجرای اولیه
//========================================

renderPersons();
function generateSchedule() {
    readScores();
    calculateTargetShifts();
    schedule = [];

    // صفر کردن پاس های قبلی
    // صفر کردن آمار برنامه قبلی
    persons.forEach(person => {

        if (person.active) {

            person.assignedShifts = 0;
            person.pass1 = 0;
            person.pass2 = 0;
            person.pass3 = 0;
            person.lastAssignedDay = null;

        }

    });

    let lastDayPersons = [];


    for (let day = 1; day <= 7; day++) {

        let availablePersons = persons.filter(person => {

            return (

                person.active &&

                person.assignedShifts < person.targetShifts &&

                !lastDayPersons.includes(person.id)

            );

        });
        // اگر کمتر از 3 نفر پیدا شد
        if (availablePersons.length < 3) {

            const extraPersons = persons.filter(person => {

                return (

                    person.active &&

                    person.assignedShifts < person.targetShifts &&

                    !lastDayPersons.includes(person.id) &&

                    !availablePersons.includes(person)

                );

            });

            availablePersons.push(...extraPersons);

        }

        if (availablePersons.length < 3) {

            const emergencyPersons = persons.filter(person => {

                return (

                    person.active &&

                    !availablePersons.includes(person)

                );

            });

            availablePersons.push(...emergencyPersons);

        }
        // مرتب سازی بر اساس کسانی که هنوز پاس بیشتری دارند
    availablePersons.sort((a, b) => {

    // اول کسانی که در هفته‌های قبل کمتر کشیک داشته‌اند
    if ((b.priority || 0) !== (a.priority || 0)) {
        return (b.priority || 0) - (a.priority || 0);
    }

    // بعد پیشرفت همین هفته
    const progressA =
        a.assignedShifts / Math.max(a.targetShifts, 1);

    const progressB =
        b.assignedShifts / Math.max(b.targetShifts, 1);

    if (progressA !== progressB) {
        return progressA - progressB;
    }

    return Math.random() - 1.5;

});





        let todayPersons = [];
        //----------------------------------
        // کسانی که هنوز هیچ پاس نگرفته‌اند
        //----------------------------------

        let zeroShiftPersons = availablePersons.filter(
            person => person.assignedShifts === 0
        );

        zeroShiftPersons.forEach(person => {

            if (todayPersons.length >= 3)
                return;

            // فقط یک نفر ضریب 0.5
            if (person.coefficient <= 0.5) {

                let hasEasyPerson =
                    todayPersons.some(
                        p => p.coefficient <= 0.5
                    );

                if (hasEasyPerson)
                    return;

            }
            if (todayPersons.includes(person)) {
                return
            }
            todayPersons.push(person);

        });

        for (let person of availablePersons) {

            if (todayPersons.includes(person)) {
                continue;
            }

            if (person.coefficient <= 0.5) {

                let hasEasyPerson =
                    todayPersons.some(
                        p => p.coefficient <= 0.5
                    );

                if (hasEasyPerson) {
                    continue;
                }

            }

            todayPersons.push(person);

            if (todayPersons.length === 3) {
                break;
            }

        }
        // 👇 این خط را اضافه کن
        todayPersons = todayPersons.slice(0, 3);

        todayPersons = shufflePersons(todayPersons);
        function shufflePersons(list) {

            let result = [...list];

            for (let i = result.length - 1; i > 0; i--) {

                let j = Math.floor(Math.random() * (i + 1));

                [result[i], result[j]] = [result[j], result[i]];

            }

            return result;

        }


        //========================================
        // ضریب 0.5 همیشه پاس 1 باشد
        //========================================

        let easyIndex = todayPersons.findIndex(
            person => person.coefficient <= 0.5
        );


        if (easyIndex > 0) {

            let easyPerson = todayPersons.splice(
                easyIndex,
                1
            )[0];


            todayPersons.unshift(easyPerson);

        }


        todayPersons.forEach((person, index) => {

            person.assignedShifts++;
            person.lastAssignedDay = day;

            if (index === 0) {

                person.pass1++;

            }

            else if (index === 1) {

                person.pass2++;

            }

            else {

                person.pass3++;

            }

        });


        schedule.push({

            day: day,

            persons: todayPersons

        });



        lastDayPersons = todayPersons.map(p => p.id);


    }
    // ذخیره سابقه برای هفته‌های بعد
persons.forEach(person => {

    if (!person.active) return;

    person.historyShifts =
        (person.historyShifts || 0) +
        person.assignedShifts;

});

savePersons();
    // نمایش برنامه
    showSchedule();

    // نمایش گزارش عدالت
    calculateFairness();

}
// function arrangeGuardOrder(personsList){

//     let result = [...personsList];


//     // پیدا کردن افراد با ضریب پایین
//     let easyPersons = result.filter(
//         person => person.coefficient <= 0.5
//     );


//     // حذف آن‌ها از لیست اصلی
//     result = result.filter(
//         person => person.coefficient > 0.5
//     );


//     // افراد ضریب 0.5 اول قرار بگیرند
//     result = [
//         ...easyPersons,
//         ...result
//     ];


//     return result;

// }
function showSchedule() {

    const container =
        document.getElementById("scheduleContainer");


    container.innerHTML = "";


    schedule.forEach(day => {


        container.innerHTML += `

        <div class="day-box">


            <h3>
                روز ${day.day}
            </h3>


            <table class="schedule-table">

                <tr>

                    <th>
                        پاس 1
                    </th>

                    <th>
                        پاس 2
                    </th>

                    <th>
                        پاس 3
                    </th>

                </tr>


                <tr>

             ${day.persons.map(person => `

                        <td>
                            ${person.name}
                        </td>

                    `).join("")}

                </tr>


            </table>


        </div>

        `;


    });


}
function calculateFairness() {

    const container =
        document.getElementById("fairnessContainer");

    container.innerHTML = "";

    let html = `


            <table class="fairness-table">

             <tr>
    <th>نام</th>
    <th>پاس گرفته</th>
    <th>پاس۱</th>
    <th>پاس۲</th>
    <th>پاس۳</th>
    <th>عدالت</th>
</tr>
    `;

 persons.forEach(person => {
    if (!person.active) {

    html += `
    <tr class="inactive-person">

        <td>${person.name}</td>

        <td>-</td>

        <td>-</td>

        <td>-</td>

        <td>-</td>

        <td>
        <span class="status inactive">
            مرخصی
        </span>
    </td>

    </tr>
    `;

    return;

}


            let shiftScore = 100;

            if (person.targetShifts > 0) {

                shiftScore =
                    (person.assignedShifts / person.targetShifts) * 100;

            }

            shiftScore = Math.max(0, Math.min(shiftScore, 100));



            let maxPass =
                Math.max(
                    person.pass1,
                    person.pass2,
                    person.pass3
                );

            let minPass =
                Math.min(
                    person.pass1,
                    person.pass2,
                    person.pass3
                );

            let difference =
                maxPass - minPass;

            let positionScore =
                100 - (difference * 25);

            positionScore =
                Math.max(positionScore, 0);



            //-----------------------------
            // عدالت پاس اول
            //-----------------------------

            let ideal = person.assignedShifts / 3;

            let pass1Score = 100;

            if (ideal > 0) {

                pass1Score =
                    100 -
                    (Math.abs(person.pass1 - ideal) / ideal) * 100;

            }

            pass1Score = Math.max(pass1Score, 0);



            //-----------------------------
            // عدالت پاس دوم
            //-----------------------------

            let pass2Score = 100;

            if (ideal > 0) {

                pass2Score =
                    100 -
                    (Math.abs(person.pass2 - ideal) / ideal) * 100;

            }

            pass2Score = Math.max(pass2Score, 0);



            //-----------------------------
            // عدالت پاس سوم
            //-----------------------------

            let pass3Score = 100;

            if (ideal > 0) {

                pass3Score =
                    100 -
                    (Math.abs(person.pass3 - ideal) / ideal) * 100;

            }

            pass3Score = Math.max(pass3Score, 0);


            //------------------------------------
            // عدالت فاصله کشیک ها
            //------------------------------------

            let days = [];

            schedule.forEach(day => {

                if (day.persons.some(p => p.id === person.id)) {

                    days.push(day.day);

                }

            });

            let distanceScore = 100;
            for (let i = 1; i < days.length; i++) {

                let gap = days[i] - days[i - 1];

                if (gap === 1) {

                    distanceScore -= 40;

                }

                else if (gap === 2) {

                    distanceScore -= 20;

                }

                else if (gap === 3) {

                    distanceScore -= 5;

                }

            }
            distanceScore = Math.max(distanceScore, 0);
            //-----------------------------
            // عدالت کلی
            //-----------------------------
            let fairness =

                (
                    shiftScore * 0.4 +

                    positionScore * 0.4 +

                    distanceScore * 0.2

                );

let fairnessValue = Math.round(fairness);

let fairnessClass = "";

if (fairnessValue < 40){

    fairnessClass = "fairness-red";

}
else if (fairnessValue < 60){

    fairnessClass = "fairness-orange";

}
else if (fairnessValue < 80){

    fairnessClass = "fairness-yellow";

}
else if (fairnessValue < 95){

    fairnessClass = "fairness-green";

}
else{

    fairnessClass = "fairness-perfect";

}

            html += `
<tr>

<td>${person.name}</td>


<td>${person.assignedShifts}</td>

<td>${person.pass1}</td>

<td>${person.pass2}</td>

<td>${person.pass3}</td>

<td>

<div class="fairness-circle ${fairnessClass}">
    ${fairnessValue}%
</div>

</td>

</tr>
`;

        });
    html += `
        </table>
    </div>
`;

    container.innerHTML = html;
}

function addPerson() {

    const input =
        document.getElementById("newPersonName");

    let name = input.value.trim();

    if (name === "") {

        alert("نام را وارد کنید");

        return;

    }

    persons.push({

        id: Date.now(),

        name: name,

        coefficient: 1,
        active: true,

        targetShifts: 0,

        assignedShifts: 0,

        pass1: 0,
        pass2: 0,
        pass3: 0

    });

    savePersons();

    input.value = "";

    renderPersons();


}

function deletePerson(id) {

    let index =
        persons.findIndex(
            person => person.id === id
        );

    if (index === -1)
        return;

    if (confirm("این پرسنل حذف شود؟")) {

        persons.splice(index, 1);
        savePersons();

        renderPersons();

    }

}

function editPerson(id) {

    let person =
        persons.find(
            p => p.id === id
        );

    if (!person)
        return;

    let newName =
        prompt(
            "نام جدید",
            person.name
        );

    if (newName === null)
        return;

    person.name =
        newName.trim();
    savePersons();
    renderPersons();

}
document
    .getElementById("addPersonBtn")
    .onclick = addPerson;

function togglePerson(id) {

    let person = persons.find(
        p => p.id === id
    );

    if (!person)
        return;

    person.active = !person.active;

    savePersons();

    renderPersons();

}

function downloadFairnessPDF() {

    const element = document.getElementById("fairnessContainer");

    const options = {

        margin: [10,10,10,10],

        filename: "گزارش-عدالت.pdf",

        image: {
            type: "jpeg",
            quality: 1
        },

        html2canvas: {
            scale: 2
        },

        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait"
        }

    };

    html2pdf()
        .set(options)
        .from(element)
        .save();

}

