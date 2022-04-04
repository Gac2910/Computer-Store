<template>
	<div class="sideNav">
		<nav>
			<i onclick="toggleSideNav()" class="fa fa-bars"></i>
			<router-link class="btn btn-outline-dark" to="/">Home</router-link>
			<router-link class="btn btn-outline-dark" to="/customers">Customers</router-link>
			<router-link class="btn btn-outline-dark" to="/employees">Employees</router-link>
			<router-link class="btn btn-outline-dark" to="/categories">Categories</router-link>
			<router-link class="btn btn-outline-dark" to="/products">Products</router-link>
			<router-link class="btn btn-outline-dark" to="/suppliers">Suppliers</router-link>
			<router-link class="btn btn-outline-dark" to="/shippers">Shippers</router-link>
			<router-link class="btn btn-outline-dark" to="/orders">Orders</router-link>
		</nav>
	</div>
</template>

<script>
export default {
	name: "Navigation"
}
</script>

<style scoped>
.sideNav {
	height: 100%;
	width: 0px;
	position: fixed;
	z-index: 1;
	top: 0;
	left: 0;
	background-color: #111;
	overflow-x: hidden;
	padding-top: 20px;
	text-align: center;
	color: #a8a8a8 ;
	transition: 0.75s;
}
.fa-bars {
	cursor: pointer;
	display: block;
	text-align: right;
	margin-right: 15px;
	margin-bottom: 25px;
	font-size: 35px;
}
.sideNav a {
	font-size: 25px;
	display: block;
	margin-bottom: 15px;
	color: inherit;
	border: none;
}
a:focus {
	box-shadow: none;
}
a:hover, .fa-bars:hover {
  	color: #f1f1f1;
}
a.router-link-active {
	background: rgb(44, 44, 44);
}
</style>