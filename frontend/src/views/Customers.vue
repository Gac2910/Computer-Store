<template>
	<div class="container-fluid">
		<div v-if="!isFormOpen">
			<div class="row">
				<div class="col-12">
					<Box title="Customers Manager" />
				</div>
			</div>
			<div class="row">
				<div class="col-lg-4">
					<div class="row">
						<div class="col-md-4 sideBox">
							<Box title="Add A New Customer">
								<button @click="$emit('emitOpenForm', this)" class="btn btn-success">
									New
								</button>
							</Box>
						</div>
						<div class="col-md-4 sideBox">
							<Box title="Search For A Customer">
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
									<option value="city">Search By City</option>
									<option value="country">Search By Country</option>
								</select>
								<button 
									@click="$emit(
									'emitSearch', 
									this, 
									`${baseURL}/customers/search/${searchParam}/${searchTerm}`,
									'Please Enter Search Term And Select A Parameter.')" 
									class="btn btn-success">
									Search
								</button>
							</Box>
						</div>
						<div class="col-md-4 sideBox">
							<Box title="Reload Table">
								<button 
									@click="$emit('emitReload', this, 'Update A Customer')" 
									class="btn btn-success">
									Reload
								</button>
								<span id="reloadMsg"></span>
							</Box>
						</div>
					</div>
				</div>
				<div class="col-lg-8">
					<Box title="Table Of All Customers" hr>
						<Table 
							@delete="deleteRecord"
							@update="(record) => $emit('emitOpenUpdateForm', this, record, 'Update A Customer')"
							:columnsProp="tableColumns" 
							:dataSetProp="tableData" />
					</Box>
				</div>
			</div>
		</div>
		<Form 
			:formTitle="formTitle"
			returnBtnText="Go Back To Customers Manager"
			:updateForm="isUpdateForm"
			@submit="submitForm"
			@close="$emit('emitCloseForm', this, 'Add A New Customer')" 
			@update="updateRecord"
			v-if="isFormOpen">
			<div class="row">
				<div class="col-md-6 form-group">
					<label for="firstName">First Name</label>
					<input 
						v-model="formData.first_name" 
						type="text" 
						id="firstName" 
						class="form-control">
				</div>
				<div class="col-md-6 form-group">
					<label for="lastName">Last Name</label>
					<input 
						v-model="formData.last_name" 
						type="text" 
						id="lastName" 
						class="form-control">
				</div>
			</div>
			<div class="row">
				<div class="col-md-6 form-group">
					<label for="address">Address</label>
					<input 
						v-model="formData.address" 
						type="text" 
						id="address" 
						class="form-control">
				</div>
				<div class="col-md-6 form-group">
					<label for="city">City</label>
					<input 
						v-model="formData.city" 
						type="text" 
						id="city" 
						class="form-control">
				</div>
			</div>
			<div class="row">
				<div class="col-md-6 form-group">
					<label for="zip">Zip Code</label>
					<input 
						v-model="formData.zip_code" 
						type="text" 
						id="zip" 
						class="form-control">
				</div>
				<div class="col-md-6 form-group">
					<label for="country">Country</label>
					<input 
						v-model="formData.country" 
						type="text" 
						id="country" 
						class="form-control">
				</div>
			</div>
		</Form>
	</div>
</template>

<script>
import Box from '@/components/BoxComponent';
import Table from '@/components/TableComponent';
import Form from "@/components/FormComponent";
export default {
	name: 'Customers',
	components: {
		Box,
		Table,
		Form
	},
	data() {
		return {
			formData: { // used for submit and update
				customer_id: "",
				first_name: "",
				last_name: "",
				address: "",
				city: "",
				zip_code: "",
				country: "",
			},
			tableColumns: [ // used in v-for for table columns
				"ID",
				"First Name",
				"Last Name",
				"Address",
				"City",
				"Zip Code",
				"Country"
			],
			tableData: [], // used in v-for for table body
			formTitle: "Add A New Customer", // changes from 'add' to 'update'
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
				url: `${baseURL}/customers/`,
				success: function (data, status) {
					if (status === "success") {
						data = JSON.parse(data);
						_this.tableData = data;
					}
				},
			});
		},
		// -------- POST --------
		submitForm() { // handles "Submit" button for new record
			// validate all values except id,
			// id will be made undefined
			for (let i in this.formData) {
				if (i == "customer_id") continue;
				if (!this.formData[i].trim()) {
					Swal.fire("Error.", "Please Enter All Fields.", "error");
					return;
				}
			}
			let _this = this;
			this.formData.customer_id = undefined;
			$.ajax({
				type: "POST",
				url: `${baseURL}/customers/insert`,
				data: this.formData,
				success: function (data, status) {
					if (status === "success") {
						Swal.fire("Record Inserted.", "", "success");
						_this.$emit("emitCloseForm", _this, "Add A New Category");
					}
				},
			});
		},
		// -------- PUT --------
		updateRecord() { // handles "Update" button for updated record
			// validate all values except id
			for (let i in this.formData) {
				if (i == "customer_id") continue;
				if (!this.formData[i].trim()) {
					Swal.fire("Error.", "Please Enter All Fields.", "error");
					return;
				}
			}
			let _this = this;
			$.ajax({
				type: "PUT",
				url: `${baseURL}/customers/update/${this.formData.customer_id}`,
				data: this.formData,
				success: function (data, status) {
					if (status === "success") {
						Swal.fire("Record Updated.", "", "success");
						for (let i in this.formData) {
							this.formData[i] = ""
						}
						_this.$emit("emitCloseForm", _this, "Add A New Category");
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
				url: `${baseURL}/customers/delete/${record.customer_id}`,
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
	}
}
</script>

<style scoped></style>