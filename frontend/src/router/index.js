import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home";
import Customers from "@/views/Customers";
import Employees from "@/views/Employees";
import Categories from "@/views/Categories";
import Products from "@/views/Products";
import Suppliers from "@/views/Suppliers";
import Shippers from "@/views/Shippers";
import Orders from "@/views/Orders";

global.baseURL = 'http://localhost:8888'; 

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home
	},
	{
		path: "/customers",
		name: "Customers",
		component: Customers
	},
	{
		path: "/employees",
		name: "Employees",
		component: Employees
	},
	{
		path: "/categories",
		name: "Categories",
		component: Categories
	},
	{
		path: "/products",
		name: "Products",
		component: Products
	},
	{
		path: "/suppliers",
		name: "Suppliers",
		component: Suppliers
	},
	{
		path: "/shippers",
		name: "Shippers",
		component: Shippers
	},
	{
		path: "/orders",
		name: "Orders",
		component: Orders
	}
];

const router = createRouter({
	history: createWebHashHistory(process.env.BASE_URL),
	routes
});

export default router