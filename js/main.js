//SELECTORS

const date_picker_element = document.querySelector('.date-picker');
const selected_date_element = document.querySelector('.date-picker .selected-date');
const dates_element = document.querySelector('.date-picker .dates');
const mth_element = document.querySelector('.date-picker .dates .month .mth');
const next_mth_element = document.querySelector('.date-picker .dates .month .next-mth');
const prev_mth_element = document.querySelector('.date-picker .dates .month .prev-mth');
const days_element = document.querySelector('.date-picker .dates .days');
/* 
const title_element = document.querySelectorAll('#title');
const description_element = document.querySelectorAll('#description');
const image_element = document.querySelectorAll('#image');
const start_element = document.querySelectorAll('#start');
const end_element = document.querySelectorAll('#end');
const recurrence_element = document.querySelectorAll('#recurrence');
const costs_element = document.querySelectorAll('#costs');
const link_element = document.querySelectorAll('#link');
const venue_element = document.querySelectorAll('#venue');
const category_element = document.querySelectorAll('#category');
 */

//const images_element = document.querySelector('.date-picker .dates .days #img')

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

let selectedDate = date;
let selectedDay = day;
let selectedMonth = month;
let selectedYear = year;

let startDay = selectedDay;
let startMonth = selectedMonth;
let startYear = selectedYear;

let eventsObj, timeStampArray = [];
let eventsJson;


/* let title = [];
let description = [];
let image = [];
let start = [];
let end = [];
let recurrence = [];
let costs = [];
let link = [];
let venue = [];
let category = [];
 */

mth_element.textContent = months[month] + ' ' + year;

selected_date_element.textContent = formatDate(date);
populateDates();

/* title_element.textContent = title;
description_element.textContent = description;
image_element.textContent = image;
start_element.textContent = start;
end_element.textContent = end;
costs_element.textContent = costs;
link_element.textContent = link;
venue_element.textContent = venue;
category_element.textContent = category; */


//EVENT LISTENERS
date_picker_element.addEventListener('click', toggleDatePicker);
next_mth_element.addEventListener('click', goToNextMonth);
prev_mth_element.addEventListener('click', goToPreviousMonth);

//FUNCTIONS

function getStartFromEvents(jsonObj){
    let startArray = [];
    for (var i = 0; i<jsonObj.length; i++){
        startArray.push(jsonObj[i]['start']);
    }
    return (startArray);
}

function loadJson(){
    
    let startDateArray = [];
    var requestURL = './sample-data.json'
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        eventsJson = request.response;
        timeStampArray = getStartFromEvents(eventsJson['events']);//Array com timestamps
        eventsJson = eventsJson['events'];//objeto com eventos
        
        startDateArray = validateDate(timeStampArray);// recebe um array com as datas convertidas
        for (var i =0; i<startDateArray.length; i++){
            if (startDateArray[i] <= selectedDate){
                hideElements(i);
            } else{
                showElements(i);
            }
        }


      }
}

function toggleDatePicker(e){
    if (!checkEventPathForClass(e.path, 'dates')){
        dates_element.classList.toggle('active');
    }
}

function goToNextMonth(e){
    month++;
    if (month > 11){
        month = 0;
        year ++;
    }
    mth_element.textContent = months[month] + ' ' + year;
    populateDates();
}

function goToPreviousMonth(e){
    month--;
    if (month < 0){
        month = 11;
        year --;
    }
    mth_element.textContent = months[month] + ' ' + year;
    populateDates();

}

    //Function to populate the datepicker with dates
function populateDates(e){
    days_element.innerHTML = '';
    
    let amount_days = 31;

    if (month == 1){
        amount_days = 28;
    }

    for (let i =0; i<amount_days; i++){
        const day_element = document.createElement('div');
        day_element.classList.add('day');
        day_element.textContent = i + 1;

        if(selectedDay == (i + 1) && selectedYear == year && selectedMonth == month){
            day_element.classList.add('selected');
        }

        day_element.addEventListener('click', function(){
            selectedDate = new Date(year + '-' + (month + 1) + '-' + (i+1));
            selectedDay = (i + 1);
            selectedMonth = month;
            selectedYear = year;

            selected_date_element.textContent = formatDate(selectedDate);
            selected_date_element.dataset.value = selectedDate;

            populateDates();
            loadJson();


        });

        days_element.appendChild(day_element);
    }
}

function validateDate(timestamp){
    let start_timestamp;
    let startDate = [];

    for (var i = 0; i<timestamp.length; i++){
        start_timestamp = timestamp[i];

        startDate.push(new Date(start_timestamp*1000));

    }
    return startDate; //retorna um array com as datas convertidas

}

function hideElements(e){
    var allOktoberfestByClass = document.getElementsByClassName('event-Oktoberfest');
    var allAvengersByClass = document.getElementsByClassName('event-Avengers-Endgame');
    var allRockImParkByClass = document.getElementsByClassName('event-RockimPark');
    var allPCIMByClass = document.getElementsByClassName('event-PCIM-EUROPE');

    var title_json = eventsJson[e]['title'];
    if (title_json == 'RockimPark'){
        allRockImParkByClass[0].style.display = 'none';
    }
    if (title_json == 'Oktoberfest'){
        allOktoberfestByClass[0].style.display = 'none';
    }
    if (title_json == 'Avengers-Endgame'){
        allAvengersByClass[0].style.display = 'none';
    }
    if (title_json == 'PCIM-EUROPE'){
        allPCIMByClass[0].style.display = 'none';
    }

}

function showElements(e){
    var allOktoberfestByClass = document.getElementsByClassName('event-Oktoberfest');
    var allAvengersByClass = document.getElementsByClassName('event-Avengers-Endgame');
    var allRockImParkByClass = document.getElementsByClassName('event-RockimPark');
    var allPCIMByClass = document.getElementsByClassName('event-PCIM-EUROPE');

    allRockImParkByClass[0].style.display = 'block';
    allOktoberfestByClass[0].style.display = 'block';
    allAvengersByClass[0].style.display = 'block';
    allPCIMByClass[0].style.display = 'block';

}



//HELPER FUNCTIONS
function checkEventPathForClass(path, selector){
    for (let i = 0; i < path.length; i++){
        if (path[i].classList && path[i].classList.contains(selector)){
            return true;
        }
    }
    return false;
}

function formatDate (d){
    let day = d.getDate();
    if (day < 10){
        day = '0' + day;
    }
    let month = d.getMonth() + 1;
    if (month < 10){
        month = '0' + month ;
    }
    let year = d.getFullYear();

    return day + ' / ' + month + ' / ' + year;
}