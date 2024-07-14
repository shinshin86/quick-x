// selectors: 1
const TEXTAREA_DATA_TESTID = "tweetTextarea_0RichTextInputContainer";
const POST_BUTTON_DATA_TAESTID = "tweetButtonInline";

// selectors: 2
const TEXTAREA_DATA_TESTID_2 = "tweetTextarea_0";
const POST_BUTTON_DATA_TAESTID_2 = "tweetButton";

// selectors: side post button
const POST_BUTTON_DATA_TAESTID_SIDE = "SideNav_NewTweet_Button";

function getTweetSelector(testid: string): string {
  return `[data-testid="${testid}"]`;
}

// duration
const DURATION_COUNT = 60;
const TIMER_DURATION = DURATION_COUNT * 1000;
const TRANSITION_DURATION = `${DURATION_COUNT}s`;
const RESET_TRANSITION_DURATION = "1s";

let isCountdownStarted = false;
let countdownTimer: number | null = null;

function setupEventListeners(postButtonSelector: string): void {
  const postButton: HTMLElement | null = document.querySelector(
    postButtonSelector,
  );

  if (postButton) {
    postButton.addEventListener("click", function () {
      const progressBar: HTMLElement | null = document.getElementById(
        "progressBar",
      );

      if (progressBar) {
        progressBar.style.width = "0%";
        isCountdownStarted = false;

        stopCountdown();
      }
    });
  }
}

function setupProgressBar(textareaSelector: string): void {
  const tweetBoxContainer: HTMLElement | null = document.querySelector(
    textareaSelector,
  );

  if (tweetBoxContainer) {
    insertProgressBar(tweetBoxContainer);
  }
}

function observeDOM(
  textareaSelector: string,
  postButtonSelector: string,
): void {
  const observer = new MutationObserver((mutations, _obs) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        const tweetBoxContainer: HTMLElement | null = document.querySelector(
          textareaSelector,
        );

        // check if tweet box exists
        if (
          tweetBoxContainer && !document.getElementById("progressBarContainer")
        ) {
          setupProgressBar(textareaSelector);
          setupEventListeners(postButtonSelector);
        } else if (!tweetBoxContainer && isCountdownStarted) {
          // if tweet box is removed, stop countdown
          stopCountdown();
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
  });
}

function insertProgressBar(tweetBoxContainer: HTMLElement): void {
  const progressBarContainer: HTMLElement = document.createElement("div");
  progressBarContainer.id = "progressBarContainer";
  progressBarContainer.style.position = "absolute";
  progressBarContainer.style.width = "100%";
  progressBarContainer.style.backgroundColor = "#ddd";
  progressBarContainer.style.borderRadius = "5px";
  progressBarContainer.style.overflow = "hidden";
  progressBarContainer.style.zIndex = "1000";
  progressBarContainer.style.pointerEvents = "none";
  progressBarContainer.style.top = "-3px";

  const progressBar: HTMLElement = document.createElement("div");
  progressBar.id = "progressBar";
  progressBar.style.height = "5px";
  progressBar.style.width = "0%";
  progressBar.style.backgroundColor = "#1D9BF0";
  progressBar.style.transition = `width ${TRANSITION_DURATION} linear`;

  progressBarContainer.appendChild(progressBar);
  tweetBoxContainer.parentNode?.insertBefore(
    progressBarContainer,
    tweetBoxContainer,
  );

  tweetBoxContainer.addEventListener(
    "input",
    function (this: HTMLTextAreaElement) {
      if (!this.textContent) {
        return;
      }

      if (this.textContent?.length > 1 && !isCountdownStarted) {
        isCountdownStarted = true;
        startCountdown(progressBar);
      }
    },
  );

  tweetBoxContainer.addEventListener("blur", stopCountdown);
}

function startCountdown(progressBar: HTMLElement): void {
  progressBar.style.transition = `width ${TRANSITION_DURATION} linear`;
  progressBar.style.width = "100%";

  countdownTimer = setTimeout(() => {
    alert("Hey, haven't you posted yet!?");
    progressBar.style.width = "0%";
    progressBar.style.transition = `width ${RESET_TRANSITION_DURATION} linear`;
    isCountdownStarted = false;
  }, TIMER_DURATION);
}

function stopCountdown(): void {
  const progressBar: HTMLElement | null = document.getElementById(
    "progressBar",
  );

  if (progressBar) {
    progressBar.style.width = "0%";
    progressBar.style.transition = `width ${RESET_TRANSITION_DURATION} linear`;
  }

  if (countdownTimer) {
    clearTimeout(countdownTimer);
    countdownTimer = null;
  }

  isCountdownStarted = false;
}

observeDOM(
  getTweetSelector(TEXTAREA_DATA_TESTID),
  getTweetSelector(POST_BUTTON_DATA_TAESTID),
);

// side post button
const sidePostButton: HTMLElement | null = document.querySelector(
  getTweetSelector(POST_BUTTON_DATA_TAESTID_SIDE),
);
sidePostButton?.addEventListener("click", function () {
  observeDOM(
    getTweetSelector(TEXTAREA_DATA_TESTID_2),
    getTweetSelector(POST_BUTTON_DATA_TAESTID_2),
  );
});
