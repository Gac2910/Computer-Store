<template>
	<div>
		<div class="row">
			<div class="col-12">
				<Box :title="formTitle" />
			</div>
		</div>
		<div class="row">
			<div class="col-md-4">
				<div class="row">
					<div class="col-12">
						<Box :title="returnBtnText">
							<button @click="$emit('close')" class="btn btn-success">
								Go Back
							</button>
						</Box>
					</div>
				</div>
			</div>
			<div class="col-md-8">
				<Box :title="formTitle" hr>
					<slot></slot>
					<div v-if="!updateForm" class="row">
						<div class="col-12">
							<button @click="$emit('submit')" class="btn btn-success submit-btn">Submit</button>
						</div>
					</div>
					<div v-if="updateForm" class="row">
						<div class="col-12">
							<button @click="$emit('update')" class="btn btn-success submit-btn">Update</button>
						</div>
					</div>
				</Box>
			</div>
		</div>
	</div>
</template>

<script>
import Box from '@/components/BoxComponent';
export default {
	name: "Form",
	components: {
		Box
	},
	props: {
		formTitle: {
			type: String,
			default: "Form Title"
		},
		returnBtnText: {
			type: String,
			default: "Return Button Text"
		},
		updateForm: false // prop controls which button to show (submit or update)
	}
}
</script>

<style scoped></style>