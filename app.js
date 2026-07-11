const generateBtn = document.getElementById("generateBtn");


generateBtn.addEventListener("click",()=>{


    readScores();


    calculateTargetShifts();


    generateSchedule();


    showSchedule();


    showPersons();


});

const pdfBtn = document.getElementById("pdfBtn");


pdfBtn.addEventListener("click",()=>{


    downloadPDF();


});