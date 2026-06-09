const container = document.querySelector(".container");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const goToPoll = document.getElementById("goToPoll");
const poll = document.getElementById("poll");
const options = document.querySelectorAll(".poll-option");
const VOTE_PROTECTION = true; // vote protection is ON
const SEND_VOTES = true; // vote sending is ON

closeModal.addEventListener("click", function () {
    modal.classList.remove("active");
});

container.addEventListener("pointerdown", function (event) {

    if (event.button !== 0) {
        return;
    }

    container.classList.add("pressed");
});

container.addEventListener("pointerdown", function (event) {
    if (event.button !== 0) {
        return;
    }

    container.classList.add("pressed");
});

container.addEventListener("pointerup", function (event) {
    container.classList.remove("pressed");

    if (event.button !== 0) {
        return;
    }

    modal.classList.add("active");
});

goToPoll.addEventListener("click", function () {
    modal.classList.remove("active");

    setTimeout(function () {
        poll.scrollIntoView({ behavior: "smooth" });
    }, 300);
});

if (VOTE_PROTECTION) {

    const hasVoted = localStorage.getItem("poll-voted");

    if (hasVoted) {
        options.forEach(function (item) {
            item.style.pointerEvents = "none";
            item.style.opacity = "0.28";
        });

        const pollSection = document.querySelector(".poll-section");
        pollSection.classList.add("submitted");

        const thankYou = document.getElementById("pollThankYou");

        if (thankYou) {
            thankYou.innerHTML = `
                <h3>Thank you.</h3>
                <p>You have already participated in this poll.</p>
            `;
        }
    }
}

const isTouchDevice = window.matchMedia("(hover: none)").matches;

options.forEach(function (option) {
    option.addEventListener("click", async function () {

        if (isTouchDevice && !option.classList.contains("opened")) {

            options.forEach(function (item) {
                item.classList.remove("opened");
            });

            option.classList.add("opened");
            return;
        }

        const vote = option.getAttribute("data-value");

        if (SEND_VOTES) {
            await fetch("https://formspree.io/f/mvznrgpy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    vote: vote
                })
            });
        }

        if (VOTE_PROTECTION) {
            localStorage.setItem("poll-voted", "true");
        }

        options.forEach(function (item) {
            item.classList.remove("selected");
            item.style.pointerEvents = "none";
        });

        option.classList.add("selected");

        const pollSection = document.querySelector(".poll-section");
        pollSection.classList.add("submitted");
    });
});