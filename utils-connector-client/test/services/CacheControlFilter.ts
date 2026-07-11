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
import type {
	RequestFilterPayload,
	RequestFilterResult,
	RequestFilter
} from "../../src/internal/filter/request/RequestFilter.js";
import { isRestRequestPayloadInstance } from "../../src/internal/connector/RestServerConnector.js";

type CacheControlValueExtendData = {
	readonly cacheControlValue: string;
};

export class CacheControlFilter implements RequestFilter {
	canHandleRequest(requestInit: RequestFilterPayload): boolean {
		return (
			requestInit.payload !== undefined &&
			isRestRequestPayloadInstance(requestInit.payload) &&
			(requestInit.payload.extendedData as CacheControlValueExtendData)
				.cacheControlValue !== undefined
		);
	}

	doRequestFilter(request: RequestFilterPayload): RequestFilterResult {
		if (!request || !request.request) {
			throw new Error("request init may not be falsy");
		}
		if (!request.request.headers) {
			request.request.headers = new Headers();
		}
		if (
			request.payload === undefined ||
			!isRestRequestPayloadInstance(request.payload) ||
			(request.payload.extendedData as CacheControlValueExtendData)
				.cacheControlValue === undefined
		) {
			return {
				request: {
					...request.request
				},
				continue: true
			};
		}
		const headers: HeadersInit = request.request.headers;
		if (headers instanceof Headers) {
			headers.append(
				"Cache-Control",
				(request.payload.extendedData as CacheControlValueExtendData)
					.cacheControlValue
			);
		} else if (Array.isArray(headers)) {
			headers.push([
				"Cache-Control",
				(request.payload.extendedData as CacheControlValueExtendData)
					.cacheControlValue
			]);
		}

		return {
			request: {
				...request.request
			},
			continue: true
		};
	}
}
