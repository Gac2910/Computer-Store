<template>
	<div class="container-fluid footer-container">
		<div class="row">
			<div class="col-12">
				<p>Guillermo Castillo - 2022</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Footer"
}
</script>

<style scoped>
.footer-container {
	flex-shrink: 0;
  	padding-left: 0px;
	text-align: center;
  	transition: 0.75s;
}
.row {
	background: rgb(70, 70, 70);
	color: white;
	padding: 5px;
}
p {
	margin: 0;
}
</style>