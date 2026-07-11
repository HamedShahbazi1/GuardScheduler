function downloadPDF(){


    const element = document.getElementById("scheduleContainer");


    const options = {

        margin: [10,10,10,10],

      filename: "برنامه-پاس-نگهبانی-7-روزه.pdf",


        image: {
            type: "jpeg",
            quality: 1
        },


        html2canvas: {

            scale: 2,

            useCORS:true,

            scrollY:0

        },


        jsPDF: {

            unit:"mm",

            format:"a4",

            orientation:"portrait"

        },


        pagebreak: {

            mode: [
                "css",
                "legacy"
            ]

        }

    };



  setTimeout(()=>{

    html2pdf()
    .set(options)
    .from(element)
    .save();


},500);

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

            mode: [
                "css",
                "legacy"
            ]

        }

    };

    setTimeout(() => {

        html2pdf()
            .set(options)
            .from(element)
            .save();

    }, 500);

}