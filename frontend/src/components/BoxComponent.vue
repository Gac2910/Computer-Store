<template>
	<div class="page-box">
		<h2 :class="{padBottom: !hr}">{{ title }}</h2>
		<hr v-if="hr">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: "Box",
	props: {
		title: {
			type: String,
			default: "Box Component"
		},
		hr: Boolean
	},
	mounted() {
		// load styles from local storage
		// without this, the styles reset to default
		let styles = JSON.parse(localStorage.getItem("page-box-styles"));
		$(".page-box").css("background", styles.background);
		$(".page-box").css("color", styles.color);
	}

}
</script>

<style scoped>
.page-box {
	background: white;
	border-radius: 5px;
	box-shadow: 1px 1px 5px black;
	width: calc(100% - 25px);
	height: calc(100% - 15px);
	margin: 15px auto;
	padding: 10px;
}
.padBottom {
	margin-bottom: 5px;
}
</style>