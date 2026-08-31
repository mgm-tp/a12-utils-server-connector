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
import * as Assert from "node:assert";

import { XsrfTokenFilter } from "./XsrfTokenFilter.js";

describe("com.mgmtp.a12.connector.request.xsrfTokenFilter", () => {
	it("test default init xsrf token filter", () => {
		const xsrfTokenFilter: XsrfTokenFilter = new XsrfTokenFilter();
		const expectedTokenValue = "123456222";
		const result = xsrfTokenFilter.doRequestFilter({
			payload: {
				relativeUrl: "",
				method: "",
				extendedData: {
					tokenStore: () => "XSRF-TOKEN=123456222;ANSWER=42"
				}
			},
			request: {}
		});
		const headers = result.request.headers;
		if (headers instanceof Headers) {
			Assert.strictEqual(
				headers.get("X-XSRF-TOKEN"),
				expectedTokenValue,
				"Expected [" +
					expectedTokenValue +
					"] but got [" +
					headers.get("X-XSRF-TOKEN") +
					"]"
			);
		}
	});

	it("test default init xsrf token filter without semicolon", () => {
		const xsrfTokenFilter: XsrfTokenFilter = new XsrfTokenFilter();
		const expectedTokenValue = "123456";
		const result = xsrfTokenFilter.doRequestFilter({
			payload: {
				relativeUrl: "",
				method: "",
				extendedData: {
					tokenStore: () => "XSRF-TOKEN=123456;ANSWER=42"
				}
			},
			request: {}
		});
		const headers = result.request.headers;
		if (headers instanceof Headers) {
			Assert.strictEqual(
				headers.get("X-XSRF-TOKEN"),
				expectedTokenValue,
				"Expected [" +
					expectedTokenValue +
					"] but got [" +
					headers.get("X-XSRF-TOKEN") +
					"]"
			);
		}
	});
});
