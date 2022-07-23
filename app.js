let favNumber = 8;
let baseURL = "http://numbersapi.com";

// 1.
async function part1() {
  let data = await $.getJSON(`${baseURL}/${favNumber}?json`);
  console.log(data);
};



//next

const favNumbers = [7, 11, 22];
async function part2() {
  let data = await $.getJSON(`${baseURL}/${favNumbers}?json`);
  console.log(data);
}
//next




async function part3() {
    let facts = await Promise.all(
      Array.from({ length: 4 }, () => $.getJSON(`${baseURL}/${favNumber}?json`))
    );
    facts.forEach(data => {
      $('body').append(`<p>${data.text}</p>`);
    });
  }


// PART 2

let singleCard = "queen of diamonds";
let baseURL = "https://deckofcardsapi.com/api/deck";

async function part1() {
    let data = await $.getJSON(`${baseURL}/${singleCard}?json`);
    console.log(data);
}

//next

async function part2() {
  let firstCardData = await $.getJSON(`${baseURL}/new/draw/`);
  let deckId = firstCardData.deck_id;
  let secondCardData = await $.getJSON(`${baseURL}/${deckId}/draw/`);
  [firstCardData, secondCardData].forEach(card => {
    let { suit, value } = card.cards[0];
    console.log(`${value.toLowerCase()} of ${suit.toLowerCase()}`);
  });
}
//next

async function setup() {
  let $btn = $('button');
  let $cardArea = $('#card-area');

  let deckData = await $.getJSON(`${baseURL}/new/shuffle/`);
  $btn.show().on('click', async function() {
    let cardData = await $.getJSON(`${baseURL}/${deckData.deck_id}/draw/`);
    let cardSrc = cardData.cards[0].image;
    let angle = Math.random() * 90 - 45;
    let randomX = Math.random() * 40 - 20;
    let randomY = Math.random() * 40 - 20;
    $cardArea.append(
      $('<img>', {
        src: cardSrc,
        css: {
          transform: `translate(${randomX}px, ${randomY}px) rotate(${angle}deg)`
        }
      })
    );
    if (cardData.remaining === 0) $btn.remove();
  });
}
setup();


//part3



$(function() {
  let baseURL = "https://pokeapi.co/api/v2";

  async function part1() {
    let data = await $.getJSON(`${baseURL}/pokemon/?limie=1000`);
    console.log(data);
  }


//next
async function part2() {
  let allData = await $.getJSON(`${baseURL}/pokemon/?limit=1000`);
  let randomPokemonUrls = [];
  for (let i = 0; i < 3; i++) {
    let randomIdx = Math.floor(Math.random() * allData.results.length);
    let url = allData.results.splice(randomIdx, 1)[0].url;
    randomPokemonUrls.push(url);
  }
  let pokemonData = await Promise.all(
    randomPokemonUrls.map(url => $.getJSON(url))
  );
  pokemonData.forEach(p => console.log(p));
}


//next
let $btn = $("button");
let $pokeArea = $("#pokemon-area");

$btn.on("click", async function() {
  $pokeArea.empty();
  let allData = await $.getJSON(`${baseURL}/pokemon/?limit=1000`);
  let randomPokemonUrls = [];
  for (let i = 0; i < 3; i++) {
    let randomIdx = Math.floor(Math.random() * allData.results.length);
    let url = allData.results.splice(randomIdx, 1)[0].url;
    randomPokemonUrls.push(url);
  }
  let pokemonData = await Promise.all(
    randomPokemonUrls.map(url => $.getJSON(url))
  );
  let speciesData = await Promise.all(
    pokemonData.map(p => $.getJSON(p.species.url))
  );
  speciesData.forEach((d, i) => {
    let descriptionObj = d.flavor_text_entries.find(function(entry) {
      return entry.language.name === "en";
    });
    let description = descriptionObj ? descriptionObj.flavor_text : "";
    let name = pokemonData[i].name;
    let imgSrc = pokemonData[i].sprites.front_default;
    $pokeArea.append(makePokeCard(name, imgSrc, description));
  });
});

function makePokeCard(name, imgSrc, description) {
  return `
    <div class="card">
      <h1>${name}</h1>
      <img src=${imgSrc} />
      <p>${description}</p>
    </div>
  `;
}
});
