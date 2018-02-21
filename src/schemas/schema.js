import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLInputObjectType } from 'graphql';
import axios from 'axios';

const CompanyType = new GraphQLObjectType({
	name: 'Company',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		users: {
			type: new GraphQLList(UserType),
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3030/companies/${parentValue.id}/users/`).then(res => res.data);
			}
		}
	})
});

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt },
		company: {
			type: CompanyType,
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3030/companies/${parentValue.companyId}`).then(res => res.data);
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3030/users/${args.id}`).then(res => res.data);
			}
		},
		company: {
			type: CompanyType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3030/companies/${args.id}`).then(res => res.data);
			}
		}
	}
});

// use const mutation = new GraphQLInputObjectType
const mutation = new GraphQLObjectType({

	name: 'Mutation',
	fields: {
		addUser: {
			type: UserType,
			args: {
				firstName: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
				companyId: { type: GraphQLString }
			},
			resolve(parentValue, { firstName, age }) {
				return axios.post('http://localhost:3030/users/', { firstName, age}).then(res => res.data);
			}
		},
		removeUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parentValue, { id }) {
				return axios.delete(`http://localhost:3030/users/${ id }`).then(res => {console.log(res); return res.data});
			}
		},
		updateUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				firstName: { type: GraphQLString },
				age: { type: GraphQLInt },
				company: { type: GraphQLString }
			},
			resolve(parentValue, args) {
				return axios.patch(`http://localhost:3030/users/${ args.id }`, { args }).then(res => res.data);
			}
		}
	}
});

export default new GraphQLSchema({
	query: RootQuery,
	mutation
});
