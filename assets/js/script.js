const url = "https://dummy-apis.netlify.app/api/contact-suggestions?count=";
let pplInfo = [];
const storage = localStorage.getItem("ppl");
let count = 0;
const randomBgs = [
  "../../assets/img/blood.png",
  "../../assets/img/bubbles.png",
  "../../assets/img/halloween.png",
  "../../assets/img/hotpink.png",
  "../../assets/img/spring.png",
];

//if the page loads for the first time, take data from api if not take data from local storage
if (storage === null) {
  init(8);
} else {
  pplInfo = JSON.parse(storage);
  renderPeople();
}

//get people data from api and add states
async function getPplData(count) {
  pplInfo = [];
  const response = await fetch(url + count);
  const data = await response.json();
  pplInfo.push(...data);
  addConnectState();
}

//take background from api, if no background available take random default background
async function setBackground(person) {
  let randomBanner = randomBgs[Math.floor(Math.random() * randomBgs.length)];

  if (person.backgroundImage.length === 0) {
    person.backgroundImage = randomBanner;
  }
}

//check for mutual contacts and give correct output
function hasMutuals(person) {
  if (person.mutualConnections > 0) {
    return `<img src="../assets/img/link.svg" class="mutuals_icon"/> ${person.mutualConnections} Mutual Connections`;
  } else {
    return `<img src="../assets/img/gfk.png" class="gfk_logo"/> GfK`;
  }
}

//render person cards
function renderPeople() {
  count = 0;
  let cardHtml = "";
  let pendingHtml = "";
  const pplOutput = document.querySelector("#ppl");
  const pendingOut = document.querySelector("#pending");
  pplOutput.innerHtml = "";
  pendingOut.innerText = "";

  //for each person in our data array
  pplInfo.forEach((person, index) => {
    let mutuals = hasMutuals(person);
    let stateOut = readState(person);

    cardHtml += `<div class="card">
            <div class="card_bg" style="--bg-img: url(${person.backgroundImage})">
              <button class="delete_button" onclick="deleteCard(${index})">
                <img src="../assets/img/x-lg.svg" class="close-icon" alt="" />
              </button>
            </div>
            <img
              src="${person.picture}"
              alt="Profile Picture"
              class="profile_pic"
            />
            <div class="person_info">
              <p class="person_name">${person.name.title} ${person.name.first} ${person.name.last}</p>
              <p class="person_position">${person.title}</p>
              <p class="person_mutuals">${mutuals}</p>
            <button class="connect_button" onclick="changeStateBtn(${index})">${stateOut}</button>
            </div>
          </div>`;
  });

  pendingHtml = selectPendingOut(count);
  pplOutput.innerHTML = cardHtml;
  pendingOut.innerText = pendingHtml;
}

function readState(person) {
  if (!person.state) {
    count += 1;
    return "Pending";
  } else {
    return "Connect";
  }
}

//check pending invitations and output in html
function selectPendingOut(n) {
  if (n === 0) {
    return "No pending invitations";
  } else if (n === 1) {
    return `${n} pending invitation`;
  } else {
    return `${n} pending invitations`;
  }
}

function changeStateBtn(index) {
  pplInfo[index].state = !pplInfo[index].state;
  reload();
}

//connect or pending state
function addConnectState() {
  const randomConnect = [false, true];
  pplInfo.forEach((person) => {
    let randomState =
      randomConnect[Math.floor(Math.random() * randomConnect.length)];
    person.state = randomState;
  });
}

//initial load
async function init(count) {
  await getPplData(count);
  pplInfo.forEach((person) => {
    setBackground(person);
  });
  renderPeople();
  localStorage.setItem("ppl", JSON.stringify(pplInfo));
}

function reload() {
  renderPeople();
  localStorage.clear();
  localStorage.setItem("ppl", JSON.stringify(pplInfo));
}

async function deleteCard(index) {
  await loadNewCard();
  pplInfo.splice(index, 1);
  reload();
}

async function loadNewCard() {
  //if you spam too fast "x" you produce an additional one, why ?
  const response = await fetch(url + 1);
  const data = await response.json();
  const person = data[0];
  const randomConnect = [false, true];
  let randomState =
    randomConnect[Math.floor(Math.random() * randomConnect.length)];
  person.state = randomState;
  setBackground(person);
  pplInfo.push(person);
}
