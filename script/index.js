const checkNegative = e => {
    e.value = !!e.value && Math.abs(e.value) >= 0 ? Math.abs(e.value) : null
}

let gatherData = document.getElementsByName('record[]')
let addRecord = document.querySelector('#add');

const barrierBeforeChart = (e) => {
    const count = gatherData.length;
    for (var i = 0; i < count; i++) {
        if (gatherData[2].value > gatherData[1].value) {
            gatherData[2].value = '';
        }
        if (gatherData[5].value > gatherData[4].value) {
            gatherData[5].value = '';
        }
        if (gatherData[i].value.length === 0) {
            gatherData[i].placeholder = "input not valid";
            e.preventDefault();
        }
    }
}

const round = arg => {
    return Math.round(arg);
};

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

    const userAgeInDays = gatherData[1].value * 365;
    const userWasClean = gatherData[2].value * 365;
    const cigsPerDay = gatherData[3].value;
    const cigarettePackCost = gatherData[4].value;
    const cigarettePackSize = gatherData[5].value;
    const userBeenSmoking = userAgeInDays - gatherData[2].value * 365;
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
    document.getElementById('zip').innerHTML = "WATCH THIS ANIMATION";
    document.getElementById('animate').href = "media/smoking.mp4";

    document.getElementById('details').innerHTML = `You have lived <span id="user-age">${userAgeInDays} days</span>,
    from which you were clean for <span id="user-clean">${userWasClean} days</span>.
    You started smoking <span id="started-smoking">${userBeenSmoking} days ago</span>,
    and as you mentioned that you smoke around <span id="per-day">${cigsPerDay} cigarettes
    per day</span>, you've smoked approximately <span id="smoke-average">${averageSmoked}
    cigarettes</span> <span id="life">in your life!`;

    document.getElementById('moneySummary').innerHTML = `You bought <span id="smoke-average">${averageSmoked} cigarettes</span>, which is equivalent to buying <span id="user-age">${round(totalPacks)} packs</span>.
     You've spent approximately <span id="user-clean">₹ ${round(totalMoneySpent)}</span> on cigarettes.
     You've been spending <span id="user-clean">₹ ${round(averageMoneySpent)}</span> per day for the last <span id="user-age">${userBeenSmoking} days</span>.`

    document.getElementById('daysSummary').innerHTML = `<li>So far, you've spent around <span id="user-age">${round(totalHoursSpentSmoking)} hours</span> smoking cigarettes.
    It would take <span id="user-age">${round(totalHoursSpentSmoking/24)} days</span> of continuous smoking to finish the amount of cigarettes you've smoked.</li>
    <li>You spent approximately <span id="user-clean">${round(totalHoursSpentLighting)} hours</span> lighting cigarettes.</li>
    <li>Smoking <span id="smoke-average">${averageSmoked} cigarettes</span> has costed you <span id="smoke-average">${round(totalLifeReduced)} hours</span> of your life which is equal to <span id="smoke-average">~${round(daysReduced)} days!</span></li>`;
};

addRecord.addEventListener('click', barrierBeforeChart);
addRecord.addEventListener('click', generateChart);
