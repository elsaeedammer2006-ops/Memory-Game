const startAudio = document.getElementById("Start");
const messageSuccess = document.querySelector(".message.success");
const messageError = document.querySelector(".message.error");

const startMessage = document.querySelector(".message-start");
const startBtn = document.querySelector(".message-start button");

const getName = () => {
  let name = document.querySelector(".message-start input").value;

  if (name == null || name == "") {
    document.querySelector(".name span").innerHTML = "Unknown";
  } else {
    document.querySelector(".name span").innerHTML = name;
  }

  document.querySelector(".message-start").remove();
};
startBtn.addEventListener("click", () => {
  startMessage.classList.add("active");
  getName();
  startAudio.play();
  countdown();
});

let duration = 1000;
let blockContainer = document.querySelector(".memory-game-blocks");
let blocks = Array.from(blockContainer.children);
let orderRange = [...Array(blocks.length).keys()];
shufflr(orderRange);

blocks.forEach((block, index) => {
  block.style.order = orderRange[index];
  block.addEventListener("click", function () {
    flipBlock(block);
  });
});

function flipBlock(selectedBlock) {
  selectedBlock.classList.add("is-flipped");

  let allFlippedBlock = blocks.filter((flipBlock) =>
    flipBlock.classList.contains("is-flipped"),
  );

  if (allFlippedBlock.length === 2) {
    stopClicking();

    checkBlock(allFlippedBlock[0], allFlippedBlock[1]);
  }
}

function shufflr(array) {
  let current = array.length,
    temp,
    random;

  while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;

    temp = array[current];
    array[current] = array[random];
    array[random] = temp;
  }
  return array;
}

function stopClicking() {
  blockContainer.classList.add("no-clicking");

  setTimeout(() => {
    blockContainer.classList.remove("no-clicking");
  }, duration);
}

function checkBlock(fristBlock, scoundBlock) {
  let triesElement = document.querySelector(".tries span");

  if (fristBlock.dataset.technology === scoundBlock.dataset.technology) {
    fristBlock.classList.remove("is-flipped");
    scoundBlock.classList.remove("is-flipped");

    fristBlock.classList.add("has-match");
    scoundBlock.classList.add("has-match");

    document.getElementById("success-sound").play();

    checkAllMatched();
  } else {
    triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;

    setTimeout(() => {
      fristBlock.classList.remove("is-flipped");
      scoundBlock.classList.remove("is-flipped");
    }, duration);

    document.getElementById("error-sound").play();

    if (parseInt(triesElement.innerHTML) === 15) {
      setTimeout(() => {
        messageError.classList.add("active");
        setTimeout(() => {
          messageError.classList.remove("active");
        }, 2000);
        resetGame();
        time = 10 * 60;
        countdown();
      }, duration);
    }
  }
}

function checkAllMatched() {
  let allMatched = true;
  let gameBolck = document.querySelectorAll(".game-block");
  let triesElement = document.querySelector(".tries span");
  gameBolck.forEach((block) => {
    if (
      !block.classList.contains("has-match") &&
      !block.classList.contains("is-flipped")
    ) {
      allMatched = false;
    }
  });

  if (allMatched) {
    setTimeout(() => {
      gameBolck.forEach((block) => {
        block.classList.remove("has-match");
        block.classList.remove("is-flipped");
        triesElement.innerHTML = 0;
        messageSuccess.classList.add("active");
        setTimeout(() => {
          messageSuccess.classList.remove("active");
        }, 2000);
      });
      time = 10 * 60;
      countdown();
    }, duration);
  }
}

function resetGame() {
  let gameBlocks = document.querySelectorAll(".memory-game-blocks .game-block");
  let triesElement = document.querySelector(".tries span");

  gameBlocks.forEach((block) => {
    block.classList.remove("has-match");
    block.classList.remove("is-flipped");
  });
  triesElement.innerHTML = 0;

  shufflr(orderRange);
  blocks.forEach((block, index) => {
    block.style.order = orderRange[index];
  });
}

// Function Timer
let time = 10 * 60;
let timerElement = document.querySelector(".timer span");
let intervel = null;

const countdown = function () {
  clearInterval(intervel);
  intervel = setInterval(() => {
    let minutes = Math.floor(time / 60);
    let secound = time % 60;

    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (secound < 10) {
      secound = "0" + secound;
    }
    document.querySelector(".timer span").innerHTML = minutes + ":" + secound;
    time--;
    if (time < 0) {
      clearInterval(intervel);
      document.querySelector(".timer span").innerHTML = "00:00";
      messageError.classList.add("active");
      setTimeout(() => {
        messageError.classList.remove("active");
      }, 2000);

      resetGame();
      time = 10 * 60;
      countdown();
    }
  }, 1000);

};
