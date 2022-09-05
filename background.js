// background.js

let friends = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    friends,
  });
});

let config = {
  method: "get",
  url: "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=amoeba&types=establishment&location=37.76999%2C-122.44696&radius=500&key=AIzaSyAZ3UzTvhTx_j3426fqujedzYw_f7_d8zA",
  headers: {},
};

function getAddr(info, tab) {
  console.log("Word " + info.selectionText + " was clicked.");
  const addr = info.selectionText.replace(" ", "+");
  const url =
    "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
    addr +
    "&location=49.2291114%2C-123.1098592&radius=500&key=AIzaSyAZ3UzTvhTx_j3426fqujedzYw_f7_d8zA";
  const options = {
    method: "GET",
    headers: {},
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      const addr = data.predictions[0].description;
      addTrip(addr);
    });
}
async function addTrip(addr) {
  let [tab] = await chrome.tabs.query({
    url: "https://www.google.com/maps/dir/*",
  });
  if (tab) {
    let curl = tab.url.slice(tab.url.search("dir") + 4);
    let temp = curl.slice(curl.search("/") + 1);
    let url =
      tab.url.slice(0, tab.url.search("dir") + 4) +
      curl.slice(0, curl.search("/") + 1) +
      addr.replace(" ", "+") +
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
  } else {
    chrome.tabs.create({
      url: "https://www.google.com/maps/place/" + addr.replace(" ", "+"),
      selected: true,
    });
  }
}
chrome.contextMenus.create({
  title: "Add %s to trip",
  contexts: ["selection"],
  id: "MY_CONTEXT_MENU",
});
chrome.contextMenus.onClicked.addListener(getAddr);
