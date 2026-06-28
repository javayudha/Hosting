 /* ==========================================
   WHO'S THE IMPOSTOR
   SCRIPT PART 1
========================================== */

// ==========================
// GANTI DENGAN URL API KAMU
// ==========================

const API_URL = "https://raw.githubusercontent.com/javayudha/impostor_api/refs/heads/main/words.json";


// ==========================
// ELEMENT HTML
// ==========================

const setupPage = document.getElementById("setupPage");
const playerPage = document.getElementById("playerPage");
const finishPage = document.getElementById("finishPage");

const playerCountInput = document.getElementById("playerCount");
const impostorCountInput = document.getElementById("impostorCount");

const playerList = document.getElementById("playerList");

const categorySelect = document.getElementById("category");

const startButton = document.getElementById("startGame");

const showWordButton = document.getElementById("showWord");

const nextPlayerButton = document.getElementById("nextPlayer");

const restartButton = document.getElementById("restart");

const cardWord = document.getElementById("cardWord");

const playerTitle = document.getElementById("playerTitle");

const playerProgress = document.getElementById("playerProgress");


// ==========================
// DATA GAME
// ==========================

let wordsData = {};

let selectedCategory = "";

let selectedPair = {};

// Tambahkan ini
let usedWords = JSON.parse(
    localStorage.getItem("usedWords")
) || [];

let playerNames = [];

let impostorIndexes = [];

let currentPlayer = 0;

let totalPlayer = 0;

let totalImpostor = 0;

// ==========================
// LOAD API
// ==========================

async function loadAPI(){

    try{

        const response = await fetch(API_URL);

        wordsData = await response.json();

        loadCategory();

    }

    catch(error){

        alert("Gagal mengambil data dari API.");

        console.log(error);

    }

}

loadAPI();


// ==========================
// LOAD CATEGORY
// ==========================

function loadCategory(){

    const categories = Object.keys(wordsData);

    categories.forEach(category=>{

        const option = document.createElement("option");

        option.value = category;

        option.innerHTML = capitalize(category);

        categorySelect.appendChild(option);

    });

}


// ==========================
// HURUF BESAR DEPAN
// ==========================

function capitalize(text){

    return text.charAt(0).toUpperCase()+text.slice(1);

}


// ==========================
// INPUT NAMA PEMAIN
// ==========================

function createPlayerInput(){

    playerList.innerHTML="";

    let jumlah = parseInt(playerCountInput.value);

    for(let i=1;i<=jumlah;i++){

        const div=document.createElement("div");

        div.className="playerItem";

        div.innerHTML=`

        <span>${i}</span>

        <input

        type="text"

        placeholder="Nama Pemain ${i}"

        value="Pemain ${i}"

        >

        `;

        playerList.appendChild(div);

    }

}

createPlayerInput();

playerCountInput.addEventListener(

"input",

createPlayerInput

);


// ==========================
// SIMPAN NAMA PEMAIN
// ==========================

function savePlayerName(){

    playerNames=[];

    const input=document.querySelectorAll(

    "#playerList input"

    );

    input.forEach(item=>{

        if(item.value.trim()==""){

            playerNames.push(

            "Pemain"

            );

        }

        else{

            playerNames.push(

            item.value

            );

        }

    });

}


// ==========================
// RANDOM ARRAY
// ==========================

function shuffle(array){

    return [...array]

    .sort(

    ()=>Math.random()-0.5

    );

}


// ==========================
// RANDOM INTEGER
// ==========================

function random(max){

    return Math.floor(

    Math.random()*max

    );

}
/* ==========================================
   SCRIPT PART 2
========================================== */

// ==========================
// MULAI GAME
// ==========================

startButton.addEventListener("click", startGame);

function startGame(){

    totalPlayer = parseInt(playerCountInput.value);

    totalImpostor = parseInt(impostorCountInput.value);

    savePlayerName();

    // ==========================
    // VALIDASI
    // ==========================

    if(totalPlayer < 3){

        alert("Minimal 3 pemain.");

        return;

    }

    if(totalImpostor < 1){

        alert("Minimal 1 impostor.");

        return;

    }

    if(totalImpostor >= totalPlayer){

        alert("Jumlah impostor harus lebih sedikit dari jumlah pemain.");

        return;

    }

    // ==========================
    // PILIH KATEGORI
    // ==========================

    selectedCategory = categorySelect.value;

    if(selectedCategory=="random"){

        const categories = Object.keys(wordsData);

        selectedCategory = categories[
            random(categories.length)
        ];

    }

    // ==========================
    // AMBIL PASANGAN KATA
    // ==========================

    const wordList = wordsData[selectedCategory];
);

