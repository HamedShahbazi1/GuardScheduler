const persons=[

{name:"مهدی",score:0},

{name:"علی",score:0},

{name:"رضا",score:0},

{name:"حسن",score:0},

{name:"محمد",score:0},

{name:"امیر",score:0},

{name:"سعید",score:0},

{name:"احمد",score:0},

{name:"میلاد",score:0}

];

const table=document.getElementById("personTable");

persons.forEach((person,index)=>{

table.innerHTML+=`

<tr>

<td>

${index+1}

</td>

<td>

${person.name}

</td>

<td>

<input

type="number"

min="0"

step="0.5"

value="0"

class="score"

data-index="${index}"

>

</td>

</tr>

`;

});

document
.getElementById("generateBtn")
.addEventListener("click",()=>{

document
.querySelectorAll(".score")
.forEach(input=>{

persons[input.dataset.index].score=
parseFloat(input.value);

});

generateSchedule(persons);

});