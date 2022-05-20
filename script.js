const contactList = document.querySelector("#contact-list");

let persons = [];

function addCountLocalStorage() {
  JSON.stringify(localStorage.setItem("invitations", count));
}

function syncCount() {
  let count = 0;
  const countFromLocalStorage = JSON.parse(localStorage.getItem("invitations"));
  if (countFromLocalStorage) {
    count = countFromLocalStorage;
  }
  countInvitations(count);
  return count;
}

syncCount();

const url = "https://dummy-apis.netlify.app/api/contact-suggestions?count=8";

function loadData() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      (persons = data), console.log(persons);

      render();
    });
}

function render() {
  contactList.innerHTML = "";
  for (let i = 0; i < persons.length; i++) {
    const person = persons[i];
    const fullName = person.name.first + " " + person.name.last;

    const markup = `
      
        <button class="deleteBtn">╳
                </button>
        <img class="picture" src = ${person.picture}>
        <h2 class="name">${fullName}</h2>
        <p class="job-title">${person.title}</p>
        <p class="connections">${person.mutualConnections} mutual connections</p>
        <button class="connectButton">Connect</button>`;

    const newPerson = document.createElement("div");
    newPerson.classList.add("contact");
    newPerson.innerHTML = markup;

    newPerson.style.backgroundImage = backgroundImage(person);
    //console.log(`url(${person.backgroundImage}&reload=${person.name.last})`);
    contactList.appendChild(newPerson);
  }

  const connectButtons = document.querySelectorAll(".connectButton");
  connectButtons.forEach((el) => {
    el.addEventListener("click", function () {
      if (el.innerText === "Connect") {
        el.innerText = "Pending";
        count = syncCount();
        count++;
        console.log(count);
        addCountLocalStorage(count);
        countInvitations(count);
      } else {
        el.innerText = "Connect";
        count = syncCount();
        count--;
        addCountLocalStorage(count);
        countInvitations(count);
      }
    });
  });
  const deleteButtons = document.querySelectorAll(".deleteBtn");
  deleteButtons.forEach((el, index) => {
    el.addEventListener("click", (event) => removeContact(event, index));
  });
}

function countInvitations(count) {
  const pendingInv = document.querySelector(".count-pending-invitations");
  if (count === 1) {
    pendingInv.innerText = "1 pending invitation";
  }
  if (count > 1) {
    pendingInv.innerText = `${count} pending invitations`;
  }
}

function removeContact(event, index) {
  event.target.parentElement.remove();
  persons = persons.filter((el, i) => {
    return i !== index;
  });
  loadOnePerson();
}

function loadOnePerson() {
  fetch("https://dummy-apis.netlify.app/api/contact-suggestions?count=1")
    .then((response) => response.json())
    .then((data) => {
      persons.push(data[0]);
      render();
    });
}

function backgroundImage(person) {
  let imgUrl = "";
  if (person.backgroundImage === "") {
    imgUrl = `url(https://images.pexels.com/photos/1558690/pexels-photo-1558690.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260)`;
  } else {
    imgUrl = `url(${person.backgroundImage}&reload=${person.name.last})`;
  }
  return imgUrl;
}

loadData();
