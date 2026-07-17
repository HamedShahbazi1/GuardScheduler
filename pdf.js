
function buildPdfTable() {

    let html = `

        <div id="pdfContent">

            <div class="pdf-header">

                <h1>برنامه پاس نگهبانی</h1>

                <p>

                    برنامه 31 روزه

                </p>

            </div>

            <table class="pdf-table">

                <thead>

                    <tr>

                        <th>روز</th>

                        <th>تاریخ</th>

                        <th>افسر جانشین</th>

                        <th>افسر سر</th>

                        <th>افسر پاسدار</th>

                    </tr>

                </thead>

                <tbody>

    `;

    monthlySchedule.forEach(function (day) {

        html += `

            <tr>

                <td>${day.day}</td>

                <td>

                    ${getWeekDayByProgramDay(day.day)}

                    <br>

                    ${getShamsiDateByProgramDay(day.day)}

                </td>

                <td>

                    ${day.chief ? day.chief.name : "---"}

                </td>

                <td>

                    ${day.guard ? day.guard.name : "---"}

                </td>

                <td>

                    ${day.night ? day.night.name : "---"}

                </td>

            </tr>

        `;

    });

    html += `

                </tbody>

            </table>

        </div>

    `;

    return html;

}

function downloadPDF() {

    const oldContainer = document.getElementById("pdfExportContainer");

    if (oldContainer) {
        oldContainer.remove();
    }

    const container = document.createElement("div");

    container.id = "pdfExportContainer";
container.style.position = "absolute";
container.style.top = "20px";
container.style.left = "20px";

container.style.opacity = "1";

container.style.zIndex = "999999";

container.style.background = "#fff";

 container.innerHTML = buildPdfTable();
    document.body.appendChild(container);

    const options = {

        margin: 8,

        filename: "برنامه-پاس-نگهبانی.pdf",

        image: {
            type: "jpeg",
            quality: 1
        },

        html2canvas: {

            scale: 2,

            useCORS: true,

            scrollY: 0

        },

        jsPDF: {

            unit: "mm",

            format: "a4",

            orientation: "portrait"

        },

      pagebreak: {

    mode: ["avoid-all", "css", "legacy"]

}

    };

const pdfContent = document.getElementById("pdfContent");

 setTimeout(function () {

    html2pdf()
        .set(options)
       .from(document.getElementById("pdfContent"))
       
        .save()
        .then(function () {

            container.remove();

        });

}, 1000);


}
function downloadFairnessPDF() {

    const oldContainer = document.getElementById("pdfFairnessContainer");

    if (oldContainer) {
        oldContainer.remove();
    }

    const container = document.createElement("div");

    container.id = "pdfFairnessContainer";

    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.left = "20px";
    container.style.opacity = "1";
    container.style.zIndex = "999999";
    container.style.background = "#ffffff";

    const fairness = document.getElementById("fairnessContainer");

    container.innerHTML = `

        <div id="pdfFairnessContent">

            <div class="pdf-header">

                <h1>گزارش عدالت برنامه</h1>

                <p>گزارش توزیع پاس‌ها</p>

            </div>

            ${fairness.innerHTML}

        </div>

    `;

    document.body.appendChild(container);

    const options = {

        margin: 8,

        filename: "گزارش-عدالت.pdf",

        image: {
            type: "jpeg",
            quality: 1
        },

        html2canvas: {

            scale: 2,

            useCORS: true,

            scrollY: 0

        },

        jsPDF: {

            unit: "mm",

            format: "a4",

            orientation: "portrait"

        },

        pagebreak: {

            mode: ["avoid-all", "css", "legacy"]

        }

    };

    setTimeout(function () {

        html2pdf()
            .set(options)
            .from(document.getElementById("pdfFairnessContent"))
            .save()
            .then(function () {

                container.remove();

            });

    }, 1000);

}