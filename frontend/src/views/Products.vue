<template>
	<div class="container-fluid">
		<div v-if="!isFormOpen">
			<div class="row">
				<div class="col-12">
					<Box title="Products Manager"></Box>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-4">
					<div class="row">
						<div class="col-md-4 sideBox">
							<Box title="Add A New Product">
								<button @click="$emit('emitOpenForm', this)" class="btn btn-success">
									New
								</button>
							</Box>
						</div>
						<div class="col-md-4 sideBox">
							<Box title="Search For A Product">
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
									<option value="name">Search By Name</option>
									<option value="price">Search By Price</option>
								</select>
								<button 
									@click="$emit(
									'emitSearch', 
									this, 
									`${baseURL}/products/search/${searchParam}/${searchTerm}`,
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
					<Box title="Table Of All Products" hr>
						<Table 
							@delete="deleteRecord"
							@update="(record) => $emit('emitOpenUpdateForm', this, record, 'Update A Product')"
							:columnsProp="tableColumns" 
							:dataSetProp="computedTableData" />
					</Box>
				</div>
			</div>
		</div>
		<Form 
			:formTitle="formTitle"
			returnBtnText="Go Back To Products Manager"
			:updateForm="isUpdateForm"
			@submit="submitForm"
			@close="$emit('emitCloseForm', this, 'Add A New Product')" 
			@update="updateRecord"
			v-if="isFormOpen">
			<div class="row">
				<div class="col-md-6 form-group">
					<label for="name">Product Name</label>
					<input 
						v-model="formData.name" 
						type="text" 
						id="name" 
						class="form-control">
				</div>
				<div class="col-md-6 form-group">
					<label for="unit">Unit</label>
					<input 
						v-model="formData.unit" 
						type="text" 
						id="unit" 
						class="form-control">
				</div>
			</div>
			<div class="row">
				<div class="col-md-12 form-group">
					<label for="price">Price</label>
					<input 
						v-model="formData.price" 
						type="text" 
						id="price" 
						class="form-control">
				</div>
			</div>
			<div class="row">
				<div class="col-md-6 form-group">
					<label for="fk_category_id">Category</label>
					<select 
						v-model="formData.category_name" 
						id="fk_category_id" 
						class="form-control">
						<option value="">Select a category</option>
						<option 
							v-for="(category, i) in categories"
							:key="i" 
							:value="category.name + ' ' + category.category_id">
							{{ category.name }}
						</option>
					</select>
				</div>
				<div class="col-md-6 form-group">
					<label for="fk_supplier_id">Supplier</label>
					<select 
						v-model="formData.supplier_name" 
						id="fk_supplier_id" 
						class="form-control">
						<option value="">Select a supplier</option>
						<option 
							v-for="(supplier, i) in suppliers"
							:key="i" 
							:value="supplier.name + ' ' + supplier.supplier_id">
							{{ supplier.name }}
						</option>
					</select>
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
	name: "Products",
	components: {
		Box,
		Table,
		Form
	},
	data() {
		return {
			formData: { // used for submit and update
				product_id: "",
				name: "",
				unit: "",
				price: "",
				category_name: "",
				supplier_name: ""
			},
			tableColumns: [ // used in v-for for table columns
				"ID",
				"Product Name",
				"Unit",
				"Price",
				"Category",
				"Supplier "
			],
			tableData: [], // used in computed property for table body
			suppliersData: [], // used in v-for for select inputs
			categoriesData: [], // used in v-for for select inputs
			formTitle: "Add A New Product", // changes from 'add' to 'update'
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
				url: `${baseURL}/products/`,
				success: function (data, status) {
					if (status === "success") {
						console.log(data);
						_this.tableData = data[0];
						_this.categoriesData = data[1];
						_this.suppliersData = data[2];
					}
				},
			});
		},
		// -------- POST --------
		submitForm() { // handles "Submit" button for new record
			// validate all values except id,
			// id will be made undefined
			for (let i in this.formData) {
				if (i == "product_id") continue;
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
			// and also to split pop only the number value from category_name and
			// supplier_name
			let _this = this;
			let product = {
				name: this.formData.name,
				unit: this.formData.unit,
				price: this.formData.price,
				fk_category_id: this.formData.category_name.split(" ").pop(),
				fk_supplier_id: this.formData.supplier_name.split(" ").pop()
			};
			$.ajax({
				type: "POST",
				url: `${baseURL}/products/insert`,
				data: product,
				success: function (data, status) {
					if (status === "success") {
						Swal.fire("Record Inserted.", "", "success");
						_this.$emit('emitCloseForm', _this, 'Add A New Product');
					}
				},
			});
		},
		// -------- PUT --------
		updateRecord() { // handles "Update" button for updated record
			// validate all values except id
			for (let i in this.formData) {
				if (i == "product_id") continue;
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
			// and also to split pop only the number value from category_name and
			// supplier_name
			let _this = this;
			let product = {
				name: this.formData.name,
				unit: this.formData.unit,
				price: this.formData.price,
				fk_category_id: this.formData.category_name.split(" ").pop(),
				fk_supplier_id: this.formData.supplier_name.split(" ").pop()
			};
			$.ajax({
				type: "PUT",
				url: `${baseURL}/products/update/${this.formData.product_id}`,
				data: product,
				success: function (data, status) {
					if (status === "success") {
						Swal.fire("Record Updated.", "", "success");
						_this.$emit('emitCloseForm', _this, 'Add A New Product');
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
				url: `${baseURL}/products/delete/${record.product_id}`,
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
		// category and supplier columns
		computedTableData: function () {
			let data = []
			this.tableData.forEach(record => {
				if (record.category_name != "") {
					record.category_name = record.category_name.substring(0, record.category_name.length - 1).trim();
				}
				if (record.supplier_name != "") {
					record.supplier_name = record.supplier_name.substring(0, record.supplier_name.length - 1).trim();
				}
				data.push(record);
			});
			return data;
		},
		// these are to fill values for the select inputs
		categories: function () {
			return this.categoriesData;
		},
		suppliers: function () {
			return this.suppliersData;
		},
	}
}
</script>

<style scoped></style>