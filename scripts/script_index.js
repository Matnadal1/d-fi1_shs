document.querySelector("#button1").addEventListener("click", function(){
    const xhr = new XMLHttpRequest();
    xhr.open("get", "https://api.tisseo.fr/v2/lines.json?key=a3732a1074e2403ce364ad6e71eb998cb")
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let lines = JSON.parse(xhr.responseText)
            let lignes = lines.lines.line

            // On supprime les éléments html affichés lors de la derniere requete

            document.querySelector("#liste").innerHTML = "" 

            // On trie les lignes dans l'ordre croissant de leur id

            lignes.sort(function(a, b) {
                return parseInt(a.id.split(':')[1]) - parseInt(b.id.split(':')[1]);
            });
            
            // On affiche les lignes, ligne par ligne
            
            for(let line of lignes) {
                let id = line.id;
                id = id.replace("line:", "");
                document.querySelector("#liste").innerHTML+="<li class='ligne' id=\""+line.id+"\"><h2>" + id + " - "+line.name+"</h2><ul id=\"arret_ligne\"></ul></li>"
            }
            
            // On affiche les arrets quand on clique sur la ligne

            const listItems = document.querySelectorAll('#liste li');

            
            listItems.forEach(item => {
                item.addEventListener('click', function(event){
                    const previousActive = document.querySelector('.active');

                    // On vérifie si la ligne a deja les arrets d'afficher


                    if (!event.currentTarget.classList.contains('active')) {
                        
                        if (previousActive) {
                            previousActive.classList.remove('active');
                        }
                        // Si non on ajoute "active" a sa classe et on affiche les arrets
                        
                        const id = event.currentTarget.id;
                        const stops = new XMLHttpRequest();
                        stops.open("get", "https://api.tisseo.fr/v2/stop_points.json?key=a3732a1074e2403ce364ad6e71eb998cb&lineId="+id)
                        stops.onreadystatechange = function () {
                            if (stops.readyState === 4 && stops.status === 200){
                                let stop = JSON.parse(stops.responseText)
                                let arrets = stop.physicalStops.physicalStop

                                let previousStops = [];

                                // Permet d'enelever les arrets doublons

                                for (let i = 0; i < arrets.length; i++) {
                                  let currentStop = arrets[i].name;
                                  if (!previousStops.includes(currentStop)) {
                                    previousStops.push(currentStop);
                                    // Ajouter l'arrêt actuel à la liste HTML
                                  };
                                };



                                let codeHTML = "";
                                for (let i = 0; i < previousStops.length; i++){

                                    codeHTML+="<li class='arret'>"+previousStops[i]+"</li>"

                                };

                                // supprime les arrets affichés dans les autres lignes pour éviter de les avoir toutes en meme temps

                                document.querySelectorAll('#liste li ul').forEach(e => e.innerHTML = ""); 
                                
                                // affiche les arrets

                                document.querySelector(`#liste li[id="${id}"] #arret_ligne`).innerHTML = codeHTML;

                            }
                        
                        }
                        stops.send();
                        event.currentTarget.classList.add('active');

                    

                    } else {
                        
                        // Si oui on on enlève la classe "active" et on retire les arrets

                        const id = event.currentTarget.id;
                        document.querySelector(`#liste li[id="${id}"] #arret_ligne`).innerHTML = "";
                        previousActive.classList.remove('active');
                    }

      
                });
            });
            


        }
    };
    xhr.send();
}
);
 






