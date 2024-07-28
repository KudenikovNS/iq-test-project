// IQtest game ver. 0.1.1
// user answers data stored in userAnswersObj

// questions consts
const testGameColorsOptions = ['#A8A8A8', '#0000A9', '#00A701', '#F60100', '#FDFF19', '#A95403', '#000000', '#850068', '#46B2AC'];

// scalable and customizable
const testGameQuestions = [
    {
        type: 'options-vertical',
        valueName: 'gender',
        question: 'Ваш пол:',
        image: '',
        options: ['Мужчина', 'Женщина']
    },
    {
        type: 'options-vertical',
        valueName: 'age',
        question: 'Укажите ваш возраст:',
        image: '',
        options: ['До 18', 'От 18 до 28', 'От 29 до 35', 'От 36']
    },
    {
        type: 'options-vertical',
        question: 'Выберете лишнее:',
        image: '',
        options: ['Дом', 'Шалаш', 'Бунгало', 'Скамейка', 'Хижина']
    },
    {
        type: 'options-vertical',
        question: 'Продолжите числовой ряд: <br>18  20  24  32',
        image: '',
        options: [62, 48, 74, 57, 60, 77]
    },
    {
        type: 'colors',
        question: 'Выберите цвет, который сейчас наиболее Вам приятен:',
        image: '',
        options: testGameColorsOptions
    },
    {
        type: 'colors',
        question: 'Отдохните пару секунд, еще раз Выберите цвет, который сейчас наиболее Вам приятен:',
        image: '',
        options: testGameColorsOptions
    },
    {
        type: 'options-vertical',
        question: 'Какой из городов лишний?',
        image: '',
        options: ['Вашингтон', 'Лондон', 'Париж', 'Нью-Йорк', 'Москва', 'Оттава',]
    },
    {
        type: 'options-horizontal',
        question: 'Выберите правильную фигуру из четырёх пронумерованных.',
        image: 'stickmans.png',
        options: [1, 2, 3, 4]
    },
    {
        type: 'options-vertical',
        question: 'Вам привычнее и важнее:',
        image: '',
        options: ['Наслаждаться каждой минутой проведенного времени', 'Быть устремленными мыслями в будущее', 'Учитывать в ежедневной практике прошлый опыт']
    },
    {
        type: 'options-vertical',
        question: 'Какое определение, по-Вашему, больше подходит к этому геометрическому изображению:',
        image: 'pyramid.png',
        options: ['оно остроконечное', 'оно устойчиво', 'оно-находится в состоянии равновесия']
    },
    {
        type: 'options-horizontal',
        question: 'Вставьте подходящее число',
        image: 'star.png',
        options: [34, 36, 53, 44, 66, 42]
    },
];

const startPageContent = document.querySelectorAll('section[class^="section-"]');
const testGameElems = document.querySelectorAll('section.testSection, .testHeader');

// hamburger menu toggle
const [hamburgerBtn, hamburgerMenu] = document.querySelectorAll('nav > .hamburger, nav > .menu');

const toggleHamburgerState = () => {
    hamburgerBtn.classList.toggle('hamburger_on');
    hamburgerMenu.classList.toggle('menu_on');
};

document.querySelector('#hamburger').addEventListener('click', () => {
    toggleHamburgerState();
});

// toggle between test and home page
const testGamePage = {
    on() {
        [...startPageContent].forEach(elem => elem.classList.add('hidden'));
        [...testGameElems].forEach(elem => elem.classList.remove('hidden'));
    },
    off() {
        [...startPageContent].forEach(elem => elem.classList.remove('hidden'));
        [...testGameElems].forEach(elem => elem.classList.add('hidden'));
    },
    results() {
        document.querySelector('section.testSection').classList.add('hidden');

        let testHeader = document.querySelector('.testHeader');
        testHeader.classList.add('resultHeader');
        testHeader.innerHTML = `
            <img src="/images/rain_bk3.png" alt="brain">
            <span class="resultsDone">ГОТОВО!<span>
        `;
    },
};

// apply styles only for one selected option
const highlightSelectedOption = selectedOptionElem => {
    [...document.querySelectorAll('.optionLabel.checked')].forEach(elem => elem.classList.remove('checked'));
    selectedOptionElem.classList.add('checked');
};

// question form generator
const contentElem = document.querySelector('#content');
const questionNameElem = document.querySelector('#contentQuestion');
const questionImg = document.querySelector('#contentImg');
const questionOptions = document.querySelector('#contentOptions');
const testSubmitBtn = document.querySelector('#testSubmit');

const makeOptions = (optionsArr, typeClassName) => {

    let optionsArrCopy = [...optionsArr];
    
    // randomizing color selection each time
    if (typeClassName === 'optionHorizontal optionColor') optionsArrCopy.sort(() => Math.random() > 0.5 ? 1 : -1);

    let optionsElemsStr = optionsArrCopy.reduce((resultStr, optionValue) => {

        const isColorOption = typeClassName === 'optionHorizontal optionColor';
        let customStyle = '';
        
        if (isColorOption) {
            customStyle = `background-color: ${optionValue}`;
        }

        let optionElem = `
            <label class="optionLabel ${typeClassName}" style="${customStyle}">
                <input type="radio" name="radio" data-value="${optionValue}"/>
                ${ isColorOption ? '' : optionValue }
            </label>
        `;

        return resultStr + optionElem;
    }, '');

    return optionsElemsStr;
};

