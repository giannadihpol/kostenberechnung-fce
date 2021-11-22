// Import der Funktionen
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js'; 
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";



// Firebase Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyCUmiaSnpEUsh_DTa5LJQ1yamoEQrHyCQo",
  authDomain: "kostenberechnung-fce.firebaseapp.com",
  projectId: "kostenberechnung-fce",
  storageBucket: "kostenberechnung-fce.appspot.com",
  messagingSenderId: "433505398790",
  appId: "1:433505398790:web:48627cda3cd2500ea01387",
  measurementId: "G-CR0P1LE2PD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();


const button = document.querySelector("#button");
button.addEventListener("click",async (evt) => {

  //Daten aus den Feldern von 1.Produktvariante auslesen
  var selectVariante = document.getElementById('dropdown-variante');
  var selectBetriebssystem =document.getElementById('dropdown-betriebssystem');
  var selectServicezeit =document.getElementById('dropdown-service');
  var selectVerügbarkeit =document.getElementById('verfügbarkeit-dropdown');

  var produkt ={
  variante:selectVariante.options[selectVariante.selectedIndex].value,
  betriebssystem:selectBetriebssystem.options[selectBetriebssystem.selectedIndex].value,
  servicezeit: selectServicezeit.options[selectServicezeit.selectedIndex].value,
  verfügbarkeit: selectVerügbarkeit.options[selectVerügbarkeit.selectedIndex].value,
};

//Daten aus Feldern von 2. Konfiguration CPU auslesen
var selectVarianteCpu =document.getElementById("cpu-variante-dropdown");
var selectMengeCpu =document.getElementById("input-cpu");

var produktCpu ={
  variante:selectVarianteCpu.options[selectVarianteCpu.selectedIndex].value,
  menge:selectMengeCpu.value
};

//Daten aus Feldern von 2. Konfiguration RAM auslesen
var selectVarianteRam =document.getElementById("dropdown-ram-variante");
var selectMengeRam = document.getElementById("ram-menge-dropdown");

var produktRam = {
  variante: selectVarianteRam.options[selectVarianteRam.selectedIndex].value,
  menge: selectMengeRam.options[selectMengeRam.selectedIndex].value
}


//Daten aus Feldern von 2. Konfiguration Storage auslesen
var selectVarianteStorage =document.getElementById("storage-varinate-dropdown");
var selectMengeStorage = document.getElementById("storage-menge-dropdown");

var produktStorage = {
  variante: selectVarianteStorage.options[selectVarianteStorage.selectedIndex].value,
  menge: selectMengeStorage.options[selectMengeStorage.selectedIndex].value
}

//Variabel initialisierung
var storagePreisGesamt;
var ramPreisGesamt;
var cpuPreisGesamt;
var produktvariantePreisGesamt;

//Prüfen, ob Felder gefüllt sind
if(produkt.variante==""||produkt.betriebssystem==""||produkt.servicezeit==""||produkt.verfügbarkeit==""||produktCpu.menge==""||produktCpu.variante==""||produktRam.menge==""||produktRam.variante==""||produktStorage.menge==""||produktStorage==""){
  alert("Bitte bei allen Feldern etwas auswählen!")
}
else{

//Datenbank Abfrage von Produktvariante
const q = query(collection(db, "produkt"), where("Bezeichnung", "==", produkt.variante),where("Betriebssystem","==",produkt.betriebssystem), where("Verfügbarkeit","==",produkt.verfügbarkeit), where("Servicezeit", "==", produkt.servicezeit));
const inputPreis = document.getElementById("preis-produktvariante");
var querySnapshot = await getDocs(q);

if(querySnapshot.empty){
  console.log("nicht erfolgreich");
  inputPreis.setAttribute("value", "");
  alert("Gewünschte Produktkonfiguration nicht vorhanden!")
}

else{
  console.log("erfolgreich");
  querySnapshot.forEach((doc) => {
   var result = doc.data();
   produktvariantePreisGesamt=result.Preis;
  
  var ErgebnisVariante = produktvariantePreisGesamt.toString();
  var AusgabeVariante = ErgebnisVariante.replace(".",",");
   inputPreis.setAttribute("value",AusgabeVariante + " €");
  });

//Datenbank Abfrage von CPU
  const cpu = query(collection(db, "produkt"), where("Bezeichnung", "==", produktCpu.variante));
  var querySnapshot = await getDocs(cpu);
  const inputPreisCpu = document.getElementById("preis-cpu");
  console.log("erfolgreich");
  querySnapshot.forEach((doc) => {
    var result = doc.data();

    //Berechnung CPU Preis
    cpuPreisGesamt=result.Preis * produktCpu.menge;
    var ErgebnisCpu = cpuPreisGesamt.toString();
    var AusgabeCpu = ErgebnisCpu.replace(".",",");
    inputPreisCpu.setAttribute("value",AusgabeCpu + " €");
   });

   //Datenbank Abfrage von RAM
  const ram = query(collection(db, "produkt"), where("Bezeichnung", "==", produktRam.variante));
  var querySnapshot = await getDocs(ram);
  const inputPreisRam = document.getElementById("preis-ram");
  console.log("erfolgreich");
  querySnapshot.forEach((doc) => {
    var result = doc.data();

    //Berechnung RAM Preis
    ramPreisGesamt=result.Preis * produktRam.menge;
    var ErgebnisRam = ramPreisGesamt.toString();
    var AusgabeRam = ErgebnisRam.replace(".",",");
    inputPreisRam.setAttribute("value",AusgabeRam + " €");
   });

   //Datenbank Abfrage von Storage
  const storage = query(collection(db, "produkt"), where("Bezeichnung", "==", produktStorage.variante));
  var querySnapshot = await getDocs(storage);
  const inputPreisStorage = document.getElementById("preis-storage");
  console.log("erfolgreich");
  querySnapshot.forEach((doc) => {
    var result = doc.data();

    //Berechnung Storage Preis
    storagePreisGesamt=result.Preis * produktStorage.menge;
    var ErgebnisStorage = storagePreisGesamt.toString();
    var AusgabeStorage = ErgebnisStorage.replace(".",",");
    inputPreisStorage.setAttribute("value",AusgabeStorage + " €");
   });

   //Gesamtpreis Berechnung Monat
   const inputGesamtPreisMonat = document.getElementById("preis-pro-monat");
   const gesamtPreisMonat = storagePreisGesamt + produktvariantePreisGesamt + ramPreisGesamt +cpuPreisGesamt;
   console.log(gesamtPreisMonat);
   const gerundetPreisMonat = gesamtPreisMonat.toFixed(2);
   var ErgebnisMonat = gerundetPreisMonat.toString();
   var AusgabeMonat = ErgebnisMonat.replace(".",",");
   inputGesamtPreisMonat.setAttribute("value",AusgabeMonat);



   //Gesamtpreis Berechnung Tag, fargen wie berechnet
   const inputGesamtPreistag = document.getElementById("preis-pro-tag");
   const gesamtPreisTag = gesamtPreisMonat/30;
   var gerundetPreisTag = gesamtPreisTag.toFixed(2);
   var ErgebnisTag = gerundetPreisTag.toString();
   var AusgabeTag = ErgebnisTag.replace(".",",");
   inputGesamtPreistag.setAttribute("value",AusgabeTag + " €");
}
}
})

