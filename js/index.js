/*******************************VARIABLES********************************/
var count = document.querySelector("#count");
var items = document.querySelector("#items");
var stats = document.querySelectorAll(".stat");
var freq = document.querySelector("#frecuency");
var cookieAlert = document.querySelector("#cookieAlert");
var upgrades = document.querySelector("#upgrades");
var reset = document.querySelector("#reset");

/**************Variables de entorno***********************/
var multiplierCost = 1.15;
var updateInterval = 1;
var accepted = false; //cookies
/*********************************************************/

var itemCount = [0, 0, 0, 0, 0, 0, 0, 0]; //Número de items i
var itemBaseCost = [10, 50, 100, 200, 500, 1200, 3000, 10000];  //coste original de los items
var itemCost = [10, 50, 100, 200, 500, 1200, 3000, 10000];  //Coste actual de los items
var itemLock = [false, false, true, true, true, true, true, true];
var lockeditems = 6;
var itemName = ["Eevee", 
                "Vaporeon", 
                "Jolteon",
                "Flareon",
                "Espeon",
                "Umbreon",
                "Leafeon",
                "Glaceon"];
var itemSprite = ["img/pkmn/eevee.png", //Eevee  
                  "img/pkmn/vaporeon.png", //Vaporeon
                  "img/pkmn/jolteon.png", //Jolteon
                  "img/pkmn/flareon.png", //Flareon
                  "img/pkmn/espeon.png", //Espeon
                  "img/pkmn/umbreon.png", //Umbreon
                  "img/pkmn/leafeon.png", //Leafeon
                  "img/pkmn/glaceon.png"]; //Glaceon
var itemReward = ["+0.5p por click",
                  "+0.5p por segundo",
                  "+1p por click", 
                  "+1p por segundo",
                  "+2p por click",
                  "+2p por segundo",
                  "+5p por click",
                  "+5p por segundo"];
var upgradeName =["Baya aranja",
                  "Baya meloc",
                  "Baya perasi",
                  "Baya safre",
                  "Baya zanama",
                  "Baya zreza",
                  "Baya atania"]
var upgradeSprite = ["img/bayas/baya_aranja.png",  //baya aranja
                     "img/bayas/baya_meloc.png",  //baya meloc
                     "img/bayas/baya_perasi.png",  //baya perasi
                     "img/bayas/baya_safre.png",  //baya safre
                     "img/bayas/baya_zanama.png",  //baya zanama
                     "img/bayas/baya_zreza.png",  //baya zreza
                     "img/bayas/baya_atania.png"]; //baya atania
var upgradeReward = ["Multiplicador de clicks + 0.5",
                     "Multiplicador de clicks por segundo + 0.5",
                     "Multiplicador de clicks + 1", 
                     "Multiplicador de clicks por segundo + 1",
                     "Multiplicador de clicks + 3.5",
                     "Multiplicador de clicks por segundo + 3.5",
                     "Secreto",
                     "Mucho más secreto"];
var upgradeCost = [200, 400, 700, 1500, 2000, 4000, 10000];
var upgradeLock = [false, true, true, true, true, true, true];
var upgradeBought = [false, false, false, false, false, false, false];
var itemHandler = [];       //Contiene los items (.item)
var itemCountHandler = [];  //Contiene el div que tiene el número de items de item i
var itemCostHandler = [];   //Contiene el div que muestra el coste actual del item i

var upgradeHandler = [];   //Contiene los div de las mejoras

var number = 0;   //Número total

var click = 1;
var multiplierClick = 1;
var clickPerSec = 0;
var clickPerSecMultiplier = 1;
/*******************************INICIALIZACIÓN****************************/



createItems();
createItems();

createUpgrades();

updateStats();

var intervalID = setInterval(function() {autoClick(updateInterval)} , updateInterval*1000);
var intervalCookieID = setInterval(saveCookies,10*1000);  //guardamos las cookies cada 10s
count.textContent = number;

loadCookies();

/********************************FUNCIONES*************************************/

/*Función que se llama cuando se hace click en la zona específica de click, suma al contador y actualiza*/
function add(){
  number += click*multiplierClick;
  updateCount();
  checkAvailability();
}

