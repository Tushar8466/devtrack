const fs = require('fs');

const contribs = [];
let startDate = new Date();
startDate.setFullYear(startDate.getFullYear() - 1);
for(let i=0; i<365; i++) {
    contribs.push({ date: new Date(startDate).toISOString().split('T')[0], level: 0 });
    startDate.setDate(startDate.getDate() + 1);
}

const grid = [];
let currentWeek = [];
const startDayOfWeek = new Date(contribs[0].date).getDay();
for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push({ date: "", level: -1, count: 0 });
}
contribs.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
        grid.push(currentWeek);
        currentWeek = [];
    }
});
if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
        currentWeek.push({ date: "", level: -1, count: 0 });
    }
    grid.push(currentWeek);
}

const labels = [];
let lastMonthIndex = -1;
grid.forEach((week, i) => {
    const firstValidDay = week.find(d => d.level !== -1);
    if (firstValidDay) {
        const d = new Date(firstValidDay.date);
        const monthIndex = d.getMonth();
        const m = d.toLocaleDateString("en-US", { month: "short" });
        if (monthIndex !== lastMonthIndex) {
            labels.push({ label: m, index: i });
            lastMonthIndex = monthIndex;
        }
    }
});
console.log(labels);
