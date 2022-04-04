<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col-12">
				<Box title="Home Page" />
			</div>
		</div>
		<div class="row">
			<div class="col-lg-6">
				<Box title="Our People">
					<div class="row">
						<div class="col-sm-6">
							<Box title="Manage Customers"> 
								<router-link to="/customers">
									<button class="btn btn-success">
										Customers
									</button>
								</router-link>
							</Box>
						</div>
						<div class="col-sm-6">
							<Box title="Manage Employees">
								<router-link to="/employees">
									<button class="btn btn-success">
										Employees
									</button>
								</router-link>
							</Box>						
						</div>
					</div>
				</Box>
			</div>
			<div class="col-lg-6">
				<Box title="Our Products">
					<div class="row">
						<div class="col-sm-6">
							<Box title="Manage Categories">
								<router-link to="categories">
									<button class="btn btn-success">
										Categories
									</button>
								</router-link>
							</Box>
						</div>
						<div class="col-sm-6">
							<Box title="Manage Product Items"> 
								<router-link to="products">
									<button class="btn btn-success">
										Products
									</button>
								</router-link>
							</Box>
						</div>	
					</div>
				</Box>
			</div>
		</div>
		<div class="row">
			<div class="col-lg-6">
				<Box title="Our Partners">
					<div class="row">
						<div class="col-sm-6">
							<Box title="Manage Suppliers">
								<router-link to="suppliers">
									<button class="btn btn-success">
										Suppliers
									</button>
								</router-link>
							</Box>
						</div>
						<div class="col-sm-6">
							<Box title="Manage Shippers">
								<router-link to="shippers">
									<button class="btn btn-success">
										Shippers
									</button>
								</router-link>
							</Box>
						</div>	
					</div>
				</Box>
			</div>
			<div class="col-lg-6">
				<div class="row">
					<div class="col-12">
						<Box title="Manage Our Orders">
							<router-link to="orders">
								<button class="btn btn-success">
									Orders
								</button>
							</router-link>
						</Box>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Box from '@/components/BoxComponent';
export default {
	name: 'Home',
	components: {
		Box,
	}
}
</script>

<style scoped></style>