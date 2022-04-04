<template>
	<div class="template-root">
		<div class="wrapper">
			<Navigation />
			<Header />
			<router-view 
				@emitOpenForm="openForm"
				@emitCloseForm="closeForm"
				@emitOpenUpdateForm="openUpdateForm"
				@emitSearch="searchRecord"
				@emitReload="reloadTable"/>
		</div>
		<Footer />
	</div>
</template>

<script>
import Header from "@/components/HeaderComponent"
import Footer from "@/components/FooterComponent"
import Navigation from "@/components/NavigationComponent";
export default {
	name: "AppComponent",
	components: {
		Header,
		Footer,
		Navigation
	},
	methods: {
		// these functions are very general and dont need to be repeated

		// handles the "New" button
		openForm(view) { 
			view.isFormOpen = true;
		},
		// handles the "Go Back" button
		closeForm(view, formTitle) {
			// clear and reset values and reload table
			for (let i in view.formData) {
				view.formData[i] = ""
			}
			view.isFormOpen = false;
			view.isUpdateForm = false;
			view.formTitle= formTitle;
			view.getAllData();
		},
		// handles the "Update" icon button
		openUpdateForm(view, record, formTitle) { 
			// set form data using selected record data.
			// also re-add the foreign key id to the columns that need it
			// for the select inputs
			for (let i in view.formData) {
				let id;
				if (i == "category_name") {
					view.categoriesData.forEach(category => {
						if (category.name == record[i]) {
							id = category.category_id;
							return;
						}
					});
					view.formData[i] = `${record[i]} ${id}`;
					continue;
				}
				else if (i == "supplier_name") {
					view.suppliersData.forEach(supplier => {
						if (supplier.name == record[i]) {
							id = supplier.supplier_id;
							return;
						}
					});
					view.formData[i] = `${record[i]} ${id}`;
					continue;
				}
				else if (i == "shipper_name") {
					view.shippersData.forEach(shipper => {
						if (shipper.name == record[i]) {
							id = shipper.shipper_id;
							return;
						}
					});
					view.formData[i] = `${record[i]} ${id}`;
					continue;
				}
				else if (i == "customer_name") {
					view.customersData.forEach(customer => {
						if (customer.name == record[i]) {
							id = customer.customer_id;
							return;
						}
					});
					view.formData[i] = `${record[i]} ${id}`;
					continue;
				}
				else if (i == "employee_name") {
					view.employeesData.forEach(employee => {
						if (employee.name == record[i]) {
							id = employee.employee_id;
							return;
						}
					});
					view.formData[i] = `${record[i]} ${id}`;
					continue;
				}
				else if (i == "product_name") {
					view.productsData.forEach(product => {
						if (product.name == record[i]) {
							id = product.product_id;
							return;
						}
					});
					view.formData[i] = `${record[i]} ${id}`;
					continue;
				}
				view.formData[i] = record[i];
			}
			view.isFormOpen = true;
			view.isUpdateForm = true;
			view.formTitle= formTitle;
		},
		// search function takes as parameter the view, the url, and error message.
		// in order for this to to work, the global const 'baseURL' had to be added as a 
		// data property of each view, baseURL is then added to the url string 
		searchRecord(view, url, errorMsg) {
			if (view.searchParam == undefined) view.searchParam = "ignore";
			if (!view.searchTerm.trim() || !view.searchParam.trim()) {
				Swal.fire("Error", errorMsg, "error");
				return;
			}
			let _this = view;
			$.ajax({
				type: "GET",
				url: url,
				success: function (data, status) {
					if (status === "success") {
						data = JSON.parse(data);
						if (data.length === 0) {
							Swal.fire("No Results.", "", "error");
							_this.getAllData();
							return;
						}
						_this.tableData = data;
					}
				},
			});
		},
		// reload table button click
		reloadTable(view) {
			document.body.style.cursor='wait';
			$("#reloadMsg").html("Reloading..");
			setTimeout(() => {
				document.body.style.cursor='default';
				$("#reloadMsg").html("");
			}, 1000)
			view.getAllData();
		}
	}
}
</script>

<style>
/* these styles are used in all views */
.wrapper { 
	flex: 1 0 auto; 
  	padding-left: 0px;
	transition: 0.75s;
	margin-bottom: 20px;
}
.sideBox input, .sideBox select {
	margin-bottom: 10px;
}
@media screen and (max-width: 1200px) {
	.col-lg-8, .col-lg-4 {
		width: 100%;
	}
}
@media screen and (min-width: 1201px) {
	.sideBox {
		width: 100%;
	}
}
</style>
