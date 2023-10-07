//map of all cocktails
//Make sure that key is the same as search parameter of url when adding new cocktails
const cocktails = {
  caipirinha: "Caipirinha",
  bluelagoon: "Blue Lagoon",
  longislandicedtea: "Long Island Iced Tea",
  tequilasunrise: "Tequila Sunrise",
  zombie: "Zombie",
};

const urlParams = new URLSearchParams(window.location.search);
const cocktailNameUrl = urlParams.get("name");

const cocktailName = cocktails[cocktailNameUrl];
const cocktailImageElement = document.getElementById("cocktail-image");
const cocktailNameElement = document.getElementById("cocktail-name");
const cocktailDescriptionElement = document.getElementById(
  "cocktail-description"
);
cocktailNameElement.textContent = cocktailName;

//Cocktail image with common image formas
let cocktailImage = null;
const supportedFormats = ["webp", "jpg", "jpeg", "png", "gif", "svg"];

//Load image function
function loadNextImage(index) {
  if (index >= supportedFormats.length) {
    //No valid image found in any format
    return;
  }

  const imageUrl = `../images/${cocktailNameUrl}Image.${supportedFormats[index]}`;

  var img = new Image();
  img.src = imageUrl;

  // Check if the image exists
  img.onload = function () {
    cocktailImageElement.src = imageUrl;
  };

  //Image does not exist in this format, try the next one
  img.onerror = function () {
    loadNextImage(index + 1);
  };
}

loadNextImage(0);

//fetch descriptions from markdown file
fetch("../descriptions/" + cocktailNameUrl + "Description.md")
  .then((response) => response.text())
  .then((markdownText) => {
    // Convert Markdown to HTML using marked library
    const htmlDescription = convertMarkdownToHtml(markdownText);

    // Set the HTML content of cocktailDescriptionElement
    cocktailDescriptionElement.innerHTML = htmlDescription;
  })
  .catch((error) => {
    console.error("Error fetching or converting Markdown:", error);
  });

const orderButton = document.getElementById("order-button");
orderButton.addEventListener("click", () => {
  submitOrder(cocktailName);
});

//submitting order to backend
async function submitOrder(cocktail) {
  console.log(JSON.stringify({ cocktail: cocktail }));
  await fetch("https://lehre.bpm.in.tum.de/ports/13741/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cocktail: cocktail }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.id) {
        alert(`Order placed successfully. Your order ID is ${data.id}.`);
        //Make order button unavailable after successful order
        orderButton.disabled = true;
        orderButton.style.display = "none";
      } else {
        alert("Could not place order.");
      }
    })
    .catch((error) => {
      console.log("Order submission error:", error);
      alert("Error submitting order");
    });
}

function convertMarkdownToHtml(markdown) {
  // Convert headings
  markdown = markdown.replace(/^(#+)(.*)$/gm, function (match, hashes, title) {
    const level = hashes.length;
    return "<h" + level + ">" + title.trim() + "</h" + level + ">";
  });

  // Convert bold text
  markdown = markdown.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Convert italic text
  markdown = markdown.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Convert paragraphs
  markdown = markdown.replace(
    /^(?!<h|<p|<ul|<ol|<li|<blockquote|<pre|<figure)(.*)$/gm,
    "<p>$1</p>"
  );

  return markdown;
}
