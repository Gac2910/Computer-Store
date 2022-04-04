<template>
	<div class="container-fluid">
		<div v-if="!isFormOpen">
			<div class="row">
				<div class="col-12">
					<Box title="Orders Manager"></Box>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-4">
					<div class="row">
						<div class="col-md-4 sideBox">
							<Box title="Add A New Order">
								<button @click="$emit('emitOpenForm', this)" class="btn btn-success">
									New
								</button>
							</Box>
						</div>
						<div class="col-md-4 sideBox">
							<Box title="Search For An Order">
								<input 
									v-model="searchTerm" 
									type="text" 
									id="searchTerm" 
									class="form-control" 
									placeholder="Enter search term">
								<select 
									v-model="searchParam" 
									id="searchParam" 
									class="form-control">
									<option value="">Select Search Parameter</option>
									<option value="product">Search By Product</option>
									<option value="customer">Search By Customer</option>
								</select>
								<button 
									@click="$emit(
									'emitSearch', 
									this, 
									`${baseURL}/orders/search/${searchParam}/${searchTerm}`,
									'Please Enter Search Term And Select A Parameter.')" 
									class="btn btn-success">
									Search
								</button>
							</Box>
						</div>
						<div class="col-md-4 sideBox">
							<Box title="Reload Table">
								<button 
									@click="$emit('emitReload', this)"
									class="btn btn-success">
									Reload
								</button>
								<span id="reloadMsg"></span>
							</Box>
						</div>
					</div>
				</div>
				<div class="col-lg-8">
					<Box title="Table Of All Orders" hr>
						<Table 
							@delete="deleteRecord"
							@update="(record) => $emit('emitOpenUpdateForm', this, record, 'Update An Order')"
							:columnsProp="tableColumns" 
							:dataSetProp="computedTableData" />
					</Box>
				</div>
			</div>
		</div>
		<Form 
			:formTitle="formTitle"
			returnBtnText="Go Back To Orders Manager"
			:updateForm="isUpdateForm"
			@submit="submitForm"
			@close="$emit('emitCloseForm', this, 'Add A New Order')" 
			@update="updateRecord"
			v-if="isFormOpen">
			<div class="row">
				<div class="col-md-6 form-group">
					<label for="fk_shipper_id">Shipper</label>
					<select 
						v-model="formData.shipper_name" 
						id="fk_shipper_id" 
						class="form-control">
						<option value="">Select a shipper</option>
						<option 
							v-for="(shipper, i) in shippers"
							:key="i" 
							:value="shipper.name + ' ' + shipper.shipper_id">
							{{ shipper.name }}
						</option>
					</select>
				</div>
				<div class="col-md-6 form-group">
					<label for="fk_customer_id">Customer</label>
					<select 
						v-model="formData.customer_name" 
						id="fk_customer_id" 
						class="form-control">
						<option value="">Select a customer</option>
						<option 
							v-for="(customer, i) in customers"
							:key="i" 
							:value="customer.name + ' ' + customer.customer_id">
							{{ customer.name }}
						</option>
					</select>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6 form-group">
					<label for="fk_employee_id">Employee</label>
					<select 
						v-model="formData.employee_name" 
						id="fk_employee_id" 
						class="form-control">
						<option value="">Select a employee</option>
						<option 
							v-for="(employee, i) in employees"
							:key="i" 
							:value="employee.name + ' ' + employee.employee_id">
							{{ employee.name }}
						</option>
					</select>
				</div>
				<div class="col-md-6 form-group">
					<label for="fk_product_id">Product</label>
					<select 
						v-model="formData.product_name" 
						id="fk_product_id" 
						class="form-control">
						<option value="">Select a product</option>
						<option 
							v-for="(product, i) in products"
							:key="i" 
							:value="product.name + ' ' + product.product_id">
							{{ product.name }}
						</option>
					</select>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12 form-group">
					<label for="order_date">Order Date</label>
					<input 
						v-model="formData.order_date" 
						type="date" 
						id="order_date" 
						class="form-control">
				</div>
			</div>
		</Form>
	</div>	
</template>

