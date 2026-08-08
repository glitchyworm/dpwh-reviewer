// =======================
// DPWH Reviewer
// Version 1.0
// =======================


// =======================
// VARIABLES
// =======================

let allQuestions = [];
let quizQuestions = [];
let userAnswers = [];

let currentPage = 0;
let reviewPage = 0;

let score = 0;

const QUESTIONS_PER_QUIZ = 100;
const QUESTIONS_PER_PAGE = 10;

// =======================
// PASSWORD PROTECTION
// =======================

const APP_PASSWORD = "DPWH2026";

const passwordScreen =
    document.getElementById("passwordScreen");

const loginBtn =
    document.getElementById("loginBtn");

const passwordInput =
    document.getElementById("passwordInput");

const passwordMessage =
    document.getElementById("passwordMessage");


// Hide the actual app initially
document.querySelector(".container").style.display =
    "none";


loginBtn.onclick = () => {

    if (passwordInput.value === APP_PASSWORD) {

        // Correct password

        passwordScreen.style.display =
            "none";

        document.querySelector(".container").style.display =
            "block";

    } else {

        // Incorrect password

        passwordMessage.innerText =
            "Incorrect password. Please try again.";

        passwordInput.value = "";

        passwordInput.focus();

    }

};


// Allow Enter key
passwordInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            loginBtn.click();

        }

    }
);

// =======================
// LOAD QUESTIONS
// =======================

fetch("data/questions.json")
    .then(response => {

        if (!response.ok) {
            throw new Error(
                `Could not load questions.json (${response.status})`
            );
        }

        return response.json();

    })
    .then(data => {

        allQuestions = data;

        document.getElementById("questionCount").innerText =
            `Total Questions: ${allQuestions.length}`;

        createQuestionSets();

    })
    .catch(error => {

        console.error(
            "Error loading questions:",
            error
        );

        document.getElementById("questionCount").innerText =
            "Unable to load questions.";

    });


// =======================
// CREATE QUESTION SETS
// =======================

function createQuestionSets() {

    const setContainer =
        document.getElementById("setContainer");

    setContainer.innerHTML = "";

    const numberOfSets =
        Math.ceil(
            allQuestions.length /
            QUESTIONS_PER_QUIZ
        );

    for (
        let setNumber = 1;
        setNumber <= numberOfSets;
        setNumber++
    ) {

        const startNumber =
            (setNumber - 1) *
            QUESTIONS_PER_QUIZ + 1;

        const endNumber =
            Math.min(
                setNumber * QUESTIONS_PER_QUIZ,
                allQuestions.length
            );

        const setButton =
            document.createElement("button");

        setButton.className =
            "set-btn";

        setButton.innerText =
            `Set ${setNumber}\nQuestions ${startNumber}-${endNumber}`;

        setButton.onclick = () => {

            startQuiz(setNumber);

        };

        setContainer.appendChild(
            setButton
        );

    }

}


// =======================
// START SELECTED SET
// =======================

function startQuiz(setNumber) {

    const startIndex =
        (setNumber - 1) *
        QUESTIONS_PER_QUIZ;

    const endIndex =
        startIndex +
        QUESTIONS_PER_QUIZ;

    quizQuestions =
        allQuestions.slice(
            startIndex,
            endIndex
        );

    // Reset answers
    userAnswers =
        new Array(
            quizQuestions.length
        ).fill(null);

    // Start at Page 1
    currentPage = 0;

    // Hide home
    document.getElementById(
        "homeScreen"
    ).style.display = "none";

    // Show quiz
    document.getElementById(
        "quizScreen"
    ).style.display = "block";

    displayQuestion();

    window.scrollTo(0, 0);

}


// =======================
// DISPLAY 10 QUESTIONS
// =======================

