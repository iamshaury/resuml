const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/profiles?select=*&limit=1';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

fetch(url, { headers: { 'apikey': key, 'Authorization': 'Bearer ' + key } })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
