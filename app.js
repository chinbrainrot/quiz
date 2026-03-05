// app.js
const allTopics = [
    "論仁論孝論君子", "廉頗藺相如列傳", "岳陽樓記", "詩三首", 
    "魚我所欲也", "師說", "勸學", "詞三首", 
    "出師表", "六國論", "始得西山宴遊記", "逍遙遊"
];

// 宣告全域變數
let currentQuizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// DOM 元素抓取
const setupScreen = document.getElementById('setup-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const topicList = document.getElementById('topic-list');

// 初始化：生成課題 Checkbox
function init() {
    topicList.innerHTML = '';
    allTopics.forEach(topic => {
        const label = document.createElement('label');
        label.className = 'topic-item';
        label.innerHTML = `<input type="checkbox" value="${topic}" checked> ${topic}`;
        topicList.appendChild(label);
    });
}

// 陣列洗牌工具 (Fisher-Yates Shuffle)
function shuffleArray(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 綁定「全選」與「取消全選」
document.getElementById('select-all-btn').addEventListener('click', () => {
    document.querySelectorAll('#topic-list input').forEach(cb => cb.checked = true);
});
document.getElementById('deselect-all-btn').addEventListener('click', () => {
    document.querySelectorAll('#topic-list input').forEach(cb => cb.checked = false);
});

// 開始測驗
document.getElementById('start-btn').addEventListener('click', () => {
    const selectedTopics = Array.from(document.querySelectorAll('#topic-list input:checked')).map(cb => cb.value);
    
    if (selectedTopics.length === 0) {
        document.getElementById('error-msg').classList.remove('hide');
        return;
    }
    document.getElementById('error-msg').classList.add('hide');

    // 從題庫篩選出符合所選課題的題目
    const filteredQuestions = questionBank.filter(q => selectedTopics.includes(q.topic));
    
    if (filteredQuestions.length === 0) {
        alert("你選擇的課題目前還沒有題目喔！請重新選擇或至題庫新增。");
        return;
    }

    // 洗牌並抽取最多 10 題
    currentQuizQuestions = shuffleArray(filteredQuestions).slice(0, 10);
    currentQuestionIndex = 0;
    score = 0;

    // 切換畫面
    setupScreen.classList.remove('active');
    quizScreen.classList.add('active');
    quizScreen.classList.remove('hide');
    
    loadQuestion();
});

// 載入題目
function loadQuestion() {
    const q = currentQuizQuestions[currentQuestionIndex];
    document.getElementById('progress-text').innerText = `第 ${currentQuestionIndex + 1} 題 / 共 ${currentQuizQuestions.length} 題`;
    document.getElementById('current-topic-tag').innerText = q.topic;
    document.getElementById('question-text').innerText = q.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    // 將選項洗牌
    const shuffledOptions = shuffleArray(q.options);
    
    shuffledOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn option-btn';
        btn.innerText = opt;
        btn.addEventListener('click', () => checkAnswer(btn, opt, q.answer, q.explanation));
        optionsContainer.appendChild(btn);
    });

    document.getElementById('feedback-container').classList.add('hide');
}

// 檢查答案
function checkAnswer(selectedBtn, selectedText, correctAnswer, explanation) {
    const allOptions = document.querySelectorAll('.option-btn');
    // 鎖定所有選項按鈕
    allOptions.forEach(btn => btn.disabled = true);

    if (selectedText === correctAnswer) {
        selectedBtn.classList.add('correct');
        score++;
    } else {
        selectedBtn.classList.add('wrong');
        // 標示出正確答案
        allOptions.forEach(btn => {
            if (btn.innerText === correctAnswer) btn.classList.add('correct');
        });
    }

    // 顯示題解
    const feedbackText = document.getElementById('explanation-text');
    feedbackText.innerText = explanation ? `【題解】${explanation}` : "本題無提供題解。";
    document.getElementById('feedback-container').classList.remove('hide');
}

// 下一題
document.getElementById('next-btn').addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuizQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// 顯示結果與評語
function showResults() {
    quizScreen.classList.remove('active');
    quizScreen.classList.add('hide');
    resultScreen.classList.add('active');
    resultScreen.classList.remove('hide');

    const total = currentQuizQuestions.length;
    document.getElementById('score-text').innerText = score;
    document.getElementById('total-questions-text').innerText = total;

    // 分數區間邏輯 (這裡依據你要求的 8-10, 5-7, 3-4, 0-2，針對10題滿分換算比例)
    let msg = "";
    const ratio = score / total; 
    // 若總數不足 10 題，按比例換算
    if (ratio >= 0.8) {
        msg = "太厲害了！你的文言文基礎非常扎實，繼續保持！";
    } else if (ratio >= 0.5) {
        msg = "表現尚可，對某些篇章可能還不夠熟悉，溫故而知新，加油！";
    } else if (ratio >= 0.3) {
        msg = "分數偏低喔！建議多翻閱課本或重溫brainrot page影片，針對錯題好好檢討。";
    } else {
        msg = "看來需要重新學習了！別灰心，從基礎的字詞解釋開始慢慢來吧！";
    }

    document.getElementById('encouragement-msg').innerText = msg;
}

// 重新開始
document.getElementById('restart-btn').addEventListener('click', () => {
    resultScreen.classList.remove('active');
    resultScreen.classList.add('hide');
    setupScreen.classList.add('active');
});

// 啟動程式

init();
