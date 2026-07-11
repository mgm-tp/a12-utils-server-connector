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

import fetchMock from "fetch-mock";
import type { MockOptions } from "fetch-mock";

import { RestServerConnector } from "../src/index.js";
import type {
	RequestFilter,
	ResponseFilter,
	ResponseFilterResult
} from "../src/index.js";
import { InitRequestFilter } from "../src/internal/filter/request/InitRequestFilter.js";
import { BodyFilter } from "../src/internal/filter/request/BodyFilter.js";
import { HeadersFilter } from "../src/internal/filter/request/HeadersFilter.js";
import { OkResponseFilter } from "../src/internal/filter/response/OkResponseFilter.js";
import type { RestRequestPayload } from "../src/internal/connector/RestServerConnector.js";

import { XsrfTokenFilter } from "./uaa/XsrfTokenFilter.js";
import { AuthorizationHeaderFilter } from "./uaa/AuthorizationHeaderFilter.js";
import { RedirectResponseFilter } from "./uaa/RedirectResponseFilter.js";
import { ResponseFilter401 } from "./uaa/ResponseFilter401.js";
import { ResponseFilter404 } from "./services/ResponseFilter404.js";
import { ResponseFilter409 } from "./services/ResponseFilter409.js";
import { TestDataHolder } from "./TestDataHolder.js";
import { isNotAuthorizedError } from "./uaa/Errors.js";
import { isNotFoundError, isNotUniqueError } from "./services/Errors.js";

