import './styles/styles.scss'
import './styles/tour.scss';

// MUST BE LOADED FIRST
import ElectronHelpers from './util/ElectronHelpers';

import VueInitializer from './vue/VueInitializer';
import {Routing} from './vue/Routing';
import {RouteNames} from './vue/Routing'
import { QrcodeReader } from 'vue-qrcode-reader'
import WindowService from './services/utility/WindowService';
ElectronHelpers.bindContextMenu();

import MenuBar from './components/MenuBar.vue'
import ViewBase from './components/ViewBase.vue'
import Button from './components/reusable/Button.vue'
import Input from './components/reusable/Input.vue'
import ActionBar from './components/reusable/ActionBar.vue'
// import LinkApp from './views/popouts/LinkApp.vue'
// import TransferRequest from './views/popouts/TransferRequest.vue'
import StoreService from "./services/utility/StoreService";

// f12 to open console from anywhere.
document.addEventListener("keydown", function (e) {
	if (e.which === 123) WindowService.openTools();
});

class Main {

	constructor(){

		const hash = location.hash.replace("#/", '');

		const shared = [
			{tag:'Button', vue:Button},
			{tag:'Input', vue:Input},
			{tag:'ActionBar', vue:ActionBar},

			{tag:'menu-bar', vue:MenuBar},
			{tag:'view-base', vue:ViewBase},
		];

		let fragments;
		if(hash === 'popout') fragments = [
			{tag:'link-app', vue:LinkApp},
			{tag:'transfer-request', vue:TransferRequest},
		]
		else fragments = [
			// {tag:'slider', vue:SliderComponent},
			// {tag:'qr-reader', vue:QrcodeReader},
		]

		const components = shared.concat(fragments);
		const middleware = (to, next, store) => {
			if(hash === 'popout') return next();
			if(Routing.isRestricted(to.name))
				store.getters.unlocked ? next() : next({name:RouteNames.LOGIN});
			else next();
		};

		new VueInitializer(Routing.routes(), components, middleware, async (router, store) => {

		});

		// window.onerror = log => {
		// 	// alert(log);
		// 	console.log('err logged', log);
		// };


		// window.eval = global.eval = () => {
		//     // throw new Error(`Sorry, this app does not support window.eval().`)
		// }
	}

}

new Main();