/*Crea los items de la zona de #items que se pueden comprar*/
function createItems(){
  itemHandler.splice(itemHandler.length,0,document.createElement('div')); //añadimos al final el div
  var index = itemHandler.length-1;  
  
  itemHandler[index].classList.add('item'/*,itemName[index]*/);
  itemHandler[index].id = "item" + String(index); //item0, item1, item2...
  itemHandler[index].onclick = function() {buyItem(this.id)};
  
  var img = document.createElement('img');
  img.src = itemSprite[index];
  img.classList.add('foto');
  itemHandler[index].appendChild(img);
  
  var text = document.createElement('div');
  text.textContent = itemName[index];
  
  generateBr(text);
  generateSpan(text,"Nº: ");
  
  
  itemCountHandler[index] = document.createElement('span');
  itemCountHandler[index].textContent = 0;
  //count.classList.add('');
  //count.id = "" + String(index);
  text.appendChild(itemCountHandler[index]);
  
  
  generateBr(text);
  generateSpan(text,"Precio: ");
  
  
  itemCostHandler[index] = document.createElement('span');
  itemCostHandler[index].textContent = itemCost[index];
  //price.classList.add('');
  //price.id = "" + String(index);
  text.appendChild(itemCostHandler[index]);
  
  
  generateBr(text);
  generateSpan(text,"Recompensa: " + itemReward[index]);
  
   itemHandler[index].appendChild(text);
  
  items.appendChild(itemHandler[itemHandler.length-1]);
}

/*Cuando se hace click en un .item se evalua si se puede comprar o no con esta funcion, en caso positivo, se resta la cantidad del coste en el contador y se actualiza la interfaz gráfica*/
function buyItem(id){
  var index = id.replace("item", '');   //Quitamos item
  if(growthRate(index)){
    itemCount[index]++;
    updateItem(index);
    updateStats();
  }
}

/*Se evalua como sube el precio de cada uno de los .item según el número actual de cada .item*/
function growthRate(index){
  var needed = itemCost[index];
    if(number >= needed){
      number -= needed;
      updateCount();
      applyBenefit(index);
      itemCost[index] = itemBaseCost[index] * Math.pow(multiplierCost,itemCount[index]+1);
      return true;
    }
  return false;
}

/*Actualiza la información de un .item*/
function updateItem(index){
  checkAvailability();
  itemCountHandler[index].textContent = itemCount[index];
  itemCostHandler[index].textContent = itemCost[index].toFixed(3).replace(/\.0*$|0*$/,'');
}
/*Actualiza el contador principal*/
function updateCount(){
    count.textContent = number.toFixed(3).replace(/\.0*$|0*$/,'');
}

/*Evalua que se acaba de comprar y aumenta las estadísticas */
function applyBenefit(index){
  switch(Number(index)){
    case 0: click+= 0.5; break;
    case 1: clickPerSec+= 0.5; break;
    case 2: click++; break;
    case 3: clickPerSec++; break;
    case 4: click+= 2; break;
    case 5: clickPerSec+= 2; break;
    case 6: click+= 5; break;
    case 7: clickPerSec+= 5; break;
  }
}

/************************GENERADORES************************/
function generateSpan(item, text, clase){
  var span = document.createElement('span');
  span.textContent = text;
  span.classList.add(clase);
  item.appendChild(span);
}

function generateBr(item){
  var br = document.createElement('br');
  item.appendChild(br);
}
/*************************************************************/

/*Pone un aspecto visual en escala de grises si no está disponible para comprar*/
function checkAvailability(){
  for(i in itemName){
    if(!itemLock[i]){
      if(itemCost[i] <= number && !itemHandler[i].classList.contains('available'))
        itemHandler[i].classList.add('available',itemName[i]);
      else if (itemCost[i] > number && itemHandler[i].classList.contains('available'))
        itemHandler[i].classList.remove('available',itemName[i]);
    }
  }
  for (i in upgradeName){
    if(!upgradeLock[i]){
      if(upgradeCost[i] <= number && !upgradeHandler[i].classList.contains('available'))
        upgradeHandler[i].classList.add('available');
      else if (upgradeCost[i] > number && upgradeHandler[i].classList.contains('available'))
        upgradeHandler[i].classList.remove('available');
    }
  }
}

/*Actualiza las estadísticas de la zona central*/
function updateStats(){
  stats[0].textContent = click.toFixed(3).replace(/\.0*$|0*$/,'');
  stats[1].textContent = multiplierClick.toFixed(3).replace(/\.0*$|0*$/,'');
  stats[2].textContent = clickPerSec.toFixed(3).replace(/\.0*$|0*$/,'');
  stats[3].textContent = clickPerSecMultiplier.toFixed(3).replace(/\.0*$|0*$/,'');
}

/*Autoclick, funciona principalmente con la estadistica "Clicks por segundo"*/
function autoClick(tick=1){ //usar ticks como segundos (si se pone cada 2 seg, 2ticks, 3->3...)
  number+= clickPerSec*clickPerSecMultiplier*tick;
  updateCount();
  checkAvailability();
  unlockItems();
  unlockUpgrades();
}

/***************************************COOKIES***************************************************/
function saveCookies(){
 
  if(accepted){
    Cookies.set('accepted', accepted ,{ expires: 7});

    Cookies.set('points', String(number), { expires: 7});

    for(i in itemName){
      Cookies.set(itemName[i], String(itemCount[i]), { expires: 7});
    }

    for(i in upgradeName){
      console.log("guardamos ", i ," ", upgradeBought[i])
      Cookies.set(upgradeName[i], String(upgradeBought[i]), { expires: 7});
    }
  }

  
}


