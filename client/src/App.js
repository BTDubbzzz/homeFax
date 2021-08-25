import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import PaperBase from './pages/PaperBase.js';
import Content from './components/Content';
import Home from './pages/Home';
import Homes from './pages/Homes.js';
import Misc from './pages/Misc.js';
import Profile from './pages/Profile.js';

import MyHome from './pages/MyHome.js';
import Transfer from './components/Transfer.js';
import TransferAccept from './components/TransferAccept';

import { StoreProvider } from './utils/GlobalState';

const httpLink = createHttpLink({
	uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('id_token');
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

function App(props) {
	return (
		<ApolloProvider client={client}>
			<Router>
				<StoreProvider>
					<Switch>
						<Route exact path='/'>
							<PaperBase content={<Content></Content>}></PaperBase>
						</Route>
						<Route exact path='/home'>
							<PaperBase content={<Home></Home>}></PaperBase>
						</Route>
						<Route exact path='/myhomes'>
							<PaperBase content={<Homes></Homes>}></PaperBase>
						</Route>
						<Route exact path='/myhomes/:homeid'>
							<PaperBase content={<MyHome></MyHome>}></PaperBase>
						</Route>
						<Route exact path='/profile'>
							<PaperBase content={<Profile></Profile>}></PaperBase>
						</Route>
						<Route exact path='/transfer'>
							<PaperBase content={<Transfer></Transfer>}></PaperBase>
						</Route>
						<Route exact path='/transferaccept'>
							<PaperBase
								content={<TransferAccept></TransferAccept>}
							></PaperBase>
						</Route>
						<Route exact path='/createHome'>
							<PaperBase content={<Misc></Misc>}></PaperBase>
						</Route>
					</Switch>
				</StoreProvider>
			</Router>
		</ApolloProvider>
	);
}

export default App;
