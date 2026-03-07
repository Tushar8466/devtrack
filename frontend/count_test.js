const fetch = require('node-fetch');
async function test() {
  const res = await fetch("https://api.github.com/repos/facebook/react/contributors?per_page=100");
  const data = await res.json();
  console.log("react top 3:", data.slice(0, 3).map(c => `${c.login}: ${c.contributions}`));
}
test();
