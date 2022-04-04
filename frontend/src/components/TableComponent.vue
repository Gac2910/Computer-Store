<template>
	<div class="table-div">
		<table>
			<colgroup>
				<col :span="columns.length">
				<col width="100px">
			</colgroup>
			<thead>
				<tr>
					<th v-for="(col, i) in columns" :key="i">
						{{ col }}
					</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(record, i) in dataSet" :key="i">
					<td v-for="(value, j) in record" :key="j">
						{{ value }}
					</td>
					<td>
						<i @click="$emit('delete', record)" class="fa fa-trash"></i>
						<i @click="$emit('update', record)" class="fa fa-refresh"></i>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	name: "Table",
	props: {
		columnsProp: { // an array of column names
			type: Array,
			default: [],
		},
		dataSetProp: { // an array of objects of data
			type: Array,
			default: [],
		}
	},
	computed: {
		// computed property allows the prop to be used in the v-for
		columns: function () {
			return this.columnsProp;
		},
		dataSet: function () {
			return this.dataSetProp;
		}
	}
}
</script>

<style scoped>
.table-div {
	overflow-x: auto;
}
table {
	background: white;
	color: black;
	width: 100%;
	text-align: center;
	min-width: 400px;
	border: 2px solid rgb(75, 74, 74);
}
table thead tr th {
	background: gray;
	color: white;
	border: 2px solid rgb(75, 74, 74);
	padding: 0px 10px;
}
table tbody tr:nth-child(odd) {
	background: rgb(235, 235, 235);
}
table tbody tr td {
	padding: 3px 5px;
	border-left: 1px solid rgb(75, 74, 74);
	border-right: 1px solid rgb(75, 74, 74);
}
</style>