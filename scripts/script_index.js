// Récupère et affiche les lignes quand on appuis sur envoyer

document.querySelector("#button1").addEventListener("click", function(){
    fetchLines();
});

// Récupère les lignes
function fetchLines() {
  const xhr = new XMLHttpRequest();
  xhr.open("get", "https://api.tisseo.fr/v2/lines.json?key=a3732a1074e2403ce364ad6e71eb998cb");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let lines = JSON.parse(xhr.responseText).lines.line;
      displayLines(lines);
    }
  };
  xhr.send();
}

// Affiche les Lignes

function displayLines(lines) {
  document.querySelector("#liste").innerHTML = "";
  lines.sort(function(a, b) {
    return parseInt(a.id.split(":")[1]) - parseInt(b.id.split(":")[1]);
  });
  lines.forEach(line => {
    let id = line.id.replace("line:", "");
    let item = `<li class='ligne' id="${line.id}"><h2>${id} - ${line.name}</h2><ul id="arret_ligne"></ul></li>`;
    document.querySelector("#liste").innerHTML += item;
  });
  const listItems = document.querySelectorAll('#liste li');
  listItems.forEach(item => {
    item.addEventListener('click', function(event){
      toggleLine(event.currentTarget);
    });
  });
}

// Selectionne une ligne (Affiche les arrets quand on clique sur les lignes)
function toggleLine(line) {
  const previousActive = document.querySelector('.active');
  if (!line.classList.contains('active')) {
    if (previousActive) {
      previousActive.classList.remove('active');
    }
    fetchStops(line.id);
    line.classList.add('active');
    console.log(line.id)

  } else {
    document.querySelector(`#liste li[id="${line.id}"] #arret_ligne`).innerHTML = "";
    previousActive.classList.remove('active');
  }
}

// Récupère les arrets

function fetchStops(lineId) {
  const stops = new XMLHttpRequest();
  stops.open("get", "https://api.tisseo.fr/v2/stop_points.json?key=a3732a1074e2403ce364ad6e71eb998cb&lineId="+lineId)
  stops.onreadystatechange = function () {
    if (stops.readyState === 4 && stops.status === 200){
      let stop = JSON.parse(stops.responseText).physicalStops.physicalStop;
      let previousStops = stop.map(s => s.name).filter((v, i, a) => a.indexOf(v) === i);
      displayStops(lineId, previousStops);
      console.log("ça marche")
    }
  };
  stops.send()
};

// Affiche les arrets
  
function displayStops(lineId, previousStops) {
  document.querySelectorAll('#liste li ul').forEach(e => e.innerHTML = "");
    let codeHTML = "";
    for (let i = 0; i < previousStops.length; i++){
        codeHTML+="<li class='arret'>"+previousStops[i]+"</li>"
    };
    document.querySelector(`#liste li[id="${lineId}"] #arret_ligne`).innerHTML = codeHTML;
}
  
