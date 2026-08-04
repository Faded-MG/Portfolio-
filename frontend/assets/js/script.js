console.log("Portfolio JS loaded");


const body = document.body;

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

const navLinks = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

const logoBtn = document.getElementById('logoBtn');

const loadingScreen = document.getElementById('loadingScreen');

const counters = document.querySelectorAll('.stat-value');

const revealElements = document.querySelectorAll('.reveal');

const typingText = document.getElementById('typingText');


const PROJECTS_API = "http://localhost:3000/api/projects";

const projectsContainer = document.getElementById("projectsContainer");



/* MENU */

if(menuToggle){

menuToggle.addEventListener('click', () => {

  const expanded =
  menuToggle.getAttribute('aria-expanded') === 'true';

  menuToggle.setAttribute(
    'aria-expanded',
    String(!expanded)
  );

  mobileMenu.hidden = expanded;

});

}



mobileLinks.forEach(link => {

link.addEventListener('click',()=>{

mobileMenu.hidden = true;

menuToggle.setAttribute(
'aria-expanded',
'false'
);

});

});





/* NAVIGATION */

const sections = document.querySelectorAll('section[id]');

const offset = 80;


function updateActiveNav(){

const scrollPos = window.scrollY + offset;


sections.forEach(section=>{

if(
scrollPos >= section.offsetTop &&
scrollPos <
section.offsetTop + section.offsetHeight
){

const id = section.getAttribute('id');


navLinks.forEach(link=>{

link.classList.toggle(
'active',
link.getAttribute('href') === `#${id}`
);

});

}

});

}





/* SCROLL */

function updateScrollProgress(){

const scrollTop = window.scrollY;

const docHeight =
document.documentElement.scrollHeight -
window.innerHeight;


const progress =
docHeight > 0
?
(scrollTop / docHeight) * 100
:
0;


if(scrollProgress){

scrollProgress.style.width =
`${progress}%`;

}

}



window.addEventListener('scroll',()=>{

updateActiveNav();

updateScrollProgress();


if(backToTop){

backToTop.classList.toggle(
'show',
window.scrollY > 450
);

}

});



if(backToTop){

backToTop.addEventListener('click',()=>{

window.scrollTo({

top:0,

behavior:'smooth'

});

});

}





/* REVEAL ANIMATION */

const observer =
new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add(
'is-visible'
);

}

});

},{
threshold:0.18
});


revealElements.forEach(el=>{

observer.observe(el);

});





/* COUNTERS */

function animateCounter(element){

const target =
Number(element.dataset.target);

let start = 0;


const timer =
setInterval(()=>{

start++;

element.textContent = start;


if(start >= target){

clearInterval(timer);

element.textContent =
target + (target > 9 ? "+" : "");

}

},30);

}



counters.forEach(counter=>{

observer.observe(counter);

counter.addEventListener(
'animationstart',
()=>{
animateCounter(counter);
}
);

});





/* POINTER EFFECT */

window.addEventListener(
'mousemove',
event=>{

const x =
event.clientX /
window.innerWidth * 100;


const y =
event.clientY /
window.innerHeight * 100;


document.documentElement.style
.setProperty('--mouse-x',`${x}%`);


document.documentElement.style
.setProperty('--mouse-y',`${y}%`);

});





/* TYPING EFFECT */

const typingPhrases=[

'Computer Science Student',

'Aspiring iOS Developer',

'Designer of clean interfaces',

'Focused on elegant experiences'

];


let typingIndex=0;

let charIndex=0;

let isDeleting=false;



function typePhrase(){

if(!typingText) return;


const current =
typingPhrases[typingIndex];


if(isDeleting){

charIndex--;

typingText.textContent =
current.substring(
0,
charIndex
);


if(charIndex===0){

isDeleting=false;

typingIndex =
(typingIndex+1)
%
typingPhrases.length;

}

}
else{


charIndex++;

typingText.textContent =
current.substring(
0,
charIndex
);


if(charIndex===current.length){

isDeleting=true;

}

}



setTimeout(
typePhrase,
isDeleting ? 70 : 130
);


}


typePhrase();





/* LOGO SECRET */

let logoClicks = 0;


if(logoBtn){

logoBtn.addEventListener('click',()=>{


logoClicks++;


if(logoClicks===5){

const toast =
document.createElement('div');


toast.className =
'toast-message';


toast.textContent =
'Secret unlocked: keep exploring the details.';


document.body.appendChild(toast);



setTimeout(()=>{

toast.remove();

},2400);



logoClicks=0;

}


});

}






/* LOADING */

window.addEventListener('load',()=>{


if(loadingScreen){

setTimeout(()=>{

loadingScreen.classList.add('hide');

},450);

}


updateActiveNav();

updateScrollProgress();


});







/* PROJECTS FROM BACKEND ARE RENDERED BY main.js */

const filterButtons = document.querySelectorAll('.filter-btn');


filterButtons.forEach(button => {

  button.addEventListener('click', () => {

    filterButtons.forEach(btn => {
      btn.classList.remove('active');
    });


    button.classList.add('active');


    const filter =
      button.dataset.filter;


    const cards =
      document.querySelectorAll('.project-card');


    cards.forEach(card => {


      const category =
        card.dataset.category;


      if(
        filter === "all" ||
        category === filter
      ){

        card.style.display = "grid";

      }
      else{

        card.style.display = "none";

      }


    });


  });

});