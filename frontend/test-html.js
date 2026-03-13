const fs = require('fs');

async function test() {
  const res = await fetch('https://github.com/users/Tushar8466/contributions');
  const html = await res.text();
  
  const regex = /data-date="(\d{4}-\d{2}-\d{2})"[\s\S]*?data-level="(\d+)"/g;
  let match;
  const dates = new Map();
  
  while ((match = regex.exec(html)) !== null) {
    const date = match[1];
    const level = parseInt(match[2]);
    dates.set(date, level);
  }
  
  const sortedDates = Array.from(dates.keys()).sort();
  console.log("Found", sortedDates.length, "dates");
  for (let i = Math.max(0, sortedDates.length - 5); i < sortedDates.length; i++) {
     console.log(sortedDates[i], dates.get(sortedDates[i]));
  }
}

test();
