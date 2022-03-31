const socket = io.connect('https://ip-locator12.herokuapp.com:5000')
const ip = document.getElementById('ip')
const loc = document.getElementById('loc')
const loc2 = document.getElementById('loc2')
const tz = document.getElementById('tz')
const isp = document.getElementById('isp')
const off = document.getElementById('off')
const btn = document.getElementById('btn')
const formIn = document.getElementById('formIn')


let ipv46_regex = /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$)/gm;

socket.on('connect', message => {
    socket.on('data', (arg)=> {
        let lookup;
        if(arg.ip === '::ffff:127.0.0.1'){
            lookup = '8.8.8.8'
            getData(lookup)
        }else{
            getData(arg.ip)
        }
        
        
    })
    
})

async function getData(ipAdd){
    const res = fetch(`http://localhost:5000/proxy?ip=${ipAdd}`)
        .then(res => res.json())
        .then(data => {
            ip.innerText = data.ip;
            off.innerText = data.time_zone.offset;
            isp.innerText = data.isp
            loc.innerText = data.city
            loc2.innerText = `${data.state_prov} ${data.country_code3}`
            makeMap(data.latitude,data.longitude)
        }).catch(err => {
            console.log(err)
        })
}

async function makeMap(lat,long){
/* 5mk$<zQf.5Dr6w=]\]{}q>{>N[s%Q""n */
var container = L.DomUtil.get('map');

 if(container != null){ container._leaflet_id = null; }
var map = L.map('map').setView([lat, long], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: ''
}).addTo(map);
var marker = L.marker([lat, long]).addTo(map);
}

btn.addEventListener('click', (ev)=> {
    ev.preventDefault();
    
    if(ipv46_regex.test(formIn.value)){
        getData(formIn.value)
        
    }else{
        formIn.placeholder = 'Enter valid IP'
    }
})
