/*=====================================
        Calendar API
=====================================*/

window.monthCalendar = [];

async function loadMonthCalendar(year, month) {

    try {

        const response = await fetch(
            `https://holidayapi.ir/jalali/${year}/${month}`
        );

        const data = await response.json();

        monthCalendar = data;

        console.log(monthCalendar);

        return true;

    }
    catch (error) {

        console.error(error);

        showToast(
            "خطا در دریافت اطلاعات تقویم",
            "error"
        );

        return false;

    }

}

/*=====================================
      اطلاعات یک روز
=====================================*/

function getDayInfo(day) {

    return monthCalendar.find(function(item){

        return item.day == day;

    });

}


/*=====================================
      روز تعطیل؟
=====================================*/

function isHoliday(day){

    const info = getDayInfo(day);

    if(!info){

        return false;

    }

    return info.isHoliday;

}


/*=====================================
      پنجشنبه یا جمعه
=====================================*/

function isWeekend(day){

    const info = getDayInfo(day);

    if(!info){

        return false;

    }

    return (
        info.weekDay === "پنجشنبه" ||
        info.weekDay === "جمعه"
    );

}