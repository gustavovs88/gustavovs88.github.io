const navBar = document.querySelector("#navbarNav");
const navBarButton = document.querySelector(".navbar-toggler");
navBarButton.addEventListener("click", () => {
  navBar.classList.toggle("collapse");
  console.log("navbar");
});

const introAnimated = document.getElementById("introAnimated");
const ctx = introAnimated.getContext("2d");
const screenWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
let canvasWidth = (introAnimated.width = screenWidth < 720 ? 300 : 700);
let canvasHeight = (introAnimated.height = screenWidth < 720 ? 280 : 400);
let particleArray = [];
let mappedImage = [];
let fontSize = screenWidth < 720 ? 12 : 14;
let fontSizeFactor = screenWidth < 720 ? 3 : 5;
let positionAdjustX = screenWidth < 720 ? 5 : 10;
let positionAdjustY = screenWidth < 720 ? 10 : 15;
// Change it to the text you want to use
let text = "Hey!\nI'm Gustavo,\nWeb Developer";
//Declare mouse radius and position
const mouse = {
  x: null,
  y: null,
  radius: screenWidth < 720 ? 30 : 75,
};

//Listen to mouse movement
window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

//Add the text source

ctx.font = `${fontSize}px arial`;
ctx.fillStyle = "white";
var lineheight = 15;
var lines = text.split("\n");
for (var i = 0; i < lines.length; i++) {
  ctx.fillText(lines[i], positionAdjustX, positionAdjustY + i * lineheight);
}

//Read the text source and map it into mappedImage array
const textCoordinates = ctx.getImageData(
  0,
  0,
  introAnimated.width,
  introAnimated.height
);
function calculateRelativeBrightness(red, green, blue) {
  return (
    Math.sqrt(red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114) /
    100
  );
}
for (let y = 0; y < introAnimated.height; y++) {
  let row = [];
  for (let x = 0; x < introAnimated.width; x++) {
    const red = textCoordinates.data[y * 4 * textCoordinates.width + x * 4];
    const green =
      textCoordinates.data[y * 4 * textCoordinates.width + (x * 4 + 1)];
    const blue =
      textCoordinates.data[y * 4 * textCoordinates.width + (x * 4 + 2)];
    const brightness = calculateRelativeBrightness(red, green, blue);
    const cellColorCalc = "rgb(" + red + "," + green + "," + blue + ")";
    const cell = [(cellBrightness = brightness), (cellColor = cellColorCalc)];
    row.push(cell);
  }
  mappedImage.push(row);
}
// Defining the particle and mesh constructor and methods
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.position1 = Math.floor(this.y) / fontSizeFactor - positionAdjustY;
    this.position2 = Math.floor(this.x) / fontSizeFactor - positionAdjustX;
    this.size = screenWidth < 720 ? 1 : 3;

    // this.size = screenWidth < 720 ? Math.random() * 1.5 + 1 : Math.random() * 3 + 1;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 1;
    this.mouseHasPassed = false;
    this.particleTransparency = 1;
    this.color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)}, 1`;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;
    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
      this.mouseHasPassed = true;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}
function init() {
  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      if (
        textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
      ) {
        let positionX = x + positionAdjustX;
        let positionY = y + positionAdjustY;
        particleArray.push(
          new Particle(positionX * fontSizeFactor, positionY * fontSizeFactor)
        );
      }
    }
  }
}

init();

function animate() {
  ctx.clearRect(0, 0, introAnimated.width, introAnimated.height);

  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
    particleArray[i].update();
  }
  connect();

  requestAnimationFrame(animate);
}
animate();
ctx.lineWidth = Math.random() * 2;
var connectDistance = screenWidth < 720 ? 4 : 10;
function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a; b < particleArray.length; b++) {
      let dx = particleArray[a].x - particleArray[b].x;
      let dy = particleArray[a].y - particleArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < connectDistance) {
        opacityValue = 0.8 - distance / 20;
        ctx.strokeStyle = `rgb(255,255,255, +${opacityValue})`;
        ctx.beginPath();
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
    }
  }
}

const frontendDescription = document.getElementById("frontendDescription");
const backendDescription = document.getElementById("backendDescription");
const flipCard = document.querySelector(".flip-card");
flipCard.addEventListener("click", function () {
  frontendDescription.classList.toggle("hide");
  backendDescription.classList.toggle("hide");
  flipCard.classList.toggle("rotate");
});

const dropdowns = document.querySelectorAll(".dropdown");

dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", () => {
    dropdown
      .querySelector(".stack-dropdown-content")
      .classList.toggle("stack-show");
  });
});

// Close the dropdown when clicking outside of it
window.addEventListener("click", (event) => {
  if (!event.target.matches(".stack-dropdown")) {
    dropdowns.forEach((dropdown) => {
      dropdown
        .querySelector(".stack-dropdown-content")
        .classList.remove("stack-show");
    });
  }
});

const myPhoto = document.querySelector(".my-photo");

const observeMyPhoto = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      myPhoto.classList.add("move-to-right");
      return;
    }

    myPhoto.classList.remove("move-to-right");
  });
});

observeMyPhoto.observe(document.querySelector(".my-photo"));

const footer = document.querySelector("footer");
const footerAnimation = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      footer.classList.toggle("hide");
      return;
    }

    footer.classList.remove("hide");
  });
});

footerAnimation.observe(document.querySelector("#header"));

const form = document.querySelector("#contactForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const postData = Object.fromEntries(formData.entries());
  console.log(formData);
  fetch(
    "https://6qgznhkvo7.execute-api.us-east-1.amazonaws.com/production/sendEmailToGustavovs88",
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(postData),
      referrerPolicy: "no-referrer",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data here
      console.log(data);
    })
    .catch((error) => {
      // Handle any errors that occur during the fetch request
      console.error("Error:", error);
    });
});
