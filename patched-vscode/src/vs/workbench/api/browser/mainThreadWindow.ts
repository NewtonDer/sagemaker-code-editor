/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mainWindow } from 'vs/base/browser/window';
import { Event } from 'vs/base/common/event';
import { DisposableStore } from 'vs/base/common/lifecycle';
import { URI, UriComponents } from 'vs/base/common/uri';
import { IOpenerService } from 'vs/platform/opener/common/opener';
import { extHostNamedCustomer, IExtHostContext } from 'vs/workbench/services/extensions/common/extHostCustomers';
import { ExtHostContext, ExtHostWindowShape, IOpenUriOptions, MainContext, MainThreadWindowShape } from '../common/extHost.protocol';
import { IHostService } from 'vs/workbench/services/host/browser/host';
import { IUserActivityService } from 'vs/workbench/services/userActivity/common/userActivityService';

@extHostNamedCustomer(MainContext.MainThreadWindow)
export class MainThreadWindow implements MainThreadWindowShape {

	private readonly proxy: ExtHostWindowShape;
	private readonly disposables = new DisposableStore();
	private readonly _receiveMessageListener: (e: MessageEvent<any>) => void;

	constructor(
		extHostContext: IExtHostContext,
		@IHostService private readonly hostService: IHostService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IUserActivityService private readonly userActivityService: IUserActivityService,
	) {
		this.proxy = extHostContext.getProxy(ExtHostContext.ExtHostWindow);

		Event.latch(hostService.onDidChangeFocus)
			(this.proxy.$onDidChangeWindowFocus, this.proxy, this.disposables);
		userActivityService.onDidChangeIsActive(this.proxy.$onDidChangeWindowActive, this.proxy, this.disposables);

		this._receiveMessageListener = (e: MessageEvent<any>) => {
			if (e.origin !== this.getOrigin() || e.source !== mainWindow.parent) {
				return;
			}
			this.proxy.$receiveMessage(e.data);
		};

		mainWindow.addEventListener('message', this._receiveMessageListener);
	}

	private getOrigin() {
		const urlParams = new URLSearchParams(mainWindow.location.search);
		return urlParams.get('origin');
	}

	dispose(): void {
		this.disposables.dispose();
		mainWindow.removeEventListener('message', this._receiveMessageListener);
	}

	$sendMessage(message: any): void {
		const origin = this.getOrigin();

		if (!origin) {
			return;
		}

		mainWindow.parent.postMessage(message, origin);
	}

	$getInitialState() {
		return Promise.resolve({
			isFocused: this.hostService.hasFocus,
			isActive: this.userActivityService.isActive,
		});
	}

	async $openUri(uriComponents: UriComponents, uriString: string | undefined, options: IOpenUriOptions): Promise<boolean> {
		const uri = URI.from(uriComponents);
		let target: URI | string;
		if (uriString && URI.parse(uriString).toString() === uri.toString()) {
			// called with string and no transformation happened -> keep string
			target = uriString;
		} else {
			// called with URI or transformed -> use uri
			target = uri;
		}
		return this.openerService.open(target, {
			openExternal: true,
			allowTunneling: options.allowTunneling,
			allowContributedOpeners: options.allowContributedOpeners,
		});
	}

	async $asExternalUri(uriComponents: UriComponents, options: IOpenUriOptions): Promise<UriComponents> {
		const result = await this.openerService.resolveExternalUri(URI.revive(uriComponents), options);
		return result.resolved;
	}
}
