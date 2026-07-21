const defaultOfficialHolidays1405 = [

    {
        date: "1405/04/03",
        title: "تاسوعای حسینی"
    },

    {
        date: "1405/04/04",
        title: "عاشورای حسینی"
    },

    {
        date: "1405/05/13",
        title: "اربعین حسینی"
    },
    {
        date: "1405/05/21",
        title: " رحلت حضرت رسول اکرم صلی الله علیه و آله"
    },
    {
        date: "1405/05/22",
        title: " شهادت حضرت امام رضا علیه السلام"
    }
    ,
    {
        date: "1405/05/30",
        title: " شهادت حضرت امام حسن عسکری علیه السلام"
    }
    ,
    {
        date: "1405/06/08",
        title: "میلاد حضرت رسول اکرم صلی الله علیه و آله"
    }
    ,
    {
        date: "1405/08/22",
        title: "شهادت حصرت فاطمه زهرا سلام الله علیها"
    }
    ,
    {
        date: "1405/10/02",
        title: "ولادت حضرت امام علی علیه السلام"
    }
    ,
    {
        date: "1405/10/16",
        title: "مبعث حضرت رسول اکرم صلی الله علیه و آله "
    }
    ,
    {
        date: "1405/11/04",
        title: "ولادت حضرت قائم عجل الله تعالی فرجه"
    }
    ,
    {
        date: "1405/11/22",
        title: "پیروزی انقلاب اسلامی و سقوط نظام شاهنشاهی"
    }
    ,
    {
        date: "1405/12/09",
        title: "شهادت حضرت امیرالمومنین علی علیه السلام"
    }
    ,
    {
        date: "1405/12/19",
        title: "عید سعید فطر"
    }
    ,
    {
        date: "1405/12/20",
        title: "عید سعید فطر"
    }
      ,
    {
        date: "1405/12/29",
        title: "آخرین روز سال"
    }
];
const HOLIDAY_STORAGE_KEY = "GuardScheduler_Holidays";


function loadOfficialHolidays() {

    const saved =
        localStorage.getItem(HOLIDAY_STORAGE_KEY);


    if (saved) {

        return JSON.parse(saved);

    }


    localStorage.setItem(
        HOLIDAY_STORAGE_KEY,
        JSON.stringify(defaultOfficialHolidays1405)
    );


    return defaultOfficialHolidays1405;

}



const officialHolidays1405 = loadOfficialHolidays();

function getHolidayInfo(date) {


    const normalizedDate = date
        .replaceAll("۰", "0")
        .replaceAll("۱", "1")
        .replaceAll("۲", "2")
        .replaceAll("۳", "3")
        .replaceAll("۴", "4")
        .replaceAll("۵", "5")
        .replaceAll("۶", "6")
        .replaceAll("۷", "7")
        .replaceAll("۸", "8")
        .replaceAll("۹", "9");


    const result = officialHolidays1405.find(function (item) {

        return item.date === normalizedDate;

    });


    return result || null;

}
function normalizePersianDate(date) {


    return date
        .replace(/۰/g, "0")
        .replace(/۱/g, "1")
        .replace(/۲/g, "2")
        .replace(/۳/g, "3")
        .replace(/۴/g, "4")
        .replace(/۵/g, "5")
        .replace(/۶/g, "6")
        .replace(/۷/g, "7")
        .replace(/۸/g, "8")
        .replace(/۹/g, "9");


}
console.log(
    getHolidayInfo("1405/05/13")
);