describe("com.mgmtp.a12.connector.restServerConnector", () => {
	const requestFilters: RequestFilter[] = [];
	const responseFilters: ResponseFilter[] = [];

	beforeEach(() => {
		requestFilters.push(new InitRequestFilter());
		requestFilters.push(new BodyFilter());
		requestFilters.push(new HeadersFilter());
		requestFilters.push(new XsrfTokenFilter());
		requestFilters.push(new AuthorizationHeaderFilter());

		responseFilters.push(new OkResponseFilter());
		responseFilters.push(new RedirectResponseFilter());
		responseFilters.push(new ResponseFilter401());
		responseFilters.push(new ResponseFilter404());
		responseFilters.push(new ResponseFilter409());
	});

	it("test ok 200", async () => {
		fetchMock.restore().reset();
		fetchMock.mock(
			"http://localhost:8080/api/user/data",
			TestDataHolder.testData() as MockOptions
		);
		const serverConnector = new RestServerConnector(
			"http://localhost:8080/api/",
			requestFilters,
			responseFilters
		);
		const payload: RestRequestPayload = {
			relativeUrl: "/user/data",
			method: "GET"
		};
		const response = await serverConnector.fetchData(payload);
		const responseBody: Promise<Response> = await response.json();
		Assert.strictEqual(
			JSON.stringify(
				(TestDataHolder.testData() as Record<string, unknown>).body
			),
			JSON.stringify(responseBody),
			"Body check failed"
		);
	});

	it("test ok base url", async () => {
		fetchMock.restore().reset();
		fetchMock.mock(
			"http://localhost:8080/api/user/data",
			TestDataHolder.testData() as MockOptions
		);
		const serverConnector = new RestServerConnector(
			"http://localhost:8080/api",
			requestFilters,
			responseFilters
		);
		Assert.strictEqual(
			serverConnector.getBaseUrl(),
			"http://localhost:8080/api",
			"base url failed"
		);
	});

	it("test additional response filter work correct", async () => {
		fetchMock.restore().reset();
		fetchMock.mock(
			"http://localhost:8080/api/user/data",
			TestDataHolder.testData() as MockOptions
		);
		const mockResponseFilters: [ResponseFilter] = [
			{
				canHandleResponse: (response: Response | undefined): boolean => {
					if (!response) {
						return false;
					}
					return true;
				},
				doResponseFilter: (
					response: Response | undefined
				): ResponseFilterResult => {
					if (response) {
						response.headers.append("modify", "true");
					}
					return {
						response: response,
						continue: true
					};
				}
			}
		];
		const serverConnector = new RestServerConnector(
			"http://localhost:8080/api",
			[],
			mockResponseFilters
		);
		const requestPayload: RestRequestPayload = {
			relativeUrl: "/user/data",
			method: "GET"
		};
		const result = await serverConnector
			.fetchData(requestPayload)
			.then(res => res.headers.get("modify"));
		Assert.strictEqual(
			result,
			"true",
			"additional response filter does not work properly"
		);
	});

	it("test not authorised 401", async () => {
		fetchMock.restore().reset();
		fetchMock.mock(
			"http://localhost:8080/api/user/data",
			TestDataHolder.testData401() as MockOptions
		);
		const serverConnector = new RestServerConnector(
			"http://localhost:8080/api",
			requestFilters,
			responseFilters
		);
		const payload: RestRequestPayload = {
			relativeUrl: "/user/data",
			method: "GET"
		};
		serverConnector
			.fetchData(payload)
			.then(() => {
				Assert.fail("Error expected");
			})
			.catch((error: unknown) => {
				if (isNotAuthorizedError(error)) {
					return;
				}
				Assert.fail("Wrong error returned");
			});
	});

	it("test not found 404", async () => {
		fetchMock.restore().reset();
		fetchMock.mock(
			"http://localhost:8080/api/user/data",
			TestDataHolder.testData404() as MockOptions
		);
		const serverConnector = new RestServerConnector(
			"http://localhost:8080/api",
			requestFilters,
			responseFilters
		);
		const payload: RestRequestPayload = {
			relativeUrl: "/user/data",
			method: "GET"
		};
		serverConnector
			.fetchData(payload)
			.then(() => {
				Assert.fail("Error expected");
			})
			.catch((error: unknown) => {
				if (isNotFoundError(error)) {
					return;
				}
				Assert.fail("Wrong error returned");
			});
	});

	it("test not unique 409", async () => {
		fetchMock.restore().reset();
		fetchMock.mock(
			"http://localhost:8080/api/user/data",
			TestDataHolder.testData409() as MockOptions
		);
		const serverConnector = new RestServerConnector(
			"http://localhost:8080/api",
			requestFilters,
			responseFilters
		);
		const payload: RestRequestPayload = {
			relativeUrl: "/user/data",
			method: "GET"
		};
		await serverConnector
			.fetchData(payload)
			.then(() => {
				Assert.fail("Error expected");
			})
			.catch((error: unknown) => {
				if (isNotUniqueError(error)) {
					return;
				}
				Assert.fail("Wrong error returned");
			});
	});

	it("test unhandled error 500", async () => {
		fetchMock.restore().reset();
		fetchMock.mock(
			"http://localhost:8080/api/user/data",
			TestDataHolder.testData500() as MockOptions
		);
		const serverConnector = new RestServerConnector(
			"http://localhost:8080/api",
			requestFilters,
			responseFilters
		);
		const payload: RestRequestPayload = {
			relativeUrl: "/user/data",
			method: "GET"
		};
		serverConnector
			.fetchData(payload)
			.then(() => {
				Assert.fail("Error expected");
			})
			.catch((error: unknown) => {
				if (isNotAuthorizedError(error)) {
					Assert.fail("Wrong error returned");
				}
				if (isNotFoundError(error)) {
					Assert.fail("Wrong error returned");
				}
				if (isNotUniqueError(error)) {
					Assert.fail("Wrong error returned");
				}
				const expectedResult = {
					status: 500,
					content: {},
					header: {},
					url: "http://localhost:8080/api/user/data"
				};
				Assert.strictEqual(
					JSON.stringify(error),
					JSON.stringify(expectedResult),
					"Default error handling message return with application/json is NOT fine"
				);
			});
	});
});
