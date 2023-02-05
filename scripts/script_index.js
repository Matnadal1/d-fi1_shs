document.querySelector("#button1").addEventListener("click", function(){
    const xhr = new XMLHttpRequest();
    xhr.open("get", "https://api.tisseo.fr/v2/lines.json?key=a3732a1074e2403ce364ad6e71eb998cb")
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let lines = JSON.parse(xhr.responseText)
            let lignes = lines.lines.line

            for(let line of lignes) {
              document.querySelector("#liste").innerHTML+="<li class='ligne' id=\""+line.id+"\"><h2>"+line.name+"</h2><ul id=\"arret_ligne\"></ul></li>"
            }
            
            const listItems = document.querySelectorAll('#liste li');


            listItems.forEach(item => {
                item.addEventListener('click', function(event){
                    console.log(event.currentTarget.id);
                    


                    const id = event.currentTarget.id;
                    const stops = new XMLHttpRequest();
                    stops.open("get", "https://api.tisseo.fr/v2/stop_points.json?key=a3732a1074e2403ce364ad6e71eb998cb&lineId="+id)
                    stops.onreadystatechange = function () {
                        if (stops.readyState === 4 && stops.status === 200){
                            let stop = JSON.parse(stops.responseText)
                            let arrets = stop.physicalStops.physicalStop

                            for (const physicalStop of arrets){
                                console.log(physicalStop.name)
                            };

                            let previousStops = [];

                            for (let i = 0; i < arrets.length; i++) {
                              let currentStop = arrets[i].name;
                              if (!previousStops.includes(currentStop)) {
                                previousStops.push(currentStop);
                                // Ajouter l'arrêt actuel à la liste HTML
                              }
                            }

                            console.log(previousStops)

                            let codeHTML = "";
                            for (let i = 0; i < previousStops.length; i++){

                                codeHTML+="<li class='arret'>"+previousStops[i]+"</li>"
                                
                            };
                            document.querySelectorAll('#liste li ul').forEach(e => e.innerHTML = ""); 
                            document.querySelector(`#liste li[id="${id}"] #arret_ligne`).innerHTML = codeHTML

                        }
                    
                    }
                    stops.send()
                    
                    const previousActive = document.querySelector('.active');
                    if (previousActive) {
                        previousActive.classList.remove('active');
                    }
                    event.currentTarget.classList.add('active');

                    var lignes = document.querySelectorAll('.ligne');


      
                });
            });                       
        }
    };
    xhr.send();
}
);
    




