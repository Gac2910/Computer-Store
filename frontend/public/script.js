
// ------- controls the side navigation menu -------
// - on document load, open navigation if screen is >= than 991px
// - on window resize, hide navigation if screen is <= than 990px
// - on nav button click, toggle styles and create/remove header nav button
// 990px was chosen only because its the smallest screen size that still looks ok 

$(document).ready(() => {
	let screenWidth = parseInt($("html").css("width"));
	if (screenWidth <= 991) closeSideNav();
	else openSideNav();
})
window.onresize = () => {
	let screenWidth = parseInt($("html").css("width"));
	if (screenWidth <= 990) closeSideNav();
}
function toggleSideNav() {
	let screenWidth = parseInt($("html").css("width"));
	if (parseInt($(".sideNav").css("width")) == 0) 
		openSideNav(screenWidth)
	else 
		closeSideNav(screenWidth)
}
function closeSideNav() {
	$(".sideNav").css("width", 0);
	$(".wrapper").css("padding-left", 0);
	$(".footer-container").css("padding-left", 0);
	let openSideNavBtn = 
	`<i onclick='toggleSideNav()' 
	class='fa fa-bars'
	id='headerNavBtn' 
	style='font-size:35px;
	cursor:pointer;
	'></i>
	<style>
	.fa-bars:hover{color:rgb(0,200,200)}
	</style>`;
	$("#sideNavBtnContainer").attr("class", "col-1");
	$("#sideNavBtnContainer").html(openSideNavBtn);
	$("#headerNavBtn").animate({left: '1000px'})
}
function openSideNav(screenWidth) {
	$(".sideNav").css("width", 200);
	if (screenWidth <= 850) {
		$(".wrapper").css("padding-left", 0);
		$(".footer-container").css("padding-left", 0);
	}
	else {
		$(".wrapper").css("padding-left", 200);
		$(".footer-container").css("padding-left", 200);
		$("#sideNavBtnContainer").attr("class", "");
		$("#sideNavBtnContainer").html("");
	}
}
