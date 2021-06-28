const header= document.querySelector('header');
const menuToggle=document.querySelector('.menuToggle');
const navigation=document.querySelector('.navigation');

menuToggle.addEventListener('click',toggleMenu);

window.addEventListener('scroll',function(){
    header.classList.toggle("sticky",window.scrollY>0);
})

function toggleMenu(){
    menuToggle.classList.toggle('active');
    navigation.classList.toggle('active');
}