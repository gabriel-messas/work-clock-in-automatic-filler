
var hourControl = 1;

function generateStartHour() {
    switch (hourControl) {
        case 1:
            return '08:55';
        case 2:
            return '08:56';
        case 3:
            return '08:57';
        case 4:
            return '08:58';
        case 5:
            return '08:59';
        case 6:
            return '09:00';
    }
}

function generateEndHour() {
    switch (hourControl) {
        case 1:
            hourControl++;
            return '18:00';
        case 2:
            hourControl++;
            return '18:01';
        case 3:
            hourControl++;
            return '18:02';
        case 4:
            hourControl++;
            return '18:03';
        case 5:
            hourControl++;
            return '18:04';
        case 6:
            hourControl = 1;
            return '18:05';
    }
}

function elementRendered(domString, all) {
    if (all === true) {
        return new Promise(function (resolve, reject) {
            function waitUntil() {
                setTimeout(function () {
                    document.querySelectorAll(domString) !== undefined ?
                        resolve(document.querySelectorAll(domString)) :
                        waitUntil();
                }, 100);
            }
            waitUntil();
        });
    } else {
        return new Promise(function (resolve, reject) {
            function waitUntil() {
                setTimeout(function () {
                    document.querySelector(domString) !== undefined ?
                        resolve(document.querySelector(domString)) :
                        waitUntil();
                }, 100);
            }
            waitUntil();
        });
    }
}

async function fillTimes() {
    const tableLines = await elementRendered('#tbody > tr', true);

    for (let line of tableLines) {
        if (line.children[1].children[0].innerHTML !== '378') {
            continue;
        }
        if (line.children[3].children[0].children[0].children[0].children[0].innerHTML === '08:00 - 1 Trabalhando') {
            continue;
        }

        if (line.children[3].children[0].children[0].children[0].children[0].innerHTML === '08:00 - 2 Férias') {
            continue;
        }

        (await elementRendered('#' + line.children[2].children[0].children[0].id, undefined)).click();

        // first hour
        (await elementRendered('#addMarcacao')).click();
        (await elementRendered('#marcacaoTime-0')).click();
        (await elementRendered('#marcacaoTime-0')).value = generateStartHour();
        (await elementRendered('#marcacaoTime-0')).dispatchEvent(new Event('input'));
        (await elementRendered('#selectJustificative-0 > span > span.ui-select-placeholder.text-muted.ng-binding')).click();
        await new Promise(r => setTimeout(r, 2000));
        (await elementRendered('#justificative_4')).click();

        // second hour
        (await elementRendered('#addMarcacao')).click();
        (await elementRendered('#marcacaoTime-1')).click();
        (await elementRendered('#marcacaoTime-1')).value = generateEndHour();
        (await elementRendered('#marcacaoTime-1')).dispatchEvent(new Event('input'));
        (await elementRendered('#selectJustificative-1 > span > span.ui-select-placeholder.text-muted.ng-binding')).click();
        (await elementRendered('#justificative_4')).click();
        await new Promise(r => setTimeout(r, 2000));
        (await elementRendered('#saveAppointment')).click();

        await new Promise(r => setTimeout(r, 2000));
    }
}

fillTimes();
