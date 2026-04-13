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
import "isomorphic-fetch";
// import * as Assert from "assert";
//
// import { HeadersFilter } from "../../main/internal/filter/request/HeadersFilter";
// import { RequestFilterPayload } from "../../main/internal/filter/request/RequestFilter";

describe("com.mgmtp.a12.connector.request.headersFilter", () => {
	// it("test default init header filter", () => {
	// 	const headersFilter: HeadersFilter = new HeadersFilter();
	// 	const result = headersFilter.doRequestFilter({
	// 		payload: {},
	// 		request: {}
	// 	} as RequestFilterPayload);
	// 	Assert.strictEqual(
	// 		JSON.stringify(result.request.headers),
	// 		JSON.stringify({
	// 			_headers: {
	// 				accept: ["application/json"],
	// 				"content-type": ["application/json;charset=utf8"]
	// 			}
	// 		}),
	// 		"headers incorrect"
	// 	);
	// });
	// it("test init header filter with Cache-Control", () => {
	// 	let customHeaders: Array<string[]> = [];
	// 	const header = ["Cache-Control", "test-cache, no-store"];
	// 	customHeaders.push(header);
	//
	// 	const headersFilter: HeadersFilter = new HeadersFilter(customHeaders);
	// 	const result = headersFilter.doRequestFilter({} as RequestInit);
	// 	Assert.strictEqual(JSON.stringify(result.request.headers), JSON.stringify({
	// 		"_headers": {
	// 			"cache-control": [
	// 				"test-cache, no-store"
	// 			]
	// 		}
	// 	}), "headers incorrect with Cache-Control custom");
	// });
	//
	// it("test init header filter with custom header", () => {
	// 	let customHeaders: Array<string[]> = [];
	// 	const header = ["any header", "Any header value"];
	// 	customHeaders.push(header);
	//
	// 	const headersFilter: HeadersFilter = new HeadersFilter(customHeaders);
	// 	const result = headersFilter.doRequestFilter({} as RequestInit);
	// 	Assert.strictEqual(JSON.stringify(result.request.headers), JSON.stringify({
	// 		"_headers": {
	// 			"any header": [
	// 				"Any header value"
	// 			],
	// 			"cache-control": [
	// 				"no-cache, no-store"
	// 			]
	// 		}
	// 	}), "headers incorrect with custom headers");
	// });
});
