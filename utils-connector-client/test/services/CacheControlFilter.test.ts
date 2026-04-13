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
// import { FilterChain } from "../../main/internal/filter/FilterChain";
// import { HeadersFilter } from "../../main/internal/filter/request/HeadersFilter";
//
// import { CacheControlFilter } from "./CacheControlFilter";
//
// describe("com.mgmtp.a12.connector.request.services.cacheControlFilter", () => {
// 	it("test custom cache control filter", async () => {
// 		const requestFilterChain = new FilterChain();
// 		requestFilterChain.registerFilterRequest(new HeadersFilter());
// 		requestFilterChain.registerFilterRequest(new CacheControlFilter());
// 		requestFilterChain.startRequestFilter({
// 			relativeUrl: "",
// 			method: "DELETE",
// 			extendedData: {
// 				cacheControlValue: "abc"
// 			}
// 		});
// 		const requestInit = requestFilterChain.getRequestInit();
// 		Assert.strictEqual(
// 			JSON.stringify(requestInit.headers),
// 			JSON.stringify({
// 				_headers: {
// 					accept: ["application/json"],
// 					"content-type": ["application/json;charset=utf8"],
// 					"cache-control": ["abc"]
// 				}
// 			}),
// 			"headers incorrect"
// 		);
// 	});
// });
