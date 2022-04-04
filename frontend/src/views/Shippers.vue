<template>
	<div class="container-fluid">
		<div v-if="!isFormOpen">
			<div class="row">
				<div class="col-12">
					<Box title="Shippers Manager" />
				</div>
			</div>
			<div class="row">
				<div class="col-lg-4">
					<div class="row">
						<div class="col-md-4 sideBox">
							<Box title="Add A New Shipper">
								<button @click="$emit('emitOpenForm', this)" class="btn btn-success">
									New
								</button>
							</Box>
						</div>
						<div class="col-md-4 sideBox">
							<Box title="Search For A Shipper">
								<input 
									v-model="searchTerm" 
									type="text" 
									id="searchTerm" 
									class="form-control" 
									placeholder="Enter name of shipper">
								<button 
									@click="$emit(
									'emitSearch', 
									this, 
									`${baseURL}/shippers/search/${searchTerm}`,
									'Please Enter Search Term.')" 
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
					<Box title="Table Of All Shippers" hr>
						<Table 
							@delete="deleteRecord"
							@update="(record) => $emit('emitOpenUpdateForm', this, record, 'Update A Shipper')"
							:columnsProp="tableColumns" 
							:dataSetProp="tableData" />
					</Box>
				</div>
			</div>
		</div>
		<Form 
			:formTitle="formTitle"
			returnBtnText="Go Back To Shippers Manager"
			:updateForm="isUpdateForm"
			@submit="submitForm"
			@close="$emit('emitCloseForm', this, 'Add A New Shipper')" 
			@update="updateRecord"
			v-if="isFormOpen">
			<div class="row">
				<div class="col-md-6 form-group">
					<label for="name">Shipper Name</label>
					<input 
						v-model="formData.name" 
						type="text" 
						id="name" 
						class="form-control">
				</div>
				<div class="col-md-6 form-group">
					<label for="phone_number">Phone Number</label>
					<input 
						v-model="formData.phone_number" 
						type="text" 
						id="phone_number" 
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
	name: "Shippers",
	components: {
		Box,
		Table,
		Form
	},
	data() {
		return {
			formData: { // used for submit and update
				shipper_id: "",
				name: "",
				phone_number: ""
			},
			tableColumns: [ // used in v-for for table columns
				"ID",
				"Shipper Name",
				"Phone Number"
			],
			tableData: [], // used in v-for for table body
			formTitle: "Add A New Shipper", // changes from 'add' to 'update'
			isFormOpen: false, // controls form visibility
			isUpdateForm: false, // controls form type (add or update)
			searchTerm: "", // search term for search function
							// this table does not use a search parameter
			baseURL: baseURL // used in URL parameter of search emit function
		}
	},
	methods: {
		// -------- GET --------
		getAllData() {
			let _this = this;
			$.ajax({
				type: "GET",
				url: `${baseURL}/shippers/`,
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
				if (i == "shipper_id") continue;
				if (!this.formData[i].trim()) {
					Swal.fire("Error.", "Please Enter All Fields.", "error");
					return;
				}
			}
			let _this = this;
			this.formData.shipper_id = undefined;
			$.ajax({
				type: "POST",
				url: `${baseURL}/shippers/insert`,
				data: this.formData,
				success: function (data, status) {
					if (status === "success") {
						Swal.fire("Record Inserted.", "", "success");
						_this.$emit('emitCloseForm', _this, 'Add A New Shipper');
					}
				},
			});
		},
		// -------- PUT --------
		updateRecord() { // handles "Update" button for updated record
			// validate all values except id
			for (let i in this.formData) {
				if (i == "shipper_id") continue;
				if (!this.formData[i].trim()) {
					Swal.fire("Error.", "Please Enter All Fields.", "error");
					return;
				}
			}
			let _this = this;
			$.ajax({
				type: "PUT",
				url: `${baseURL}/shippers/update/${this.formData.shipper_id}`,
				data: this.formData,
				success: function (data, status) {
					if (status === "success") {
						Swal.fire("Record Updated.", "", "success");
						for (let i in this.formData) {
							this.formData[i] = ""
						}
						_this.$emit('emitCloseForm', _this, 'Add A New Shipper');
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
				url: `${baseURL}/shippers/delete/${record.shipper_id}`,
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