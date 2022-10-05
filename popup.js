let parent = document.getElementById("buttons");
let addrs = [];

let form = document.getElementById("shortcut");
let add = document.getElementById("add");

function getAddr(info, callback) {
  const addr = info.replaceAll(" ", "+");
  const url =
    "https://floating-reaches-98501.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
    addr +
    "&location=49.2291114%2C-123.1098592&radius=500&key=" +
    "AIzaSyAZ3UzTvhTx_j3426fqujedzYw_f7_d8zA";
  const options = {
    method: "GET",
    headers: {},
  };
  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      const addr = data.predictions[0].description;
      callback(addr);
    });
}

async function addTrip(addr) {
  let [tab] = await chrome.tabs.query({
    url: "https://www.google.com/maps/dir/*",
  });
  if (tab) {
    chrome.tabs.sendMessage(tab.id, { greeting: addr }, response => {
      if (!response)
        console.error("This was a fiasco :", chrome.runtime.lastError.message);
    });
  } else {
    chrome.tabs.create({
      url: "https://www.google.com/maps/place/" + addr.replace(" ", "+"),
      selected: true,
    });
  }
}

add.addEventListener("click", () => {
  let name = form.name.value;
  getAddr(form.address.value, addr => {
    chrome.storage.sync.get("friends", async friend => {
      let friends = await friend.friends;
      friends.push({ name: name, addr: addr });
      chrome.storage.sync.set({
        friends,
      });
      setUp();
    });
  });
});

function setUp() {
  addrs = [];
  let buttons = document.querySelectorAll("button");
  if (buttons) {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].remove();
    }
  }
  chrome.storage.sync.get("friends", async friend => {
    for (let i = 0; i < friend.friends.length; i++) {
      const newBtn = document.createElement("button");
      newBtn.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        if (confirm("Remove " + friend.friends[i].name + "?")) {
          chrome.storage.sync.get("friends", async friend => {
            let friends = await friend.friends;
            let temp;
            for (let i = 0; i < friends.length; i++) {
              if (friends[i].name == newBtn.textContent) {
                temp = i;
              }
            }
            friends.splice(temp, 1);
            chrome.storage.sync.set({
              friends,
            });
            setUp();
          });
        }
      });
      const tempFriend = await friend.friends[i];
      newBtn.textContent = tempFriend.name;
      addrs.push(tempFriend.addr);
      parent.appendChild(newBtn);
      init(newBtn, i);
    }
  });
}

function init(btn, i) {
  btn.addEventListener("click", () => {
    addTrip(addrs[i]);
  });
}

setUp();