function loadCookies(){
  
  if(Cookies.get('accepted') == 'true'){
    
    number = Number(Cookies.get('points'));
    
    unlockItems();
    unlockUpgrades();
    

    for(i in itemName){
      if(!itemLock[i]){
        itemCount[i] = Number(Cookies.get(itemName[i]));
        
        for(j = 0; j < itemCount[i]; j++){
         applyBenefit(i);
        }
        updateItem(i);
      }
    } 
    
    for(i in upgradeName){
      if(!upgradeLock[i]){
        upgradeBought[i] = stringToBool(Cookies.get(upgradeName[i]));
        console.log(upgradeBought[i]);
        if(upgradeBought[i]){
          applyBenefitUpgrade(i);
          upgradeHandler[i].classList.add("delete");
        }
      }
    }
    
    updateStats();
    
  }
  else{
    cookieAlert.classList.add('notaccepted');
  }
}

function substringMatching(string,substring){
  return string.includes(substring);
}
/***********************************************************************************************/

function stringToBool(string){
  return string == "true";
}

/*Se llama cuando cambia el <input> de la zona central, se puede regular cada cuanto se actualiza la interfaz gráfica default: 1s*/
function updateUpdateInterval(){
  updateInterval = freq.value; 
  clearInterval(intervalID);
  intervalID = setInterval(function() {autoClick(updateInterval)} , updateInterval*1000);
}

function hideCookieAlert(){
  cookieAlert.classList.add('hide');
  accepted = true;
}

function unlockItems(){
  var unlocked = 0;
  for(i in itemName){
    if(itemLock[i] && number >= itemCost[i]*0.7){
      itemLock[i] = false;
      unlocked++;
    }
  }
  if(unlocked>0)
    for(i = 0; i < unlocked; i++)
       createItems();
  
}

function unlockUpgrades(){
  var unlocked = 0;
  for (i in upgradeName){
    if(upgradeLock[i] && number >= upgradeCost[i]*0.65){
      upgradeLock[i] = false;
      unlocked++;
    }
  }
  if(unlocked>0)
    for(i = 0; i < unlocked; i++)
       createUpgrades();
}

function createUpgrades(){
  
  upgradeHandler.splice(upgradeHandler.length,0,document.createElement('div'));
  var index = upgradeHandler.length-1;  
  
  var img = document.createElement('img');
  img.src = upgradeSprite[index];
  upgradeHandler[index].appendChild(img);
  upgradeHandler[index].classList.add("upgrade");
  upgradeHandler[index].id = "upgrade" + String(index);
  upgradeHandler[index].onclick = function() {buyUpgrade(this.id)};
  upgradeHandler[index].title = upgradeName[index] + "\nPrecio: " + upgradeCost[index] + "\nBeneficio: " + upgradeReward[index];
  upgrades.appendChild(upgradeHandler[index]);
}

/*Evalua que se acaba de comprar y aumenta las estadísticas */
function applyBenefitUpgrade(index){
  switch(Number(index)){
    case 0: multiplierClick+= 0.5; break;
    case 1: clickPerSecMultiplier+= 0.5; break;
    case 2: multiplierClick++; break;
    case 3: clickPerSecMultiplier++; break;
    case 4: multiplierClick+= 3.5; break;
    case 5: clickPerSecMultiplier+= 3.5; break;
    case 6: click+= 20; break;
    case 7: clickPerSec+= 10; break;
  }
}

/*Cuando se hace click en un .item se evalua si se puede comprar o no con esta funcion, en caso positivo, se resta la cantidad del coste en el contador y se actualiza la interfaz gráfica*/
function buyUpgrade(id){
  var index = id.replace("upgrade", '');   //Quitamos upgrade
  if(number >= upgradeCost[index]){
    applyBenefitUpgrade(index);
    upgradeBought[index] = true;
    upgradeHandler[index].classList.add("delete");
    updateStats();
  }
}

function resetEverything(){
  if(window.confirm("¿Estás seguro de querer eliminar tu progreso?")){
    
    number = 0;
    
    itemCount = [0, 0, 0, 0, 0, 0, 0, 0];
    itemCost = itemBaseCost;
    itemLock = [false, false, true, true, true, true, true, true];
    lockeditems = 6;
    upgradeLock = [false, true, true, true, true, true, true];
    upgradeBought = [false, false, false, false, false, false, false];
    
    for(i in itemCount){
      if(!itemLock[i])
        updateItem(i);
    }
    
    click = 1;
    multiplierClick = 1;
    clickPerSec = 0;
    clickPerSecMultiplier = 1;
    
    updateStats();
    
  }
}