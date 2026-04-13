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

import { FilterChain } from "../src/internal/filter/FilterChain.js";
import { BodyFilter } from "../src/internal/filter/request/BodyFilter.js";
import { OkResponseFilter } from "../src/internal/filter/response/OkResponseFilter.js";
import { RequestFilter, ResponseFilter } from "../src/index.js";
import { HeadersFilter } from "../src/internal/filter/request/HeadersFilter.js";

describe("com.mgmtp.a12.connector.filter.filterChain", () => {
	it("add request filter", () => {
		const filterChain: FilterChain = new FilterChain();
		filterChain.registerFilterRequest(new BodyFilter());

		const expectArrayFilters: RequestFilter[] = [];
		expectArrayFilters.push(new BodyFilter());
		Assert.strictEqual(
			JSON.stringify(filterChain.requestFilters()),
			JSON.stringify(expectArrayFilters),
			"list of filters are incorrect"
		);
	});

	it("add request filters", () => {
		const filterChain: FilterChain = new FilterChain();
		filterChain.registerFilterRequest(new BodyFilter());
		filterChain.registerFilterRequest(new HeadersFilter());

		const expectArrayFilters: RequestFilter[] = [];
		expectArrayFilters.push(new BodyFilter());
		expectArrayFilters.push(new HeadersFilter());
		Assert.strictEqual(
			JSON.stringify(filterChain.requestFilters()),
			JSON.stringify(expectArrayFilters),
			"list of filters are incorrect"
		);
	});

	it("add response filters", () => {
		const filterChain: FilterChain = new FilterChain();
		filterChain.registerFilterResponse(new OkResponseFilter());

		const expectArrayFilters: ResponseFilter[] = [];
		expectArrayFilters.push(new OkResponseFilter());
		Assert.strictEqual(
			JSON.stringify(filterChain.responseFilters()),
			JSON.stringify(expectArrayFilters),
			"list of filters are incorrect"
		);
	});

	it("check default request init", () => {
		const filterChain: FilterChain = new FilterChain();
		Assert.strictEqual(
			JSON.stringify(filterChain.getRequestInit()),
			JSON.stringify({}),
			"request init default is not null or undefined"
		);
	});
});
