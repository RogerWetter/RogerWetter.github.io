
async function getWeather(position) {
  const time = new Date()

  const apiUrl = `https://api.meteomatics.com/${time.toISOString()}/t_2m:C/${position.coords.latitude},${position.coords.longitude}/json?model=mix`;
  //pls don't use, you can get your own free access to meteomatics on their website! www.meteomatics.com
  const username = 'student_wetter_roger';
  const password = 's2xY6XZ5pC';
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': 'Basic ' + btoa(username + ':' + password)
      }
    });
    const data = await response.json();
    const temperature = data.data[0]?.coordinates[0]?.dates[0]?.value;
    document.getElementById('weather').innerHTML = `<p>Temperatur: ${temperature}°C</p>`;
  } catch (e) {
    document.getElementById('weather').innerHTML = `<p>Leider kann das Wetter aktuell nicht abgerufen werden :(</p>`;
    console.error('Fehler beim Abrufen der Wetterdaten:', e.message);
  }
}

async function getAddressLookup(position) {
  // KEY is restricted to this website!
  const KEY = "AIzaSyBSoGCCQ6cu4Z5sK3hWiBwvbacIRFqsKks"
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${KEY}`

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()
    console.log(data)
    if (data.error_message) {
      throw new Error(data.error_message)
    }
    const address = data.results[6].formatted_address;
    document.getElementById('place').innerHTML = `<p>in ${address}.</p>`;

  } catch (e) {
    console.error('Fehler beim Abrufen der Adressdaten:', e.message);
  }
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(getWeather);
  navigator.geolocation.getCurrentPosition(getAddressLookup);
} else {
  const position = {
    coords: {
      latitude: '47.49440780348561',
      longitude: '8.71264549797825'
    }
  }
  console.log(position)
  getWeather(position)
}