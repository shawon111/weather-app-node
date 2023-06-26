const http = require('http');
const fs = require('fs');
const request = require('requests');

const homePageFile = fs.readFileSync('./home.html', 'utf-8');

const kelvinToCel = (kelvin) => {
    const cel = kelvin - 273;
    return cel.toFixed(2)
}

const replaceVal = (oldVal, newVal) => {
   let tempareture = oldVal.replace("{%tempValue%}", kelvinToCel(newVal.main.temp));
   tempareture = tempareture.replace("{%tempMinVal%}", kelvinToCel(newVal.main.temp_min));
   tempareture =  tempareture.replace("{%tempMaxVal%}", kelvinToCel(newVal.main.temp_max));
   tempareture =  tempareture.replace("{%city%}", newVal.name);
   tempareture =  tempareture.replace("{%country%}", newVal.sys.country);
   return tempareture
}

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        request('https://api.openweathermap.org/data/2.5/weather?q=satkhira&appid=b49f3079e8ec8176c7f9fd15ebc75f9d')
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const data = [objData];
                const loadData = data.map(item => replaceVal(homePageFile, item)).join();
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(loadData);
            })
            .on('end', (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    console.log('connection closed due to errors', err);
                } 
                res.end()
            });
    }
});

server.listen(8000, '127.0.0.1', (err) => {
    if (err) console.log(err);
    console.log("The server is running on the port: 8000")
})