const buttonHinzufügen = document.querySelector("#button-hinzufügen");
buttonHinzufügen.addEventListener("click",async (evt) => {

//Daten aus den Feldern von 1.Produktvariante auslesen
var selectVariante = document.getElementById('dropdown-variante');
var selectBetriebssystem =document.getElementById('dropdown-betriebssystem');
var selectServicezeit =document.getElementById('dropdown-service');
var selectVerügbarkeit =document.getElementById('verfügbarkeit-dropdown');

var produkt ={
variante:selectVariante.options[selectVariante.selectedIndex].value,
betriebssystem:selectBetriebssystem.options[selectBetriebssystem.selectedIndex].value,
servicezeit: selectServicezeit.options[selectServicezeit.selectedIndex].value,
verfügbarkeit: selectVerügbarkeit.options[selectVerügbarkeit.selectedIndex].value,
};

//Daten aus Feldern von 2. Konfiguration CPU auslesen
var selectVarianteCpu =document.getElementById("cpu-variante-dropdown");
var selectMengeCpu =document.getElementById("input-cpu");

var produktCpu ={
variante:selectVarianteCpu.options[selectVarianteCpu.selectedIndex].value,
menge:selectMengeCpu.value
};

//Daten aus Feldern von 2. Konfiguration RAM auslesen
var selectVarianteRam =document.getElementById("dropdown-ram-variante");
var selectMengeRam = document.getElementById("ram-menge-dropdown");

var produktRam = {
variante: selectVarianteRam.options[selectVarianteRam.selectedIndex].value,
menge: selectMengeRam.options[selectMengeRam.selectedIndex].value
}


//Daten aus Feldern von 2. Konfiguration Storage auslesen
var selectVarianteStorage =document.getElementById("storage-varinate-dropdown");
var selectMengeStorage = document.getElementById("storage-menge-dropdown");

var produktStorage = {
variante: selectVarianteStorage.options[selectVarianteStorage.selectedIndex].value,
menge: selectMengeStorage.options[selectMengeStorage.selectedIndex].value
}

//Variabel initialisierung
var storagePreisGesamt2;
var ramPreisGesamt2;
var cpuPreisGesamt2;
var produktvariantePreisGesamt2;

//Prüfen, ob Felder gefüllt sind
if(produkt.variante==""||produkt.betriebssystem==""||produkt.servicezeit==""||produkt.verfügbarkeit==""||produktCpu.menge==""||produktCpu.variante==""||produktRam.menge==""||produktRam.variante==""||produktStorage.menge==""||produktStorage==""){
alert("Bitte bei allen Feldern etwas auswählen!")
}
else{

//Datenbank Abfrage von Produktvariante
const q = query(collection(db, "produkt"), where("Bezeichnung", "==", produkt.variante),where("Betriebssystem","==",produkt.betriebssystem), where("Verfügbarkeit","==",produkt.verfügbarkeit), where("Servicezeit", "==", produkt.servicezeit));
const inputPreis = document.getElementById("preis-produktvariante");
var querySnapshot = await getDocs(q);

if(querySnapshot.empty){
console.log("nicht erfolgreich");
inputPreis.setAttribute("value", "");
alert("Gewünschte Produktkonfiguration nicht vorhanden!")
}

else{
console.log("erfolgreich");
querySnapshot.forEach((doc) => {
 var result = doc.data();
 produktvariantePreisGesamt2=result.Preis;

var ErgebnisVariante = produktvariantePreisGesamt2.toString();
var AusgabeVariante = ErgebnisVariante.replace(".",",");
 inputPreis.setAttribute("value",AusgabeVariante + " €");
});

//Datenbank Abfrage von CPU
const cpu = query(collection(db, "produkt"), where("Bezeichnung", "==", produktCpu.variante));
var querySnapshot = await getDocs(cpu);
const inputPreisCpu = document.getElementById("preis-cpu");
console.log("erfolgreich");
querySnapshot.forEach((doc) => {
  var result = doc.data();

  //Berechnung CPU Preis
  cpuPreisGesamt2=result.Preis * produktCpu.menge;
  var ErgebnisCpu = cpuPreisGesamt2.toString();
  var AusgabeCpu = ErgebnisCpu.replace(".",",");
  inputPreisCpu.setAttribute("value",AusgabeCpu + " €");
 });

 //Datenbank Abfrage von RAM
const ram = query(collection(db, "produkt"), where("Bezeichnung", "==", produktRam.variante));
var querySnapshot = await getDocs(ram);
const inputPreisRam = document.getElementById("preis-ram");
console.log("erfolgreich");
querySnapshot.forEach((doc) => {
  var result = doc.data();

  //Berechnung RAM Preis
  ramPreisGesamt2=result.Preis * produktRam.menge;
  var ErgebnisRam = ramPreisGesamt2.toString();
  var AusgabeRam = ErgebnisRam.replace(".",",");
  inputPreisRam.setAttribute("value",AusgabeRam + " €");
 });

 //Datenbank Abfrage von Storage
const storage = query(collection(db, "produkt"), where("Bezeichnung", "==", produktStorage.variante));
var querySnapshot = await getDocs(storage);
const inputPreisStorage = document.getElementById("preis-storage");
console.log("erfolgreich");
querySnapshot.forEach((doc) => {
  var result = doc.data();

  //Berechnung Storage Preis
  storagePreisGesamt2=result.Preis * produktStorage.menge;
  var ErgebnisStorage = storagePreisGesamt2.toString();
  var AusgabeStorage = ErgebnisStorage.replace(".",",");
  inputPreisStorage.setAttribute("value",AusgabeStorage + " €");
 });

 //Gesamtpreis Berechnung Monat
 const inputGesamtPreisMonat = document.getElementById("preis-pro-monat");
 const aktuellerPreis = inputGesamtPreisMonat.value;
 const preisUmgewandelt = aktuellerPreis.replace(",",".");
 const umgewandelt = parseInt(preisUmgewandelt);

  const gesamtPreisMonat2 = umgewandelt+storagePreisGesamt2 + produktvariantePreisGesamt2 + ramPreisGesamt2 +cpuPreisGesamt2;
  console.log(gesamtPreisMonat2);
  var gerundetPreisMonat2 = gesamtPreisMonat2.toFixed(2);
  var ErgebnisMonat =gerundetPreisMonat2.toString();
  var AusgabeMonat = ErgebnisMonat.replace(".",",");
  inputGesamtPreisMonat.setAttribute("value",AusgabeMonat);

  //Gesamtpreis Berechnung Tag
 const inputGesamtPreisTag = document.getElementById("preis-pro-tag");

  const gesamtPreisTag2 = (gesamtPreisMonat2/30);
  console.log(gesamtPreisTag2);
  var gerundetPreisTag2 = gesamtPreisTag2.toFixed(2);
  var ErgebnisTag =gerundetPreisTag2.toString();
  var AusgabeTag = ErgebnisTag.replace(".",",");
  inputGesamtPreisTag.setAttribute("value",AusgabeTag);

  //Anzeige von allen ausgewählten und hinzugefügten Produkten bei Klick auf hinzufügen button
  const visibilityList = document.getElementById("auflistung");
  var styleCurrent = window.getComputedStyle(visibilityList);
  if (styleCurrent.visibility === "hidden")
  {
      visibilityList.style.visibility="visible";
  }
  const auflistung= document.getElementById("Server-auflistung");
  auflistung.setAttribute("value",produkt.variante+produkt.betriebssystem+produkt.servicezeit+produkt.verfügbarkeit);
}
}

})

//Info Button
const icon = document.querySelector("#info-icon");
icon.addEventListener("click",async (evt) => {

const visibilityBild = document.getElementById("info-bild");
var styleCurrent = window.getComputedStyle(visibilityBild);

if (styleCurrent.visibility === "hidden")
{
    visibilityBild.style.visibility="visible";
}else{
  if(styleCurrent.visibility == "visible"){
    visibilityBild.style.visibility="hidden";
  }
}

})