const makeQuestionForm = ({ type, question, image, options }) => {
    
    questionNameElem.innerHTML = `<span>${question}</span>`;
    questionImg.innerHTML = `<img src="/images/${image}" alt="">`;

    questionOptions.innerHTML =
        type === 'options-vertical' ? makeOptions(options, '') :
            type === 'options-horizontal' ? makeOptions(options, 'optionHorizontal') :
                type === 'colors' ? makeOptions(options, 'optionHorizontal optionColor') :
                    'type of question is undefined';

    if (type === 'options-horizontal') {
        questionOptions.classList.add('optionsHorizontal');
    }
    else if (type === 'colors') {
        questionOptions.classList.add('optionsHorizontal', 'optionsColor');
    } else {
        questionOptions.classList.remove('optionsHorizontal');
        questionOptions.classList.remove('optionsHorizontal', 'optionsColor');
    }

    testSubmitBtn.classList.add('btnInactive');
};

// handle user answers and store it in variable 
let userAnswersObj = {
    answers: []
};
const handleAnswer = number => {

    let questionName = testGameQuestions[number].question;
    let questionValueName = testGameQuestions[number].valueName;
    let answerValue = questionOptions.querySelector('input:checked').dataset.value;

    if (number < 2) {
        userAnswersObj[questionValueName] = answerValue;
    } else {
        userAnswersObj.answers.push({
            question: questionName,
            answer: answerValue,
        });
    }
};
const resetAnswers = () => {
    userAnswersObj = {
        answers: []
    };
};

// progress bar renderer
const progressBarElem = document.querySelector('.progressBarFront');
const progressBarUpdate = currentProgresNum => {
    let progressPercent = ((currentProgresNum) * 100) / maxQuestionNumber;
    progressBarElem.style.cssText = `width: ${Math.round(progressPercent)}%`;
};

// timer contdown
const showTimer = () => {

    let timerElem = document.querySelector('#timer');
    let countDownDate = new Date(new Date().getTime() + 1000 * 60 * 10).getTime();

    let timerInterval = setInterval(() => {

        let now = new Date().getTime();
        let timeleft = countDownDate - now;

        let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');

        timerElem.innerHTML = `${minutes}:${seconds}`;

        if (timeleft < 1000) {
            clearInterval(timerInterval);
        }

    }, 1000);
};

// computing results mode
const computingResultsPage = {
    on: () => {
        testSubmitBtn.classList.add('hidden');
        contentElem.classList.add('computingResults');

        contentElem.innerHTML = `
            <div class="loadingHeader">Обработка результатов</div>
            <div class="loadingAnimation" id="loadingAnimation">
                <div class="loaderSpinner"></div>
            </div>
            <div>Определение стиля мышления...</div>
        `;

        setTimeout(() => {
            let event = new Event('computingResultsPage.timeOver');
            document.dispatchEvent(event);
        }, 2000 * Math.random() + 2000);
    }
};

// showing resulting page after timeout of computing animation page
document.addEventListener('computingResultsPage.timeOver', () => {
    testGamePage.results();
    document.querySelector('.resultsSection').classList.remove('hidden');
    showTimer();
});

// get data and hande from server
const handleReqData = dataObj => {

    let resultHTML = '';

    const makeLine = (key, data) => {
        return `<li>
                    <b>${key}:</b> ${data};
                </li>`;
    };

    for (let key in dataObj) {

        if (Array.isArray(dataObj[key])) {
            resultHTML += makeLine(key, dataObj[key].join(', '));
        } else {
            resultHTML += makeLine(key, dataObj[key]);
        }
    }

    return `<ul>${resultHTML}</ul>`;
};
const showDataFromServer = () => {

    let url = 'https://swapi.dev/api/people/1/';
    fetch(url)
        .then(response => {
            return response.ok ? response.json() : {error: 'ошибка подключения к серверу'};
        })
        .then(data => {
            document.querySelector('#requestOutput').classList.remove('hidden');
            document.querySelector('#requestOutput').innerHTML = handleReqData(data);
        })
        .catch(err => console.error(err));
};

// main clicks handler
let currentQuestionNumber = 0;
let maxQuestionNumber = testGameQuestions.length;
document.querySelector('body').addEventListener('click', e => {

    if (e.target.classList.value.includes('btn')) {
        e.preventDefault();
    }

    if (e.target.id === 'testStart') {
        testGamePage.on();
        currentQuestionNumber = 0;
        resetAnswers();
        progressBarUpdate(currentQuestionNumber);
        makeQuestionForm(testGameQuestions[0]);
    }
    if (e.target.id === 'returnToHome') {
        location.reload();
        testGamePage.off();
        document.querySelector('.resultsSection').classList.add('hidden');
    }

    if (e.target.classList.value.includes('menuLink')) {
        toggleHamburgerState();
    }

    if (e.target.classList.value.includes('optionLabel')) {
        highlightSelectedOption(e.target);
        testSubmitBtn.classList.remove('btnInactive');
    }

    if (e.target.id === 'testSubmit' && !e.target.classList.value.includes('btnInactive')) {
        handleAnswer(currentQuestionNumber);
        currentQuestionNumber++;
        if (currentQuestionNumber < maxQuestionNumber) makeQuestionForm(testGameQuestions[currentQuestionNumber]);
        progressBarUpdate(currentQuestionNumber);
        if (currentQuestionNumber === maxQuestionNumber) computingResultsPage.on();
    }

    if (e.target.id === 'testCall' || e.target.parentElement.id === 'testCall') {
        showDataFromServer();
    }
});