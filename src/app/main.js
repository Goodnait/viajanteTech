const key = "a47b53784e9541c8a0101129260107";

fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=Lisbon&lang=pt`)
  .then(r => r.json())
  .then(console.log);