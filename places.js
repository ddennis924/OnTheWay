// document
//   .getElementById("directions-searchbox-2")
//   .firstChild.firstChild.getAttribute("aria-label");
// let searchboxes = document.querySelectorAll("id*=directions-searchbox");
// searchboxes.shift();
// searchboxes.pop();

// let places = [];
// searchboxes.forEach(box =>
//   places.push(box.firstChild.firstChild.firstChild.getAttribute("aria-label"))
// );
//maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=YOUR_API_KEY
const heading = "https://www.google.com/maps/dir/";
chrome.runtime.onMessage.addListener(function (request) {
  const addr = request.greeting;
  const url = document.location.href;
  let placesUrl = url.substring(
    heading.length,
    url.lastIndexOf("/", url.lastIndexOf("/") - 1)
  );
  let places = placesUrl.split("/");
  const destination = places.pop();
  const origin = places.shift();
  places.push(addr);
  //   searchboxes.forEach(box =>
  //     places.push(
  //       box
  //         .querySelector("div")
  //         .querySelector("div")
  //         .querySelector("input")
  //         .getAttribute("aria-label")
  //     )
  //   );
  let apiUrl = `https://floating-reaches-98501.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=optimize:true`;

  places.forEach(place => {
    apiUrl += `|${place}`;
  });

  apiUrl += "&key=AIzaSyAZ3UzTvhTx_j3426fqujedzYw_f7_d8zA";
  const options = {
    method: "GET",
    headers: {},
  };
  fetch(apiUrl, options)
    .then(response => response.json())
    .then(data => {
      placeOrder = data.routes[0].waypoint_order;
      newPlaces = [];
      placeOrder.forEach(point => newPlaces.push(places[point]));
      renderMap(destination, origin, newPlaces);
    });
});

function renderMap(destination, origin, places) {
  let tempUrl = heading;
  tempUrl += origin + "/";
  places.forEach(place => (tempUrl += place.replace(" ", "+") + "/"));
  tempUrl += destination;
  document.location.href = tempUrl;
}
