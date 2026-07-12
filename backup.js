/*=====================================
        Export Backup
=====================================*/

function exportData() {

    const backup = {

        chief: lists.chief,

        guard: lists.guard,

        night: lists.night,

        reserve: lists.reserve

    };

    const json =
        JSON.stringify(
            backup,
            null,
            2
        );

    const blob =
        new Blob(
            [json],
            {
                type:"application/json"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "guard-scheduler-backup.json";

    link.click();

    URL.revokeObjectURL(url);

    showToast(
        "فایل پشتیبان دانلود شد.",
        "success"
    );

}
/*=====================================
        Import Backup
=====================================*/

function importData(event) {

    const file = event.target.files[0];

    if (!file) {

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        try {

            const backup = JSON.parse(e.target.result);

            lists.chief.length = 0;
            lists.guard.length = 0;
            lists.night.length = 0;
            lists.reserve.length = 0;

            lists.chief.push(...(backup.chief || []));
            lists.guard.push(...(backup.guard || []));
            lists.night.push(...(backup.night || []));
            lists.reserve.push(...(backup.reserve || []));

            saveList("chief");
            saveList("guard");
            saveList("night");
            saveList("reserve");

            renderList("chief", chiefTable);
            renderList("guard", guardTable);
            renderList("night", nightTable);
            renderReservePersons();

            showToast(
                "اطلاعات با موفقیت وارد شد.",
                "success"
            );

        }

        catch {

            showToast(
                "فایل معتبر نیست.",
                "error"
            );

        }

        importFile.value = "";

    };

    reader.readAsText(file);

}

exportBtn.addEventListener(
    "click",
    exportData
);

importBtn.addEventListener(
    "click",
    function () {
        importFile.click();
    }
);

importFile.addEventListener(
    "change",
    importData
);