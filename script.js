// =============================
// 点字読みクイズ  script.js
// =============================


const quizData = [
    { image:"./images/a.png", char:"あ" },
    { image:"./images/i.png", char:"い" },
    { image:"./images/u.png", char:"う" },
    { image:"./images/e.png", char:"え" },
    { image:"./images/o.png", char:"お" },

    { image:"./images/ka.png", char:"か" },
    { image:"./images/ki.png", char:"き" },
    { image:"./images/ku.png", char:"く" },
    { image:"./images/ke.png", char:"け" },
    { image:"./images/ko.png", char:"こ" },

    { image:"./images/sa.png", char:"さ" },
    { image:"./images/si.png", char:"し" },
    { image:"./images/su.png", char:"す" },
    { image:"./images/se.png", char:"せ" },
    { image:"./images/so.png", char:"そ" },

    { image:"./images/ta.png", char:"た" },
    { image:"./images/ti.png", char:"ち" },
    { image:"./images/tu.png", char:"つ" },
    { image:"./images/te.png", char:"て" },
    { image:"./images/to.png", char:"と" },

    { image:"./images/na.png", char:"な" },
    { image:"./images/ni.png", char:"に" },
    { image:"./images/nu.png", char:"ぬ" },
    { image:"./images/ne.png", char:"ね" },
    { image:"./images/no.png", char:"の" },

    { image:"./images/ha.png", char:"は" },
    { image:"./images/hi.png", char:"ひ" },
    { image:"./images/hu.png", char:"ふ" },
    { image:"./images/he.png", char:"へ" },
    { image:"./images/ho.png", char:"ほ" },

    { image:"./images/ma.png", char:"ま" },
    { image:"./images/mi.png", char:"み" },
    { image:"./images/mu.png", char:"む" },
    { image:"./images/me.png", char:"め" },
    { image:"./images/mo.png", char:"も" },

    { image:"./images/ya.png", char:"や" },
    { image:"./images/yu.png", char:"ゆ" },
    { image:"./images/yo.png", char:"よ" },

    { image:"./images/ra.png", char:"ら" },
    { image:"./images/ri.png", char:"り" },
    { image:"./images/ru.png", char:"る" },
    { image:"./images/re.png", char:"れ" },
    { image:"./images/ro.png", char:"ろ" },

    { image:"./images/wa.png", char:"わ" },
    { image:"./images/wo.png", char:"を" },
    { image:"./images/n.png", char:"ん" }
];

// =============================
// 変数
// =============================

let questionPool = [];
let wrongList = [];
let currentQuestion;
let total = 0;
let correct = 0;
let cleared = false;
let showAnswerMode = false;


// =============================
// DOM取得
// =============================

const homeScreen = document.getElementById("homeScreen");
const quizScreen = document.getElementById("quizScreen");
const endScreen = document.getElementById("endScreen");

const quizImage = document.getElementById("quizImage");
const answerInput = document.getElementById("answer");
const feedback = document.getElementById("feedback");
const effectCircle = document.getElementById("effectCircle");
const scoreText = document.getElementById("scoreText");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");


// =============================
// ホーム画面ボタン
// =============================

document.getElementById("allBtn").addEventListener("click", () => {
    startQuiz(quizData.length);
});

document.getElementById("customBtn").addEventListener("click", () => {

    // ここは触らない
    let n = parseInt(document.getElementById("customNum").value);

    if(isNaN(n)) n = 1;
    if(n < 1) n = 1;
    if(n > quizData.length) n = quizData.length;

    startQuiz(n);
});


// =============================
// クイズ開始
// =============================

function startQuiz(n) {

    questionPool = shuffle([...quizData]).slice(0, n);
    wrongList = [];
    total = questionPool.length;
    correct = 0;

    homeScreen.classList.add("hidden");
    endScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    showNextQuestion();
}


// =============================
// シャッフル
// =============================

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}


// =============================
// 出題
// =============================

function showNextQuestion() {

    if(questionPool.length === 0){

        endScreen.classList.remove("hidden");
        quizScreen.classList.add("hidden");

        scoreText.textContent =
            `${total}問中 ${correct}問正解 (${(correct/total*100).toFixed(1)}%)`;

        return;
    }

    cleared = false;
    answerInput.value = "";
    answerInput.disabled = false;

    currentQuestion = questionPool.shift();
    quizImage.src = currentQuestion.image;

    feedback.textContent = "";

    answerInput.focus();
}


// =============================
// 入力判定（ENTER専用）
// =============================
answerInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    const input = answerInput.value.trim();

    // 正解済み・コマンド後なら次の問題へ
    if (cleared || showAnswerMode) {
        cleared = false;
        showAnswerMode = false;

        answerInput.disabled = false;
        answerInput.value = "";
        answerInput.focus();

        showNextQuestion();
        return;
    }

    answerInput.value = ""; 

    // 「ー」で答え表示
    if (input === "ー") {
        feedback.innerHTML = `<span class="answer">${currentQuestion.char}</span><br>
                              <span class="next">Enterで次の問題</span>`;

        if (!wrongList.includes(currentQuestion)) {
            wrongList.push(currentQuestion);
        }

        showAnswerMode = true;
        wrongSound.play();
        return;
    }

    // 正解
    if (input === currentQuestion.char) {
        feedback.innerHTML = `<span class="answer">○ ${currentQuestion.char}</span><br>
                              <span class="next">Enterで次の問題</span>`;
        correctSound.play();
        cleared = true;
        correct++;

        effectCircle.style.display = "block";
        setTimeout(() => { effectCircle.style.display = "none"; }, 500);

        return;
    }

    // 不正解
    if (!wrongList.includes(currentQuestion)) {
        wrongList.push(currentQuestion);
    }
    wrongSound.play();
});

// =============================
// 終了画面ボタン
// =============================

document.getElementById("retryWrongBtn").addEventListener("click", () => {

    if(wrongList.length === 0) return;

    questionPool = shuffle([...wrongList]);
    wrongList = [];

    total = questionPool.length;
    correct = 0;

    endScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    showNextQuestion();
});


document.getElementById("homeBtn").addEventListener("click", () => {

    endScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
});





