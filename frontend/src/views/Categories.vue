<template>
	<div class="container-fluid">
		<div v-if="!isFormOpen">
			<div class="row">
				<div class="col-12">
					<Box title="Categories Manager" />
				</div>
			</div>
			<div class="row">
				<div class="col-lg-4">
					<div class="row">
						<div class="col-md-4 sideBox">
							<Box title="Add A New Category">
								<button @click="$emit('emitOpenForm', this)" class="btn btn-success">
									New
								</button>
							</Box>
						</div>
						<div class="col-md-4 sideBox">
							<Box title="Search For A Category">
								<input 
									v-model="searchTerm" 
									type="text" 
									id="searchTerm" 
									class="form-control" 
									placeholder="Enter name of category">
								<button 
									@click="$emit(
									'emitSearch', 
									this, 
									`${baseURL}/categories/search/${searchTerm}`,
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
					<Box title="Table Of All Categories" hr>
						<Table 
							@delete="deleteRecord"
							@update="(record) => $emit('emitOpenUpdateForm', this, record, 'Update A Category')"
							:columnsProp="tableColumns" 
							:dataSetProp="tableData" />
					</Box>
				</div>
			</div>
		</div>	
		<Form 
			:formTitle="formTitle"
			returnBtnText="Go Back To Categories Manager"
			:updateForm="isUpdateForm"
			@submit="submitForm"
			@close="$emit('emitCloseForm', this, 'Add A New Category')" 
			@update="updateRecord"
			v-if="isFormOpen">
			<div class="row">
				<div class="col-md-6 form-group">
					<label for="name">Category Name</label>
					<input 
						v-model="formData.name" 
						type="text" 
						id="name" 
						class="form-control">
				</div>
				<div class="col-md-6 form-group">
					<label for="description">Description</label>
					<input 
						v-model="formData.description" 
						type="text" 
						id="description" 
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
	name: "Categories",
	components: {
		Box,
		Table,
		Form
	},
	data() {
		return {
			formData: { // used for submit and update
				category_id: "",
				name: "",
				description: "",
			},
			tableColumns: [ // used in v-for for table columns
				"ID",
				"Category Name",
				"Description",
			],
			tableData: [], // used in v-for for table body
			formTitle: "Add A New Category", // changes from 'add' to 'update'
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
				url: `${baseURL}/categories/`,
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
				if (i == "category_id") continue;
				if (!this.formData[i].trim()) {
					Swal.fire("Error.", "Please Enter All Fields.", "error");
					return;
				}
			}
			let _this = this;
			this.formData.category_id = undefined;
			$.ajax({
				type: "POST",
				url: `${baseURL}/categories/insert`,
				data: this.formData,
				success: function (data, status) {
					if (status === "success") {
						Swal.fire("Record Inserted.", "", "success");
						_this.$emit('emitCloseForm', _this, 'Add A New Category')
					}
				},
			});
		},
		// -------- PUT --------
		updateRecord() { // handles "Update" button for updated record
			// validate all values except id
			for (let i in this.formData) {
				if (i == "category_id") continue;
				if (!this.formData[i].trim()) {
					Swal.fire("Error.", "Please Enter All Fields.", "error");
					return;
				}
			}
			let _this = this;
			$.ajax({
				type: "PUT",
				url: `${baseURL}/categories/update/${this.formData.category_id}`,
				data: this.formData,
				success: function (data, status) {
					if (status === "success") {
						Swal.fire("Record Updated.", "", "success");
						for (let i in this.formData) {
							this.formData[i] = ""
						}
						_this.$emit('emitCloseForm', _this, 'Add A New Category')
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
				url: `${baseURL}/categories/delete/${record.category_id}`,
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