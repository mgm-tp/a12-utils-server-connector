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
import * as Assert from "node:assert";

import { BodyFilter } from "../../src/internal/filter/request/BodyFilter.js";
import { FilterChain } from "../../src/internal/filter/FilterChain.js";

describe("com.mgmtp.a12.connector.request.bodyfilter", () => {
	it("test default init body filter", async () => {
		const requestFilterChain = new FilterChain();
		const bodyFilter: BodyFilter = new BodyFilter();
		requestFilterChain.registerFilterRequest(bodyFilter);
		await requestFilterChain.startRequestFilter({
			relativeUrl: "",
			method: ""
		});
		const requestInit = requestFilterChain.getRequestInit();
		Assert.strictEqual(requestInit.body, undefined, "Body empty -> correct");
	});

	it("test custom body with GET method", async () => {
		const requestFilterChain = new FilterChain();
		const bodyFilter: BodyFilter = new BodyFilter();
		requestFilterChain.registerFilterRequest(bodyFilter);
		await requestFilterChain.startRequestFilter({
			body: {
				username: "admin",
				lastName: "min"
			},
			method: "GET",
			relativeUrl: ""
		});
		const requestInit = requestFilterChain.getRequestInit();
		Assert.strictEqual(requestInit.body, undefined, "Body not ok");
	});

	it("test custom body with HEAD method", async () => {
		const requestFilterChain = new FilterChain();
		const bodyFilter: BodyFilter = new BodyFilter();
		requestFilterChain.registerFilterRequest(bodyFilter);
		await requestFilterChain.startRequestFilter({
			body: {
				username: "admin",
				lastName: "min"
			},
			method: "HEAD",
			relativeUrl: ""
		});
		const requestInit = requestFilterChain.getRequestInit();
		Assert.strictEqual(requestInit.body, undefined, "Body not ok");
	});

	it("test custom body with DELETE method", async () => {
		const requestFilterChain = new FilterChain();
		const bodyFilter: BodyFilter = new BodyFilter();
		requestFilterChain.registerFilterRequest(bodyFilter);
		await requestFilterChain.startRequestFilter({
			body: {
				username: "admin",
				lastName: "min"
			},
			method: "DELETE",
			relativeUrl: ""
		});
		const requestInit = requestFilterChain.getRequestInit();
		Assert.strictEqual(requestInit.body, undefined, "Body not ok");
	});

	it("test custom body with POST", async () => {
		const expectedBodyInit = {
			username: "admin",
			lastName: "min"
		};

		const requestFilterChain = new FilterChain();
		const bodyFilter: BodyFilter = new BodyFilter();
		requestFilterChain.registerFilterRequest(bodyFilter);
		await requestFilterChain.startRequestFilter({
			body: {
				username: "admin",
				lastName: "min"
			},
			method: "POST",
			relativeUrl: ""
		});
		const requestInit = requestFilterChain.getRequestInit();

		if (requestInit.body === null || requestInit.body === undefined) {
			Assert.fail("Body can't be null or undefined");
		}
		Assert.strictEqual(
			JSON.stringify(requestInit.body),
			JSON.stringify(expectedBodyInit),
			"Body not ok"
		);
	});
});