function displayQuestion() {

    const questionsContainer =
        document.getElementById(
            "questionsContainer"
        );

    const submitBtn =
        document.getElementById(
            "submitBtn"
        );

    const nextBtn =
        document.getElementById(
            "nextBtn"
        );

    const prevBtn =
        document.getElementById(
            "prevBtn"
        );


    // Clear page
    questionsContainer.innerHTML = "";


    // First question on this page
    const startIndex =
        currentPage *
        QUESTIONS_PER_PAGE;


    // Last question on this page
    const endIndex =
        Math.min(
            startIndex +
            QUESTIONS_PER_PAGE,
            quizQuestions.length
        );


    // Total pages
    const totalPages =
        Math.ceil(
            quizQuestions.length /
            QUESTIONS_PER_PAGE
        );


    // Page indicator
    document.getElementById(
        "progress"
    ).innerText =
        `Page ${currentPage + 1} of ${totalPages}`;


    // =======================
    // CREATE QUESTIONS
    // =======================

    for (
        let i = startIndex;
        i < endIndex;
        i++
    ) {

        const question =
            quizQuestions[i];


        // Question container
        const questionDiv =
            document.createElement("div");

        questionDiv.className =
            "question-block";


        // Question number and text
        const questionText =
            document.createElement("h3");

        questionText.innerText =
    question.question;

        questionDiv.appendChild(
            questionText
        );


        // Answer container
        const answersDiv =
            document.createElement("div");


        const letters =
            ["A", "B", "C", "D"];


        // Create choices
        question.choices.forEach(
            (choice, index) => {

                const letter =
                    letters[index];


                const answerButton =
                    document.createElement("button");

                answerButton.className =
                    "answer-btn";

                answerButton.innerText =
                    `${letter}. ${choice}`;


                // Restore selected answer
                if (
                    userAnswers[i] ===
                    letter
                ) {

                    answerButton.classList.add(
                        "selected"
                    );

                }


                // Select answer
                answerButton.onclick = () => {

                    userAnswers[i] =
                        letter;


                    answersDiv
                        .querySelectorAll(
                            ".answer-btn"
                        )
                        .forEach(
                            button => {

                                button.classList.remove(
                                    "selected"
                                );

                            }
                        );


                    answerButton.classList.add(
                        "selected"
                    );

                };


                answersDiv.appendChild(
                    answerButton
                );

            }
        );


        questionDiv.appendChild(
            answersDiv
        );


        questionsContainer.appendChild(
            questionDiv
        );

    }


    // =======================
    // NAVIGATION
    // =======================

    // Hide Previous on first page
    if (currentPage === 0) {

        prevBtn.style.display =
            "none";

    } else {

        prevBtn.style.display =
            "inline-block";

    }


    // Show Submit only on last page
    if (
        currentPage ===
        totalPages - 1
    ) {

        nextBtn.style.display =
            "none";

        submitBtn.style.display =
            "inline-block";

    } else {

        nextBtn.style.display =
            "inline-block";

        submitBtn.style.display =
            "none";

    }

}


// =======================
// NEXT QUIZ PAGE
// =======================

document.getElementById(
    "nextBtn"
).onclick = () => {

    const totalPages =
        Math.ceil(
            quizQuestions.length /
            QUESTIONS_PER_PAGE
        );


    if (
        currentPage <
        totalPages - 1
    ) {

        currentPage++;

        displayQuestion();

        window.scrollTo(
            0,
            0
        );

    }

};


// =======================
// PREVIOUS QUIZ PAGE
// =======================

document.getElementById(
    "prevBtn"
).onclick = () => {

    if (currentPage > 0) {

        currentPage--;

        displayQuestion();

        window.scrollTo(
            0,
            0
        );

    }

};


// =======================
// SUBMIT QUIZ
// =======================

document.getElementById(
    "submitBtn"
).onclick = () => {

    score = 0;


    quizQuestions.forEach(
        (question, index) => {

            if (
                userAnswers[index] ===
                question.answer
            ) {

                score++;

            }

        }
    );


    // Hide quiz
    document.getElementById(
        "quizScreen"
    ).style.display = "none";


    // Show result
    document.getElementById(
        "resultScreen"
    ).style.display = "block";


    document.getElementById(
        "scoreText"
    ).innerText =
        `Your Score: ${score} / ${quizQuestions.length}`;

    window.scrollTo(0, 0);

};


// =======================
// REVIEW BUTTON
// =======================

document.getElementById(
    "reviewBtn"
).onclick = () => {

    reviewPage = 0;


    // Hide result
    document.getElementById(
        "resultScreen"
    ).style.display = "none";


    // Show review
    document.getElementById(
        "reviewScreen"
    ).style.display = "block";


    displayReviewPage();

    window.scrollTo(0, 0);

};


