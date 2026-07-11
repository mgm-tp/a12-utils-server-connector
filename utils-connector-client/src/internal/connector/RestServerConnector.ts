/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License – EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED “AS IS” AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */
import type { RequestFilter, ResponseFilter } from "../../index.js";

import { FilterChain } from "../filter/FilterChain.js";
import { InitRequestFilter } from "../filter/request/InitRequestFilter.js";
import { BodyFilter } from "../filter/request/BodyFilter.js";
import { HeadersFilter } from "../filter/request/HeadersFilter.js";
import { OkResponseFilter } from "../filter/response/OkResponseFilter.js";
import { CustomHeadersFilter } from "../filter/request/CustomHeadersFilter.js";
import { SignalHeadersFilter } from "../filter/request/SignalHeadersFilter.js";

import type { CommonRequest, ServerConnector } from "./ServerConnector.js";

/**
 * REST request payload at runtime. Please pass in this structure during your fetch method.
 * - relativeUrl: your relative url.
 * - method: GET/POST/PUT/PATCH .... HTTP method.
 * - signal: Is used to associate an AbortSignal with a fetch request. This allows for the cancellation of the request
 * before it completes.
 * - runtimeBaseUrl: It overrides the _serverUrlBase.
 * - body: It's relevant for particular method like POST.
 * - customHeaders: The list of custom headers which will be added to request header.
 * - extendedData: we put it as any since we don't know what kind of data you need. Put whatever you want.
 * - needUrlEncoded: the flag determines whether the final request url is encoded or not. If it's not defined, it would
 * be considered as true.
 */
export interface RestRequestPayload extends CommonRequest {
	readonly relativeUrl: string;
	readonly method: string;
	readonly signal?: AbortSignal;
	readonly runtimeBaseUrl?: string;
	readonly body?: unknown;
	readonly customHeaders?: string[][];
	readonly extendedData?: unknown;
	readonly needUrlEncoded?: boolean;
}

/**
 * Check the payload instance. we only see relativeUrl and method are required
 * Other properties like body and extendedData are optional.
 * @param payload
 */
export function isRestRequestPayloadInstance(
	payload: RestRequestPayload | object
): payload is RestRequestPayload {
	return (
		"relativeUrl" in payload &&
		"method" in payload &&
		typeof payload.relativeUrl === "string" &&
		typeof payload.method === "string"
	);
}
/**
 * REST implementation of @ServerConnector
 * This should provide all necessary infrastructure for you in order to use REST.
 * During the construction of connector it's default (you can't change) that
 * 	InitRequest @InitRequestFilter
 * 	Body @BodyFilter
 * 	Headers @HeadersFilter
 * are initialized. However you can easily change RequestInit instance by adding your own @RequestFilter
 * If you think our filters are not fullfill your requirements.
 */
export class RestServerConnector implements ServerConnector {
	private _requestFilterChain = new FilterChain();
	private _responseFilterChain = new FilterChain();

	constructor(
		private _serverUrlBase: string,
		private _additionalRequestFilter?: RequestFilter[],
		private _additionalResponseFilter?: ResponseFilter[]
	) {
		this._requestFilterChain.registerFilterRequest(new InitRequestFilter());
		this._requestFilterChain.registerFilterRequest(new BodyFilter());
		this._requestFilterChain.registerFilterRequest(new HeadersFilter());
		this._requestFilterChain.registerFilterRequest(new SignalHeadersFilter());
		this._requestFilterChain.registerFilterRequest(new CustomHeadersFilter());
		if (this._additionalRequestFilter !== undefined) {
			this._additionalRequestFilter.forEach(additionalRequestFilter => {
				this._requestFilterChain.registerFilterRequest(additionalRequestFilter);
			});
		}

		if (this._additionalResponseFilter !== undefined) {
			this._additionalResponseFilter.forEach(additionalResponseFilter => {
				this._responseFilterChain.registerFilterResponse(
					additionalResponseFilter
				);
			});
		}
		this._responseFilterChain.registerFilterResponse(new OkResponseFilter());
	}

	async fetchData(requestPayload: RestRequestPayload): Promise<Response> {
		const requestInit =
			this._requestFilterChain.startRequestFilter(requestPayload);
		const baseRestUrl =
			requestPayload.runtimeBaseUrl !== undefined
				? requestPayload.runtimeBaseUrl
				: this._serverUrlBase;
		const requestUrl = this.normalizeUrl(
			baseRestUrl + requestPayload.relativeUrl
		);
		const { needUrlEncoded = true } = requestPayload;
		const _result = fetch(
			needUrlEncoded ? encodeURI(requestUrl) : requestUrl,
			requestInit
		).then(response => response);
		return await this._responseFilterChain.startResponseFilter(_result);
	}

	/**
	 * Get your base URL
	 */
	getBaseUrl() {
		return this._serverUrlBase;
	}

	normalizeUrl(url: string): string {
		return url.replace(/([^:]\/)\/+/g, "$1");
	}
}
