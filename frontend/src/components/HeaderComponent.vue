<template>
	<div class="container-fluid header-container">
		<div class="row">
			<div class="" id="sideNavBtnContainer"></div>
			<div class="col-8">
				<router-link to="/">
					<h3>Computer Store Manager</h3>
				</router-link>
			</div>
			<div class="col-sm-2">
				<button v-if="!darkModeEnabled" @click="darkMode" class="btn btn-outline-dark darkModeBtn">Dark Mode</button>
				<button v-if="darkModeEnabled" @click="lightMode" class="btn btn-outline-light darkModeBtn">Light Mode</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Header",
	data() {
		return {
			darkModeEnabled: false
		}
	},
	methods: {
		darkMode() {
			// sets styles to dark mode and saves setings in local storage
			let boxStyles = {background: "gray", color: "white"};
			let backgroundStyles = {body: "rgb(60, 60, 60)", header: "rgb(70, 70, 70)"};
			$(".header-container").css("background", backgroundStyles.header);
			$("body").css("background", backgroundStyles.body);
			$(".page-box").css("background", boxStyles.background);
			$(".page-box").css("color", boxStyles.color);
			this.darkModeEnabled = true;
			localStorage.setItem("page-box-styles", JSON.stringify(boxStyles));
			localStorage.setItem("background-styles", JSON.stringify(backgroundStyles));
		},
		lightMode() {
			// sets styles to light mode and saves setings in local storage
			let boxStyles = {background: "white", color: "black"};
			let backgroundStyles = {body: "rgb(235, 235, 235)", header: "white"};
			$(".header-container").css("background", backgroundStyles.header);
			$("body").css("background", backgroundStyles.body);
			$(".page-box").css("background", boxStyles.background);
			$(".page-box").css("color", boxStyles.color);
			this.darkModeEnabled = false;
			localStorage.setItem("page-box-styles", JSON.stringify(boxStyles));
			localStorage.setItem("background-styles", JSON.stringify(backgroundStyles));
		}
	},
	mounted() {
		// loads settings from local storage, if settings not saved load light mode styles
		let boxStyles = JSON.parse(localStorage.getItem("page-box-styles")) || {background: "white", color: "black"};
		let backgroundStyles = JSON.parse(localStorage.getItem("background-styles")) || {body: "rgb(235, 235, 235)", header: "white"};
		$("header-container").css("background", backgroundStyles.header);
		$("body").css("background", backgroundStyles.body);
		$(".page-box").css("background", boxStyles.background);
		$(".page-box").css("color", boxStyles.color);
		localStorage.setItem("page-box-styles", JSON.stringify(boxStyles));
		localStorage.setItem("background-styles", JSON.stringify(backgroundStyles));
		if (backgroundStyles.body === "rgb(235, 235, 235)") this.darkModeEnabled = false;
		else this.darkModeEnabled = true;
	}
}
</script>

<style scoped>
.header-container {
	color: darkcyan;
	border-bottom: 3px solid gray;
	text-shadow: 1px 1px 2px black;
	white-space: nowrap;
	transition: .75s;
}
.darkModeBtn {
	margin: 2px auto;
}
@media screen and (max-width: 325px) {
	.col-1 {
		width: 100%;
	}
	.col-11 {
		text-align: center !important;
		white-space: normal;
	}
}
@media screen and (max-width: 500px) {
	.col-11 {
		text-align: right;
	}
}
</style>