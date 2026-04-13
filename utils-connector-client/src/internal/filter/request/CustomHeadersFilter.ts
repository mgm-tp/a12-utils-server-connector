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
import {
	RequestFilter,
	RequestFilterPayload,
	RequestFilterResult
} from "./RequestFilter.js";

/**
 * This is custom header filter which need to register at first of RequestFilter.
 * In order to make sure all customHeaders are taken.
 * All other filter related to Headers need to be registered after this one otherwise it will be overrided
 * eg: XsrfFilter
 */
export class CustomHeadersFilter implements RequestFilter {
	canHandleRequest(request: RequestFilterPayload): boolean {
		return (
			request.payload !== undefined &&
			request.payload.customHeaders !== undefined &&
			request.payload.customHeaders.length > 0
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
			request.payload === undefined ||
			request.payload.customHeaders === undefined ||
			request.payload.customHeaders.length === 0
		) {
			return {
				request: request.request,
				continue: true
			};
		}
		const newHeaders = new Headers({});
		for (const kvp of request.payload.customHeaders) {
			const key = kvp[0];
			const value = kvp[1];
			if (!key) {
				continue;
			}
			newHeaders.append(key, value);
		}
		request.request.headers = newHeaders;

		return {
			request: request.request,
			continue: true
		};
	}
}
