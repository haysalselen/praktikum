const cocktails = {
  caipirinha: "Caipirinha",
  bluelagoon: "Blue Lagoon",
  longislandicedtea: "Long Island Iced Tea",
  tequilasunrise: "Tequila Sunrise",
  zombie: "Zombie",
};
const urlParams = new URLSearchParams(window.location.search);
const cocktailNameUrl = urlParams.get("name");
const cocktailImage = "../images/" + cocktailNameUrl + "Image.webp";

const cocktailName = cocktails[cocktailNameUrl];

const cocktailImageElement = document.getElementById("cocktail-image");
const cocktailNameElement = document.getElementById("cocktail-name");
const cocktailDescriptionElement = document.getElementById(
  "cocktail-description"
);

const socket = io("https://lehre.bpm.in.tum.de/ports/13741");

socket.connect();

socket.on("statusChange", function (data) {
  alert(`Status of your order ${data.orderId} has changed to ${data.status}.`);
});

cocktailImageElement.src = cocktailImage;
cocktailNameElement.textContent = cocktailName;

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
        //socket.emit("registerOrder", { orderId: data.id });
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
