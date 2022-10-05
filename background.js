// background.js
let friends = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    friends,
  });
});
function getAddr(info, callback) {
  const addr = info.replaceAll(" ", "+");
  console.log(addr);
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

function init(info) {
  getAddr(info.selectionText, addTrip);
}
// function getAddr(info, addTrip) {
//   const addr = info.selectionText.replaceAll(" ", "+");
//   console.log(addr);
//   const url =
//     "https://floating-reaches-98501.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
//     addr +
//     "&location=49.2291114%2C-123.1098592&radius=500&key=" +
//     "AIzaSyAZ3UzTvhTx_j3426fqujedzYw_f7_d8zA";
//   const options = {
//     method: "GET",
//     headers: {},
//   };
//   fetch(url, options)
//     .then(response => response.json())
//     .then(data => {
//       const addr = data.predictions[0].description;
//       addTrip(addr);
//     });
// }
// async function addTrip(addr) {
//   let [tab] = await chrome.tabs.query({
//     url: "https://www.google.com/maps/dir/*",
//   });
//   if (tab) {
//     chrome.tabs.sendMessage(tab.id, { greeting: addr }, response => {
//       if (!response)
//         console.error("This was a fiasco :", chrome.runtime.lastError.message);
//     });
//   } else {
//     chrome.tabs.create({
//       url: "https://www.google.com/maps/place/" + addr.replace(" ", "+"),
//       selected: true,
//     });
//   }
// }
chrome.contextMenus.create({
  title: "Add %s to trip",
  contexts: ["selection"],
  id: "MY_CONTEXT_MENU",
});
chrome.contextMenus.onClicked.addListener(init);
