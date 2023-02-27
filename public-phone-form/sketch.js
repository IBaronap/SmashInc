let socket = io("http://localhost:5050", { path: '/real-time' })
let canvas;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    background(0);
}

let button = document.getElementById('ButtonSend');

    let Disable = document.getElementById('Check1');

    Disable.addEventListener('change', function() {
        if (this.checked) {
          button.removeAttribute('disabled');
        } else {
          button.setAttribute('disabled', true);
        }
      });


let data = {
    name: "",
    email: "",
    phone: "",
    notify: ""
  };

button.addEventListener('click', function(){
    data.name = document.getElementById("nameBox").value;
    data.email = document.getElementById("emailBox").value;
    data.phone = document.getElementById("numberBox").value;
    data.notify = document.getElementById("Check2").checked;

    console.log(data);
    send(data);
});

async function send(data) {
    const datas = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)}
    await fetch(`/Forms-Array`, datas)
}
  
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}