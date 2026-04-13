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
import { RestRequestPayload } from "../../index.js";

import { DefaultErrorResponseFilter } from "./response/DefaultErrorResponseFilter.js";
import {
	RequestFilter,
	RequestFilterPayload,
	RequestFilterResult
} from "./request/RequestFilter.js";
import {
	ResponseFilter,
	ResponseFilterResult
} from "./response/ResponseFilter.js";

/**
 * FilterChain is considered internal mechanism to construct extension points regarding build request
 * Processing response.
 * You're able to register multiple RequestFilter and ResponseFilter to FilterChain
 */
export class FilterChain {
	private _filtersRequest: RequestFilter[] = [];
	private _filtersResponse: ResponseFilter[] = [];
	private _requestInit: RequestInit = {};

	registerFilterRequest(filterWillBeAdded: RequestFilter) {
		this._filtersRequest.push(filterWillBeAdded);
	}

	requestFilters() {
		return this._filtersRequest;
	}

	responseFilters() {
		return this._filtersResponse;
	}

	registerFilterResponse(filterWillBeAdded: ResponseFilter) {
		this._filtersResponse.push(filterWillBeAdded);
	}

	getRequestInit(): RequestInit {
		return this._requestInit;
	}

	startRequestFilter(payload: RestRequestPayload): RequestInit {
		this._requestInit = {};
		for (const requestFilter of this._filtersRequest) {
			const requestPayload: RequestFilterPayload = {
				request: this._requestInit,
				payload: payload
			};
			if (requestFilter.canHandleRequest(requestPayload)) {
				const result: RequestFilterResult =
					requestFilter.doRequestFilter(requestPayload);
				this._requestInit = {
					...result.request
				};
				if (!result.continue) {
					break;
				}
			}
		}
		return this._requestInit;
	}

	/**
	 * We can see a limitation of this would be. Util only can handles error cases for all ResponseFilter
	 * In case project would like to set more information to response return from Connector
	 * it would be not possible due to setting back data to Promise<Response>
	 * @param responseFilters
	 * @private
	 */
	async startResponseFilter(
		responseInput: Promise<Response>
	): Promise<Response> {
		let response;
		if (responseInput) {
			try {
				response = await responseInput;
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (error) {
				await Promise.reject(
					new Response(new Blob(), {
						status: 503,
						statusText: "Service Unavailable"
					})
				);
			}
		}
		for (const responseFilter of this._filtersResponse) {
			if (responseFilter.canHandleResponse(response)) {
				const result: ResponseFilterResult =
					responseFilter.doResponseFilter(response);
				if (result.error !== undefined) {
					await Promise.reject(
						new Response(new Blob(), {
							status: result.response?.status,
							statusText: result.error.message
						})
					);
				} else {
					response = result.response;
				}
				if (!result.continue) {
					break;
				}
				// How could we update back the response to this._response since it's a Promise<Response> ?????
				// Notice that we already await above.
			}
		}
		const defaultErrorHandler: DefaultErrorResponseFilter =
			new DefaultErrorResponseFilter();
		if (defaultErrorHandler.canHandleResponse(response)) {
			await defaultErrorHandler.doFilterResponse(response);
		}
		return responseInput;
	}
}
