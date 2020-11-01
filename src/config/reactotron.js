import Reactotron, { networking } from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = Reactotron
	//.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
	.configure() // controls connection & communication settings
	.useReactNative() // add all built-in react native plugins
	.use(networking())
	.use(reactotronRedux())
	.connect(); // let's connect!

console.tron = reactotron;

Reactotron.clear();

export default reactotron;
