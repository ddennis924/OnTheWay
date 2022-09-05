let parent = document.getElementById("buttons");
let addrs = [];

let form = document.getElementById("shortcut");
let add = document.getElementById("add");
add.addEventListener("click", () => {
  let name = form.name.value;
  let addr = form.address.value;
  chrome.storage.sync.get("friends", async (friend) => {
    let friends = await friend.friends;
    friends.push({ name: name, addr: addr });
    chrome.storage.sync.set({
      friends,
    });
    setUp();
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
  chrome.storage.sync.get("friends", async (friend) => {
    for (let i = 0; i < friend.friends.length; i++) {
      const newBtn = document.createElement("button");
      newBtn.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        if (confirm("Remove " + friend.friends[i].name + "?")) {
          chrome.storage.sync.get("friends", async (friend) => {
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
      newBtn.textContent = await friend.friends[i].name;
      addrs.push(await friend.friends[i].address);
      parent.appendChild(newBtn);
      init(newBtn, i);
    }
  });
}

// When the button is clicked, inject setPageBackgroundColor into current page
function init(btn, i) {
  btn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({
      url: "https://www.google.com/maps/dir/*",
    });
    if (tab.url.includes("https://www.google.com/maps/dir")) {
      let curl = tab.url.slice(tab.url.search("dir") + 4);
      let temp = curl.slice(curl.search("/") + 1);
      let url =
        tab.url.slice(0, tab.url.search("dir") + 4) +
        curl.slice(0, curl.search("/") + 1) +
        addrs[i].replace(" ", "+") +
        "/" +
        temp.slice(0, temp.search("/"));
      //
      console.log(curl);
      console.log(tab.url.slice(0, tab.url.search("dir") + 3));
      console.log(temp);
      chrome.tabs.create({
        url: url,
        selected: true,
      });
    }
  });
}

setUp();