<script>
import Box from "@/components/BoxComponent";
import Table from '@/components/TableComponent';
import Form from "@/components/FormComponent";
export default {
	name: "Orders",
	components: {
		Box,
		Table,
		Form
	},
	data() {
		return {
			formData: { // used for  and update
				order_id: "",
				order_date: "",
				shipper_name: "",
				customer_name: "",
				employee_name: "",
				product_name: ""
			},
			tableColumns: [ // used in v-for for table columns
				"ID",
				"Order Date",
				"Shipper Name",
				"Customer Name",
				"Employee Name",
				"Product Name"
			],
			tableData: [], // used in computed property for table body
			shippersData: [], // used in v-for for select inputs
			customersData: [], // used in v-for for select inputs
			employeesData: [], // used in v-for for select inputs
			productsData: [], // used in v-for for select inputs
			formTitle: "Add A New Order", // changes from 'add' to 'update'
			isFormOpen: false, // controls form visibility
			isUpdateForm: false, // controls form type (add or update)
			searchTerm: "", // search term for search function
			searchParam: "", // search parameter for columns
			baseURL: baseURL // used in URL parameter of search emit function
		}
	},
	methods: {
		// -------- GET --------
		getAllData() {
			let _this = this;
			$.ajax({
				type: "GET",
				url: `${baseURL}/orders/`,
				success: function (data, status) {
					if (status === "success") {
						console.log(data);
						_this.tableData = data[0];
						// format date to yyy-mm-dd
						_this.tableData.forEach(order => {
							let formattedDate = new Date(order.order_date)
							order.order_date = formattedDate.toISOString().toString().split("").splice(0,10).join("");
						});
						_this.shippersData = data[1];
						_this.customersData = data[2];
						_this.employeesData = data[3];
						_this.productsData = data[4];
					}
				},
			});
		},
		// -------- POST --------
		submitForm() { // handles "Submit" button for new record
			// validate all values except id,
			// id will be made undefined
			for (let i in this.formData) {
				if (i == "order_id") continue;
				// toString() was necessary because shipper, customer,
				// employee, and product were being turned into number
				// while checking for empty string validation
				if (!this.formData[i].toString().trim()) {
					Swal.fire("Error.", "Please Enter All Fields.", "error");
					return;
				}
			}
			// there is a difference in property names between the formData
			// object and the column names in mysql database.
			// so a new object is made to fix the property name differences,
			// and also to split pop only the number value from the foreign key names
			let _this = this;
			let order = {
				order_date: this.formData.order_date,
				fk_shipper_id: this.formData.shipper_name.split(" ").pop(),
				fk_customer_id: this.formData.customer_name.split(" ").pop(),
				fk_employee_id: this.formData.employee_name.split(" ").pop(),
				fk_product_id: this.formData.product_name.split(" ").pop()
			};
			$.ajax({
				type: "POST",
				url: `${baseURL}/orders/insert`,
				data: order,
				success: function (data, status) {
					if (status === "success") {
						Swal.fire("Record Inserted.", "", "success");
						_this.$emit('emitCloseForm', _this, 'Add A New Order');
					}
				},
			});
		},
		// -------- PUT --------
		updateRecord() { // handles "Update" button for updated record
			// validate all values except id
			for (let i in this.formData) {
				if (i == "order_id") continue;
				// toString() was necessary because category and 
				// supplier was being turned into a number
				// while checking for empty string validation
				if (!this.formData[i].toString().trim()) {
					Swal.fire("Error.", "Please Enter All Fields.", "error");
					return;
				}
			}
			// there is a difference in property names between the formData
			// object and the column names in mysql database.
			// so a new object is made to fix the property name differences,
			// and also to split pop only the number value from the foreign key names
			let _this = this;
			let order = {
				order_date: this.formData.order_date,
				fk_shipper_id: this.formData.shipper_name.split(" ").pop(),
				fk_customer_id: this.formData.customer_name.split(" ").pop(),
				fk_employee_id: this.formData.employee_name.split(" ").pop(),
				fk_product_id: this.formData.product_name.split(" ").pop()
			};
			$.ajax({
				type: "PUT",
				url: `${baseURL}/orders/update/${this.formData.order_id}`,
				data: order,
				success: function (data, status) {
					if (status === "success") {
						Swal.fire("Record Updated.", "", "success");
						_this.$emit('emitCloseForm', _this, 'Add A New Order');
					}
				},
			});
		},
		// -------- DELETE --------
		async deleteRecord(record) { // handles the "Delete" icon button
			let cancel = true;
			await Swal.fire({
				title: "Are You Sure You Want To Delete?",
				showCancelButton: true,
				confirmButtonText: "Delete!",
			}).then((result) => {
				if(result.isConfirmed) {
					cancel = false;
				}
			});
			if (cancel) return;
			let _this = this;
			$.ajax({
				type: "DELETE",
				url: `${baseURL}/orders/delete/${record.order_id}`,
				success: function (data, status) {
					if (status === "success") {
						Swal.fire("Record Deleted.", "", "success");
						_this.getAllData();
					}
         		}
			});
		}
	},
	mounted() {
		this.getAllData();
	},
	computed: {
		// returns table data with numbers removed from
		// shipper, customer, employee and product columns
		computedTableData: function () {
			let data = []
			this.tableData.forEach(record => {
				let recordArray;
				if (record.shipper_name != "") {
					recordArray = record.shipper_name.split(" ");
					record.shipper_name = recordArray.splice(0, recordArray.length - 1).join(" ");
				}
				if (record.customer_name != "") {
					recordArray = record.customer_name.split(" ");
					record.customer_name = recordArray.splice(0, recordArray.length - 1).join(" ");
				}
				if (record.employee_name != "") {
					recordArray = record.employee_name.split(" ");
					record.employee_name = recordArray.splice(0, recordArray.length - 1).join(" ");
				}
				if (record.product_name != "") {
					recordArray = record.product_name.split(" ");
					record.product_name = recordArray.splice(0, recordArray.length - 1).join(" ");
				}
				data.push(record);
			});
			return data;
		},
		// these are to fill values for the select inputs
		shippers: function () {
			return this.shippersData;
		},
		customers: function () {
			return this.customersData;
		},
		employees: function () {
			return this.employeesData;
		},
		products: function () {
			return this.productsData;
		}
	}
}
</script>

<style scoped></style>