// Jika semua kata dalam kategori sudah habis
if (availableWords.length === 0) {

    usedWords = [];

    localStorage.removeItem("usedWords");

    availableWords = wordList;
}

// Pilih kata secara acak
 let availableWords = wordList.filter(word =>
    !usedWords.includes(word.id)
);

selectedPair = availableWords[
    random(availableWords.length)
];

// Simpan ID
usedWords.push(selectedPair.id);

localStorage.setItem(
    "usedWords",
    JSON.stringify(usedWords)
);

    // ==========================
    // ACAK IMPOSTOR
    // ==========================

    impostorIndexes=[];

    while(impostorIndexes.length<totalImpostor){

        const index=random(totalPlayer);

        if(!impostorIndexes.includes(index)){

            impostorIndexes.push(index);

        }

    }

    currentPlayer=0;

    setupPage.classList.add("hidden");

    playerPage.classList.remove("hidden");

    loadPlayer();

}


// ==========================
// LOAD PLAYER
// ==========================

function loadPlayer(){

    playerTitle.innerHTML=

    playerNames[currentPlayer];

    playerProgress.innerHTML=

    `${currentPlayer+1} / ${totalPlayer}`;

    cardWord.innerHTML=`

        <div class="cover">

        Klik tombol

        <br><br>

        <b>Lihat Kata</b>

        <br><br>

        lalu berikan HP ke pemain berikutnya.

        </div>

    `;

    showWordButton.classList.remove("hidden");

    nextPlayerButton.classList.add("hidden");

}


// ==========================
// CEK IMPOSTOR
// ==========================

function isImpostor(index){

    return impostorIndexes.includes(index);

}
/* ==========================================
   SCRIPT PART 3 (FINAL)
========================================== */

// ==========================
// TAMPILKAN KATA
// ==========================

showWordButton.addEventListener("click", showWord);

function showWord(){

    cardWord.classList.add("flip");

    setTimeout(() => {

        let roleClass;
        let roleName;
        let word;

        if(isImpostor(currentPlayer)){

            roleClass="impostor";

            roleName="🕵️ IMPOSTOR";

            word=selectedPair.impostor;

        }else{

            roleClass="normal";

            roleName="👤 PEMAIN";

            word=selectedPair.civilian;

        }

        cardWord.innerHTML=`

        <div class="roleBox">

            <div class="word">

                ${word}

            </div>

            <div class="desc">

                Simpan kata ini.

                Jangan tunjukkan kepada pemain lain.

            </div>

        </div>

        `;

        cardWord.classList.remove("flip");

    },250);

    showWordButton.classList.add("hidden");

    nextPlayerButton.classList.remove("hidden");

}


// ==========================
// PEMAIN BERIKUTNYA
// ==========================

nextPlayerButton.addEventListener("click",nextPlayer);

function nextPlayer(){

    currentPlayer++;

    if(currentPlayer>=totalPlayer){

        finishGame();

        return;

    }

    loadPlayer();

}


// ==========================
// SELESAI
// ==========================

function finishGame(){

    playerPage.classList.add("hidden");

    finishPage.classList.remove("hidden");

}


// ==========================
// MAIN LAGI
// ==========================

restartButton.addEventListener("click",restartGame);

function restartGame(){

    finishPage.classList.add("hidden");

    setupPage.classList.remove("hidden");

    currentPlayer=0;

    selectedPair={};

    impostorIndexes=[];

}


// ==========================
// LOADING API
// ==========================

window.addEventListener("load",()=>{

    startButton.disabled=true;

    startButton.innerHTML="Memuat Kata...";

});

async function loadAPI(){

    try{

        const response=await fetch(API_URL);

        wordsData=await response.json();

        loadCategory();

        startButton.disabled=false;

        startButton.innerHTML="▶ Mulai Game";

    }

    catch(error){

        alert("API tidak dapat dimuat.");

        console.log(error);

    }

}


// ==========================
// ENTER KEY
// ==========================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        if(!setupPage.classList.contains("hidden")){

            startGame();

        }

    }

});


// ==========================
// CEGAH SCROLL HP
// ==========================

document.body.addEventListener("touchmove",function(e){

},{passive:true});


// ==========================
// CONSOLE
// ==========================

console.log("Who's The Impostor Premium Loaded");

usedWords.push(selectedPair.id);
console.log(usedWords);
