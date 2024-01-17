const buttonColors = ["red", "blue", "green", "yellow"];
const positiveMessages = ["cool", "wow", "nice", "amazing", "are you a sage"];
const patternDelay = 500;

let gamePattern = [];
let userClickedPattern = [];
let failed = false;
let started = false;
let canPlay = false;
let level = 0;

function nextSequence() {
  level++;
  userClickedPattern = [];
  $("#level-title").text(`Level ${level}`);
  let randNo = Math.floor(Math.random() * buttonColors.length);
  const buttonId = buttonColors[randNo];
  gamePattern.push(buttonId);
  for (let i = 0; i < gamePattern.length; i++) {
    setTimeout(() => {
      const buttonId = gamePattern[i];
      new Audio(`./sounds/${buttonId}.mp3`).play();
      $(`#${buttonId}`).fadeOut(100).fadeIn(50);
    }, patternDelay * i);
  }

  setTimeout(() => {
    canPlay = true;
    $("#level-title").text("Go");
  }, patternDelay * gamePattern.length);
}

function animatePress(button) {
  button.addClass("pressed");
  setTimeout(() => {
    button.removeClass("pressed");
  }, 100);
}

function animateTitle() {
  const titleFontSize = $("#level-title").css("font-size");
  $("#level-title")
    .animate({ fontSize: "3.2rem" }, 50)
    .animate({ fontSize: titleFontSize }, 50);
}

function animateFail() {
  $("body").addClass("game-over");
  setTimeout(() => {
    $("body").removeClass("game-over");
  }, 200);
}

function animateSuccess() {
  $("body").addClass("success");
  setTimeout(() => {
    $("body").removeClass("success");
  }, 200);
}

function checkUserClickedPattern() {
  if (
    userClickedPattern.toString() ==
    gamePattern.slice(0, userClickedPattern.length).toString()
  ) {
    if (gamePattern.length === userClickedPattern.length) {
      return "success";
    }
    return "continue";
  } else {
    return "fail";
  }
}

$(".btn").click(function (e) {
  if (canPlay) {
    const buttonId = $(this).attr("id");
    new Audio(`./sounds/${buttonId}.mp3`).play();
    userClickedPattern.push(buttonId);
    animatePress($(this));
    const result = checkUserClickedPattern();
    animateTitle();

    if (result === "success") {
      $("#level-title").text("Success ");
      canPlay = false;
      animateSuccess();
      setTimeout(nextSequence, 1000);
    } else if (result === "fail") {
      $("#level-title").text("Game Over, Press Any Key to Restart");
      animateFail();
      failed = true;
    } else {
      const messageIndex = Math.floor(Math.random() * positiveMessages.length);
      $("#level-title").text(positiveMessages[messageIndex]);
    }
  }
});

$(document).keydown(function (e) {
  if (!started && e.key === "a") {
    nextSequence();
    started = true;
  }

  if (failed) {
    gamePattern = [];
    level = 0;
    failed = false;
    nextSequence();
  }
});