// =======================
// NEW QUIZ
// =======================

document.getElementById(
    "newQuizBtn"
).onclick = () => {

    // Hide result
    document.getElementById(
        "resultScreen"
    ).style.display = "none";


    // Hide review
    document.getElementById(
        "reviewScreen"
    ).style.display = "none";


    // Show home
    document.getElementById(
        "homeScreen"
    ).style.display = "block";


    window.scrollTo(0, 0);

};


// =======================
// DISPLAY REVIEW PAGE
// =======================

function displayReviewPage() {

    const container =
        document.getElementById("reviewQuestionsContainer");

    const nextBtn =
        document.getElementById("reviewNextBtn");

    const prevBtn =
        document.getElementById("reviewPrevBtn");

    // Clear previous questions
    container.innerHTML = "";

    // Determine questions on this page
    const startIndex =
        reviewPage * QUESTIONS_PER_PAGE;

    const endIndex =
        Math.min(
            startIndex + QUESTIONS_PER_PAGE,
            quizQuestions.length
        );

    // Total review pages
    const totalPages =
        Math.ceil(
            quizQuestions.length /
            QUESTIONS_PER_PAGE
        );

    // Page indicator
    document.getElementById("reviewProgress").innerText =
        `Review Page ${reviewPage + 1} of ${totalPages}`;


    // =======================
    // CREATE REVIEW QUESTIONS
    // =======================

    for (
        let i = startIndex;
        i < endIndex;
        i++
    ) {

        const question =
            quizQuestions[i];

        // Question container
        const questionDiv =
            document.createElement("div");

        questionDiv.className =
            "question-block";


        // Question number + question
        const questionText =
            document.createElement("h3");

       questionText.innerText =
    question.question;

        questionDiv.appendChild(
            questionText
        );


        // Answer choices
        const letters =
            ["A", "B", "C", "D"];


        question.choices.forEach(
            (choice, index) => {

                const letter =
                    letters[index];


                const answerDiv =
                    document.createElement("div");


                answerDiv.innerText =
                    `${letter}. ${choice}`;


                // Basic appearance
                answerDiv.style.padding =
                    "12px";

                answerDiv.style.margin =
                    "6px 0";

                answerDiv.style.border =
                    "1px solid #ccc";

                answerDiv.style.borderRadius =
                    "8px";


                // =======================
                // CORRECT ANSWER = GREEN
                // =======================

                if (
                    letter === question.answer
                ) {

                    answerDiv.style.backgroundColor =
                        "#4CAF50";

                    answerDiv.style.color =
                        "white";

                    answerDiv.style.fontWeight =
                        "bold";

                }


                // =======================
                // WRONG SELECTED ANSWER = RED
                // =======================

                if (
                    letter === userAnswers[i]
                    &&
                    letter !== question.answer
                ) {

                    answerDiv.style.backgroundColor =
                        "#E53935";

                    answerDiv.style.color =
                        "white";

                    answerDiv.style.fontWeight =
                        "bold";

                }


                questionDiv.appendChild(
                    answerDiv
                );

            }
        );


        container.appendChild(
            questionDiv
        );

    }


    // =======================
    // REVIEW NAVIGATION
    // =======================

    // Previous button
    if (reviewPage === 0) {

        prevBtn.style.display =
            "none";

    } else {

        prevBtn.style.display =
            "inline-block";

    }


    // Next button
    if (
        reviewPage === totalPages - 1
    ) {

        nextBtn.style.display =
            "none";

    } else {

        nextBtn.style.display =
            "inline-block";

    }

}
// =======================
// REVIEW NEXT PAGE
// =======================

document.getElementById(
    "reviewNextBtn"
).onclick = () => {

    const totalPages =
        Math.ceil(
            quizQuestions.length /
            QUESTIONS_PER_PAGE
        );


    if (
        reviewPage <
        totalPages - 1
    ) {

        reviewPage++;

        displayReviewPage();

        window.scrollTo(
            0,
            0
        );

    }

};


// =======================
// REVIEW PREVIOUS PAGE
// =======================

document.getElementById(
    "reviewPrevBtn"
).onclick = () => {

    if (reviewPage > 0) {

        reviewPage--;

        displayReviewPage();

        window.scrollTo(
            0,
            0
        );

    }

};