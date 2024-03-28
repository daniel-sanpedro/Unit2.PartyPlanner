// PARTY PLANNER

// base URL
const BASE_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-FTB-MT-WEB-PT";

let parties = [{}, {}, {}];

// get the form element
const form = document.getElementById("addParties");

// listen for form submission
form.addEventListener("submit", addParty);

// function to render parties on the page
async function render() {
  // fetch parties from the server
  parties = await getParties();

  // get the list element to display parties
  const partiesUl = document.getElementById("parties");

  // create list items for each party
  const partyLis = parties.map((party) => {
    // convert date string to a Date object
    const date = new Date(Date.parse(party.date));

    // create a new list item for the party
    const partyLi = document.createElement("li");

    // populate the list item with party details
    partyLi.innerHTML = `
      <h2>${party.name}</h2>
      <h3>Time: ${date}</h3>
      <h3>Location: ${party.location}</h3>
      <p>${party.description}</p>
    `;

    // create a delete button for each party
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";

    // add event listener to delete the party when the button is clicked
    deleteButton.addEventListener("click", () => deleteParty(party.id));

    // append the delete button to the party list item
    partyLi.appendChild(deleteButton);

    // return the list item
    return partyLi;
  });

  // replace existing party list with new ones
  partiesUl.replaceChildren(...partyLis);
}

// initial rendering of parties
render();

async function getParties() {
  try {
    const response = await fetch(BASE_URL + "/events");
    const json = await response.json();
    return json.data;
  } catch (err) {
    console.error(err);
    // return empty array if there's an error
    return [];
  }
}

async function deleteParty(partyId) {
  try {
    // try to delete the party
    await fetch(BASE_URL + "/events/" + partyId, {
      // use the DELETE method
      method: "DELETE",
    });

    // rerender the party list after deletion
    render();
  } catch (error) {
    // if theres an error, log it to the console
    console.error("Oops! Failed to delete the party:", error);
  }
}

async function addParty(event) {
  // prevent the default form submission behavior
  event.preventDefault();

  // get values from the form
  const name = form.name.value;
  // convert date to ISO format
  const date = new Date(form.date.value).toISOString();
  const location = form.location.value;
  const description = form.description.value;

  try {
    // try to add the party
    await fetch(BASE_URL + "/events", {
      // sending data to server to create a new party
      method: "POST",
      headers: {
        // indicating that we're sending JSON data
        "Content-Type": "application/json",
      },
      // convert data to JSON format
      body: JSON.stringify({
        name: name,
        description: description,
        date: date,
        location: location,
      }),
    });

    // after adding the party successfully, update the view
    render();
  } catch (error) {
    // log any errors to the console
    console.error("Oops! Failed to add the party:", error);
  }
}
