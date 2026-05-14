async function test() {
  const appId = 'eb21caa4';
  const apiKey = '215b1c709a40164518931534ede93ab1';
  const baseUrl = 'https://api.adzuna.com/v1/api/jobs/in/search';

  const url = `${baseUrl}/1?app_id=${appId}&app_key=${apiKey}&results_per_page=5&what=React`;
  
  console.log('Fetching', url);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data.results[0], null, 2));
  } catch(e) {
    console.error(e);
  }
}
test();
