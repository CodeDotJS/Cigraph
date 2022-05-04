const checkNegative = e => {
    e.value = !!e.value && Math.abs(e.value) >= 0 ? Math.abs(e.value) : null
}

document.getElementById('visible').style.display = 'none';

let gatherData = document.getElementsByName('record[]')
let addRecord = document.querySelector('#add');

const stringToNumber = n => {
    return parseInt(n);
};

const barrierBeforeChart = (e) => {
    const count = gatherData.length;
    for (var i = 0; i < count; i++) {
        if (stringToNumber(gatherData[2].value) > stringToNumber(gatherData[1].value)) {
            gatherData[2].value = '';
        }
        if (stringToNumber(gatherData[5].value) > stringToNumber(gatherData[4].value)) {
            gatherData[5].value = '';
        }
        if (gatherData[i].value.length === 0) {
            gatherData[i].placeholder = "input not valid";
            e.preventDefault();
        } else {
            document.getElementById('visible').style.display = '';
        }
    }
}

const generateChart = () => {
    let chartStatus = Chart.getChart("smokingData");
    let secondChartStatus = Chart.getChart("moneyGraph");
    let thirdChartStatus = Chart.getChart("daysGraph")

    if (chartStatus != undefined || secondChartStatus != undefined || thirdChartStatus != undefined) {
        chartStatus.destroy();
        secondChartStatus.destroy();
        thirdChartStatus.destroy();
    }

    const ctx = document.getElementById('smokingData').getContext('2d');
    const ftx = document.getElementById('moneyGraph').getContext('2d');
    const mtx = document.getElementById('daysGraph').getContext('2d');

    const userAgeInDays = stringToNumber(gatherData[1].value) * 365;
    const userWasClean = stringToNumber(gatherData[2].value) * 365;
    const cigsPerDay = stringToNumber(gatherData[3].value);
    const cigarettePackCost = stringToNumber(gatherData[4].value);
    const cigarettePackSize = stringToNumber(gatherData[5].value);
    const userBeenSmoking = userAgeInDays - stringToNumber(gatherData[2].value) * 365;
    const averageSmoked = cigsPerDay * userBeenSmoking;
    const totalPacks = averageSmoked / cigarettePackSize;
    const totalMoneySpent = averageSmoked * (cigarettePackCost / cigarettePackSize);
    const averageMoneySpent = totalMoneySpent / userBeenSmoking;
    const totalLifeReduced = (averageSmoked * 11) / 60;
    const totalHoursSpentSmoking = (averageSmoked * 5.5) / 60;
    const totalHoursSpentLighting = ((averageSmoked * 2) / 60) / 60;
    const daysReduced = totalLifeReduced / 24;

    const userName = gatherData[0].value;


    const globalDataSets = [{
        backgroundColor: [
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(255, 99, 132)'
        ],
        borderColor: [
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(255, 99, 132)',
        ],
        borderWidth: 2
    }];

    const globalPlugin = {
        tooltip: {
            titleFont: {
                size: 18
            },
            bodyFont: {
                size: 16
            }
        }
    }

    const smokingData = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['DAYS LIVED', 'NOT SMOKED', 'DAYS OF CIGARETTES'],
            datasets: [{
                label: 'DAYS',
                data: [userAgeInDays, userWasClean, userBeenSmoking],
                backgroundColor: globalDataSets[0].backgroundColor,
                borderColor: globalDataSets[0].borderColor,
                borderWidth: globalDataSets[0].borderWidth
            }]
        },
        options: {
            plugins: globalPlugin
        }
    });

    const moneyGraph = new Chart(ftx, {
        type: 'line',
        data: {
            labels: ['PACKATES BOUGHT', 'TOTAL MONEY SPENT', 'AVERAGE MONEY SPENT'],
            datasets: [{
                label: 'RUPEES',
                data: [totalPacks, totalMoneySpent, averageMoneySpent],
                backgroundColor: globalDataSets[0].backgroundColor,
                borderColor: globalDataSets[0].borderColor,
                borderWidth: globalDataSets[0].borderWidth
            }]
        },
        options: {
            plugins: globalPlugin
        }
    });

    const daysGraph = new Chart(mtx, {
        type: 'line',
        data: {
            labels: ['LIGHTING CIGS', 'HOURS SMOKED', 'LIFE REDUCED'],
            datasets: [{
                label: 'HOURS',
                data: [totalHoursSpentLighting, totalHoursSpentSmoking, totalLifeReduced],
                backgroundColor: globalDataSets[0].backgroundColor,
                borderColor: globalDataSets[0].borderColor,
                borderWidth: globalDataSets[0].borderWidth
            }]
        },
        options: {
            plugins: globalPlugin
        }
    });

    document.getElementById('user').innerHTML = userName;
    document.getElementById('more').innerHTML = "NEXT";
    document.getElementById('download').innerHTML = "NEXT";
    document.getElementById('zip').innerHTML = "WATCH THIS VIDEO";
    document.getElementById('thanks').innerHTML = "DONE!";

    document.getElementById('details').innerHTML = `You have lived <span id="user-age">${userAgeInDays} days</span>,
    from which you were clean for <span id="user-clean">${userWasClean} days</span>.
    You started smoking <span id="started-smoking">${userBeenSmoking} days ago</span>,
    and as you mentioned that you smoke around <span id="per-day">${cigsPerDay} cigarettes
    per day</span>, you've smoked approximately <span id="smoke-average">${averageSmoked}
    cigarettes</span> <span id="life">in your life!</span>`;

    document.getElementById('moneySummary').innerHTML = `You bought <span id="smoke-average">${averageSmoked} cigarettes</span>,
    which is equivalent to buying <span id="user-age">${totalPacks.toFixed(2)} packs</span>.
     You've spent approximately <span id="user-clean">₹ ${totalMoneySpent.toFixed(2)}</span> on cigarettes.
     You've been spending <span id="user-clean">₹ ${averageMoneySpent.toFixed(2)}</span> per day for the last <span id="user-age">${userBeenSmoking} days</span>.`

    document.getElementById('daysSummary').innerHTML = `<li>So far, you've spent around <span id="user-clean">${totalHoursSpentSmoking.toFixed(2)} hours</span> smoking cigarettes.
    It would take <span id="user-clean">${(totalHoursSpentSmoking/24).toFixed(2)} days</span> of continuous smoking to finish the number of cigarettes you've smoked.</li>
    <li>You spent approximately <span id="user-age">${totalHoursSpentLighting.toFixed(2)} hours</span> lighting cigarettes.</li>
    <li>Smoking <span id="smoke-average">${averageSmoked} cigarettes</span> has cost you <span id="smoke-average">${totalLifeReduced.toFixed(2)} hours</span> of your
    life which is equal to <span id="smoke-average"> ${daysReduced.toFixed(2)} days!</span></li>`;

    document.getElementById('videoSummary').innerHTML = `Since you're here, you should check <a href="https://www.goodreads.com/en/book/show/6618.The_Easy_Way_to_Stop_Smoking">this book.</a> Things might work for you. Who knows?`;
};

addRecord.addEventListener('click', barrierBeforeChart);
addRecord.addEventListener('click', generateChart);
